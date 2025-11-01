import { Component, Input } from '@angular/core';
import { Shop } from '../shop';

@Component({
  selector: 'app-shop-tab',
  templateUrl: './shop-tab.component.html',
  styleUrl: './shop-tab.component.css'
})
export class ShopTabComponent {
  days: string[] = ['Monday', "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  @Input() shop!: Shop;

}
