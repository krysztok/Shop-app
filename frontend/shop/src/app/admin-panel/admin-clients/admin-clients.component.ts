import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ClientsService } from '../../account/clients.service';
import { ClientData } from '../../account/clientData';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { Address } from '../../account/address';
import { AdminClientsViewComponent } from './admin-clients-view/admin-clients-view.component';
import { AdminClientsDeleteComponent } from './admin-clients-delete/admin-clients-delete.component';

@Component({
  selector: 'app-admin-clients',
  templateUrl: './admin-clients.component.html',
  styleUrl: './admin-clients.component.css'
})
export class AdminClientsComponent {
  clientsService: ClientsService = inject(ClientsService);
  clients: ClientData[] | undefined;
  dataSource = new MatTableDataSource<ClientData>();
  filterDictionary = new Map<string, string>();

  @ViewChild('id') idFilter!: ElementRef;
  @ViewChild('name') nameFilter!: ElementRef;
  @ViewChild('surname') surnameFilter!: ElementRef;
  @ViewChild('address') addressFilter!: ElementRef;
  @ViewChild('email') emailFilter!: ElementRef;
  @ViewChild('phoneNumber') phoneNumberFilter!: ElementRef;
  @ViewChild(MatTable) table!: MatTable<any>

  @ViewChild('acld') dialogDelete!: AdminClientsDeleteComponent;
  @ViewChild('aclv') dialog!: AdminClientsViewComponent;

  displayedColumns: string[] = ['id', 'name', 'surname', 'email', 'phone', 'address', 'action'];

  ngOnInit() {
    this.clientsService.getAllClients().then(res => {
      this.clients = res;
      this.dataSource = new MatTableDataSource(this.clients);

      this.dataSource.filterPredicate = function (record, filter) {
        let isMatch = false;
        var map = new Map(JSON.parse(filter));

        for (let [key, value] of map) {
          switch (key) {
            case 'idC':
              if (value) {
                let s: string = value.toString();
                isMatch = (value == "") || (record.idC.toString().toLowerCase().includes(s));
                isMatch = (record.idC.toString().toLowerCase().includes(s));
                if (!isMatch) return false;
              } else {
                isMatch = true;
              }
              break;
            case 'name':
              if (value) {
                let s: string = value.toString();
                isMatch = (value == "") || (record[key as keyof ClientData].toString().toLowerCase().includes(s));
                isMatch = (record[key as keyof ClientData].toString().toLowerCase().includes(s));
                if (!isMatch) return false;
              } else {
                isMatch = true;
              }
              break;
            case 'surname':
              if (value) {
                let s: string = value.toString();
                isMatch = (value == "") || (record[key as keyof ClientData].toString().toLowerCase().includes(s));
                isMatch = (record[key as keyof ClientData].toString().toLowerCase().includes(s));
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
                isMatch = (value == "") || (record[key as keyof ClientData].toString().toLowerCase().includes(s));
                isMatch = (record[key as keyof ClientData].toString().toLowerCase().includes(s));
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
                isMatch = (value == "") || (record[key as keyof ClientData].toString().replace(phoneRegex, '').includes(s));
                isMatch = (record[key as keyof ClientData].toString().replace(phoneRegex, '').includes(s));
                if (!isMatch) return false;
              } else {
                isMatch = true;
              }
              break;
            default:
              isMatch = (value == "all" || value == "") || (record[key as keyof ClientData] == value);
              if (!isMatch) return false;
              break;
          }
        }
        return isMatch;
      }
    })
  }

  refreshList(s: string) {
    this.clientsService.getAllClients().then(res => {
      this.clients = res;
      this.dataSource.data = new MatTableDataSource(this.clients).data
    })

    this.renderTable()
  }

  view(client: ClientData) {
    this.dialogDelete.close()
    this.dialog.show(client)
  }

  delete(client: ClientData) {
    this.dialog.close()
    this.dialogDelete.show(client.idC, client.name, client.surname)
  }

  activate(clientId: number) {
    this.clientsService.activateClient(clientId).then(data => {
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
    if (!this.clients) {
      return;
    }

    const data = this.clients.slice();

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return this.compareIds(a.idC, b.idC, isAsc);
        case 'name':
          return this.compare(a.name.toLowerCase(), b.name.toLowerCase(), isAsc);
        case 'surname':
          return this.compare(a.surname.toLowerCase(), b.surname.toLowerCase(), isAsc);
        case 'address':
          let aAddress = a.address.city + ", " + a.address.street + " " + a.address.number;
          let bAddress = b.address.city + ", " + b.address.street + " " + b.address.number;
          return this.compare(aAddress, bAddress, isAsc);
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

  compareIds(a: number, b: number, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
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
    this.surnameFilter.nativeElement.value = '';
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
