package com.example.shop_backend.orders;
import com.example.shop_backend.products.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrdersService implements OrdersServiceI{

    @Autowired
    private OrdersRepository ordersRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Order> getAllOrders() {
        return ordersRepository.findAll();
    }

    @Override
    public Order getOrderById(String id) {
        return ordersRepository.findById(id).orElse(null);
    }

    @Override
    public List<Order> getOrdersByClientId(int idC) {
        return ordersRepository.findAllByClientDataIdC(idC);
    }

    @Override
    public Map<String, String> createOrder(Order order) {
        double productsValue = 0;

        //check products ids and values
        for(OrderProductData orderProductData: order.getProducts()) {
            String id = orderProductData.getProductId();
            Product product = productRepository.findById(id).orElse(null);

            if (product == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product with id: '" + id + "' does not exist!");
            }

            double price = product.getPrice();
            if(price != orderProductData.getValue()) {
                throw new IllegalArgumentException("Product with id: '" + id + " value is incorrect!");
            }

            double value = price * orderProductData.getAmount();
            if(value != orderProductData.getTotalValue()) {
                throw new IllegalArgumentException("Product with id: '" + id + " total value is incorrect!");
            }

            productsValue += value;
        }

        //check total products value
        if(order.getProductsTotalValue() != productsValue) {
            throw new IllegalArgumentException("Total products value is incorrect!");
        }

        //check total value
        double totalValue = productsValue + order.getOrderTransportData().getTransportCost();
        if (order.getTotalValue() != totalValue) {
            throw new IllegalArgumentException("Total value is incorrect!");
        }

        Order o = new Order(order.getClientData(), order.getProducts(), productsValue,
                order.getOrderTransportData(), order.getPaymentOption(), totalValue);
        o.setOrderStatus(Order.OrderStatus.placed);
        Date date = new Date();
        o.setDate(date);
        o.putStatusHistory(new StatusHistory(Order.OrderStatus.placed, date));
        String id = ordersRepository.insert(o).get_id();

        HashMap<String, String> map = new HashMap<>();
        map.put("id", id);
        return map;
    }

    @Override
    public void changeOrderStatus(String id, Order.OrderStatus orderStatus) {
        Order order = getOrderById(id);

        if (order == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order with id: '" + id + "' does not exist!");
        }

        if(order.getOrderStatus() == Order.OrderStatus.canceled) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can not change status of canceled order!");
        }

        Date date = new Date();
        order.setOrderStatus(orderStatus);
        order.putStatusHistory(new StatusHistory(orderStatus, date));
        ordersRepository.save(order);
    }
}
