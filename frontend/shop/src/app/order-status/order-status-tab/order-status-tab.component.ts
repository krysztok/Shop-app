import { Component, Input } from '@angular/core';
import { StatusHistory } from '../statusHistory';

@Component({
  selector: 'app-order-status-tab',
  templateUrl: './order-status-tab.component.html',
  styleUrl: './order-status-tab.component.css'
})
export class OrderStatusTabComponent {
  @Input() statusHistory!: StatusHistory

}
