import { Component, ViewChild } from '@angular/core';
import { ClientsService } from './clients.service';
import { ClientData } from './clientData';
import { ChangeAddressComponent } from './change-address/change-address.component';
import { ChangeDataComponent } from './change-data/change-data.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {

  clientData!: ClientData | null

  @ViewChild('aca') dialogAddress!: ChangeAddressComponent;
  @ViewChild('acd') dialogData!: ChangeDataComponent;
  @ViewChild('acp') dialogPassword!: ChangePasswordComponent;

  constructor(private clientsService: ClientsService) { }

  ngOnInit() {
    this.clientsService.getMyData().then((client) => {
      if (client) {
        this.clientData = client;
      }
    })
  }

  changeAddress() {
    this.dialogData.close();
    this.dialogPassword.close();
    if (this.clientData) {
      this.dialogAddress.show(this.clientData);
    }
  }

  changeData() {
    this.dialogAddress.close();
    this.dialogPassword.close();
    if (this.clientData) {
      this.dialogData.show(this.clientData);
    }
  }

  changePassword() {
    this.dialogAddress.close();
    this.dialogData.close();
    this.dialogPassword.show();
  }

  refresh(s: string) {
    this.clientsService.getMyData().then((client) => {
      if (client) {
        this.clientData = client;
      }
    })
  }

}
