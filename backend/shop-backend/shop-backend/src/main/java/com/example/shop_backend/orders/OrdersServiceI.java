package com.example.shop_backend.orders;

import java.util.List;
import java.util.Map;

public interface OrdersServiceI {
    List<Order> getAllOrders();
    Order getOrderById(String id);
    Map<String, String> createOrder(Order order);
    void changeOrderStatus(String id, Order.OrderStatus orderStatus);
}
