import { Component, inject } from '@angular/core';
import { ProductsService } from '../../products/products.service';
import { CategoriesService } from '../../categories-bar/categories.service';
import { Product } from '../../products/product';
import { Category } from '../../categories-bar/category';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrl: './admin-product.component.css'
})
export class AdminProductComponent {
  productsService: ProductsService = inject(ProductsService);
  categoriesService: CategoriesService = inject(CategoriesService);

  displayedColumns: string[] = ['id', 'name','categoryId', 'category', 'price', 'action'];
  categories: Category[] | undefined;

  products: Product[] | undefined;

  ngOnInit() {
    this.productsService.getAllProducts().then(res => {
      this.products = res;
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

}
