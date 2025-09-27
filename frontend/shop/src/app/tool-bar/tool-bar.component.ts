import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../products/product';
import { WishListService } from '../wish-list/wish-list.service';
import { Subscription } from 'rxjs';
import { CartService } from '../cart/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrl: './tool-bar.component.css'
})
export class ToolBarComponent {

  @ViewChild('search') search!: ElementRef;

  cartNumber: number = 0;
  wishListNumber: number = 0;

  items: MenuItem[] = [];

  private subscriptionWishList: Subscription;
  private subscriptionCart: Subscription;

  constructor(private wishListService: WishListService, private cartService: CartService, private router: Router) {
    this.subscriptionWishList = this.wishListService.wishListSubject
      .subscribe(_ => {
        {
          this.wishListNumber = this.wishListService.getProductsNumber();
          this.setNumbers();
        }
      });

    this.subscriptionCart = this.cartService.cartSubject
      .subscribe(_ => {
        {
          this.cartNumber = this.cartService.getProductsNumber();
          this.setNumbers();
        }
      });

  }

  ngOnInit() {
    this.items = [
      {
        label: 'Main Page',
        routerLink: "/"
      },
      {
        label: 'Cart',
        routerLink: "/cart"
      },
      {
        label: 'Wish List',
        routerLink: "/wish"
      },
      {
        label: 'Contact',
        routerLink: "/contact"
      },
      {
        label: 'Account',
        routerLink: "/account"
      },
      {
        label: 'Order Status',
        routerLink: "/order"
      },
      {
        label: 'Admin Panel',
        routerLink: "/admin"
      }
    ];

    this.wishListNumber = this.wishListService.getProductsNumber();
    this.cartNumber = this.cartService.getProductsNumber();
    this.setNumbers();
  }

  setNumbers() {
    this.items[2].label = this.wishListNumber > 0 ? 'Wish List (' + this.wishListNumber + ')' : "Wish List";
    this.items[1].label = this.cartNumber > 0 ? 'Cart (' + this.cartNumber + ')' : "Cart";

    this.items = JSON.parse(JSON.stringify(this.items)); //force refresh
  }

  searchProduct() {
    let text = this.search.nativeElement.value;

    if (text.length > 1) {
      this.search.nativeElement.value = ""
      this.router.navigate(['products/search/'], {
        queryParams: {
          search: text
        }
      });
    }

  }

}
