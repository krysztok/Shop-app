import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from './order.service';
import { Order } from '../cart/order';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrl: './order-status.component.css'
})
export class OrderStatusComponent {
  @ViewChild('orderIdSearch') orderIdSearch!: ElementRef;
  route = inject(ActivatedRoute)
  orderId!: string
  order!: Order | undefined

  constructor(private router: Router, private ordersService: OrderService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loadData();
    });

    this.route.queryParamMap.subscribe((params) => {
      this.loadData();
    })
  }

  loadData() {
    this.order = undefined;
    this.orderId = this.route.snapshot.paramMap.get("orderId") as string;

    if (this.orderId && this.orderId != "") {
      this.ordersService.getOrder(this.orderId).then(res => {
        if (res) {
          this.order = res;
        }
      })
    }

  }

  checkOrder() {
    let text = this.orderIdSearch.nativeElement.value;

    if (text.length > 1) {
      this.router.navigate(['order/' + text], {

      });
    }

    this.orderIdSearch.nativeElement.value = ""
  }

}
