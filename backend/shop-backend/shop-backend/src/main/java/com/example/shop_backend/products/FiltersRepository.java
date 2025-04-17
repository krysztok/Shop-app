package com.example.shop_backend.products;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface FiltersRepository extends MongoRepository<Filter, String> {

    @Query(value = "{'category_id' : ?0}")
    Filter findByCategoryId(String category_id);
}
