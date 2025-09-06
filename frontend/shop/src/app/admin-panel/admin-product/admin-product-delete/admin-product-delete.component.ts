import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { ProductsService } from '../../../products/products.service';

@Component({
  selector: 'app-admin-product-delete',
  templateUrl: './admin-product-delete.component.html',
  styleUrl: './admin-product-delete.component.css'
})
export class AdminProductDeleteComponent {

  @ViewChild('apd') dialog!: ElementRef;
  productId!: string;
  productName!: string;
  @Output() refreshList: EventEmitter<string> = new EventEmitter<string>();

  constructor(private productsService: ProductsService) { }

  show(productId: string, productName: string) {
    this.productId = productId;
    this.productName = productName;

    this.dialog.nativeElement.show();
  }

  close() {
    this.dialog.nativeElement.close();
  }

  delete() {
    this.productsService.deleteProduct(this.productId).then(data => {
        this.refreshList.emit("refresh")
        this.close()
      }).catch((error) => {
        let message: string = error.error.message;
        if (message.includes("problem: ")) {
          message = message.split("problem: ")[1]
        }
        console.log(message)
        alert(message)
      });
   // this.close();
  }

  deactivate() {
    this.productsService.deactivateProduct(this.productId).then(data => {
        this.refreshList.emit("refresh")
        this.close()
      }).catch((error) => {
        let message: string = error.error.message;
        if (message.includes("problem: ")) {
          message = message.split("problem: ")[1]
        }
        console.log(message)
        alert(message)
      });
   // this.close();
  }
}
