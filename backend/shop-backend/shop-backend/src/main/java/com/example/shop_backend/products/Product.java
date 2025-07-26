package com.example.shop_backend.products;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;
import java.util.Objects;

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

    public Product(String name, String description, double price, String categoryId, Map<String, Object> params){
        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("Name cannot be empty!");
        }
        else if (name.length() > 40) {
            throw new IllegalArgumentException("Name is too long!");
        }
        else if (!name.matches("^[0-9a-zA-Z ]+$")){
            throw new IllegalArgumentException("Name contains illegal characters!");
        }

        if (price <= 0) {
            throw new IllegalArgumentException("Price can not be lower or equal 0!");
        }

        if (description == null || description.isEmpty()) {
            throw new IllegalArgumentException("Description can not be empty!");
        } else if(description.length() > 2000) {
            throw new IllegalArgumentException("Description is too long!");
        } else if (!description.matches("^[0-9a-zA-Z!-\\\\ \\\\/:-@\\[-_\\]]+$")){
            throw new IllegalArgumentException("Description contains illegal characters!");
        }



        params.forEach((param, object) -> {
            if (param == null || param.isEmpty()) {
                throw new IllegalArgumentException("Param name ( " + param + " ) cannot be empty!");
            }
            else if (param.length() > 40) {
                throw new IllegalArgumentException("Param name ( " + param + " ) is too long!");
            }
            else if (!param.matches("^[0-9a-zA-Z!-\\\\ \\\\/:-@\\[-_\\]]+$")) {
                throw new IllegalArgumentException("Param name ( " + param + " ) contains illegal characters!");
            }

            switch (object) {
                case String s -> {
                    if (s.isEmpty()) {
                        throw new IllegalArgumentException("Parameter value ( " + param + " ) can not be empty!");
                    } else if (s.length() > 20) {
                        throw new IllegalArgumentException("Parameter value ( " + param + " ) is too long!");
                    } else if (!s.matches("^[0-9a-zA-Z!-\\\\ \\\\/:-@\\[-_\\]]+$")) {
                        throw new IllegalArgumentException("Parameter value ( " + param + " ) contains illegal characters!");
                    }
                }
                case Integer i -> {
                    //nothing?
                }
                case Boolean b -> {
                    //nothing?
                }
                case null, default ->
                        throw new IllegalArgumentException("Unsupported param type for param: " + param + "!");
            }

        });

        this.name = name;
        this.description = description;
        this.price = price;
        this.categoryId = categoryId;
        this.params = params;

        this.ratingValue = 0;
        this.active = true;
    }

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

    public Object getParam(String param) {
        return params.get(param);
    }
}
