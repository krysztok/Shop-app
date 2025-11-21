import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../cart/order';
import { OrderStatus } from './orderStatus';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  async createOrder(order: Order) {
    let res = this.http.post('http://localhost:8080/orders/createOrder', order, { observe: 'response' }).toPromise();
    return res;
  }

  async getAllOrders() {
    const data = await this.http.get<Order[]>('http://localhost:8080/orders/getAllOrders').toPromise();
    return data;
  }

  async changeStatus(id: string, status: OrderStatus) {
    let res = this.http.put('http://localhost:8080/orders/changeOrderStatus/' + id + "/" + status, { observe: 'response' }).toPromise();
    return res;
  }

  async getOrder(id: string) {
    const data = await this.http.get<Order>('http://localhost:8080/orders/getOrder/' + id).toPromise();
    return data;
  }

}
