import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { ProductsService } from '../../../../products/products.service';

@Component({
  selector: 'app-admin-product-show-image',
  templateUrl: './admin-product-show-image.component.html',
  styleUrl: './admin-product-show-image.component.css'
})
export class AdminProductShowImageComponent {
  @ViewChild('aps') dialog!: ElementRef;
  @Output() closeImage = new EventEmitter<string>();

  productId!: string
  name!: string

  imageToShow: any;
  isImageLoading = false;

  constructor(private productsService: ProductsService) {
  }

  show(productId: string, name: string) {
    this.productId = productId;
    this.name = name;

    this.getImage()
    this.dialog.nativeElement.show();
  }

  close() {
    this.closeImage.emit("close");
    this.dialog.nativeElement.close();
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  getImage() {
    this.isImageLoading = true;
    this.productsService.getFile(this.productId, this.name).then(data => {
      if (data) {
        this.createImageFromBlob(data);
        this.isImageLoading = false;
      }
    }, error => {
      this.isImageLoading = false;
      console.log(error);
    });
  }
}
