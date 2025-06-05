import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../products/product';
import { WishListService } from '../wish-list/wish-list.service';
import { Subscription } from 'rxjs';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrl: './tool-bar.component.css'
})
export class ToolBarComponent {

  @Input() wishListProductsIds: String[] = [];
  productsAmmount: number = 0;

  items: MenuItem[] = [];

  private subscriptionWishList: Subscription;
  private subscriptionCart: Subscription;

  constructor(private wishListService: WishListService, private cartService: CartService){
    this.subscriptionWishList = this.wishListService.wishListSubject
    .subscribe(products => {
      {
        this.wishListProductsIds = products;
        this.setNumbers();
      }
    });

    this.subscriptionCart = this.cartService.cartSubject
    .subscribe(products => {
      {
        //this.cartProducts = products;
        this.productsAmmount = this.cartService.getProductTypeAmmount();
        
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

    this.wishListProductsIds = this.wishListService.getProductsIds();
    this.productsAmmount = this.cartService.getProductTypeAmmount();
    this.setNumbers();

    //this.setNumbers();
  } 

  setNumbers() {
    this.items[2].label = this.wishListProductsIds.length > 0? 'Wish List (' + this.wishListProductsIds.length + ')' : "Wish List";
    this.items[1].label = this.productsAmmount > 0? 'Cart (' + this.productsAmmount + ')' : "Cart";

    this.items = JSON.parse(JSON.stringify(this.items)); //force refresh
  }

}
