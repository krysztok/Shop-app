import { booleanAttribute, Injectable } from '@angular/core';
import { Product } from '../products/product';
import { Subject } from 'rxjs';
import { ProductsService } from '../products/products.service';
import { WishListService } from '../wish-list/wish-list.service';
import { AuthService } from '../auth/auth.service';
import { ClientsService } from '../account/clients.service';
import { cartDTO } from './cartDTO';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart: Map<Product, number> = new Map<Product, number>;
  cartSubject = new Subject<Map<Product, number>>();
  cartValue: number = 0;
  showLocalStorage: boolean = false;

  constructor(private productsService: ProductsService, private wishListService: WishListService, private authService: AuthService, private clientsService: ClientsService) {
    //this.getFromLocalStorage();
    this.getFromStorage()
    this.calculateCartValue();

    this.cartSubject.next(this.cart);
  }

  ngOnInit() {
    // this.getFromLocalStorage();
    // this.cartSubject.next(this.cart);
  }

  addProductToCart(product: Product) {
    if (this.checkIfInCart(product._id)) {
      return;
    }

    this.cart.set(product, 1);
    this.calculateCartValue();
    this.saveStorage();
    //this.saveInLocalStorage();
    this.cartSubject.next(this.cart);
  }

  getProducts() {
    return this.cart;
  }

  removeProduct(productId: string) {
    this.cart.forEach((v, k) => {
      if (k._id == productId) {
        this.cart.delete(k)
      }
    })

    this.calculateCartValue();
    this.saveStorage();
    //this.saveInLocalStorage();
    this.cartSubject.next(this.cart);
  }

  getProductsNumber() {
    let amount: number = 0;
    this.cart.forEach(() => {
      amount += 1;
    })

    return amount;
  }

  checkIfInCart(productId: string): boolean {
    let inCart: boolean = false;
    this.cart.forEach((v, k) => {
      if (k._id === productId) {
        inCart = true;
      }
    })

    return inCart;
  }

  changeProductAmount(product: Product, amount: number) {
    if (amount != 0) {
      this.cart.set(product, amount);
    } else {
      this.cart.delete(product);
    }

    this.calculateCartValue();
    this.saveStorage();
    //this.saveInLocalStorage();
    this.cartSubject.next(this.cart);
  }

  calculateCartValue() {
    this.cartValue = 0;

    this.cart.forEach((v, k) => {
      this.cartValue += k.price * v;
    })
  }

  getCartValue() {
    return this.cartValue;
  }

  clearCart() {
    this.cart = new Map<Product, number>;
    this.calculateCartValue();

    this.saveStorage();
    //this.saveInLocalStorage();
    this.cartSubject.next(this.cart);
  }

  getFromStorage() {
    this.cart = new Map<Product, number>;

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

  saveUserStorage() {
    let cartIds: string[] = []
    let cartAmount: number[] = []

    this.cart.forEach((v, k) => {
      cartIds.push(k._id);
      cartAmount.push(v);
    })

    let cartDTO: cartDTO = {
      ids: cartIds,
      amount: cartAmount
    };

    this.clientsService.saveMyCart(cartDTO).then((res) => {
    }).catch((error) => {
      let message: string = error.error.message;
      if (message && message.includes("problem: ")) {
        message = message.split("problem: ")[1]
      }
      console.log(message)
      alert(message)
    });
  }

  getUserStorage() {
    this.clientsService.getMyCart().then((res) => {
      if (res) {
        this.loadProducts(res?.ids, res?.amount)
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

  saveInLocalStorage() {
    let cartIds: string[] = []
    let cartAmount: number[] = []

    this.cart.forEach((v, k) => {
      cartIds.push(k._id);
      cartAmount.push(v);
    }
    )

    localStorage.setItem("cartIds", JSON.stringify(cartIds));
    localStorage.setItem("cartAmount", JSON.stringify(cartAmount));
  }

  getFromLocalStorage() {
    let p = JSON.parse(localStorage.getItem('cartIds')!)
    let a = JSON.parse(localStorage.getItem('cartAmount')!)

    this.loadProducts(p, a);
  }

  loadProducts(p: string[], a: number[]) {
    if (p != null) {
      //this.cart = new Map<Product, number>;

      for (let i = 0; i < p.length; i++) {
        this.productsService.getProductById(p[i]).then(
          (product) => {
            if (product == null) {
              alert("Product with id: \"" + p[i] + "\" has been removed from cart and wont be available!")
              this.removeProduct(p[i])
            } else {
              if (product?.active) {
                this.cart.set(product!, a[i]);
                this.calculateCartValue();
              } else {
                alert("Product with id: \"" + p[i] + "\" is currently not available and has been moved to wish list!")
                this.removeProduct(p[i])
                this.wishListService.addProductToWishList(p[i])
              }
              this.cartSubject.next(this.cart); //because map load is async
            }
          })
      }
    }
  }

  changeStorage() {
    this.showLocalStorage = !this.showLocalStorage
    this.getFromStorage()
    this.calculateCartValue();

    this.cartSubject.next(this.cart);
  }

  isLocalStorage() {
    return this.showLocalStorage;
  }

  changeUser() {
    this.getFromStorage()
    this.calculateCartValue();
    this.showLocalStorage = false;

    this.cartSubject.next(this.cart);
  }

}
