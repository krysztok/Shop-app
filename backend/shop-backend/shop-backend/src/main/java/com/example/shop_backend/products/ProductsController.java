package com.example.shop_backend.products;

import com.example.shop_backend.filters.FiltersServiceI;
import com.example.shop_backend.products.images.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class ProductsController {
    private final ProductsServiceI productsService;
    private final FiltersServiceI filtersService;
    private final StorageService storageService;

    @Autowired
    private ProductRepository productRepository;


    @Autowired
    public ProductsController(ProductsServiceI productsService, FiltersServiceI filtersService, StorageService storageService) {
        this.productsService = productsService;
        this.filtersService = filtersService;
        this.storageService = storageService;
    }

   public String routerLinkToString(String routerLink) {
        return routerLink.replace("-", " ");
    }

    @GetMapping("/getProducts/{categoryLabel}")
    public List<Product> getProductsByCategoryLabel(@PathVariable String categoryLabel) {
        return productsService.getProductsByCategoryLabel(routerLinkToString(categoryLabel));
    }

    @GetMapping("/getProductsByIds")
    public List<Product> getProductsByIds(@Param("ids") String[] ids) {
        return productsService.getProductsByIds(ids);
    }

    @GetMapping("/searchProductsByText/{text}")
    public List<Product> searchProductsByText(@PathVariable String text) {
        return productsService.searchProductsByText(text);
    }

    @GetMapping("/getProductsWithSubCategories/{categoryLabel}")
    public List<Product> getProductsWithSubCategoriesByCategory(@PathVariable String categoryLabel) {
        return productsService.getProductsWithSubCategoriesByCategory(routerLinkToString(categoryLabel));
    }

    @GetMapping("/getAllProducts")
    public List<Product> getAllProducts() {
        return productsService.getAllProducts();
    }

    @GetMapping("/getProduct/{id}")
    public Product getProductById(@PathVariable String id) {
        return productsService.getProductById(id);
    }

    @GetMapping("/getProductByName/{name}")
    public Product getProductByName(@PathVariable String name) {
        return productsService.getProductByName(name);
    }

    @PostMapping("/createProduct")
    public void createProduct(@RequestBody Product product) {
        Product p = productsService.createProduct(product);
        filtersService.addParamsToFilter(p.getCategoryId(), p.getParams());
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/updateProduct")
    @ResponseBody
    public void updateProduct(@RequestBody Product prod) {
        productsService.updateProduct(prod);
    }

    @DeleteMapping("/deactivateProduct/{id}")
    public void deactivateProduct(@PathVariable String id) {
        productsService.deactivateProduct(id);
    }

    @DeleteMapping("/deleteProduct/{id}")
    public void deleteProduct(@PathVariable String id) {
        productsService.deleteProduct(id);
        storageService.deleteAllImages(id);
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/activateProduct/{id}")
    @ResponseBody
    public void activateProduct(@PathVariable String id){
        productsService.activateProduct(id);
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/rateProduct/{id}")
    @ResponseBody
    public void rateProduct(@RequestBody Rating rating, @PathVariable String id) {
        productsService.rateProduct(rating, id);
    }

    @DeleteMapping("/deleteRating/{id}/{commentId}")
    @ResponseBody
    public void deleteRating(@PathVariable String id, @PathVariable String commentId) {
       productsService.deleteRating(id, commentId);
    }
}
