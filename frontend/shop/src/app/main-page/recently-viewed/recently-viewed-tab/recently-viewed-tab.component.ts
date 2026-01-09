import { Component, Input } from '@angular/core';
import { Product } from '../../../products/product';
import { ProductsService } from '../../../products/products.service';

@Component({
  selector: 'app-recently-viewed-tab',
  templateUrl: './recently-viewed-tab.component.html',
  styleUrl: './recently-viewed-tab.component.css'
})
export class RecentlyViewedTabComponent {
  @Input() product!: Product;
  imageToShow: any;
  isImageLoading = false;

  constructor(private productsService: ProductsService) { }

  ngOnInit() {
    this.getImage()
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
