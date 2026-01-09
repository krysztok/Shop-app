import { Component, ViewChild } from '@angular/core';
import { Product } from '../products/product';
import { CartService } from './cart.service';
import { Subscription } from 'rxjs';
import { OrderTransportData } from './transport-options/orderTransportData';
import { AddressFormComponent } from '../account/address-form/address-form.component';
import { ClientData } from '../account/clientData';
import { ClientDataFormComponent } from '../account/client-data-form/client-data-form.component';
import { Order } from './order';
import { OrderStatus } from '../order-status/orderStatus';
import { OrderProductData } from './orderProductData';
import { OrderService } from '../order-status/order.service';
import { Router } from '@angular/router';
import { ClientsService } from '../account/clients.service';
import { AuthService } from '../auth/auth.service';
import { WishListService } from '../wish-list/wish-list.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  cartProducts: Map<Product, number> = new Map<Product, number>;
  private subscriptionCart: Subscription;
  clientData!: ClientData;

  @ViewChild('addressForm') addressForm!: AddressFormComponent;
  @ViewChild('clientDataForm') clientDataForm!: ClientDataFormComponent;

  cartValue: number = 0;
  totalValue: number = 0;
  orderTransportData: OrderTransportData | null = null;
  paymentOption: string | null = null;

  paymentOptionError = false;
  transportOptionError = false;

  constructor(private cartService: CartService, private orderService: OrderService, private router: Router,
    private clientsService: ClientsService, private authService: AuthService, private wishListService: WishListService) {
    this.subscriptionCart = this.cartService.cartSubject
      .subscribe(products => {
        {
          this.cartProducts = this.cartService.getProducts();
          this.cartValue = this.cartService.getCartValue();
          this.setTotalValue();
        }
      });

      this.setUserData();
  }

  checkIfLogged() {
    return this.authService.isLoggedIn();
  }

  checkifLocalStorage() {
    return this.cartService.isLocalStorage();
  }

  ngOnInit() {
    this.cartProducts = this.cartService.getProducts();
    this.cartValue = this.cartService.getCartValue();
  }

  assignAmmount(product: Product, ammount: number) {
    this.cartService.changeProductAmount(product, ammount);
  }

  setUserData(param?: string) {
    if (this.authService.isLoggedIn()) {
      this.clientsService.getMyData().then((client) => {
        if (client) {
          this.clientData = client;

          if (this.addressForm && this.clientDataForm) {
            this.addressForm.setValues(this.clientData.address);
            this.clientDataForm.setValues(this.clientData);
          }
        }
      })
    }
  }

  setTransportCost(orderTransportData: OrderTransportData | null) {
    if (orderTransportData != null) {
      this.orderTransportData = orderTransportData;
    } else {
      this.orderTransportData = null;
    }

    this.transportOptionError = false;
    this.setTotalValue();
  }

  setTotalValue() {
    this.totalValue = this.cartValue;
    if (this.orderTransportData) {
      this.totalValue += this.orderTransportData.transportCost;
    }
  }

  setPaymentOption(option: string | null) {
    this.paymentOption = option;
    this.paymentOptionError = false;
  }

  showErrors() {
    this.transportOptionError = this.orderTransportData != null ? false : true;
    this.paymentOptionError = this.paymentOption != null ? false : true;

    this.addressForm.mark()
    this.clientDataForm.mark()
  }

  changeStorage() {
    this.cartService.changeStorage()
    this.wishListService.changeStorage()
  }

  submitOrder() {
    if (this.addressForm.isValid() && this.clientDataForm.isValid() && this.orderTransportData != null && this.paymentOption != null) {
      let address = this.addressForm.getValue();
      let clientFormData = this.clientDataForm.getValue();

      if (address != null && clientFormData != null) {
        let clientData: ClientData = {
          name: clientFormData.name,
          surname: clientFormData.surname,
          email: clientFormData.email,
          phoneNumber: clientFormData.phoneNumber,
          address: address,
          idC: this.clientData ? this.clientData.idC : -1,
          active: this.clientData ? true : false
        }

        let order: Order = {
          _id: '',
          clientData: clientData,
          products: [],
          productsTotalValue: this.cartValue,
          orderTransportData: this.orderTransportData,
          paymentOption: this.paymentOption,
          totalValue: this.totalValue,
          orderStatus: OrderStatus.placed,
          date: undefined,
          statusHistory: []
        };

        this.cartProducts.forEach((v, k) => {
          let orderProductData: OrderProductData = {
            productId: k._id,
            value: k.price,
            amount: v,
            totalValue: k.price * v
          }

          order.products.push(orderProductData)
        })

        this.orderService.createOrder(order).then(data => {
          this.cartService.clearCart()
          let id = "";
          if (data?.body) {
            const map = new Map(Object.entries(data?.body));
            id = map.get("id")
          }
          this.router.navigate(['/cart/order', id])
        }).catch((error) => {
          let message: string = error.error.message;
          if (message && message.includes("problem: ")) {
            message = message.split("problem: ")[1]
          }
          console.log(message)
          alert(message)
        });


      }
    } else {
      this.showErrors()
    }
  }
}
