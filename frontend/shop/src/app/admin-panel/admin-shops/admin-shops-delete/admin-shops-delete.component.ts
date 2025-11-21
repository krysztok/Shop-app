import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { ShopsService } from '../../../contact/shops.service';

@Component({
  selector: 'app-admin-shops-delete',
  templateUrl: './admin-shops-delete.component.html',
  styleUrl: './admin-shops-delete.component.css'
})
export class AdminShopsDeleteComponent {
  @ViewChild('asd') dialog!: ElementRef;
  @Output() refreshList: EventEmitter<string> = new EventEmitter<string>();
  shopId!: string;
  shopName!: string;

  constructor(private shopService: ShopsService) { }

  show(shopId: string, shopName: string) {
    this.shopName = shopName;
    this.shopId = shopId;

    this.dialog.nativeElement.show();
  }

  close() {
    this.dialog.nativeElement.close();
  }

  delete() {
    this.shopService.deleteShop(this.shopId).then(data => {
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
    this.shopService.deactivateShop(this.shopId).then(data => {
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
