import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from './order.service';
import { Order } from '../cart/order';
import { AuthService } from '../auth/auth.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';

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
  myOrders!: Order[]

  @ViewChild(MatTable) table!: MatTable<any>
  displayedColumns: string[] = ['id', 'date', "orderStatus", "action"];
  dataSource = new MatTableDataSource<Order>();

  constructor(private router: Router, private ordersService: OrderService, private authService: AuthService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loadData();
    });

    this.route.queryParamMap.subscribe((params) => {
      this.loadData();
    })

    if (this.authService.isLoggedIn()) {
      this.ordersService.getMyOrders().then((data) => {
        if (data) {
          this.myOrders = data;
          this.dataSource = new MatTableDataSource(data);
        }
      })
    }
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
      this.show(text)
    }

    this.orderIdSearch.nativeElement.value = ""
  }

  show(id: string) {
    this.router.navigate(['order/' + id], {

      });
  }

  sortData(sort: Sort) {
    if (!this.myOrders) {
      return;
    }

    const data = this.myOrders.slice();

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return this.compareIds(a._id, b._id, isAsc);
        case 'date':
          return this.compare(a.date, b.date, isAsc);
        case 'orderStatus':
          return this.compare(a.orderStatus, b.orderStatus, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string | Date | undefined, b: number | string | Date | undefined, isAsc: boolean) {
    if (a != undefined && b != undefined) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    } else {
      return -1;
    }

  }

  compareIds(a: string, b: string, isAsc: boolean) {
    return (parseInt(a) < parseInt(b) ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
