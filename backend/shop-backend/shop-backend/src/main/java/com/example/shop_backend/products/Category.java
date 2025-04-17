package com.example.shop_backend.products;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Arrays;
import java.util.Objects;

@Document(collection = "Categories")
public class Category {
    @Id
    @Indexed(unique=true)
    private String _id;
    private String label;
   // private String routerLink;
    private String[] items;
    private String type;

    //dodać usuwanie(co z produktami?) i update categorii

    public Category(String label, String type) {
        if (label.length() > 40) {
            throw new IllegalArgumentException("Label is too long");
        }
        else if (!label.matches("^[0-9a-zA-Z ]+$")){
            throw new IllegalArgumentException("Label contains illegal characters");
        }

        if (!Objects.equals(type, "category") &&
                !Objects.equals(type, "subCategory") &&
                !Objects.equals(type, "subSubCategory")) {
            throw new IllegalArgumentException("Unknown category type");
        }

        // routerLink ? poczebne?

        this.label = label;
       // this.routerLink = routerLink;
        this.type = type;

        if(type.equals("category") || type.equals("subCategory")) {
            items = new String[0];
        }
    }

    public String get_id() {
        return _id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {

        return _id + " " + label;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    /*public String getRouterLink() {
        return routerLink;
    }*/

    /*public void setRouterLink(String routerLink) {
        this.routerLink = routerLink;
    }*/

    public String[] getItems() {
        return items;
    }

    public void setItems(String[] items) {
        this.items = items;
    }

    public void addItem(String id) {
        String[] newItems = Arrays.copyOf(items, items.length + 1);
        newItems[items.length] = id;
        items = newItems;
    }
}
