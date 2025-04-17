import { Component } from '@angular/core';

@Component({
  selector: 'app-payment-options',
  templateUrl: './payment-options.component.html',
  styleUrl: './payment-options.component.css'
})
export class PaymentOptionsComponent {

  options: string[] = ['Payment option 1', 'Payment option 2', 'Payment option 3', 'Payment option 4'];

}
