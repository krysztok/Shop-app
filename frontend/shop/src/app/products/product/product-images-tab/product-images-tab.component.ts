import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-images-tab',
  templateUrl: './product-images-tab.component.html',
  styleUrl: './product-images-tab.component.css'
})
export class ProductImagesTabComponent {
  @Input() image!: any;

}
