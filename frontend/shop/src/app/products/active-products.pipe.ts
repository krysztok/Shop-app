import { Pipe, PipeTransform } from '@angular/core';
import { Product } from './product';

@Pipe({
  name: 'activeProducts'
})
export class ActiveProductsPipe implements PipeTransform {

  transform(products: Product[] | undefined): any {
    if (products == undefined) {
      return null;
    }

    return products.filter(product => product.active)
  }

}
