package com.example.shop_backend.products;

import org.springframework.beans.factory.annotation.Autowired;
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
    private String[] items;
    private String type;
    private String parentId;

    @Autowired
    private CategoryRepository categoryRepository;

    //dodać usuwanie(co z produktami?) i update categorii

    public Category(String label, String type, String parentId) {
        if (label == null || label.isEmpty()) {
            throw new IllegalArgumentException("Label cannot be empty!");
        }
        else if (label.length() > 40) {
            throw new IllegalArgumentException("Label is too long!");
        }
        else if (!label.matches("^[0-9a-zA-Z ]+$")){
            throw new IllegalArgumentException("Label contains illegal characters!");
        }

        if (type == null || type.isEmpty()) {
            throw new IllegalArgumentException("Type can not be empty!");
        }
        else if (!Objects.equals(type, "category") &&
                !Objects.equals(type, "subCategory") &&
                !Objects.equals(type, "subSubCategory")) {
            throw new IllegalArgumentException("Unknown category type!");
        }

        this.label = label;
        this.type = type;
        this.parentId = parentId;

        if (type.equals("category") || type.equals("subCategory")) {
            items = new String[0];
        }
    }

    public String get_id() {
        return _id;
    }

    public String getType() {
        return type;
    }

    public String getParentId() {
        return parentId;
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
