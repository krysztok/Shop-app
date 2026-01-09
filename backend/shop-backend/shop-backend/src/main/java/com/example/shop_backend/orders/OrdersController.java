package com.example.shop_backend.orders;

import com.example.shop_backend.accounts.ClientData;
import com.example.shop_backend.accounts.ClientsServiceI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RequestMapping("orders/")
@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class OrdersController {
    private final OrdersServiceI ordersService;
    private final ClientsServiceI clientsService;

    @Autowired
    public OrdersController(OrdersServiceI ordersService, ClientsServiceI clientsService) {
        this.ordersService = ordersService;
        this.clientsService = clientsService;
    }

    @PostMapping("/p/createOrder")
    public Map<String, String> createOrder(@RequestBody Order order) {
        return ordersService.createOrder(order);
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/a/changeOrderStatus/{id}/{orderStatus}")
    @ResponseBody
    public void changeOrderStatus(@PathVariable String id, @PathVariable Order.OrderStatus orderStatus) {
        ordersService.changeOrderStatus(id, orderStatus);
    }

    @GetMapping("/a/getAllOrders")
    public List<Order> getAllOrders(){
        return ordersService.getAllOrders();
    }

    @GetMapping("/a/getOrdersByClientId/{id}")
    public List<Order> getOrdersByClientId(@PathVariable int id){
        return ordersService.getOrdersByClientId(id);
    }

    @GetMapping("/c/getMyOrders")
    public List<Order> getMyOrders(Authentication authentication){
        ClientData clientData = clientsService.getClientByEmail(authentication.getName());
        return ordersService.getOrdersByClientId(clientData.getIdC());
    }

    @GetMapping("/p/getOrder/{id}")
    public Order getOrderById(@PathVariable String id) {
        return ordersService.getOrderById(id);
    }
}
