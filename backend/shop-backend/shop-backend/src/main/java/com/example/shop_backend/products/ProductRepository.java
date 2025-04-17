package com.example.shop_backend.products;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {

    @Query(value = "{'categoryId' : ?0}")
    List<Product> findAllByCategoryId(String categoryId);

    @Query(value = "{'name' : ?0}")
    Product findByName(String name);

}
