import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../product';
import { ProductsService } from '../products.service';
import { Filters } from '../filters/filters';
import { FiltersService } from '../filters/filters.service';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  route = inject(ActivatedRoute)
  productService: ProductsService = inject(ProductsService);
  filtersService: FiltersService = inject(FiltersService);

  filters: Filters = {
    priceFrom: null,
    priceTo: null,
    rating: null,
    filters: [],
    _id: null,
    category_id: null
  }

  categoryLabel!: string
  products: Product[] | undefined

  compareProducts: Product[] = [];

  sortOptions: string[] = ["Rating", "Name A-Z", "Name Z-A", "Price Low-High", "Price High-Low"];
  selectedSort: string = this.sortOptions[0];

ngOnInit() {
  this.categoryLabel = this.route.snapshot.paramMap.get("category") as string;

  this.productService.getProductsByCategoryLabel(this.categoryLabel).then(res => {
    this.products = res;
  }
  )

  this.filtersService.getFiltersByCategoryLabel(this.categoryLabel).then(res => {
    this.filters.filters = res!;
  }
  );
  
}

getCategoryLabel() {
  return this.categoryLabel.replaceAll("-", " ");
}

public assignFilters(input: Filters) {
  //making new object to force reload
  let newFilters = Object.assign({}, input);
  this.filters = newFilters;
}

addToCompare(product: Product){
  if(this.compareProducts.length < 3){
    
    for(let i = 0; i < this.compareProducts.length; i++){
      if(this.compareProducts[i]._id === product._id){
        return;
      }
    }

    this.compareProducts.push(product);
  }
}

}
