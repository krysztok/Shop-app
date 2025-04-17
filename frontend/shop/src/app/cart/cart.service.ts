import { booleanAttribute, Injectable } from '@angular/core';
import { Product } from '../products/product';
import { Subject } from 'rxjs';
import { ProductsService } from '../products/products.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart: Map<Product, number> = new Map<Product, number>;
  cartSubject = new Subject<Map<Product, number>>();
  cartValue: number = 0;

  constructor(private productsService: ProductsService) {
    //localStorage.setItem("cartIds", JSON.stringify(null))
    this.getFromLocalStorage();
    this.calculateCartValue();

    this.cartSubject.next(this.cart);
  }

  ngOnInit(){
    this.getFromLocalStorage();
    this.cartSubject.next(this.cart);
  }

  addProductToCart(product: Product) {
    if (this.checkIfInCart(product)) {
      return;
    }

    this.cart.set(product, 1);
    this.calculateCartValue();
    this.addToLocalStorage();
    this.cartSubject.next(this.cart);
  }

  getProducts() {
    return this.cart;
  }

  removeProduct(product: Product) {
    if (!this.checkIfInCart(product)) {
      return;
    }

    this.cart.forEach((v, k) => {
      if (k._id == product._id) {
        this.cart.delete(k)
      }
    })

    this.calculateCartValue();
    this.addToLocalStorage();
    this.cartSubject.next(this.cart);
  }

  getProductTypeAmmount() {
    let ammount: number = 0;
    this.cart.forEach(() => {
      ammount += 1;
    })

    return ammount;
  }

  checkIfInCart(product: Product): boolean {
    let inCart: boolean = false;
    this.cart.forEach((v, k) => {
      if (k._id === product._id) {
        inCart = true;
      }
    })

    return inCart;
  }

  changeProductAmmount(product: Product, ammount: number) {
    if (ammount != 0) {
      this.cart.set(product, ammount);
    } else {
      this.cart.delete(product);
    }

    this.calculateCartValue();
    this.addToLocalStorage();
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

    this.addToLocalStorage();
    this.cartSubject.next(this.cart);
  }

  addToLocalStorage() {
    let cartIds: string[] = []
    let cartAmmount: number[] = []

    this.cart.forEach((v, k) => {
      cartIds.push(k._id);
      cartAmmount.push(v);
    }
    )

    localStorage.setItem("cartIds", JSON.stringify(cartIds));
    localStorage.setItem("cartAmmount", JSON.stringify(cartAmmount));

  }

  getFromLocalStorage() {
    let p = JSON.parse(localStorage.getItem('cartIds')!)
    let a = JSON.parse(localStorage.getItem('cartAmmount')!)

    if (p != null) {
     this.cart = new Map<Product, number>;
      
      for (let i = 0; i < p.length; i++) {
        this.productsService.getProductById(p[i]).then(
          (product) => {
            this.cart.set(product!, a[i]);
            this.calculateCartValue();
            this.cartSubject.next(this.cart); //because map load is async
          })
      }
    }
  }


}
