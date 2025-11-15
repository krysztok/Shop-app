import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CategoriesService } from '../../categories-bar/categories.service';
import { Category } from '../../categories-bar/category';
import { MatTable, MatTableDataSource } from '@angular/material/table'
import { Sort } from '@angular/material/sort';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { tableFilter } from '../tableFilter';
import { AdminCategoryEditComponent } from './admin-category-edit/admin-category-edit.component';
import { AdminCategoryDeleteComponent } from './admin-category-delete/admin-category-delete.component';
import { AdminCategoryImageComponent } from './admin-category-image/admin-category-image.component';


@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrl: './admin-category.component.css',

})
export class AdminCategoryComponent {

  categoriesService: CategoriesService = inject(CategoriesService);
  categories: Category[] = [];
  displayedColumns: string[] = ['id', 'name', 'type', 'parentId', 'action'];
  filters: tableFilter[] = [];
  dataSource = new MatTableDataSource<Category>();
  filterDictionary = new Map<string, string>();

  @ViewChild('ace') dialog!: AdminCategoryEditComponent;
  @ViewChild('acd') dialogDelete!: AdminCategoryDeleteComponent;
  @ViewChild('aci') dialogImages!: AdminCategoryImageComponent;
  @ViewChild('name') nameFilter!: ElementRef;
  @ViewChild(MatTable) table!: MatTable<any>

  ngOnInit() {

    this.categoriesService.getAllCategories().then(res => {
      if (res) {
        this.categories = res;
        this.categoriesSetParentIds();
        this.dataSource = new MatTableDataSource(this.categories);

        this.createFilters(true)
      }

      this.dataSource.filterPredicate = function (record, filter) {
        let isMatch = false;
        var map = new Map(JSON.parse(filter));

        for (let [key, value] of map) {
          if (key != "label") {
            isMatch = (value == "all" || value == '') || (record[key as keyof Category] == value);
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

  createFilters(init: boolean) {
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

    let f_lastValue = this.filters[0] ? this.filters[0].selectedValue : null;
    let f1_lastValue = this.filters[1] ? this.filters[1].selectedValue : null;
    let clearFilters: boolean = false;
    this.filters = []

    let f: tableFilter = {
      label: 'Parent category id/name',
      name: 'parentId',
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

    let typeOptions = ["all", "category", "subCategory", "subSubCategory"];

    let f1: tableFilter = {
      label: 'Type',
      name: 'type',
      options: typeOptions,
      values: typeOptions
    }

    if (init) {
      f1.selectedValue = "all"
    } else { //if selected value is still available keep filters, else clear filters
      if (f1_lastValue && typeOptions.includes(f1_lastValue)) {
        f1.selectedValue = f1_lastValue
      } else {
        clearFilters = true;
      }
    }

    this.filters.push(f)
    this.filters.push(f1)

    if (clearFilters) {
      this.clearFilters()
    }
  }

  refreshList(s: string) {
    this.categoriesService.getAllCategories().then(res => {
      if (res) {
        this.categories = res;
        this.categoriesSetParentIds();
        this.dataSource.data = new MatTableDataSource(this.categories).data;

        this.createFilters(false)
      }
    })

    this.renderTable()
  }

  edit(category: Category) {
    this.dialogImages.close()
    this.dialogDelete.close()
    this.dialog.show(true, category)
  }

  add() {
    this.dialogImages.close()
    this.dialogDelete.close()
    this.dialog.show(false)
  }

  delete(category: Category) {
    this.dialogImages.close()
    this.dialog.close()
    this.dialogDelete.show(category._id, category.label)
  }

  showImage(categoryId: string) {
    this.dialog.close()
    this.dialogDelete.close()
    this.dialogImages.show(categoryId);
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
          return this.compare(a.label.toLowerCase(), b.label.toLowerCase(), isAsc);
        case 'type':
          return this.compare(a.type.toLowerCase(), b.type.toLowerCase(), isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  compareIds(a: string, b: string, isAsc: boolean) {

    if (a == null) {
      return -1;
    }
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

  categoriesSetParentIds() { //to remove when all items have parent id in base
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

  clearFilters() {
    if (this.filterDictionary.size == 0) {
      return;
    }

    this.filterDictionary.forEach((v, k) => {
      this.filterDictionary.set(k, '')
    })

    this.nameFilter.nativeElement.value = '';
    this.filters[0].selectedValue = "all"
    this.filters[1].selectedValue = "all"

    var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.dataSource.filter = jsonString;
  }

  renderTable() { //force render on content change
    if (this.table) {
      this.table.renderRows()
    }
  }
}


