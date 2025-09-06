package com.example.shop_backend.products;

import jakarta.annotation.PostConstruct;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class ProductsController {
    JSONArray categoriesJson;
    List<Category> categories;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private FiltersRepository filtersRepository;

    @GetMapping("/getAllCategories")
    public List<Category> getAllCategories(){
        return categoryRepository.findAll();
    }

    //for mega menu
    @GetMapping("/getAllCategoriesJson")
    public String getAllCategoriesJson() throws IOException {
        return categoriesJson.toString();
    }

    public void getCategoriesFromDB() {
        categories = categoryRepository.findAll();
    }

    @PostConstruct
    public void createCategoriesJson() throws IOException {
        JSONArray json = new JSONArray();
        getCategoriesFromDB();

        for(int i = 0; i < categories.size(); i++){
            Category category = categories.get(i);
            if(!Objects.equals(category.getType(), "category")) {
                continue;
            }

            //Main category
            JSONObject jsonObj = new JSONObject();
            jsonObj.put("label", category.getLabel());
            //jsonObj.put("routerLink", category.getRouterLink());
            jsonObj.put("routerLink", createRouterLink("/categories/", category.getLabel()));

            //subCategories
            JSONObject[] subCategories = createSubcategories(category.getItems());

            //spread subCategories to the "table" view with x columns
            int x = 5;
            int cols = Math.min(x, subCategories.length); //case when fewer subcategories than x
            JSONArray[] subCategoriesArray = new JSONArray[cols];
            for(int j = 0; j < cols; j++){
                subCategoriesArray[j] = new JSONArray();
            }

            for(int j = 0; j < subCategories.length; j++){
                subCategoriesArray[j%cols].put(subCategories[j]);
            }

            jsonObj.put("items", subCategoriesArray);
            json.put(jsonObj);
        }

        categoriesJson = json;
    }

    public JSONObject[] createSubcategories(String[] subCategoriesIds){
        int size = subCategoriesIds.length;
        JSONObject[] subCategories = new JSONObject[size];

        for (int i = 0; i < size; i++){
            Category category = getCategoryById(subCategoriesIds[i]);

            if (category == null) {
                throw new NullPointerException("subCategory is null, check items of categories!");
            }

            subCategories[i] = new JSONObject();
            subCategories[i].put("label", category.getLabel());
            //subCategories[i].put("routerLink", category.getRouterLink());
            subCategories[i].put("routerLink", createRouterLink("/products/", category.getLabel()));

            JSONArray subSubCategories = createSubSubcategories(category.getItems());
            subCategories[i].put("items", subSubCategories);
        }

        return subCategories;
    }

    public JSONArray createSubSubcategories(String[] subSubCategoriesIds){
        JSONArray subSubCategories = new JSONArray();

        for(int i = 0; i < subSubCategoriesIds.length ; i++){
            Category category = getCategoryById(subSubCategoriesIds[i]);

            if (category == null) {
                throw new NullPointerException("subSubCategory is null, check items of subCategories!");
            }

            JSONObject subSubCategory = new JSONObject();
            subSubCategory.put("label", category.getLabel());
            //subSubCategory.put("routerLink", category.getRouterLink());
            subSubCategory.put("routerLink", createRouterLink("/products/", category.getLabel()));

            subSubCategories.put(subSubCategory);
        }

        return subSubCategories;
    }


    @GetMapping("/getSubcategories/")
    public Category[] getSubCategories(@RequestParam(value="categoryId") String categoryId){
        Category category = getCategoryById(categoryId);
        String[] items = category.getItems();
        Category[] subCategories = new Category[items.length];

        for(int i=0; i < items.length; i++){
            subCategories[i] = getCategoryById(items[i]);
        }

        return subCategories;
    }

    @GetMapping("/getCategory/{id}")
    private Category getCategoryById(@PathVariable String id) {
        return categories.stream().filter(category -> Objects.equals(category.get_id(), id)).findAny().orElse(null);
    }

    @GetMapping("/getCategoryByLabel/{label}")
    public Category getCategoryByLabel(@PathVariable String label) {
        return categories.stream().filter(category -> Objects.equals(category.getLabel(), routerLinkToString(label))).findAny().orElse(null);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/createCategory")
    @ResponseBody
    public void createCategory(@RequestBody Category cat) throws IOException {
        if (cat.getParentId() != null && !categoryRepository.existsById(cat.getParentId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parent category with id: '" + cat.getParentId() + "' does not exist!");
        }

        Category category = new Category(cat.getLabel(), cat.getType(), cat.getParentId());
        Category result =  categoryRepository.insert(category);

        String parentId = cat.getParentId();
        if (parentId != null) {
            Category parentCategory = getCategoryById(parentId);
            parentCategory.addItem(result.get_id());

            categoryRepository.save(parentCategory);
        }

        createCategoriesJson();
    }



    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/updateCategory")
    @ResponseBody
    public void updateCategory(@RequestBody Category cat) throws IOException {
        //check basics
        Optional<Category> dbCategory = categoryRepository.findById(cat.get_id());

        if (dbCategory.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category with id: '" + cat.get_id() + "' does not exist!");
        }

        Category category = dbCategory.get();

        if (!Objects.equals(category.getLabel(), cat.getLabel())){
            category.setLabel(cat.getLabel());
        }

        if (!Objects.equals(cat.getType(), category.getType())){
            if (cat.getItems().length != 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can not change type of category, remove all items first!");
            }

            if (category.getParentId() != null || !Objects.equals(cat.getParentId(), "")) { //not all objects has parentId set in db
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can not change type of category, remove it from parent's items first!");
            }

            if (Objects.equals(cat.getType(), "subSubCategory")) { //remove products if no longer subSubCategory
                removeProductsFromCategory(category.get_id());
            }


            category.setType(cat.getType());
        }

        if (Objects.equals(category.getType(), "subSubCategory") && cat.getItems().length > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can not add items to subSubCategory!");
        }

        //check items
        boolean hasItemsChanged = false;
        List<String> categoriesToAdd = new ArrayList<>();
        List<String> categoriesToRemove = new ArrayList<>();

        for (String item : category.getItems()){
            if (!Arrays.asList(cat.getItems()).contains(item)){
                categoriesToRemove.add(item);
                hasItemsChanged = true;
            }
        }
        List<Category> dbCategoriesToRemove = categoryRepository.findAllById(categoriesToRemove);

        for (String item : cat.getItems()){
            if (!Arrays.asList(category.getItems()).contains(item)){
                categoriesToAdd.add(item);
                hasItemsChanged = true;
            }
        }
        List<Category> dbCategoriesToAdd = categoryRepository.findAllById(categoriesToAdd);

        //check new items
        if (!categoriesToAdd.isEmpty()) {
            if (dbCategoriesToAdd.size() != categoriesToAdd.size()) {
                StringBuilder s = new StringBuilder("Can not add items with ids: ");

                List<String> existingIds = new ArrayList<>();

                for (Category dbCat : dbCategoriesToAdd) {
                    existingIds.add(dbCat.get_id());
                }

                for (String item : categoriesToAdd){
                    if (!existingIds.contains(item)){
                        s.append(item).append(", ");
                    }
                }

                s.append(" (they dont exist!)");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, s.toString());
            }

            String expectedItemType = Objects.equals(category.getType(), "category") ? "subCategory" : "subSubCategory";

            for (Category dbCat : dbCategoriesToAdd) {
                if (!Objects.equals(dbCat.getType(), expectedItemType)){
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can not add item with id: " + dbCat.get_id() + " (wrong category type!)");
                }

                if (!(dbCat.getParentId() == null)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can not add item with id: " + dbCat.get_id() + " (already have a parent!)");
                }
            }
        }

        //change items' parent ids
        if (!categoriesToRemove.isEmpty()) {
            for (Category dbCat: dbCategoriesToRemove){

                dbCat.setParentId(null);

            }
            categoryRepository.saveAll(dbCategoriesToRemove);
        }

        if (!categoriesToAdd.isEmpty()) {
            for (Category dbCat: dbCategoriesToAdd){
                dbCat.setParentId(category.get_id());
            }
            categoryRepository.saveAll(dbCategoriesToAdd);
        }

        if(hasItemsChanged) {
            category.setItems(cat.getItems());
        }

        //update
        categoryRepository.save(category);
        createCategoriesJson();
    }

    public String createRouterLink(String route, String label) {
        return route + label.replace(" ", "-");
    }


   public String routerLinkToString(String routerLink) {
        return routerLink.replace("-", " ");
    }

    @GetMapping("/getProducts/{categoryLabel}")
    public List<Product> getProductsByCategory(@PathVariable String categoryLabel) {
        Category category = getCategoryByLabel(categoryLabel);
        return productRepository.findAllByCategoryId(category.get_id());
    }

    @GetMapping("/getAllProducts")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/getProduct/{id}")
    public Product getProductById(@PathVariable String id) {
        return productRepository.findById(id).orElse(null);
    }

    @GetMapping("/getProductByName/{name}")
    public Product getProductByName(@PathVariable String name) {
        return productRepository.findByName(name);
    }

    @PostMapping("/createProduct")
    public void createProduct(@RequestBody Product product) {
        checkProductName(product.getName());
        checkProductCategory(product.getCategoryId());

        Product p = new Product(product.getName(), product.getDescription(), product.getPrice(), product.getCategoryId(), product.getParams());
        productRepository.insert(p);

        addParamsToFilter(product.getCategoryId(), product.getParams());
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/updateProduct")
    @ResponseBody
    public void updateProduct(@RequestBody Product prod) throws IOException {
        //check basics
        Optional<Product> dbProduct = productRepository.findById(prod.get_id());

        if (dbProduct.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product with id: '" + prod.get_id() + "' does not exist!");
        }
        Product product = dbProduct.get();

        if (!Objects.equals(product.getName(), prod.getName())){
            checkProductName(prod.getName());
        }

        if (!Objects.equals(product.getCategoryId(), prod.getCategoryId())) {
            checkProductCategory(prod.getCategoryId());
        }

        //check params
        Map<String, Object> paramsToDelete = new HashMap<>();
        Map<String, Object> paramsToAdd = new HashMap<>();

        if (Objects.equals(product.getCategoryId(), prod.getCategoryId())){
            for (Map.Entry<String, Object> entry: product.getParams().entrySet()) {
                if (!prod.getParams().containsKey(entry.getKey())) {
                    paramsToDelete.put(entry.getKey(), entry.getValue());
                } else { //check if param type or value changed
                    if (entry.getValue().getClass() != prod.getParam(entry.getKey()).getClass()
                            || entry.getValue() != prod.getParam(entry.getKey())) {
                        paramsToDelete.put(entry.getKey(), entry.getValue());
                        paramsToAdd.put(entry.getKey(), prod.getParam(entry.getKey()));
                    }
                }
            }
        } else {//if product category changed all add/delete
            paramsToDelete = product.getParams();
            paramsToAdd = prod.getParams();
        }

        for (Map.Entry<String, Object> entry: prod.getParams().entrySet()) {
            if (!product.getParams().containsKey(entry.getKey())) {
                paramsToAdd.put(entry.getKey(), entry.getValue());
            }
        }

        removeParamsFromFilter(product.get_id(), product.getCategoryId(), paramsToDelete);
        addParamsToFilter(prod.getCategoryId(), paramsToAdd);

        product.setName(prod.getName());
        product.setCategoryId(prod.getCategoryId());
        product.setPrice(prod.getPrice());
        product.setDescription(prod.getDescription());
        product.setParams(prod.getParams());

        //update
        productRepository.save(product);
    }

    public void checkProductName(String name) {
        if (productRepository.findByName(name) != null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product with name: '" + name + "' already exists!");
        }
    }

    public void checkProductCategory(String categoryId) {
        if (categoryId != null && !categoryId.isEmpty()) {
            Optional<Category> dbCategory = categoryRepository.findById(categoryId);

            if (dbCategory.isEmpty()){
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parent category with id: '" + categoryId + "' does not exist!");
            }

            if (!Objects.equals(dbCategory.get().getType(), "subSubCategory")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parent category must be \"subSubCategory\" type!");
            }
        }
    }

    public void addParamsToFilter(String categoryId, Map<String, Object> params){
        Filter filter = filtersRepository.findByCategoryId(categoryId);
        boolean filterChanged = false;

        if (filter != null) {
            for (int i = 0; i < filter.getFilters().length; i++){
                CustomFilter cFilter = filter.getFilters()[i];
                Object o = params.get(cFilter.getParameterName());

                if(o != null) {
                    if (Objects.equals(cFilter.getFilterType(), "string") && o.getClass() == String.class) {
                        String s = (String) o;
                        if (!cFilter.hasOption(s)) {
                            cFilter.addOption(s);
                            filterChanged = true;
                        }

                    } else if (Objects.equals(cFilter.getFilterType(), "int") && o.getClass() == Integer.class) {
                        int intOption = (Integer) o;

                        if (intOption > cFilter.getMax()) {
                            cFilter.setMax(intOption);
                            filterChanged = true;
                        }
                    }
                }
            }
        }

        if(filterChanged){
            filtersRepository.save(filter);
        }
    }

    public void removeParamsFromFilter(String productId, String categoryId, Map<String, Object> params) {
        Filter filter = filtersRepository.findByCategoryId(categoryId);
        boolean filterChanged = false;

        if (filter != null) {
            for (int i = 0; i < filter.getFilters().length; i++){
                CustomFilter cFilter = filter.getFilters()[i];
                Object o = params.get(cFilter.getParameterName());

                if(o != null) {
                    if (Objects.equals(cFilter.getFilterType(), "string") && o.getClass() == String.class) {
                        String s = (String) o;

                        if (cFilter.hasOption(s)) {
                            List<Product> productsToCheck = productRepository.findAllByCategoryIdAnd_idNotIn(categoryId, productId);

                            if (!checkIfProductsContainOption(productsToCheck, cFilter.getParameterName(), s)) {
                                cFilter.removeOption(s);
                                filterChanged = true;
                            }
                        }

                    } else if (Objects.equals(cFilter.getFilterType(), "int") && o.getClass() == Integer.class) {
                        int intOption = (Integer) o;

                        if (intOption == cFilter.getMax()){
                            List<Product> productsToCheck = productRepository.findAllByCategoryIdAnd_idNotIn(categoryId, productId);

                            cFilter.setMax(getIntOptionMaxValue(productsToCheck, cFilter.getParameterName()));
                            filterChanged = true;
                        }
                    }
                }
            }
        }

        if(filterChanged){
            filtersRepository.save(filter);
        }
    }

    public boolean checkIfProductsContainOption(List<Product> products, String paramName, String option) {
        for (Product prod : products) {
            for (Map.Entry<String, Object> entry : prod.getParams().entrySet()){
                if (Objects.equals(entry.getKey(), paramName) && entry.getValue().getClass() == String.class && entry.getValue().equals(option)) {
                    return true;
                }
            }
        }

        return false;
    }

    public int getIntOptionMaxValue(List<Product> products, String paramName) {
        int maxValue = 0;
        for (Product prod: products) {
            for (Map.Entry<String, Object> entry : prod.getParams().entrySet()){
                if (Objects.equals(entry.getKey(), paramName) && entry.getValue().getClass() == Integer.class && (int)entry.getValue() > maxValue) {
                    maxValue = (int)entry.getValue();
                }
            }
        }
        return  maxValue;
    }

    @PutMapping("/withdrawProduct/{Id}")
    public void withdrawProduct(@PathVariable String Id) {

    }

    @GetMapping("/getFiltersByCategoryLabel/{categoryLabel}")
    public CustomFilter[] getFiltersByCategoryLabel(@PathVariable String categoryLabel) {

        Category category = categoryRepository.getCategoryByLabel(routerLinkToString(categoryLabel));
        Filter filter = filtersRepository.findByCategoryId(category.get_id());
        return filter.getFilters();
    }

    @GetMapping("/getAllFilters")
    public List<Filter> getAllFilters(){
        return filtersRepository.findAll();
    }

    @PostMapping("/createFilter")
    public void createFilter(@RequestBody FilterCreateDTO cFilterDTO){
        if (cFilterDTO.getCategoryId() != null && !categoryRepository.existsById(cFilterDTO.getCategoryId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category with id: '" + cFilterDTO.getCategoryId() + "' does not exist!");
        }

        Filter filter = filtersRepository.findByCategoryId(cFilterDTO.getCategoryId());
        if (filter == null) {
            filter = new Filter(cFilterDTO.getCategoryId());
        }

        List<Product> products = new ArrayList<>();

        if(!Objects.equals(cFilterDTO.getType(), "boolean")){
            products = productRepository.findAllByCategoryId(cFilterDTO.getCategoryId());
        }

        switch (cFilterDTO.getType()) {
            case "string":
                List<String> availableOptions = new ArrayList<>();

                for (Product product : products) {
                    Object o = product.getParam(cFilterDTO.getName());

                    if (o!=null && o.getClass() == String.class) {
                        String s = (String) o;
                        if (!availableOptions.contains(s)) {
                            availableOptions.add(s);
                        }
                    }
                }

                filter.addParamString(cFilterDTO.getName(), availableOptions.toArray(new String[availableOptions.size()]));
                break;
            case "boolean":
                filter.addParamBoolean(cFilterDTO.getName());
                break;
            case "int":
                int max = 0;

                for (Product product : products) {
                    Object o = product.getParam(cFilterDTO.getName());

                    if (o!=null && o.getClass() == Integer.class) {
                        int i = (Integer) o;

                        if(i > max){
                            max = i;
                        }
                    }
                }

                filter.addParamInt(cFilterDTO.getName(), max);
                break;
        }

        filtersRepository.save(filter);
    }

    @DeleteMapping("/deleteFilter/{id}/{index}")
    public void deleteFilter(@PathVariable String id, @PathVariable int index){
        Optional<Filter> oFilter = filtersRepository.findById(id);

        if (oFilter.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Filter with id: '" + id + "' does not exist!");
        }

        Filter filter = oFilter.get();

        if (filter.getFilters().length-1 < index) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Filter with id: '" + id + "' does not have filter with index: " + index + "!");
        }

        filter.removeFilter(index);

        if (filter.getFilters().length > 0) {
            filtersRepository.save(filter);
        } else {
            filtersRepository.deleteById(filter.get_id());
        }
    }

    @DeleteMapping("/deactivateProduct/{id}")
    public void deactivateProduct(@PathVariable String id) {
        removeProduct(id, false);
    }

    @DeleteMapping("/deleteProduct/{id}")
    public void deleteProduct(@PathVariable String id) {
        removeProduct(id, true);
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/activateProduct/{id}")
    @ResponseBody
    public void activateProduct(@PathVariable String id){
        Optional<Product> oProduct = productRepository.findById(id);

        if (oProduct.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product with id: '" + id + "' does not exist!");
        }

        Product product = oProduct.get();
        addParamsToFilter(product.getCategoryId(), product.getParams());
        product.setActive(true);
        productRepository.save(product);
    }

    public void removeProduct(String id, boolean delete) {
        Optional<Product> oProduct = productRepository.findById(id);

        if (oProduct.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product with id: '" + id + "' does not exist!");
        }

        Product product = oProduct.get();
        removeParamsFromFilter(product.get_id(), product.getCategoryId(), product.getParams());

        if (delete){
            productRepository.delete(product);
        } else {
            product.setActive(false);
            productRepository.save(product);
        }
    }

    @DeleteMapping("/deleteCategory/{id}")
    public void deleteCategory(@PathVariable String id) throws IOException {
        Optional<Category> oCategory = categoryRepository.findById(id);

        if (oCategory.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category with id: '" + id + "' does not exist!");
        }

        Category category = oCategory.get();

        removeProductsFromCategory(id);

        if (category.getItems() != null) {
            removeParentFromSubCategories(category.getItems());
        }

        deleteFiltersByCategoryId(id);

        if (category.getParentId() != null) {
            removeCategoryFromParent(id, category.getParentId());
        }

        categoryRepository.deleteById(id);
        createCategoriesJson();
    }

    public void removeProductsFromCategory(String categoryId) {
        List<Product> products = productRepository.findAllByCategoryId(categoryId);

        for (Product product : products) {
            product.setCategoryId(null);
        }

        productRepository.saveAll(products);
    }

    public void removeParentFromSubCategories(String[] items) {
        List<Category> categoryList = categoryRepository.findAllById(Arrays.stream(items).toList());

        for (Category category: categoryList) {
            category.setParentId(null);
        }

        categoryRepository.saveAll(categoryList);
    }

    public void removeCategoryFromParent(String id, String parentId) {
        Optional<Category> oCategory = categoryRepository.findById(parentId);

        if (oCategory.isPresent()) {
            Category category = oCategory.get();
            category.removeItem(id);
            categoryRepository.save(category);
        }
    }

    public void deleteFiltersByCategoryId(String categoryId) {
        Filter filter = filtersRepository.findByCategoryId(categoryId);

        if (filter != null) {
            filtersRepository.deleteById(filter.get_id());
        }
    }


}
