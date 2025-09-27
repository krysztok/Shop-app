package com.example.shop_backend.products;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {

    @Query(value = "{'categoryId' : ?0}")
    List<Product> findAllByCategoryId(String categoryId);

    @Query(value = "{'categoryId' : ?0, '_id' : {$ne : ?1}}")
    List<Product> findAllByCategoryIdAnd_idNotIn(String categoryId, String _id);

    @Query(value = "{'name' : ?0}")
    Product findByName(String name);

    List<Product> findBy_idIn(String[] ids);

    List<Product> findByNameIgnoreCaseContaining(String text);
}
