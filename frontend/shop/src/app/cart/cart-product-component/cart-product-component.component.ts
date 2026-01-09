import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { Product } from '../../products/product';
import { CategoriesService } from '../../categories-bar/categories.service';
import { Router } from '@angular/router';
import { ProductsService } from '../../products/products.service';

@Component({
  selector: 'app-cart-product-component',
  templateUrl: './cart-product-component.component.html',
  styleUrl: './cart-product-component.component.css'
})
export class CartProductComponentComponent {

  @Input() product!: Product;
  @Input() ammount!: number;
  @Output() ammountChange: EventEmitter<number> = new EventEmitter<number>();

  imageToShow: any;
  isImageLoading = false;

  constructor(private categoriesService: CategoriesService, private router: Router, private productsService: ProductsService) { }

  ngOnInit() {
    this.getImage()
  }

  changeAmount(add: boolean) {
    if (add) {
      this.ammountChange.emit(++this.ammount);
    } else {
      this.ammountChange.emit(--this.ammount);
    }
  }

  remove() {
    this.ammountChange.emit(0);
  }

  goToProductPage() {
    this.categoriesService.getCategoryById(this.product.categoryId).then((category) => {
      this.router.navigateByUrl("/products/" + category?.label.replaceAll(' ', '-') + "/" + this.product.name.replaceAll(' ', '-'));
    }
    )

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
