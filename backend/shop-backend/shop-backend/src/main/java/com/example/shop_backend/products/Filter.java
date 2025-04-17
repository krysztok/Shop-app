package com.example.shop_backend.products;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document(collection = "filters")
public class Filter {
    @Id
    @Indexed(unique=true)
    private String _id;
    private String category_id;
    private CustomFilter[] filters;

    public CustomFilter[] getFilters() {
        return filters;
    }
}
