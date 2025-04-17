import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../product';

@Component({
  selector: 'app-product-compare',
  templateUrl: './product-compare.component.html',
  styleUrl: './product-compare.component.css'
})
export class ProductCompareComponent {

  @Input() product!: Product;
  @Output() remove: EventEmitter<Product> = new EventEmitter<Product>();

  removeProduct(){
    this.remove.emit(this.product);
  }

}
