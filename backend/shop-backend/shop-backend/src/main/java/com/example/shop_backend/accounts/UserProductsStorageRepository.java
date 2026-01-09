package com.example.shop_backend.accounts;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserProductsStorageRepository  extends MongoRepository<UserProductsStorage, String> {

    UserProductsStorage findByUserId(int id);
}
