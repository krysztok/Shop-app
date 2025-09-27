import { Component, Input } from '@angular/core';
import { Product } from '../../../products/product';

@Component({
  selector: 'app-recently-viewed-tab',
  templateUrl: './recently-viewed-tab.component.html',
  styleUrl: './recently-viewed-tab.component.css'
})
export class RecentlyViewedTabComponent {
  @Input() product!: Product;

}
