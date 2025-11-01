package com.example.shop_backend.products;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ShopsRepository extends MongoRepository<Shop, String> {
}
