package com.example.shop_backend.shops;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ShopsRepository extends MongoRepository<Shop, String> {
}
