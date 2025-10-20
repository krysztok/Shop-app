package com.example.shop_backend.products;

import java.util.Date;

public class StatusHistory {
    private Order.OrderStatus status;
    private Date date;

    public StatusHistory(Order.OrderStatus status, Date date) {
        this.status = status;
        this.date = date;
    }

    public Order.OrderStatus getStatus() {
        return status;
    }

    public void setStatus(Order.OrderStatus status) {
        this.status = status;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
