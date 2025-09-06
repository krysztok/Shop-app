import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FiltersService } from '../../products/filters/filters.service';
import { Filters } from '../../products/filters/filters';
import { FilterData } from './filterData';
import { CategoriesService } from '../../categories-bar/categories.service';
import { Category } from '../../categories-bar/category';
import { Sort } from '@angular/material/sort';
import { tableFilter } from '../tableFilter';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import { AdminFilterViewComponent } from './admin-filter-view/admin-filter-view.component';
import { AdminFilterAddComponent } from './admin-filter-add/admin-filter-add.component';
import { AdminFilterDeleteComponent } from './admin-filter-delete/admin-filter-delete.component';

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

  @ViewChild('afv') dialog!: AdminFilterViewComponent;
  @ViewChild('afa') dialogAdd!: AdminFilterAddComponent;
  @ViewChild('afd') dialogDelete!: AdminFilterDeleteComponent;
  @ViewChild('name') nameFilter!: ElementRef;
  @ViewChild(MatTable) table!: MatTable<any>

  ngOnInit() {
    this.filltersService.getAllFilters().then(res => {
      this.filters = res;
      this.createData()
      this.dataSource = new MatTableDataSource(this.data);

      this.dataSource.filterPredicate = function (record, filter) {
        let isMatch = false;
        var map = new Map(JSON.parse(filter));

        for (let [key, value] of map) {
          if (key != "parameterName") {
            isMatch = (value == "all" || value == "") || (record[key as keyof FilterData] == value);
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

    this.createTableFilters(true);
  }

  createData() {
    if (this.filters) {
      let n = 0;
      this.data = []

      for (let i = 0; i < this.filters?.length; i++) {
        let cFilters = this.filters[i].filters;

        if (cFilters) {
          for (let j = 0; j < cFilters.length; j++) {
            let mainFilter_idTMP = this.filters[i]._id;
            let category_idTMP = this.filters[i].category_id;

            this.data[n] = {
              mainFilter_id: mainFilter_idTMP != null ? mainFilter_idTMP : "",
              category_id: category_idTMP != null ? category_idTMP : "",
              index: j,
              parameterName: cFilters[j].parameterName,
              filterType: cFilters[j].filterType,
              availableOptions: cFilters[j].availableOptions,
              max: cFilters[j].max
            }

            n++;
          }
        }
      }
    }
  }

  createTableFilters(init: boolean) {
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

      let f_lastValue = this.tableFilters[0] ? this.tableFilters[0].selectedValue : null;
      let f1_lastValue = this.tableFilters[1] ? this.tableFilters[1].selectedValue : null;
      let clearFilters: boolean = false;
      this.tableFilters = []

      let f: tableFilter = {
        label: 'Category id/name',
        name: 'category_id',
        options: optionsCategory,
        values: valuesCategory
      }

      if (init) {
        f.selectedValue = "all"
      } else { //if selected value is still available keep filters, else clear filters
        if (f_lastValue && optionsCategory.includes(f_lastValue)) {
          f.selectedValue = f_lastValue
        } else {
          clearFilters = true;
        }
      }

      let filtersOptions: string[] = ["all", "string", "boolean", "int"];
      let f1: tableFilter = {
        label: 'Filter type',
        name: 'filterType',
        options: filtersOptions,
        values: filtersOptions
      }

      if (init) {
        f1.selectedValue = "all"
      } else { //if selected value is still available keep filters, else clear filters
        if (f1_lastValue && filtersOptions.includes(f1_lastValue)) {
          f1.selectedValue = f1_lastValue
        } else {
          clearFilters = true;
        }
      }

      this.tableFilters.push(f)
      this.tableFilters.push(f1)

      if (clearFilters) {
        this.clearFilters()
      }
    })
  }

  refreshList(s: string) {
    this.filltersService.getAllFilters().then(res => {
      this.filters = res;
      this.createData()
      this.dataSource.data = new MatTableDataSource(this.data).data;
    })

    this.createTableFilters(false)
    this.renderTable()
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

  view(filter: FilterData, categoryName: string) {
    this.dialogAdd.close()
    this.dialogDelete.close()
    this.dialog.show(filter, categoryName)
  }

  add() {
    this.dialog.close()
    this.dialogDelete.close()
    this.dialogAdd.show()
  }

  delete(id: string, index: number) {
    this.dialog.close()
    this.dialogAdd.close()
    this.dialogDelete.show(id, index)
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
          return this.compare(a.parameterName.toLowerCase(), b.parameterName.toLowerCase(), isAsc);
        case 'filterType':
          return this.compare(a.filterType.toLowerCase(), b.filterType.toLowerCase(), isAsc);
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

  clearFilters() {
    if (this.filterDictionary.size == 0) {
      return;
    }

    this.filterDictionary.forEach((v, k) => {
      this.filterDictionary.set(k, '')
    })

    this.nameFilter.nativeElement.value = '';
    this.tableFilters[0].selectedValue = "all"
    this.tableFilters[1].selectedValue = "all"

    var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.dataSource.filter = jsonString;
  }

  renderTable() { //force render on content change
    if (this.table) {
      this.table.renderRows()
    }
  }
}
