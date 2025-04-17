package com.example.shop_backend.products;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document(collection = "Products")
public class Product {
    @Id
    @Indexed(unique=true)
    private String _id;
    private String name;
    private String description;
    private double ratingValue;
    private double price;
    private String categoryId;
    private boolean active;
    private Map<String, Object> params;

    public String getName(){
        return name;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public double getPrice() {
        return price;
    }

    public double getRatingValue() {
        return ratingValue;
    }

    public String get_id() {
        return _id;
    }

    public String getDescription() {
        return description;
    }

    public Map<String, Object> getParams() {
        return params;
    }
}
