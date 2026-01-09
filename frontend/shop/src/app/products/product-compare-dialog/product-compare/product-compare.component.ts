import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../product';
import { ProductsService } from '../../products.service';

@Component({
  selector: 'app-product-compare',
  templateUrl: './product-compare.component.html',
  styleUrl: './product-compare.component.css'
})
export class ProductCompareComponent {

  @Input() product!: Product;
  @Output() remove: EventEmitter<Product> = new EventEmitter<Product>();

  imageToShow: any;
  isImageLoading = false;

  constructor(private productsService: ProductsService) { }

  ngOnInit() {
    this.getImage()
  }

  removeProduct() {
    this.remove.emit(this.product);
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

    if (this.product.imagesNames && this.product.imagesNames[0] != null) {
      this.productsService.getFile(this.product._id, this.product.imagesNames[0]).then(data => {
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

}
