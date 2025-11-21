package com.example.shop_backend.products;

import com.example.shop_backend.categories.CategoriesServiceI;
import com.example.shop_backend.categories.Category;
import com.example.shop_backend.filters.FiltersServiceI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;

@Service
public class ProductsService implements ProductsServiceI {
    private final CategoriesServiceI categoriesService;
    private final FiltersServiceI filtersService;

    @Autowired
    private ProductRepository productRepository;

    public ProductsService(CategoriesServiceI categoriesService, FiltersServiceI filtersService) {
        this.categoriesService = categoriesService;
        this.filtersService = filtersService;
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(String id) {
        return productRepository.findById(id).orElse(null);
    }

    @Override
    public Product getProductByName(String name) {
        return productRepository.findByName(name);
    }

    @Override
    public List<Product> getProductsByIds(String[] ids) {
        return productRepository.findBy_idIn(ids);
    }

    @Override
    public List<Product> searchProductsByText(String text) {
        if(text == null || text.isEmpty()) {
            throw new IllegalArgumentException("Text cannot be empty!");
        } else if(text.length() < 2){
            throw new IllegalArgumentException("Text is too short!");
        } else if (!text.matches("^[0-9a-zA-Z ]+$")) {
            throw new IllegalArgumentException("Text contains illegal characters!");
        }

        return productRepository.findByNameIgnoreCaseContaining(text);
    }

    @Override
    public List<Product> getProductsWithSubCategoriesByCategory(String categoryLabel) {
        Category category = categoriesService.getCategoryByLabel(categoryLabel);
        List<Product> products = new ArrayList<>(productRepository.findAllByCategoryId(category.get_id()));

        if (category.getItems() != null) {
            for (String catId : category.getItems()) {
                products.addAll(productRepository.findAllByCategoryId(catId));
            }
        }

        return products;
    }



    @Override
    public List<Product> getProductsByCategoryLabel(String categoryLabel) {
        Category category = categoriesService.getCategoryByLabel(categoryLabel);
        return productRepository.findAllByCategoryId(category.get_id());
    }


    @Override
    public void removeProductsFromCategory(String categoryId) {
        List<Product> products = productRepository.findAllByCategoryId(categoryId);

        for (Product product : products) {
            product.setCategoryId(null);
        }

        productRepository.saveAll(products);
    }

    @Override
    public void addProductImageName(String id, String name) {
        Product product = getProductById(id);

        if (product == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product with id: '" + id + "' does not exist!");
        }

        product.addImageName(name);
        productRepository.save(product);
    }

    @Override
    public void removeProductImageName(String id, String name) {
        Product product = getProductById(id);

        if (product == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product with id: '" + id + "' does not exist!");
        }

        product.deleteImageName(name);
        productRepository.save(product);
    }

    @Override
    public Product createProduct(Product product) {
        checkProductName(product.getName());
        checkProductCategory(product.getCategoryId());

        Product p = new Product(product.getName(), product.getDescription(), product.getPrice(), product.getCategoryId(), product.getParams());
        productRepository.insert(p);

        return p;
    }

    @Override
    public void updateProduct(Product prod) {
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

        filtersService.removeParamsFromFilter(product.get_id(), product.getCategoryId(), paramsToDelete);
        filtersService.addParamsToFilter(prod.getCategoryId(), paramsToAdd);

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
            Category category = categoriesService.getCategoryById(categoryId);

            if (category == null){
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parent category with id: '" + categoryId + "' does not exist!");
            }

            if (!Objects.equals(category.getType(), "subSubCategory")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parent category must be \"subSubCategory\" type!");
            }
        }
    }

    @Override
    public void deactivateProduct(String id) {
        removeProduct(id, false);
    }

    @Override
    public void deleteProduct(String id) {
        removeProduct(id, true);
    }

    public void removeProduct(String id, boolean delete) {
        Product product = getProductById(id);

        if (product == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product with id: '" + id + "' does not exist!");
        }

        filtersService.removeParamsFromFilter(product.get_id(), product.getCategoryId(), product.getParams());

        if (delete){
            productRepository.delete(product);
        } else {
            product.setActive(false);
            productRepository.save(product);
        }
    }

    @Override
    public void activateProduct(String id){
        Product product = getProductById(id);

        if (product == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product with id: '" + id + "' does not exist!");
        }

        filtersService.addParamsToFilter(product.getCategoryId(), product.getParams());
        product.setActive(true);
        productRepository.save(product);
    }

    @Override
    public void rateProduct(Rating rating, String id) {
        Product product = getProductById(id);

        if (product == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product with id: '" + id + "' does not exist!");
        }

        product.addRating(rating);
        productRepository.save(product);
    }

    @Override
    public void deleteRating(String id, String commentId) {
        Product product = getProductById(id);

        if (product == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product with id: '" + id + "' does not exist!");
        }

        product.deleteRating(commentId);
        productRepository.save(product);
    }

}
