import { Injectable } from '@angular/core';
import { Product } from '../products/product';
import { Observable, Observer, Subject } from 'rxjs';
import { ProductsService } from '../products/products.service';
import { AuthService } from '../auth/auth.service';
import { ClientsService } from '../account/clients.service';

@Injectable({
  providedIn: 'root'
})
export class WishListService {
  wishListIds: string[] = [];
  wishListSubject = new Subject<string[]>();
  showLocalStorage: boolean = false;

  constructor(private productsService: ProductsService, private authService: AuthService, private clientsService: ClientsService) {
    //this.getFromLocalStorage();
    this.getFromStorage();
    this.wishListSubject.next(this.wishListIds);
  }

  addProductToWishList(productId: string) {
    for (let i = 0; i < this.wishListIds.length; i++) {
      if (this.wishListIds[i] === productId) {
        return;
      }
    }

    this.wishListIds.push(productId);
    //this.saveInLocalStorage();
    this.saveStorage()
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

    //this.saveInLocalStorage();
    this.saveStorage()
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

  getFromStorage() {
    this.wishListIds = [];

    if (this.authService.isLoggedIn() && !this.showLocalStorage) {
      this.getUserStorage()
    } else {
      this.getFromLocalStorage();
    }
  }

  saveStorage() {
    if (this.authService.isLoggedIn() && !this.showLocalStorage) {
      this.saveUserStorage();
    } else {
      this.saveInLocalStorage();
    }
  }

  getUserStorage() {
    this.clientsService.getMyWishList().then((res) => {
      if (res) {
        this.wishListIds = res;
      }

    }).catch((error) => {
      let message: string = error.error.message;
      if (message && message.includes("problem: ")) {
        message = message.split("problem: ")[1]
      }
      console.log(message)
      alert(message)
    });
  }

  saveUserStorage() {
    this.clientsService.saveMyWishList(this.wishListIds).then((res) => {
    }).catch((error) => {
      let message: string = error.error.message;
      if (message && message.includes("problem: ")) {
        message = message.split("problem: ")[1]
      }
      console.log(message)
      alert(message)
    });
  }

  saveInLocalStorage() {
    localStorage.setItem("wishListIds", JSON.stringify(this.wishListIds));
  }

  getFromLocalStorage() {
    let p = JSON.parse(localStorage.getItem('wishListIds')!)
    if (p != null) {
      this.wishListIds = p;
    }
  }

  changeStorage() {
    this.showLocalStorage = !this.showLocalStorage
    this.getFromStorage();
    this.wishListSubject.next(this.wishListIds);
  }

  isLocalStorage() {
    return this.showLocalStorage;
  }

  changeUser() {
    this.getFromStorage();
    this.showLocalStorage = false;

    this.wishListSubject.next(this.wishListIds);
  }
}
