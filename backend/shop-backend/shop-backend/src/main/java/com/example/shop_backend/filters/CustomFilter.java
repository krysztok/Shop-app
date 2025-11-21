package com.example.shop_backend.filters;

import java.util.Arrays;
import java.util.Objects;

public class CustomFilter {
    private String parameterName;
    private String filterType;
    private String[] availableOptions;
    private int max;

    public CustomFilter(){}

    public CustomFilter(String parameterName, String[] availableOptions, String filterType, int max) {
        this.parameterName = parameterName;
        this.availableOptions = availableOptions;
        this.filterType = filterType;
        this.max = max;
    }

    public CustomFilter(String parameterName, String filterType) {
        this.parameterName = parameterName;
        this.filterType = filterType;
    }

    public CustomFilter(String parameterName, String filterType, String[] availableOptions) {
        this.parameterName = parameterName;
        this.filterType = filterType;
        this.availableOptions = availableOptions;
    }

    public CustomFilter(String parameterName, String filterType, int max) {
        this.parameterName = parameterName;
        this.filterType = filterType;
        this.max = max;
    }

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

    public boolean hasOption(String option) {
        for (String availableOption : availableOptions) {
            if (Objects.equals(availableOption, option)) {
                return true;
            }
        }

        return false;
    }

    public void removeOption(String option) {
        if (!hasOption(option)) {
            return;
        }

        int removedIdx = getOptionIndex(option);
        String[] newOptions = new String[availableOptions.length - 1];
        int j = 0;

        for(int i = 0; i < availableOptions.length; i++) {
            if (i != removedIdx) {
                newOptions[j] = availableOptions[i];
                j++;
            }
        }

        availableOptions = newOptions;
    }

    public int getOptionIndex(String option) {
        for (int i = 0; i < availableOptions.length; i++) {
            if (Objects.equals(availableOptions[i], option)) {
                return i;
            }
        }

        return -1;
    }

    public void addOption(String option) {
        String[] newOptions = Arrays.copyOf(availableOptions, availableOptions.length+1);
        newOptions[newOptions.length-1] = option;
        availableOptions = newOptions;
    }

}
