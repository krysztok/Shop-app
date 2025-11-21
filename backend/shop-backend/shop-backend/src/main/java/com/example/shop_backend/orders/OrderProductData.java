package com.example.shop_backend.orders;

public class OrderProductData {
    private String productId;
    private double value;
    private int  amount;
    private double totalValue; //redundant but can be used for discounts?

    public OrderProductData(String productId, double value, int amount, double totalValue) {
        if (productId == null || productId.isEmpty()) {
            throw new IllegalArgumentException("Product Id cannot be empty!");
        }

        if (value <= 0) {
            throw new IllegalArgumentException("Value can not be lower or equal 0!");
        }

        if (amount < 1) {
            throw new IllegalArgumentException("Amount can not be lower than 1!");
        }

        if (totalValue <= 0) {
            throw new IllegalArgumentException("Total value can not be lower or equal 0!");
        }

        this.productId = productId;
        this.value = value;
        this.amount = amount;
        this.totalValue = totalValue;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public double getTotalValue() {
        return totalValue;
    }

    public void setTotalValue(double totalValue) {
        this.totalValue = totalValue;
    }
}
