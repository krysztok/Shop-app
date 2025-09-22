package com.example.shop_backend.products;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Arrays;
import java.util.Date;
import java.util.Map;
import java.util.Objects;

@Document(collection = "Products")
public class Product {
    public boolean isActive() {
        return active;
    }

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
    private Rating[] ratings;

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
                    if (i < 0) {
                        throw new IllegalArgumentException("Parameter value ( " + param + " ) can not be lower than 0!");
                    }
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

    public void addRating(Rating addRating) {
        if (ratings == null) {
           ratings = new Rating[0];
        }

        Rating rating = new Rating(addRating.getUser(), addRating.getValue(), addRating.getComment());
        rating.setDate(new Date());
        rating.set_id(new ObjectId().toString());

        Rating[] newRatings = Arrays.copyOf(ratings, ratings.length + 1);
        newRatings[ratings.length] = rating;
        ratings = newRatings;

        calculateRatings();
    }

    public void deleteRating(String ratingId) {
        int index = -1;

        for (int i = 0; i < ratings.length; i++){
            if (Objects.equals(ratings[i].get_id(), ratingId)) {
                index = i;
                break;
            }
        }

        if(index < 0) {
            return;
        }

        Rating[] newRatings = new Rating[ratings.length-1];
        int j = 0;
        for (int i = 0; i < ratings.length; i++) {
            if (i != index){
                newRatings[j] = ratings[i];
                j++;
            }
        }
        this.ratings = newRatings;

        calculateRatings();
    }

    public void calculateRatings() {
        if (ratings != null && ratings.length != 0) {
            double ratingV = 0;

            for(Rating rating: ratings) {
                ratingV += rating.getValue();
            }

            this.ratingValue = ratingV / ratings.length;
        } else {
            this.ratingValue = 0;
        }
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

    public void setName(String name) {
        this.name = name;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setRatingValue(double ratingValue) {
        this.ratingValue = ratingValue;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public void setParams(Map<String, Object> params) {
        this.params = params;
    }

    public Rating[] getRatings() {
        return ratings;
    }

    public void setRatings(Rating[] ratings) {
        this.ratings = ratings;
    }
}
