package com.example.shop_backend.categories;
import jakarta.annotation.PostConstruct;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;

@Service
public class CategoriesService implements CategoriesServiceI{
    JSONArray categoriesJson;

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryByLabel(String label) {
        return categoryRepository.getCategoryByLabel(label);
    }

    @Override
    public Category getCategoryById(String id) {
        Optional<Category> dbCategory = categoryRepository.findById(id);
        return dbCategory.orElse(null);
    }

    @Override
    public List<Category> getCategoriesByIds(String[] ids) {
        return categoryRepository.findBy_idIn(ids);
    }

    @Override
    public Category[] getSubCategories(Category category) {
        if(category.getItems() == null) {
            return null;
        }

        String[] items = category.getItems();
        Category[] subCategories = new Category[items.length];

        for(int i=0; i < items.length; i++){
            subCategories[i] = getCategoryById(items[i]);
        }

        return subCategories;
    }

    @Override
    public String getAllCategoriesJson() {
        return categoriesJson.toString();
    }

    @PostConstruct
    public void createCategoriesJson() {
        JSONArray json = new JSONArray();
        List<Category> categories = getAllCategories();

        for (int i = 0; i < categories.size(); i++) {
            Category category = categories.get(i);
            if(!Objects.equals(category.getType(), "category")) {
                continue;
            }

            //Main category
            JSONObject jsonObj = new JSONObject();
            jsonObj.put("label", category.getLabel());
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
            subCategories[i].put("routerLink", createRouterLink("/products/", category.getLabel()));

            JSONArray subSubCategories = createSubSubcategories(category.getItems());
            subCategories[i].put("items", subSubCategories);
        }

        return subCategories;
    }

    public JSONArray createSubSubcategories(String[] subSubCategoriesIds){
        JSONArray subSubCategories = new JSONArray();

        for (int i = 0; i < subSubCategoriesIds.length ; i++){
            Category category = getCategoryById(subSubCategoriesIds[i]);

            if (category == null) {
                throw new NullPointerException("subSubCategory is null, check items of subCategories!");
            }

            JSONObject subSubCategory = new JSONObject();
            subSubCategory.put("label", category.getLabel());
            subSubCategory.put("routerLink", createRouterLink("/products/", category.getLabel()));

            subSubCategories.put(subSubCategory);
        }

        return subSubCategories;
    }

    @Override
    public CategoryNavDTO getCategoryNav(String label) {
        Category category = getCategoryByLabel(label);
        Category subCategory;
        String mainCategoryLabel = "", subCategoryLabel = "";

        if (Objects.equals(category.getType(), "subCategory")) {
            subCategory = category;
        } else if (Objects.equals(category.getType(), "subSubCategory")) {
            if (category.getParentId() != null && !Objects.equals(category.getParentId(), "")) {
                subCategory = getCategoryById(category.getParentId());
            } else {
                return null;
            }
        } else {
            return null;
        }

        subCategoryLabel = subCategory.getLabel();

        if (subCategory.getParentId() != null) {
            mainCategoryLabel = getCategoryById(subCategory.getParentId()).getLabel();
        }

        return new CategoryNavDTO(mainCategoryLabel, subCategoryLabel);
    }

    public String createRouterLink(String route, String label) {
        return route + label.replace(" ", "-");
    }

    @Override
    public void createCategory(Category cat) {
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

    @Override
    public boolean updateCategory(Category cat) {
        boolean removeProducts = false;
        //check basics
        Category category = getCategoryById(cat.get_id());

        if (category == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category with id: '" + cat.get_id() + "' does not exist!");
        }

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
                removeProducts = true;
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

                if (!(dbCat.getParentId() == null || Objects.equals(dbCat.getParentId(), ""))) {
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

        return removeProducts;
    }

    @Override
    public void deleteCategory(String id) {
        Category category = getCategoryById(id);

        if (category == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category with id: '" + id + "' does not exist!");
        }

        if (category.getItems() != null) {
            removeParentFromSubCategories(category.getItems());
        }

        if (category.getParentId() != null) {
            removeCategoryFromParent(id, category.getParentId());
        }

        categoryRepository.deleteById(id);
        createCategoriesJson();
    }

    public void removeParentFromSubCategories(String[] items) {
        List<Category> categoryList = categoryRepository.findAllById(Arrays.stream(items).toList());

        for (Category category: categoryList) {
            category.setParentId(null);
        }

        categoryRepository.saveAll(categoryList);
    }

    public void removeCategoryFromParent(String id, String parentId) {
        Category category = getCategoryById(parentId);

        if (category != null) {
            category.removeItem(id);
            categoryRepository.save(category);
        }
    }

}
