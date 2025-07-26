import { Component, inject, ViewChild } from '@angular/core';
import { ProductsService } from '../../products/products.service';
import { CategoriesService } from '../../categories-bar/categories.service';
import { Product } from '../../products/product';
import { Category } from '../../categories-bar/category';
import { Sort } from '@angular/material/sort';
import { tableFilter } from '../tableFilter';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import { AdminProductEditComponent } from './admin-product-edit/admin-product-edit.component';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrl: './admin-product.component.css'
})
export class AdminProductComponent {
  productsService: ProductsService = inject(ProductsService);
  categoriesService: CategoriesService = inject(CategoriesService);

   @ViewChild('ape') dialog!:AdminProductEditComponent;

  displayedColumns: string[] = ['id', 'name', 'categoryId', 'category', 'price', 'action'];
  categories: Category[] | undefined;

  products: Product[] | undefined;

  filters: tableFilter[] = [];
  dataSource = new MatTableDataSource<Product>();
  filterDictionary = new Map<string, string>();

  ngOnInit() {
    this.productsService.getAllProducts().then(res => {
      this.products = res;
      this.dataSource = new MatTableDataSource(this.products);

      this.dataSource.filterPredicate = function (record, filter) {
        let isMatch = false;
        var map = new Map(JSON.parse(filter));

        for (let [key, value] of map) {
          switch (key) {
            case 'name':
              if (value) {
                let s: string = value.toString();
                isMatch = (value == "") || (record[key as keyof Product].toString().toLowerCase().includes(s));
                isMatch = (record[key as keyof Product].toString().toLowerCase().includes(s));
                if (!isMatch) return false;
              } else {
                isMatch = true;
              }
              break;
            case 'priceFrom':
              if (value) {
                let n: number = parseFloat(value.toString());
                isMatch = record.price >= n;
                if (!isMatch) return false;
              } else {
                isMatch = true;
              }
              break;
            case 'priceTo':
              if (value) {
                let n: number = parseFloat(value.toString());
                isMatch = record.price <= n;
                if (!isMatch) return false;
              } else {
                isMatch = true;
              }
              break;
            default:
              isMatch = (value == "all") || (record[key as keyof Product] == value);
              if (!isMatch) return false;
              break;
          }
        }
        return isMatch;
      }
    })

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

      this.filters.push({
        label: 'Category id/name',
        name: 'categoryId',
        options: optionsCategory,
        values: valuesCategory,
        selectedValue: "all"
      })

    })
  }

  edit(product: Product) {
    this.dialog.show(true, product)
  }

  add() {
    this.dialog.show(false)
  }

  delete(id: string) {
    console.log("delete: " + id);
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

  sortData(sort: Sort) {
    if (!this.products) {
      return;
    }

    const data = this.products.slice();

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return this.compareIds(a._id, b._id, isAsc);
        case 'name':
          return this.compare(a.name.toLowerCase(), b.name.toLowerCase(), isAsc);
        case 'categoryId':
          return this.compareIds(a.categoryId, b.categoryId, isAsc);
        case 'category':
          return this.compare(this.getCategory(a.categoryId), this.getCategory(b.categoryId), isAsc);
        case 'price':
          return this.compare(a.price, b.price, isAsc);
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
    this.filterDictionary.set("name", filterValue.trim().toLowerCase())
    var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.dataSource.filter = jsonString;
  }

  applyPriceFilter(event: Event, priceMin: boolean) {
    const filterValue = (event.target as HTMLInputElement).value;
    let name = ""
    name = priceMin ? "priceFrom" : "priceTo";
    this.filterDictionary.set(name, filterValue.trim().toLowerCase())
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

}
