import { Component, inject } from '@angular/core';
import { FiltersService } from '../../products/filters/filters.service';
import { Filters } from '../../products/filters/filters';
import { customFilters } from '../../products/filters/customFilter';
import { FilterData } from './filterData';
import { CategoriesService } from '../../categories-bar/categories.service';
import { Category } from '../../categories-bar/category';
import { Sort } from '@angular/material/sort';

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
  sortedData: FilterData[] = [];
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
              let mainFilter_idTMP = this.filters[i]._id;
              let category_idTMP = this.filters[i].category_id;

              this.data[n] = {
                //mainFilter_id: this.filters[i]._id,
                mainFilter_id: mainFilter_idTMP != null ? mainFilter_idTMP : "",
                //category_id: this.filters[i].category_id,
                category_id: category_idTMP != null ? category_idTMP : "",
                index: j,
                parameterName: cFilters[j].parameterName,
                filterType: cFilters[j].filterType
              }

              n++;
            }
          }
        }
      }

      this.sortedData = this.data;
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
    console.log("edit: " + id + "  " + index);
  }

  delete(id: string, index: number) {
    console.log("delete: " + id + "  " + index);
  }

  sortData(sort: Sort) {
    if (!this.data) {
      return;
    }

    if (!sort.active || sort.direction === '') {
      this.sortedData = this.data;
      return;
    }

    const data = this.data.slice();

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'mainFilterId':
          return this.compareIds(a.mainFilter_id, b.mainFilter_id, isAsc);
        case 'category_id':
          return this.compareIds(a.category_id, b.category_id, isAsc);
        case 'category_name':
          return this.compare(this.getCategory(a.category_id), this.getCategory(b.category_id), isAsc);
        case 'index':
          return this.compare(a.index, b.index, isAsc);
        case 'parameterName':
          return this.compare(a.parameterName, b.parameterName, isAsc);
        case 'filterType':
          return this.compare(a.filterType, b.filterType, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  compareIds(a: string, b: string, isAsc: boolean) {
    return (parseInt(a) < parseInt(b) ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
