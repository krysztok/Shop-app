import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-payment-options',
  templateUrl: './payment-options.component.html',
  styleUrl: './payment-options.component.css'
})
export class PaymentOptionsComponent {

  options: string[] = ['Payment option 1', 'Payment option 2', 'Payment option 3', 'Payment option 4'];
  selectedIndex: number | null = null;

  @Output() paymentOption: EventEmitter<string | null> = new EventEmitter<string | null>();

  changePaymentOption(selectedIndex: number | null) {
    this.selectedIndex = selectedIndex;
    this.paymentOption.emit(selectedIndex != null ? this.options[selectedIndex] : null);
  }

}
