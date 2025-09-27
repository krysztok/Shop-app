package com.example.shop_backend.products;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Collection;
import java.util.List;


public interface CategoryRepository extends MongoRepository<Category, String> {

    @Query(value = "{'label' : ?0}")
    Category getCategoryByLabel(String label);

    List<Category> findBy_idIn(String[] ids);

}
