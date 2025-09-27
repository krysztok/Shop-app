import { Component, Input } from '@angular/core';
import { Product } from '../../products/product';
import { Subscription } from 'rxjs';
import { RecentlyViewedService } from './recently-viewed.service';

@Component({
  selector: 'app-recently-viewed',
  templateUrl: './recently-viewed.component.html',
  styleUrl: './recently-viewed.component.css'
})
export class RecentlyViewedComponent {

}
