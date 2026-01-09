import { Component } from '@angular/core';
import { Product } from '../products/product';
import { WishListService } from './wish-list.service';
import { Subscription } from 'rxjs';
import { CartService } from '../cart/cart.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.css'
})
export class WishListComponent {

  products: Product[] = []
  private subscriptionWishList: Subscription;

  constructor(private wishListService: WishListService, private cartService: CartService, private authService: AuthService) {
    this.subscriptionWishList = this.wishListService.wishListSubject
      .subscribe(productIds => {
        {
          this.products = this.wishListService.getProducts()
        }
      });

  }

  changeStorage() {
    this.cartService.changeStorage()
    this.wishListService.changeStorage()
  }

  checkIfLogged() {
    return this.authService.isLoggedIn();
  }

  checkifLocalStorage() {
    return this.wishListService.isLocalStorage();
  }

  ngOnInit() {
    this.products = this.wishListService.getProducts()
  }

  test() {
    this.wishListService.saveInLocalStorage();
  }

}
