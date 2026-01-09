import { Component, ElementRef, ViewChild } from '@angular/core';
import { ClientData } from '../../../account/clientData';
import { Order } from '../../../cart/order';
import { OrderService } from '../../../order-status/order.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-admin-clients-view',
  templateUrl: './admin-clients-view.component.html',
  styleUrl: './admin-clients-view.component.css'
})
export class AdminClientsViewComponent {
  @ViewChild('aclv') dialog!: ElementRef;

  client!: ClientData
  orders!: Order[]
  dataSource = new MatTableDataSource<Order>();

  displayedColumns: string[] = ['id', 'date', 'status'];

  constructor(private ordersService: OrderService) { }

  show(client: ClientData) {
    this.client = client;

    this.ordersService.getOrdersByClientId(client.idC).then(res => {
      if (res) {
        this.orders = res;
        this.dataSource = new MatTableDataSource(this.orders);
      }
    })

    this.dialog.nativeElement.show();
  }

  close() {
    this.dialog.nativeElement.close();
  }
}
