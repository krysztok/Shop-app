import { Component } from '@angular/core';
import { Product } from '../products/product';
import { CartService } from './cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  cartProducts: Map<Product, number> = new Map<Product, number>;
  private subscriptionCart: Subscription;

  cartValue: number = 0;
  transportValue: number | null = null;
  paymentOption: any = null;

    constructor(private cartService: CartService){
      this.subscriptionCart = this.cartService.cartSubject
      .subscribe(products => {
        {
          this.cartProducts = this.cartService.getProducts();
          this.cartValue = this.cartService.getCartValue();
        }
      });
    
    }
  
  ngOnInit() {
    this.cartProducts = this.cartService.getProducts();
    this.cartValue = this.cartService.getCartValue();
  }

  assignAmmount(product:Product, ammount: number){
    this.cartService.changeProductAmmount(product, ammount);
  }

  
  getTransportCost(cost: number | null) {
    cost!=null? this.transportValue = cost : 0;
  }


  getPaymentOption(option: any){
    this.paymentOption = option;
  }

  submitOrder(){
    this.cartService.clearCart()
  }
}
