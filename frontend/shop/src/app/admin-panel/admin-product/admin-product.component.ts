import { Component, inject } from '@angular/core';
import { ProductsService } from '../../products/products.service';
import { CategoriesService } from '../../categories-bar/categories.service';
import { Product } from '../../products/product';
import { Category } from '../../categories-bar/category';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrl: './admin-product.component.css'
})
export class AdminProductComponent {
  productsService: ProductsService = inject(ProductsService);
  categoriesService: CategoriesService = inject(CategoriesService);

  displayedColumns: string[] = ['id', 'name', 'categoryId', 'category', 'price', 'action'];
  categories: Category[] | undefined;

  products: Product[] | undefined;
  sortedData: Product[] | undefined;

  ngOnInit() {
    this.productsService.getAllProducts().then(res => {
      this.products = res;
      this.sortedData = res;
    })

    this.categoriesService.getAllCategories().then(res => {
      this.categories = res;
    })
  }

  edit(id: string) {
    console.log("edit: " + id);
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

    if (!sort.active || sort.direction === '') {
      this.sortedData = this.products;
      return;
    }

    const data = this.products.slice();

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return this.compareIds(a._id, b._id, isAsc);
        case 'name':
          return this.compare(a.name, b.name, isAsc);
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

}
