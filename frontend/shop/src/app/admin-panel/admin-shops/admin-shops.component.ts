import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Shop } from '../../contact/shop';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ShopsService } from '../../contact/shops.service';
import { Sort } from '@angular/material/sort';
import { Address } from '../../account/address';
import { AdminShopsDeleteComponent } from './admin-shops-delete/admin-shops-delete.component';
import { AdminShopsEditComponent } from './admin-shops-edit/admin-shops-edit.component';

@Component({
  selector: 'app-admin-shops',
  templateUrl: './admin-shops.component.html',
  styleUrl: './admin-shops.component.css'
})
export class AdminShopsComponent {
  shopsService: ShopsService = inject(ShopsService);
  shops: Shop[] | undefined;
  dataSource = new MatTableDataSource<Shop>();
  filterDictionary = new Map<string, string>();

  @ViewChild('id') idFilter!: ElementRef;
  @ViewChild('name') nameFilter!: ElementRef;
  @ViewChild('address') addressFilter!: ElementRef;
  @ViewChild('email') emailFilter!: ElementRef;
  @ViewChild('phoneNumber') phoneNumberFilter!: ElementRef;
  @ViewChild(MatTable) table!: MatTable<any>

  @ViewChild('asd') dialogDelete!: AdminShopsDeleteComponent;
  @ViewChild('ase') dialog!: AdminShopsEditComponent;

  displayedColumns: string[] = ['id', 'name', 'address', 'email', 'phone', 'action'];

  ngOnInit() {
    this.shopsService.getShops().then(res => {
      this.shops = res;
      this.dataSource = new MatTableDataSource(this.shops);

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
            case 'name':
              if (value) {
                let s: string = value.toString();
                isMatch = (value == "") || (record[key as keyof Shop].toString().toLowerCase().includes(s));
                isMatch = (record[key as keyof Shop].toString().toLowerCase().includes(s));
                if (!isMatch) return false;
              } else {
                isMatch = true;
              }
              break;
            case 'address':
              if (value) {
                let s: string = value.toString().replace(/[\s,]/g, "");
                let address: string = record.address["city" as keyof Address].toString().toLowerCase() +
                  record.address["street" as keyof Address].toString().toLowerCase() +
                  record.address["number" as keyof Address].toString().toLowerCase();
                isMatch = (value == "") || address.includes(s);
                isMatch = address.includes(s);
                if (!isMatch) return false;
              } else {
                isMatch = true;
              }
              break;
            case 'email':
              if (value) {
                let s: string = value.toString();
                isMatch = (value == "") || (record[key as keyof Shop].toString().toLowerCase().includes(s));
                isMatch = (record[key as keyof Shop].toString().toLowerCase().includes(s));
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
                isMatch = (value == "") || (record[key as keyof Shop].toString().replace(phoneRegex, '').includes(s));
                isMatch = (record[key as keyof Shop].toString().replace(phoneRegex, '').includes(s));
                if (!isMatch) return false;
              } else {
                isMatch = true;
              }
              break;
            default:
              isMatch = (value == "all" || value == "") || (record[key as keyof Shop] == value);
              if (!isMatch) return false;
              break;
          }
        }
        return isMatch;
      }
    })
  }

  refreshList(s: string) {
    this.shopsService.getShops().then(res => {
      this.shops = res;
      this.dataSource.data = new MatTableDataSource(this.shops).data
    })

    this.renderTable()
  }

  edit(shop: Shop) {
     this.dialogDelete.close()
     this.dialog.show(true, shop)
  }

  add() {
     this.dialogDelete.close()
     this.dialog.show(false)
  }

  delete(shop: Shop) {
     this.dialog.close()
     this.dialogDelete.show(shop._id, shop.name)
  }

    activate(shopId: string) {
    this.shopsService.activateShop(shopId).then(data => {
      this.refreshList("activate")
    }).catch((error) => {
      let message: string = error.error.message;
      if (message.includes("problem: ")) {
        message = message.split("problem: ")[1]
      }
      console.log(message)
      alert(message)
    });
  }

  sortData(sort: Sort) {
    if (!this.shops) {
      return;
    }

    const data = this.shops.slice();

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return this.compareIds(a._id, b._id, isAsc);
        case 'name':
          return this.compare(a.name.toLowerCase(), b.name.toLowerCase(), isAsc);
        case 'address':
          let aAddress = a.address.city + ", " + a.address.street + " " + a.address.number;
          let bAddress = b.address.city + ", " + b.address.street + " " + b.address.number;
          return this.compareIds(aAddress, bAddress, isAsc);
        case 'email':
          return this.compare(a.email, b.email, isAsc);
        case 'phone':
          return this.compare(a.phoneNumber, b.phoneNumber, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  compareIds(a: string, b: string, isAsc: boolean) {
    return (parseInt(a) < parseInt(b) ? -1 : 1) * (isAsc ? 1 : -1);
  }

  applyStringFilter(label: string, event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterDictionary.set(label, filterValue.trim().toLowerCase())
    var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.dataSource.filter = jsonString;
  }

  clearFilters() {
    if (this.filterDictionary.size == 0) {
      return;
    }

    this.filterDictionary.forEach((v, k) => {
      this.filterDictionary.set(k, '')
    })

    this.idFilter.nativeElement.value = '';
    this.nameFilter.nativeElement.value = '';
    this.addressFilter.nativeElement.value = '';
    this.emailFilter.nativeElement.value = '';
    this.phoneNumberFilter.nativeElement.value = '';

    var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.dataSource.filter = jsonString;
  }

  renderTable() { //force render on content change
    if (this.table) {
      this.table.renderRows()
    }
  }
}
