import { booleanAttribute, Injectable } from '@angular/core';
import { Product } from '../products/product';
import { Subject } from 'rxjs';
import { ProductsService } from '../products/products.service';
import { WishListService } from '../wish-list/wish-list.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart: Map<Product, number> = new Map<Product, number>;
  cartSubject = new Subject<Map<Product, number>>();
  cartValue: number = 0;

  constructor(private productsService: ProductsService, private wishListService: WishListService) {
    //localStorage.setItem("cartIds", JSON.stringify(null))
    this.getFromLocalStorage();
    this.calculateCartValue();

    this.cartSubject.next(this.cart);
  }

  ngOnInit() {
    this.getFromLocalStorage();
    this.cartSubject.next(this.cart);
  }

  addProductToCart(product: Product) {
    if (this.checkIfInCart(product._id)) {
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

  removeProduct(productId: string) {
    this.cart.forEach((v, k) => {
      if (k._id == productId) {
        this.cart.delete(k)
      }
    })

    this.calculateCartValue();
    this.addToLocalStorage();
    this.cartSubject.next(this.cart);
  }

  getProductsNumber() {
    let ammount: number = 0;
    this.cart.forEach(() => {
      ammount += 1;
    })

    return ammount;
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


}
