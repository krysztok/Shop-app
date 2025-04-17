import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { Product } from '../../products/product';
import { CategoriesService } from '../../categories-bar/categories.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-product-component',
  templateUrl: './cart-product-component.component.html',
  styleUrl: './cart-product-component.component.css'
})
export class CartProductComponentComponent {

@Input() product!: Product;
@Input() ammount!: number;
@Output() ammountChange: EventEmitter<number> = new EventEmitter<number>();

constructor(private categoriesService: CategoriesService, private router: Router){}

changeAmount(add: boolean) {
  if(add){
    this.ammountChange.emit(++this.ammount);
  } else {
    this.ammountChange.emit(--this.ammount);
  }
}

remove(){
  this.ammountChange.emit(0);
}

goToProductPage(){
  this.categoriesService.getCategoryById(this.product.categoryId).then((category) => {
   this.router.navigateByUrl("/products/"+ category?.label.replaceAll(' ', '-') + "/" + this.product.name.replaceAll(' ', '-'));
  }
 )

}

}
