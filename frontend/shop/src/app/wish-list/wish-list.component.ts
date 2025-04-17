import { Component } from '@angular/core';
import { Product } from '../products/product';
import { WishListService } from './wish-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.css'
})
export class WishListComponent {

  products: Product[] = []
  private subscriptionWishList: Subscription;

  constructor(private wishListService: WishListService) {
    this.subscriptionWishList = this.wishListService.wishListSubject
      .subscribe(productIds => {
        {
          this.products = this.wishListService.getProducts()
        }
      });

  }


  ngOnInit() {
    this.products = this.wishListService.getProducts()
  }

  test() {
    this.wishListService.addToLocalStorage();
  }

}
