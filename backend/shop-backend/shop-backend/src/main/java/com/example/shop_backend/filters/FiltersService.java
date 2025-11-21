package com.example.shop_backend.filters;
import com.example.shop_backend.products.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@Service
public class FiltersService implements FiltersServiceI {
    @Autowired
    private FiltersRepository filtersRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public CustomFilter[] getFiltersByCategoryId(String categoryId) {
        Filter filter = filtersRepository.findByCategoryId(categoryId);

        if (filter != null) {
            return filter.getFilters();
        } else {
            return null;
        }
    }

    @Override
    public List<Filter> getAllFilters(){
        return filtersRepository.findAll();
    }

    @Override
    public void createFilter(FilterCreateDTO cFilterDTO){
        Filter filter = filtersRepository.findByCategoryId(cFilterDTO.getCategoryId());
        if (filter == null) {
            filter = new Filter(cFilterDTO.getCategoryId());
        }

        List<Product> products = new ArrayList<>();

        if(!Objects.equals(cFilterDTO.getType(), "boolean")){
            products = productRepository.findAllByCategoryId(cFilterDTO.getCategoryId());
        }

        switch (cFilterDTO.getType()) {
            case "string":
                List<String> availableOptions = new ArrayList<>();

                for (Product product : products) {
                    Object o = product.getParam(cFilterDTO.getName());

                    if (o!=null && o.getClass() == String.class) {
                        String s = (String) o;
                        if (!availableOptions.contains(s)) {
                            availableOptions.add(s);
                        }
                    }
                }

                filter.addParamString(cFilterDTO.getName(), availableOptions.toArray(new String[availableOptions.size()]));
                break;
            case "boolean":
                filter.addParamBoolean(cFilterDTO.getName());
                break;
            case "int":
                int max = 0;

                for (Product product : products) {
                    Object o = product.getParam(cFilterDTO.getName());

                    if (o!=null && o.getClass() == Integer.class) {
                        int i = (Integer) o;

                        if(i > max){
                            max = i;
                        }
                    }
                }

                filter.addParamInt(cFilterDTO.getName(), max);
                break;
        }

        filtersRepository.save(filter);
    }

    @Override
    public void deleteFilter(String id, int index) {
        Optional<Filter> oFilter = filtersRepository.findById(id);

        if (oFilter.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Filter with id: '" + id + "' does not exist!");
        }

        Filter filter = oFilter.get();

        if (filter.getFilters().length-1 < index) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Filter with id: '" + id + "' does not have filter with index: " + index + "!");
        }

        filter.removeFilter(index);

        if (filter.getFilters().length > 0) {
            filtersRepository.save(filter);
        } else {
            filtersRepository.deleteById(filter.get_id());
        }
    }

    @Override
    public void deleteFiltersByCategoryId(String categoryId) {
        Filter filter = filtersRepository.findByCategoryId(categoryId);

        if (filter != null) {
            filtersRepository.deleteById(filter.get_id());
        }
    }

    @Override
    public void addParamsToFilter(String categoryId, Map<String, Object> params){
        Filter filter = filtersRepository.findByCategoryId(categoryId);
        boolean filterChanged = false;

        if (filter != null) {
            for (int i = 0; i < filter.getFilters().length; i++){
                CustomFilter cFilter = filter.getFilters()[i];
                Object o = params.get(cFilter.getParameterName());

                if(o != null) {
                    if (Objects.equals(cFilter.getFilterType(), "string") && o.getClass() == String.class) {
                        String s = (String) o;
                        if (!cFilter.hasOption(s)) {
                            cFilter.addOption(s);
                            filterChanged = true;
                        }

                    } else if (Objects.equals(cFilter.getFilterType(), "int") && o.getClass() == Integer.class) {
                        int intOption = (Integer) o;

                        if (intOption > cFilter.getMax()) {
                            cFilter.setMax(intOption);
                            filterChanged = true;
                        }
                    }
                }
            }
        }

        if(filterChanged){
            filtersRepository.save(filter);
        }
    }

    @Override
    public void removeParamsFromFilter(String productId, String categoryId, Map<String, Object> params) {
        Filter filter = filtersRepository.findByCategoryId(categoryId);
        boolean filterChanged = false;

        if (filter != null) {
            for (int i = 0; i < filter.getFilters().length; i++){
                CustomFilter cFilter = filter.getFilters()[i];
                Object o = params.get(cFilter.getParameterName());

                if(o != null) {
                    if (Objects.equals(cFilter.getFilterType(), "string") && o.getClass() == String.class) {
                        String s = (String) o;

                        if (cFilter.hasOption(s)) {
                            List<Product> productsToCheck = productRepository.findAllByCategoryIdAnd_idNotIn(categoryId, productId);

                            if (!checkIfProductsContainOption(productsToCheck, cFilter.getParameterName(), s)) {
                                cFilter.removeOption(s);
                                filterChanged = true;
                            }
                        }

                    } else if (Objects.equals(cFilter.getFilterType(), "int") && o.getClass() == Integer.class) {
                        int intOption = (Integer) o;

                        if (intOption == cFilter.getMax()){
                            List<Product> productsToCheck = productRepository.findAllByCategoryIdAnd_idNotIn(categoryId, productId);

                            cFilter.setMax(getIntOptionMaxValue(productsToCheck, cFilter.getParameterName()));
                            filterChanged = true;
                        }
                    }
                }
            }
        }

        if(filterChanged){
            filtersRepository.save(filter);
        }
    }


    public boolean checkIfProductsContainOption(List<Product> products, String paramName, String option) {
        for (Product prod : products) {
            for (Map.Entry<String, Object> entry : prod.getParams().entrySet()){
                if (Objects.equals(entry.getKey(), paramName) && entry.getValue().getClass() == String.class && entry.getValue().equals(option)) {
                    return true;
                }
            }
        }

        return false;
    }

    public int getIntOptionMaxValue(List<Product> products, String paramName) {
        int maxValue = 0;
        for (Product prod: products) {
            for (Map.Entry<String, Object> entry : prod.getParams().entrySet()){
                if (Objects.equals(entry.getKey(), paramName) && entry.getValue().getClass() == Integer.class && (int)entry.getValue() > maxValue) {
                    maxValue = (int)entry.getValue();
                }
            }
        }
        return  maxValue;
    }
}
