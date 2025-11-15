import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ProductsService } from '../../../products/products.service';
import { MatTable } from '@angular/material/table';
import { AdminProductShowImageComponent } from './admin-product-show-image/admin-product-show-image.component';

@Component({
  selector: 'app-admin-product-images',
  templateUrl: './admin-product-images.component.html',
  styleUrl: './admin-product-images.component.css'
})
export class AdminProductImagesComponent {
  @ViewChild('api') dialog!: ElementRef;
  @ViewChild('aps') dialogShow!: AdminProductShowImageComponent;
  @ViewChild('fileUpload') input!: ElementRef;
  @ViewChild(MatTable) table!: MatTable<any>

  productId!: string
  displayedColumns: string[] = ['name', 'action'];
  imagesNames: string[] = []
  public files: any[];

  constructor(private productsService: ProductsService) {
    this.files = [];
  }

  show(productId: string) {
    this.productId = productId;
    this.files = [];
    this.getFiles();

    this.dialog.nativeElement.show();
  }

  showImage(name: string) {
    this.close()
    this.dialogShow.show(this.productId, name)
  }

  closeImage(event: string){
    this.dialog.nativeElement.show();
  }

  getFiles() {
    this.productsService.listFiles(this.productId).then(data => {
      if (data) {
        this.imagesNames = data
      }
    })

    this.renderTable();
  }

  onFileSelected(event: any) {
    this.files = event.target.files;
  }

  uploadFile() {
    const formData = new FormData();
    for (const file of this.files) {
      formData.append('file', file);
      this.files = [];
      this.input.nativeElement.value = "";
    }

    this.productsService.uploadFiles(formData, this.productId).then(data => {
      this.getFiles()
    }).catch((error) => {
      let message: string = error.error.message;
      if (message.includes("problem: ")) {
        message = message.split("problem: ")[1]
      }
      console.log(message)
      alert(message)
    });
  }

  deleteFile(name: string) {
    this.productsService.deleteFile(this.productId, name).then(data => {
      this.getFiles()
    }).catch((error) => {
      let message: string = error.error.message;
      if (message.includes("problem: ")) {
        message = message.split("problem: ")[1]
      }
      console.log(message)
      alert(message)
    });
  }

  close() {
    this.dialog.nativeElement.close();
  }

  renderTable() { //force render on content change
    if (this.table) {
      this.table.renderRows()
    }
  }
}
