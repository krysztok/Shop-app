import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {

  @Input() name: string = 'filter';
  show_filter: boolean = true;
  @Input() type!: string;
  @Input() availableOptions!: any[];
  @Input() intMax!: number;

  @Input() priceFrom: number | null = null;
  @Output() priceFromChange: EventEmitter<number | null> = new EventEmitter<number | null>();

  @Input() priceTo: number | null = null;
  @Output() priceToChange: EventEmitter<number | null> = new EventEmitter<number | null>();

  @Input() rating!: number | null;
  @Output() ratingChange: EventEmitter<number | null> = new EventEmitter<number | null>();

  options: { name: any, checked: boolean }[] = [];
  @Output() selectedOptionsChange: EventEmitter<any> = new EventEmitter<any>();

  @Output() clearSignal: EventEmitter<any> = new EventEmitter<any>();

  selectedStatus: boolean | null = null;

  ngOnInit() {
    if (this.availableOptions === null) {
      this.availableOptions = [];
    }

    if (this.type == "int") {
      for (let i = 0; i < this.intMax; i++) {
        this.availableOptions.push(i);
      }
    } else if (this.type == "boolean") {
      this.availableOptions = [true, false]
    } else if (this.type == "rating") {
      this.availableOptions = [5, 4, 3, 2, 1]
    }

    if (this.availableOptions !== undefined) {
      for (let i = 0; i < this.availableOptions.length; i++) {
        let n = { name: this.availableOptions[i], checked: false };
        this.options.push(n)
      }
    }
  }

  colapse() {
    this.show_filter = !this.show_filter;
  }

  changeValue() {
    let name = this.name;
    let selectedOptions: any[] = [];

    for (let i = 0; i < this.options.length; i++) {
      if (this.options[i].checked) {
        selectedOptions.push(this.options[i].name);
      }
    }

    if (this.type === "boolean" && this.selectedStatus != null) {
      selectedOptions.push(this.selectedStatus)
    }

    this.selectedOptionsChange.emit({ name, selectedOptions });
  }

  changePriceFrom() {
    this.priceFromChange.emit(this.priceFrom);
  }

  changePriceTo() {
    this.priceToChange.emit(this.priceTo);
  }

  changeRating() {
    this.ratingChange.emit(this.rating);
  }


  clearOptions() {
    for (let i = 0; i < this.options.length; i++) {
      this.options[i].checked = false;
    }
    this.changeValue();
  }

  clear(singleClear?: boolean) {
    switch(this.type){
      case "price": {
        this.priceFrom = null;
        this.priceTo = null;
    
        this.changePriceFrom();
        this.changePriceTo();
        break
      }
      case "rating": {
        this.rating = null;
        this.changeRating();
        break
      }
      case "boolean": {
        this.selectedStatus = null;
        this.changeValue();
        break
      }
      case "string":
      case "int": {
        this.clearOptions();
        break
      }
    }

    if(singleClear){  //refresh product list after clearing only this filter (not all by "Clear filters" button) 
      this.clearSignal.emit()
    }

  }

}
