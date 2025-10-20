import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Order } from '../../../cart/order';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { OrderStatus } from '../../../order-status/orderStatus';
import { OrderService } from '../../../order-status/order.service';

@Component({
  selector: 'app-admin-orders-change-status',
  templateUrl: './admin-orders-change-status.component.html',
  styleUrl: './admin-orders-change-status.component.css'
})
export class AdminOrdersChangeStatusComponent {
  @ViewChild('aoc') dialog!: ElementRef;
  @Output() refreshList: EventEmitter<string> = new EventEmitter<string>();

  statusForm!: FormGroup;
  statusOptions: string[] = []


  constructor(private fb: FormBuilder, private ordersService: OrderService) { }

  ngOnInit() {
    this.statusOptions = Object.values(OrderStatus).filter(value => typeof value === 'string');
    this.statusForm = this.fb.group({
      orderId: new FormControl(''),
      status: new FormControl(''),
    })

  }

  save() {
    if (!this.statusForm.valid) {
      return;
    }
    this.ordersService.changeStatus(
      this.statusForm.get('orderId')?.value,
      this.statusForm.get('status')?.value
    ).then(data => {
      this.refreshList.emit("refresh")
      this.close()
    }).catch((error) => {
      let message: string = error.error.message;
      if (message && message.includes("problem: ")) {
        message = message.split("problem: ")[1]
      }
      console.log(message)
      alert(message)
    });

  }

  show(order: Order) {
    this.statusForm.patchValue({
      orderId: order._id,
      status: order.orderStatus
    })

    this.dialog.nativeElement.show();
  }

  close() {
    this.dialog.nativeElement.close();
  }

}
