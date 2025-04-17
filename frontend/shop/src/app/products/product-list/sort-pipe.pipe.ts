import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../product';

@Pipe({
  name: 'sortPipe'
})
export class SortPipePipe implements PipeTransform {

  transform(products: Product[] | undefined, sortBy: string, sortOptions: string[]): any {
    if (products == undefined) {
      return null;
    }

    let sortedProducts: Product[] = products;

    switch (sortBy) {
      case sortOptions[1]: { //name a-z
        sortedProducts = sortedProducts.sort((a, b) => a.name.localeCompare(b.name))
        break;
      }
      case sortOptions[2]: { //name z-a
        sortedProducts = sortedProducts.sort((a, b) => b.name.localeCompare(a.name))
        break;
      }
      case sortOptions[3]: { //price l-h
        sortedProducts = sortedProducts.sort((a, b) => a.price - b.price)
        break;
      }
      case sortOptions[4]: { //price h-l
        sortedProducts = sortedProducts.sort((a, b) => b.price - a.price)
        break;
      }
      case sortOptions[0]: //rating
      default: {
        sortedProducts = sortedProducts.sort((a, b) => b.ratingValue - a.ratingValue)
        break;

      }
    }

    return sortedProducts;
  }
}
