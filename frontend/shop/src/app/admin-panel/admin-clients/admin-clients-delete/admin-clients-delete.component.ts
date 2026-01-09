import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { ClientsService } from '../../../account/clients.service';

@Component({
  selector: 'app-admin-clients-delete',
  templateUrl: './admin-clients-delete.component.html',
  styleUrl: './admin-clients-delete.component.css'
})
export class AdminClientsDeleteComponent {
  @ViewChild('acld') dialog!: ElementRef;
  @Output() refreshList: EventEmitter<string> = new EventEmitter<string>();
  clientId!: number;
  clientnName!: string;
  clientnSurname!: string;

  constructor(private clientsService: ClientsService) { }

  show(clientId: number, clientName: string, clientSurname: string) {
    this.clientnName = clientName;
    this.clientId = clientId;
    this.clientnSurname = clientSurname

    this.dialog.nativeElement.show();
  }

  close() {
    this.dialog.nativeElement.close();
  }

  delete() {
    this.clientsService.deleteClient(this.clientId).then(data => {
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

  deactivate() {
      this.clientsService.deactivateClient(this.clientId).then(data => {
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
}
