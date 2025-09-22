import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Product } from '../../../products/product';
import { ProductsService } from '../../../products/products.service';

@Component({
  selector: 'app-admin-product-comments',
  templateUrl: './admin-product-comments.component.html',
  styleUrl: './admin-product-comments.component.css'
})
export class AdminProductCommentsComponent {

  @ViewChild('apc') dialog!: ElementRef;

  product!: Product | undefined
  ratingSortOptions: string[] = ["Date New-Old", "Date Old-New", "Rating High-Low", "Rating Low-High"];
  ratingSelectedSort: string = this.ratingSortOptions[0];
  @Output() refreshList: EventEmitter<string> = new EventEmitter<string>();

  constructor(private productsService: ProductsService) { }

  show(product: Product) {
    this.product = product;
    this.dialog.nativeElement.show();
  }

  deleteRating(ratingId: string) {
    if (this.product) {
      this.productsService.deleteRating(this.product._id, ratingId).then(data => {
        this.refreshList.emit("refresh") //refresh product list

        if (this.product) { //refresh this product
          this.productsService.getProductById(this.product._id).then(data => {
            this.product = data;
          })
        }
      }).catch((error) => {
        let message: string = error.error.message;
        if (message.includes("problem: ")) {
          message = message.split("problem: ")[1]
        }
        console.log(message)
        alert(message)
      });
    }

  }

  close() {
    this.dialog.nativeElement.close();
  }

}
