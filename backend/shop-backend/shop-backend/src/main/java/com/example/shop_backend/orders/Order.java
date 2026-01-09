package com.example.shop_backend.orders;

import com.example.shop_backend.accounts.ClientData;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Arrays;
import java.util.Date;

@Document(collection = "Orders")
public class Order {
    @Id
    @Indexed(unique=true)
    private String _id;
    private ClientData clientData;
    private OrderProductData[] products;
    private double productsTotalValue;
    private OrderTransportData orderTransportData;
    private String paymentOption;
    private double totalValue;
    private OrderStatus orderStatus;
    private Date date;

    private StatusHistory[] statusHistory;

    public enum OrderStatus {
        placed,
        paid,
        confirmed,
        inDelivery,
        completed,
        canceled
    }

    public Order() {}

    public Order(ClientData clientData, OrderProductData[] products, double productsTotalValue, OrderTransportData orderTransportData, String paymentOption, double totalValue) {
        if (productsTotalValue <= 0) {
            throw new IllegalArgumentException("Products total value can not be lower or equal 0!");
        }

        if (totalValue <= 0) {
            throw new IllegalArgumentException("Total value can not be lower or equal 0!");
        } else if (totalValue < productsTotalValue) {
            throw new IllegalArgumentException("Total value can not be lower than products total value!");
        }

        String[] paymentOptions = {"Payment option 1", "Payment option 2", "Payment option 3", "Payment option 4"};
        boolean correctPaymentOption = false;
        for (int i = 0; i < paymentOption.length(); i++) {
            if(paymentOption.equals(paymentOptions[i])){
                correctPaymentOption = true;
                break;
            }
        }

        if(!correctPaymentOption) {
            throw new IllegalArgumentException("Incorrect payment option!");
        }

        this.clientData = clientData;
        this.products = products;
        this.productsTotalValue = productsTotalValue;
        this.orderTransportData = orderTransportData;
        this.paymentOption = paymentOption;
        this.totalValue = totalValue;
    }

    public void putStatusHistory(StatusHistory statusH) {
        if(statusHistory == null) {
            statusHistory = new StatusHistory[1];
        } else {
            statusHistory = Arrays.copyOf(statusHistory, statusHistory.length + 1);
        }

        statusHistory[statusHistory.length-1] = statusH;

    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public ClientData getClientData() {
        return clientData;
    }

    public void setClientData(ClientData clientData) {
        this.clientData = clientData;
    }

    public OrderProductData[] getProducts() {
        return products;
    }

    public void setProducts(OrderProductData[] products) {
        this.products = products;
    }

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(OrderStatus orderStatus) {
        this.orderStatus = orderStatus;
    }

    public double getTotalValue() {
        return totalValue;
    }

    public void setTotalValue(double totalValue) {
        this.totalValue = totalValue;
    }

    public String getPaymentOption() {
        return paymentOption;
    }

    public void setPaymentOption(String paymentOption) {
        this.paymentOption = paymentOption;
    }

    public OrderTransportData getOrderTransportData() {
        return orderTransportData;
    }

    public void setOrderTransportData(OrderTransportData orderTransportData) {
        this.orderTransportData = orderTransportData;
    }

    public double getProductsTotalValue() {
        return productsTotalValue;
    }

    public void setProductsTotalValue(double productsTotalValue) {
        this.productsTotalValue = productsTotalValue;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public StatusHistory[] getStatusHistory() {
        return statusHistory;
    }

    public void setStatusHistory(StatusHistory[] statusHistory) {
        this.statusHistory = statusHistory;
    }

}
