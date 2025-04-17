import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../product';
import { Filters } from './filters';

@Pipe({
  name: 'filtersPipe'
})
export class FiltersPipe implements PipeTransform {

  transform(products: Product[] | undefined, filters: Filters): any {
    
    if (products == undefined) {
      return null;
    }

    let filteredProducts: Product[] = products;

    let priceFrom = filters.priceFrom;
    if(priceFrom !== null) {
      filteredProducts = filteredProducts.filter((product) => product.price > priceFrom);
    }

    let priceTo = filters.priceTo;
    if(priceTo !== null) {
      filteredProducts = filteredProducts.filter((product) => product.price < priceTo);
    }
    
    let rating = filters.rating;
    if(rating !== null) {
      filteredProducts = filteredProducts.filter((product) => product.ratingValue >= rating);
    }

    filters.customFilters?.forEach((cFilter) => {
      if((cFilter.filterType == "string" || cFilter.filterType == "int") && 
          cFilter.selectedOptions !== undefined && cFilter.selectedOptions.length > 0) {
        filteredProducts = filteredProducts.filter((product) => checkIfProductFulfilManyOptionsFilter(product.params.get(cFilter.parameterName), cFilter.selectedOptions));
      }

      if(cFilter.filterType == "boolean" && cFilter.selectedOptions !== undefined && cFilter.selectedOptions.length > 0){
        filteredProducts = filteredProducts.filter((product) => product.params.get(cFilter.parameterName) === cFilter.selectedOptions[0]);
      }
    })

    return filteredProducts;
  }

}

function checkIfProductFulfilManyOptionsFilter(parameterValue: any, selectedOptions: any[]): boolean {
  for(let i = 0; i < selectedOptions.length; i++){
    if(parameterValue === selectedOptions[i]){
      return true;
    }
  }

  return false;
}
