import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Order } from '../../cart/order';
import { OrderService } from '../../order-status/order.service';
import { tableFilter } from '../tableFilter';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { MatSelectChange } from '@angular/material/select';
import { OrderStatus } from '../../order-status/orderStatus';
import { ClientData } from '../../account/clientData';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AdminOrderViewComponent } from './admin-order-view/admin-order-view.component';
import { AdminOrdersChangeStatusComponent } from './admin-orders-change-status/admin-orders-change-status.component';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css',
  providers: [
    MatDatepickerModule,
  ],
})
export class AdminOrdersComponent {
  ordersService: OrderService = inject(OrderService)
  orders: Order[] = [];
  displayedColumns: string[] = ['id', 'date', 'email', "phoneNumber", "totalValue", "orderStatus", "action"];
  filters: tableFilter[] = [];
  dataSource = new MatTableDataSource<Order>();
  filterDictionary = new Map<string, string>();
  phoneRegex = /[\+ \-]/g

  @ViewChild('aov') dialog!: AdminOrderViewComponent;
  @ViewChild('aoc') dialogChangeStatus!: AdminOrdersChangeStatusComponent;

  @ViewChild(MatTable) table!: MatTable<any>
  @ViewChild('id') idFilter!: ElementRef;
  @ViewChild('email') emailFilter!: ElementRef;
  @ViewChild('phoneNumber') phoneNumberFilter!: ElementRef;
  @ViewChild('dateFrom') dateFromFilter!: ElementRef;
  @ViewChild('dateTo') dateToFilter!: ElementRef;
  @ViewChild('valueFrom') valueFromFilter!: ElementRef;
  @ViewChild('valueTo') valueToFilter!: ElementRef;

  ngOnInit() {
    this.ordersService.getAllOrders().then(res => {
      if (res) {
        this.orders = res;
        this.dataSource = new MatTableDataSource(res);
        this.createFilters(true)

        this.dataSource.filterPredicate = function (record, filter) {
          let isMatch = false;
          var map = new Map(JSON.parse(filter));

          for (let [key, value] of map) {
            switch (key) {
              case '_id':
                if (value) {
                  let s: string = value.toString();
                  isMatch = (value == "") || (record._id.toString().toLowerCase().includes(s));
                  isMatch = (record._id.toString().toLowerCase().includes(s));
                  if (!isMatch) return false;
                } else {
                  isMatch = true;
                }
                break;
              case 'email':
                if (value) {
                  let s: string = value.toString();
                  isMatch = (value == "") || (record.clientData[key as keyof ClientData].toString().toLowerCase().includes(s));
                  isMatch = (record.clientData[key as keyof ClientData].toString().toLowerCase().includes(s));
                  if (!isMatch) return false;
                } else {
                  isMatch = true;
                }
                break;
              case 'phoneNumber':
                if (value) {
                  let s: string = value.toString();
                  let phoneRegex = /[\+ \-]/g;
                  s = s.replace(phoneRegex, '')
                  isMatch = (value == "") || (record.clientData[key as keyof ClientData].toString().replace(phoneRegex, '').includes(s));
                  isMatch = (record.clientData[key as keyof ClientData].toString().replace(phoneRegex, '').includes(s));
                  if (!isMatch) return false;
                } else {
                  isMatch = true;
                }
                break;
              case 'dateFrom':
                if (value && record.date) {
                  let date = new Date(value.toString());
                  let rdate = new Date(record.date);
                  isMatch = rdate >= date
                  if (!isMatch) return false;
                } else {
                  isMatch = true;
                }
                break;
              case 'dateTo':
                if (value && record.date) {
                  let date = new Date(value.toString());
                  let rdate = new Date(record.date);
                  isMatch = rdate <= date
                  if (!isMatch) return false;
                } else {
                  isMatch = true;
                }
                break;
              case 'valueFrom':
                if (value && record.date) {
                  let n: number = parseFloat(value.toString());
                  isMatch = record.totalValue >= n;
                  if (!isMatch) return false;
                } else {
                  isMatch = true;
                }
                break;
              case 'valueTo':
                if (value) {
                  let n: number = parseFloat(value.toString());
                  isMatch = record.totalValue <= n;
                  if (!isMatch) return false;
                } else {
                  isMatch = true;
                }
                break;
              default:
                isMatch = (value == "all" || value == "") || (record[key as keyof Order] == value);
                if (!isMatch) return false;
                break;
            }
          }
          return isMatch;
        }
      }

    })

  }

  createFilters(init: boolean) {
    let orderStatusValues: string[] = ["all"];
    orderStatusValues = orderStatusValues.concat(Object.values(OrderStatus).filter(value => typeof value === 'string'));

    let f_lastValue = this.filters[0] ? this.filters[0].selectedValue : null;
    let clearFilters: boolean = false;
    this.filters = []

    let f: tableFilter = {
      label: 'Order Status',
      name: 'orderStatus',
      options: orderStatusValues,
      values: orderStatusValues
    }

    if (init) {
      f.selectedValue = "all"
    } else { //if selected value is still available keep filters, else clear filters
      if (f_lastValue && orderStatusValues.includes(f_lastValue)) {
        f.selectedValue = f_lastValue
      } else {
        clearFilters = true;
      }
    }

    this.filters.push(f)

    if (clearFilters) {
      this.clearFilters()
    }
  }

  refreshList(s: string) {
    this.ordersService.getAllOrders().then(res => {
      if (res) {
        this.orders = res;
        this.dataSource = new MatTableDataSource(res);
        this.createFilters(true)
      }
    })

    this.renderTable()
  }

  view(order: Order) {
    this.dialogChangeStatus.close();
    this.dialog.show(order)
  }

  changeStatus(order: Order) {
    this.dialog.close();
    this.dialogChangeStatus.show(order);
  }

  sortData(sort: Sort) {
    if (!this.orders) {
      return;
    }

    const data = this.orders.slice();

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return this.compareIds(a._id, b._id, isAsc);
        case 'date':
          return this.compare(a.date, b.date, isAsc);
        case 'email':
          return this.compare(a.clientData.email.toLowerCase(), b.clientData.email.toLowerCase(), isAsc);
        case 'phoneNumber':
          return this.compare(a.clientData.phoneNumber.replace(this.phoneRegex, ''), b.clientData.phoneNumber.replace(this.phoneRegex, ''), isAsc);
        case 'totalValue':
          return this.compare(a.totalValue, b.totalValue, isAsc);
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

  applyFilter(ob: MatSelectChange, filter: tableFilter) {
    this.filterDictionary.set(filter.name, this.getValueFromFilter(filter.name, ob.value));
    var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.dataSource.filter = jsonString;
  }

  applyPriceFilter(event: Event, valueMin: boolean) {
    const filterValue = (event.target as HTMLInputElement).value;
    let name = valueMin ? "valueFrom" : "valueTo";
    this.filterDictionary.set(name, filterValue.trim().toLowerCase())
    var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.dataSource.filter = jsonString;
  }

  applyDateFilter(dateFrom: boolean) {
    const filterValue = dateFrom ? this.dateFromFilter.nativeElement.value : this.dateToFilter.nativeElement.value;
    let name = dateFrom ? "dateFrom" : "dateTo";
    this.filterDictionary.set(name, filterValue.toString().trim().toLowerCase())
    var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.dataSource.filter = jsonString;
  }

  applyStringFilter(label: string, event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterDictionary.set(label, filterValue.trim().toLowerCase())
    var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.dataSource.filter = jsonString;
  }

  getValueFromFilter(filterName: string, v: string) {
    for (let i = 0; i < this.filters.length; i++) {
      if (this.filters[i].name == filterName) {
        for (let j = 0; j < this.filters[i].options.length; j++) {
          if (this.filters[i].options[j] == v) {
            return this.filters[i].values[j];
          }
        }
      }
    }

    return "";
  }

  clearFilters() {
    if (this.filterDictionary.size == 0) {
      return;
    }

    this.filterDictionary.forEach((v, k) => {
      this.filterDictionary.set(k, '')
    })

    this.idFilter.nativeElement.value = '';
    this.emailFilter.nativeElement.value = '';
    this.phoneNumberFilter.nativeElement.value = '';
    this.dateFromFilter.nativeElement.value = '';
    this.dateToFilter.nativeElement.value = '';
    this.valueFromFilter.nativeElement.value = '';
    this.valueToFilter.nativeElement.value = '';


    this.filters[0].selectedValue = "all"

    var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.dataSource.filter = jsonString;
  }

  renderTable() { //force render on content change
    if (this.table) {
      this.table.renderRows()
    }
  }
}
