package com.example.shop_backend.orders;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RequestMapping("orders/")
@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class OrdersController {
    private final OrdersServiceI ordersService;

    @Autowired
    public OrdersController(OrdersServiceI ordersService) {
        this.ordersService = ordersService;
    }

    @PostMapping("/createOrder")
    public Map<String, String> createOrder(@RequestBody Order order) {
        return ordersService.createOrder(order);
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/changeOrderStatus/{id}/{orderStatus}")
    @ResponseBody
    public void changeOrderStatus(@PathVariable String id, @PathVariable Order.OrderStatus orderStatus) {
        ordersService.changeOrderStatus(id, orderStatus);
    }

    @GetMapping("/getAllOrders")
    public List<Order> getAllOrders(){
        return ordersService.getAllOrders();
    }

    @GetMapping("/getOrder/{id}")
    public Order getOrderById(@PathVariable String id) {
        return ordersService.getOrderById(id);
    }
}
