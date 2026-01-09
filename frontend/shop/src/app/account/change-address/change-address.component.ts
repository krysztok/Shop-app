import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { AddressFormComponent } from '../address-form/address-form.component';
import { ClientsService } from '../clients.service';
import { ClientData } from '../clientData';

@Component({
  selector: 'app-change-address',
  templateUrl: './change-address.component.html',
  styleUrl: './change-address.component.css'
})
export class ChangeAddressComponent {
  @ViewChild('aca') dialog!: ElementRef;
  @ViewChild('addressForm') addressForm!: AddressFormComponent;

  @Output() refresh: EventEmitter<string> = new EventEmitter<string>();

  constructor(private clientsService: ClientsService) { }

  changeAddress() {
    if (this.addressForm.isValid()) {
      let address = this.addressForm.getValue();

      if (address) {
        this.clientsService.updateMyAddress(address).then((res) => {
          this.refresh.emit("refresh")
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
    }
  }

  show(clientData: ClientData) {
    this.addressForm.setValues(clientData.address);
    this.dialog.nativeElement.show();
  }

  close() {
    this.dialog.nativeElement.close();
  }
}
