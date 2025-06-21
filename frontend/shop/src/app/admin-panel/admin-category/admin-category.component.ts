import { Component, inject } from '@angular/core';
import { CategoriesService } from '../../categories-bar/categories.service';
import { Category } from '../../categories-bar/category';
import { MatTableDataSource} from '@angular/material/table'
import { Sort } from '@angular/material/sort';
import { MatSelectChange } from '@angular/material/select';
import { tableFilter } from '../tableFilter';


@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrl: './admin-category.component.css',

})
export class AdminCategoryComponent {

  categoriesService: CategoriesService = inject(CategoriesService);
  categories: Category[] = [];
  displayedColumns: string[] = ['id', 'parentId', 'name', 'type', 'action'];
  filters: tableFilter[] = [];
  dataSource = new MatTableDataSource<Category>();
  filterDictionary = new Map<string, string>();

  ngOnInit() {

    this.categoriesService.getAllCategories().then(res => {
      if (res) {
        this.categories = res;
        this.categoriesSetParentIds();
        this.dataSource = new MatTableDataSource(this.categories);

        let optionsCategory: string[] = ["all"];
        let valuesCategory: string[] = ["all"];
        if (this.categories) {
          for (let i = 0; i < this.categories?.length; i++) {
            if (this.categories[i].type != "subSubCategory") {
              optionsCategory.push(this.categories[i]._id + "/" + this.categories[i].label);
              valuesCategory.push(this.categories[i]._id);
            }
          }
        }

        this.filters.push({
          label: 'Parent category id/name',
          name: 'parentId',
          options: optionsCategory,
          values: valuesCategory,
          selectedValue: "all"
        })

        let typeOptions = ["all", "category", "subCategory", "subSubCategory"];

        this.filters.push({
          label: 'Type',
          name: 'type',
          options: typeOptions,
          values: typeOptions,
          selectedValue: "all"
        })

      }

      this.dataSource.filterPredicate = function (record, filter) {
        let isMatch = false;
        var map = new Map(JSON.parse(filter));

        for (let [key, value] of map) {
          if (key != "label") {
            isMatch = (value == "all") || (record[key as keyof Category] == value);
            if (!isMatch) return false;
          } else {
            if (value) {
              let s: string = value.toString();
              isMatch = (value == "") || (record[key as keyof Category].toString().toLowerCase().includes(s));
              isMatch = (record[key as keyof Category].toString().toLowerCase().includes(s));
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

  edit(id: string) {
    console.log("edit: " + id);
  }

  delete(id: string) {
    console.log("delete: " + id);
  }

  sortData(sort: Sort) {
    if (!this.categories) {
      return;
    }

    const data = this.categories.slice();

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      switch (sort.active) {
        case 'id':
          return this.compareIds(a._id, b._id, isAsc);
        case 'parentId':
          return this.compareIds(a.parentId, b.parentId, isAsc);
        case 'name':
          return this.compare(a.label, b.label, isAsc);
        case 'type':
          return this.compare(a.type, b.type, isAsc);
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
    this.filterDictionary.set("label", filterValue.trim().toLowerCase())
    var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.dataSource.filter = jsonString;
  }

  getValueFromFilter(filterName: string, v: string) {
    for (let i = 0; i < this.filters.length; i++) {
      if (this.filters[i].name == filterName) {
        for (let j = 0; j < this.filters[i].options.length; j++) {
          if (this.filters[i].options[j] == v) {
            return this.filters[i].values[j];
          }
        }
      }
    }

    return "";
  }

  categoriesSetParentIds() {
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].items != null) {
        for (let j = 0; j < this.categories[i].items.length; j++) {
          for (let k = 0; k < this.categories.length; k++) {
            if (this.categories[k]._id == this.categories[i].items[j]) {
              this.categories[k].parentId = this.categories[i]._id;
            }
          }
        }
      }
    }
  }

}
