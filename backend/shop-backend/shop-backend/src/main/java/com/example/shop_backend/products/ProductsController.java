package com.example.shop_backend.products;

import jakarta.annotation.PostConstruct;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

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

    public JSONObject[] createSubcategories(String[] subCategoriesIdx){
        int size = subCategoriesIdx.length;
        JSONObject[] subCategories = new JSONObject[size];

        for (int i = 0; i < size; i++){
            Category category = getCategoryById(subCategoriesIdx[i]);
            subCategories[i] = new JSONObject();
            subCategories[i].put("label", category.getLabel());
            //subCategories[i].put("routerLink", category.getRouterLink());
            subCategories[i].put("routerLink", createRouterLink("/products/", category.getLabel()));

            JSONArray subSubCategories = createSubSubcategories(category.getItems());
            subCategories[i].put("items", subSubCategories);
        }

        return subCategories;
    }

    public JSONArray createSubSubcategories(String[] subSubCategoriesIdx){
        JSONArray subSubCategories = new JSONArray();

        for(int i = 0; i < subSubCategoriesIdx.length ; i++){
            Category category = getCategoryById(subSubCategoriesIdx[i]);

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
    public void createCategory(@RequestBody Map<String, String> body) throws IOException {
        Category category = new Category(body.get("label"), body.get("type"));
        Category result =  categoryRepository.insert(category);
        String parentId = body.get("parentId");

        if (parentId != null) {
            Category parentCategory = getCategoryById(parentId);
            parentCategory.addItem(result.get_id());

            categoryRepository.save(parentCategory);
        }

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

        // System.out.println(product.getName());
//        System.out.println(product.getCategoryId());
//        System.out.println(product.getPrice());
//        System.out.println(product.getRatingValue());

        productRepository.insert(product);

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

}
