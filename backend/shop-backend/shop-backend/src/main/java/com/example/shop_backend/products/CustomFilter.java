package com.example.shop_backend.products;

public class CustomFilter {
    private String parameterName;
    private String filterType;
    private String[] availableOptions;
    private int max;

    public String getFilterType() {
        return filterType;
    }

    public void setFilterType(String filterType) {
        this.filterType = filterType;
    }

    public int getMax() {
        return max;
    }

    public void setMax(int max) {
        this.max = max;
    }

    public String[] getAvailableOptions() {
        return availableOptions;
    }

    public void setAvailableOptions(String[] availableOptions) {
        this.availableOptions = availableOptions;
    }

    public String getParameterName() {
        return parameterName;
    }

    public void setParameterName(String parameterName) {
        this.parameterName = parameterName;
    }


}
