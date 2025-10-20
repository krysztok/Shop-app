import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Order } from '../../../cart/order';

@Component({
  selector: 'app-admin-order-view',
  templateUrl: './admin-order-view.component.html',
  styleUrl: './admin-order-view.component.css'
})
export class AdminOrderViewComponent {
  @ViewChild('aov') dialog!: ElementRef;
  @ViewChild(MatTable) table!: MatTable<any>

  displayedColumns: string[] = ['id','value','amount','totalValue'];

  order!: Order

  constructor() { }

  show(order: Order) {
    this.order = order;
    this.dialog.nativeElement.show();
  }

  close() {
    this.dialog.nativeElement.close();
  }

}
