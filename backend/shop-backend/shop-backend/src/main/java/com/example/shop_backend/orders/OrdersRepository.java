package com.example.shop_backend.orders;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface OrdersRepository extends MongoRepository<Order, String> {

    @Query(value = "{'clientData.idC' : ?0}")
    List<Order> findAllByClientDataIdC(int clientId);

}
