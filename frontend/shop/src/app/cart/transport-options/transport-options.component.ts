import { Component, EventEmitter, Output } from '@angular/core';
import { OrderTransportData } from './orderTransportData';

@Component({
  selector: 'app-transport-options',
  templateUrl: './transport-options.component.html',
  styleUrl: './transport-options.component.css'
})
export class TransportOptionsComponent {

    options: string[] = ['Transport option 1', 'Transport option 2', 'Transport option 3', 'Transport option 4', 'Transport option 5', 'Transport option 6','Self-pickup'];
    selectedIndex: number | null = null;
    prices: number[] = [5, 10, 10.99, 11, 13, 15, 0]
    optionsAdditionalParams: any[]  = [];

    @Output() transportCost: EventEmitter<OrderTransportData | null> = new EventEmitter<OrderTransportData | null>();
    


  constructor(){
    for(let i = 0; i < this.prices.length; i++) {
      this.optionsAdditionalParams.push(this.prices[i] + " zł");
    }
  }

  changeTransportCost(selectedIndex: number | null) {
    this.selectedIndex = selectedIndex;
    let transportOptionEmit: OrderTransportData | null = null;

    if(selectedIndex != null){
      transportOptionEmit = {
        transportType: this.options[selectedIndex],
        transportCost: this.prices[selectedIndex]
      }; 
    }

    this.transportCost.emit(transportOptionEmit);
  }

}
