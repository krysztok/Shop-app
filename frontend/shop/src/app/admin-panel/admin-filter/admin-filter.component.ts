import { Component, inject } from '@angular/core';
import { FiltersService } from '../../products/filters/filters.service';
import { Filters } from '../../products/filters/filters';
import { FilterData } from './filterData';
import { CategoriesService } from '../../categories-bar/categories.service';
import { Category } from '../../categories-bar/category';
import { Sort } from '@angular/material/sort';
import { tableFilter } from '../tableFilter';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';

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

  tableFilters: tableFilter[] = [];
  dataSource = new MatTableDataSource<FilterData>();
  filterDictionary = new Map<string, string>();

  ngOnInit() {
    this.categoriesService.getAllCategories().then(res => {
      this.categories = res;

      let optionsCategory: string[] = ["all"];
      let valuesCategory: string[] = ["all"];
      if (this.categories) {
        for (let i = 0; i < this.categories?.length; i++) {
            optionsCategory.push(this.categories[i]._id + "/" + this.categories[i].label);
            valuesCategory.push(this.categories[i]._id);
        }
      }

      this.tableFilters.push({
        label: 'Category id/name',
        name: 'category_id',
        options: optionsCategory,
        values: valuesCategory,
        selectedValue: "all"
      })


      let filtersOptions: string[] = ["all", "string", "boolean", "int"];
      this.tableFilters.push({
        label: 'Filter type',
        name: 'filterType',
        options: filtersOptions,
        values: filtersOptions,
        selectedValue: "all"
      })

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


      this.dataSource = new MatTableDataSource(this.data);

      this.dataSource.filterPredicate = function (record, filter) {
        let isMatch = false;
        var map = new Map(JSON.parse(filter));

        for (let [key, value] of map) {
          if (key != "parameterName") {
            isMatch = (value == "all") || (record[key as keyof FilterData] == value);
            if (!isMatch) return false;
          } else {
            if (value) {
              let s: string = value.toString();
              isMatch = (value == "") || (record[key as keyof FilterData].toString().toLowerCase().includes(s));
              isMatch = (record[key as keyof FilterData].toString().toLowerCase().includes(s));
              if (!isMatch) return false;
            } else {
              isMatch = true;
            }
          }
        }

        return isMatch;
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
    console.log("edit: " + id + "  " + index);
  }

  delete(id: string, index: number) {
    console.log("delete: " + id + "  " + index);
  }

  sortData(sort: Sort) {
    if (!this.data) {
      return;
    }

    const data = this.data.slice();

    this.dataSource.data = data.sort((a, b) => {
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

    applyFilter(ob: MatSelectChange, filter: tableFilter) {
      this.filterDictionary.set(filter.name, this.getValueFromFilter(filter.name, ob.value));
      var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
      this.dataSource.filter = jsonString;
    }
  
    applyNameFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.filterDictionary.set("parameterName", filterValue.trim().toLowerCase())
      var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
      this.dataSource.filter = jsonString;
    }
  
    getValueFromFilter(filterName: string, v: string) {
      for (let i = 0; i < this.tableFilters.length; i++) {
        if (this.tableFilters[i].name == filterName) {
          for (let j = 0; j < this.tableFilters[i].options.length; j++) {
            if (this.tableFilters[i].options[j] == v) {
              return this.tableFilters[i].values[j];
            }
          }
        }
      }
  
      return "";
    }
}
