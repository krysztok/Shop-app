package com.example.shop_backend.categories;
import java.util.List;

public interface CategoriesServiceI {
    List<Category> getAllCategories();
    Category getCategoryByLabel(String label);
    Category getCategoryById(String id);
    List<Category> getCategoriesByIds(String[] ids);
    Category[] getSubCategories(Category category);
    String getAllCategoriesJson();
    CategoryNavDTO getCategoryNav(String label);
    void createCategory(Category cat);
    boolean updateCategory(Category cat);
    void deleteCategory(String id);
}
