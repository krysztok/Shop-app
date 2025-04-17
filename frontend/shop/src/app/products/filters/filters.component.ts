import { Component, EventEmitter, inject, Input, Output, ViewChildren, QueryList  } from '@angular/core';
import { FiltersService } from './filters.service';
import { Filters } from './filters';
import { FilterComponent } from './filter/filter.component';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css',
})
export class FiltersComponent {

  @Input() categoryLabel!: string;
  filltersService: FiltersService = inject(FiltersService);

  filter_price_name: string = "Price"
  filter_price_type: string = "price"

  filter_ratings_name: string = "Ratings"
  filter_ratings_type: string = "rating"

  @Input() filters!: Filters
  @Output() filtersChange: EventEmitter<Filters> = new EventEmitter<Filters>();

  @ViewChildren('fltr') filterComponents:QueryList<FilterComponent> | undefined;
  

  ngOnInit() {

  }

  public assignPriceFrom(input: number | null) {
    this.filters.priceFrom = input;
  }

  public assignPriceTo(input: number | null) {
    this.filters.priceTo = input;
  }

  public assignRating(input: number | null) {
    this.filters.rating = input;
  }

  public assignCustomFilter(input: any){
    if( this.filters !== undefined && this.filters.customFilters !== null){
      for(let i = 0; i < this.filters.customFilters?.length; i++){
        if(this.filters.customFilters[i].parameterName === input.name){
          this.filters.customFilters[i].selectedOptions = input.selectedOptions;
          return;
        }
      }
    }
  }



  changeFilters(){
    if(this.filters !== null){
      this.filtersChange.emit(this.filters);
    }
  }

  public clearFilters(){
    if(this.filterComponents != undefined){
      this.filterComponents.forEach((filter) => filter.clear())
      this.changeFilters()
    }
  }


}
