package com.example.shop_backend.products;

public class FilterCreateDTO {
    private String name;
    private String categoryId;
    private String type;

    public FilterCreateDTO(String name, String categoryId, String type) {
        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("Param name cannot be empty!");
        }
        else if (name.length() > 40) {
            throw new IllegalArgumentException("Param name ( " + name + " ) is too long!");
        }
        else if (!name.matches("^[0-9a-zA-Z!-\\\\ \\\\/:-@\\[-_\\]]+$")) {
            throw new IllegalArgumentException("Param name ( " + name + " ) contains illegal characters!");
        }

        if (type == null || type.isEmpty()) {
            throw new IllegalArgumentException("Type cannot be empty!");
        } else if (!type.equals("string") && !type.equals("boolean") && !type.equals("int")){
            throw new IllegalArgumentException("Unknown filter type! ( " + type + " )");
        }

        if (categoryId == null || categoryId.isEmpty()) {
            throw new IllegalArgumentException("CategoryId cannot be empty!");
        }

        this.name = name;
        this.categoryId = categoryId;
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public String getType() {
        return type;
    }
}
