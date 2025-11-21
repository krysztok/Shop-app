package com.example.shop_backend.filters;

import java.util.List;
import java.util.Map;

public interface FiltersServiceI {
    CustomFilter[] getFiltersByCategoryId(String categoryId);
    List<Filter> getAllFilters();
    void createFilter(FilterCreateDTO cFilterDTO);
    void deleteFilter(String id, int index);
    void deleteFiltersByCategoryId(String categoryId);
    void addParamsToFilter(String categoryId, Map<String, Object> params);
    void removeParamsFromFilter(String productId, String categoryId, Map<String, Object> params);
}
