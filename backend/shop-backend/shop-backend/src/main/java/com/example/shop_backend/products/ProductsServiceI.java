package com.example.shop_backend.products;

import java.util.List;

public interface ProductsServiceI {
    List<Product> getAllProducts();
    Product getProductById(String id);
    Product getProductByName(String name);
    List<Product> getProductsByIds(String[] ids);
    List<Product> searchProductsByText(String text);
    List<Product> getProductsWithSubCategoriesByCategory(String categoryLabel);
    List<Product> getProductsByCategoryLabel(String categoryLabel);
    void removeProductsFromCategory(String categoryId);
    void addProductImageName(String id, String name);
    void removeProductImageName(String id, String name);
    Product createProduct(Product product);
    void updateProduct(Product prod);
    void deactivateProduct(String id);
    void deleteProduct(String id);
    void activateProduct(String id);
    void rateProduct(Rating rating, String id);
    void deleteRating(String id, String commentId);

}
