import { Component } from '@angular/core';
import { Product } from './products/product';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  wishList: Product[] = [];
  cart: Product[] = [];

  addProductToWishList(product: Product) {
    for(let i = 0; i < this.wishList.length; i++){
      if(this.wishList[i]._id === product._id){
        return;
      }
    }
  
    this.wishList.push(product);
  }

  addProductToCart(product: Product) {
    for(let i = 0; i < this.cart.length; i++){
      if(this.cart[i]._id === product._id){
        return;
      }
    }
  
    this.cart.push(product);
  }

}
