import { Component, ContentChild, ElementRef, Input, ViewChild } from '@angular/core';
import { Product } from '../product';

@Component({
  selector: 'app-product-compare-dialog',
  templateUrl: './product-compare-dialog.component.html',
  styleUrl: './product-compare-dialog.component.css'
})
export class ProductCompareDialogComponent {

  @Input() products!: Product[];
  @ViewChild('cmp') dialog!:ElementRef;


  show(){
    console.log(this.products)
    this.dialog.nativeElement.show();
  }

  removeProduct(product: Product) {
    for(let i=0; i < this.products.length; i++){
      if(product._id === this.products[i]._id){
        this.products.splice(i, 1);
        break;
      }
    }

    if(this.products.length == 0){
      this.dialog.nativeElement.close();
    }
    
  }

  clear(){
    this.products.splice(0, this.products.length);
    this.dialog.nativeElement.close();
  }

}
