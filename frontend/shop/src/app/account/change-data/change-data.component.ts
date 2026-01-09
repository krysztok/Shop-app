import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { ClientDataFormComponent } from '../client-data-form/client-data-form.component';
import { ClientsService } from '../clients.service';
import { ClientUpdateDTO } from './clientUpdateDTO';
import { ClientData } from '../clientData';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-data',
  templateUrl: './change-data.component.html',
  styleUrl: './change-data.component.css'
})
export class ChangeDataComponent {
  @ViewChild('acd') dialog!: ElementRef;
  @ViewChild('clientDataForm') clientDataForm!: ClientDataFormComponent;

  @Output() refresh: EventEmitter<string> = new EventEmitter<string>();

  oldEmail: string = ''

  constructor(private clientsService: ClientsService, private authService: AuthService, private router: Router) { }

  changeData() {
    if (this.clientDataForm.isValid()) {
      let cfData = this.clientDataForm.getValue();

      if (cfData) {
        let clientData: ClientUpdateDTO = {
          name: cfData?.name,
          surname: cfData.surname,
          email: cfData.email,
          phoneNumber: cfData.phoneNumber
        }

        console.log("?")

        this.clientsService.updateMyData(cfData).then((res) => {
          this.refresh.emit("refresh")
          if (clientData.email != this.oldEmail) {
            this.authService.logout();
            this.router.navigate(['/login'])
          } else {
            this.close();
          }
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
    this.clientDataForm.setValues(clientData)
    this.oldEmail = clientData.email;
    this.dialog.nativeElement.show();
  }

  close() {
    this.dialog.nativeElement.close();
  }
}
