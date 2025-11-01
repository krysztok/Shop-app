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

  }

  deactivate() {
    
  }

}
