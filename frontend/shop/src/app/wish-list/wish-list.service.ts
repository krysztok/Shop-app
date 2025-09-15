import { Injectable } from '@angular/core';
import { Product } from '../products/product';
import { Observable, Observer, Subject } from 'rxjs';
import { ProductsService } from '../products/products.service';

@Injectable({
  providedIn: 'root'
})
export class WishListService {
  wishListIds: string[] = [];
  wishListSubject = new Subject<string[]>();

  constructor(private productsService: ProductsService) {
    this.getFromLocalStorage();
    this.wishListSubject.next(this.wishListIds);
  }

  addProductToWishList(productId: string) {
    for (let i = 0; i < this.wishListIds.length; i++) {
      if (this.wishListIds[i] === productId) {
        return;
      }
    }

    this.wishListIds.push(productId);
    this.addToLocalStorage();
    this.wishListSubject.next(this.wishListIds);
  }

  getProductsIds() {
    return this.wishListIds;
  }

  getProducts() {
    let products: Product[] = []
    for (let i = 0; i < this.wishListIds.length; i++) {
      this.productsService.getProductById(this.wishListIds[i]).then(
        (product) => {
          if (product == null) {
            alert("Product with id: \"" + this.wishListIds[i] + "\" has been removed from wish list and wont be available!")
            this.removeProduct(this.wishListIds[i])
          } else {
            products.push(product!);
          }
        }
      )
    }

    return products;
  }

  getProductsNumber() {
    let ammount: number = 0;
    this.wishListIds.forEach(() => {
      ammount += 1;
    })

    return ammount;
  }

  removeProduct(productId: String) {
    for (let i = 0; i < this.wishListIds.length; i++) {
      if (this.wishListIds[i] === productId) {
        this.wishListIds.splice(i, 1);
      }
    }

    this.addToLocalStorage();
    this.wishListSubject.next(this.wishListIds);
  }

  checkIfOnWishList(product: Product) {
    for (let i = 0; i < this.wishListIds.length; i++) {
      if (this.wishListIds[i] === product._id) {
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
    if (p != null) {
      this.wishListIds = p;
    }
  }

}
