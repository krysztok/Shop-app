package com.example.shop_backend.products;

public class CategoryNavDTO {
    String mainCategory;
    String subCategory;

    public CategoryNavDTO(String mainCategory, String subCategory) {
        this.subCategory = subCategory;
        this.mainCategory = mainCategory;
    }

    public String getMainCategory() {
        return mainCategory;
    }

    public void setMainCategory(String mainCategory) {
        this.mainCategory = mainCategory;
    }

    public String getSubCategory() {
        return subCategory;
    }

    public void setSubCategory(String subCategory) {
        this.subCategory = subCategory;
    }
}
