import { Injectable } from '@angular/core';
import { Product } from '../products/product';
import { Observable, Observer, Subject } from 'rxjs';
import { ProductsService } from '../products/products.service';

@Injectable({
  providedIn: 'root'
})
export class WishListService {
    wishListIds: string[] = [];
    wishListSubject  = new Subject<string[]>();

    constructor(private productsService: ProductsService){
      this.getFromLocalStorage();
      this.wishListSubject.next(this.wishListIds);
    }
  
    addProductToWishList(product: Product) {
      for(let i = 0; i < this.wishListIds.length; i++){
        if(this.wishListIds[i] === product._id){
          return;
        }
      }
    
      this.wishListIds.push(product._id);
      this.addToLocalStorage();
      this.wishListSubject.next(this.wishListIds);
    }

    getProductsIds(){
      return this.wishListIds;
    }

    getProducts(){
      let products: Product[] = []
      for (let i = 0; i < this.wishListIds.length; i++) {
        this.productsService.getProductById(this.wishListIds[i]).then(
          (product) => {
            products.push(product!);
          }
        )
      }

      return products;
    }

    removeProduct(product: Product) {
      for(let i = 0; i< this.wishListIds.length; i++) {
          if(this.wishListIds[i] === product._id) {
            this.wishListIds.splice(i, 1);
          }
      }
  
      this.addToLocalStorage();
      this.wishListSubject.next(this.wishListIds);
    }
  
    checkIfOnWishList(product: Product) {
      for(let i = 0; i < this.wishListIds.length; i++) {
        if(this.wishListIds[i] === product._id){
          return true;
        }
      }
  
      return false;
    }

    addToLocalStorage() {
      localStorage.setItem("wishListIds", JSON.stringify(this.wishListIds));
    }

    getFromLocalStorage() {
      let p = JSON.parse(localStorage.getItem('wishListIds')!)
      if(p != null){
        this.wishListIds = p;
      }
    }
  
}
