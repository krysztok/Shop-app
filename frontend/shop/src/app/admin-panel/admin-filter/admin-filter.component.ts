import { Component, inject } from '@angular/core';
import { FiltersService } from '../../products/filters/filters.service';
import { Filters } from '../../products/filters/filters';
import { customFilters } from '../../products/filters/customFilter';
import { FilterData } from './filterData';
import { CategoriesService } from '../../categories-bar/categories.service';
import { Category } from '../../categories-bar/category';

@Component({
  selector: 'app-admin-filter',
  templateUrl: './admin-filter.component.html',
  styleUrl: './admin-filter.component.css'
})
export class AdminFilterComponent {
  filltersService: FiltersService = inject(FiltersService);
  categoriesService: CategoriesService = inject(CategoriesService);
  displayedColumns: string[] = ['mainFilterId', 'category_id', 'category_name', "index", "parameterName", "filterType", "action"];

  filters: Filters[] | undefined;
  categories: Category[] | undefined;
  data: FilterData[] = [];

  ngOnInit() {
    this.categoriesService.getAllCategories().then(res => {
      this.categories = res;
    })

    this.filltersService.getAllFilters().then(res => {
      this.filters = res;

      let n = 0;

      if (this.filters) {
        for (let i = 0; i < this.filters?.length; i++) {
          let cFilters = this.filters[i].filters;

          if (cFilters) {
            for (let j = 0; j < cFilters.length; j++) {
              this.data[n] = {
                mainFilter_id: this.filters[i]._id,
                category_id: this.filters[i].category_id,
                index: j,
                parameterName: cFilters[j].parameterName,
                filterType: cFilters[j].filterType
              }

              n++;
            }
          }
        }
      }
    })
  }

    getCategory(id: string) {
    if (this.categories) {
      for (let i = 0; i < this.categories?.length; i++) {
        if (this.categories[i]._id == id) {
          return this.categories[i].label;
        }
      }
    }

    return "no category";
  }

    edit(id: string, index: number) {
    console.log("edit: " + id + "  " + index );
  }

  delete(id: string, index: number) {
    console.log("delete: " + id + "  " + index);
  }

}
