package com.example.shop_backend.products;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Arrays;
import java.util.Map;

@Document(collection = "filters")
public class Filter {
    @Id
    @Indexed(unique=true)
    private String _id;
    private String category_id;
    private CustomFilter[] filters;

    public Filter(){}

    public Filter (String _id, String category_id, CustomFilter[] filters) {
        this._id = _id;
        this.category_id = category_id;
        this.filters = filters;
    }

    public Filter (String category_id){
        this.category_id = category_id;
        this.filters = new CustomFilter[0];
    }

    public CustomFilter[] getFilters() {
        return filters;
    }

    public String get_id() {
        return _id;
    }

    public String getCategory_id() {
        return category_id;
    }

    public void addParamString(String name, String[] availableOptions) {
        CustomFilter filter = new CustomFilter(name, "string", availableOptions);
        addParam(filter);
    }

    public void addParamBoolean(String name) {
        CustomFilter filter = new CustomFilter(name, "boolean");
        addParam(filter);
    }

    public void addParamInt(String name, int max) {
        CustomFilter filter = new CustomFilter(name, "int", max);
        addParam(filter);
    }

    public void addParam(CustomFilter filter) {
        CustomFilter[] newFilters = Arrays.copyOf(filters, filters.length + 1);
        newFilters[newFilters.length - 1] = filter;
        filters = newFilters;
    }
}
