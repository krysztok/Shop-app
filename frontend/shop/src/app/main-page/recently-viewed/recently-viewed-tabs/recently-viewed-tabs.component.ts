import { Component, inject, Input } from '@angular/core';
import { ProductsService } from '../../../products/products.service';
import { Product } from '../../../products/product';
import { RecentlyViewedService } from '../recently-viewed.service';
import { CategoriesService } from '../../../categories-bar/categories.service';
import { Category } from '../../../categories-bar/category';

@Component({
  selector: 'app-recently-viewed-tabs',
  templateUrl: './recently-viewed-tabs.component.html',
  styleUrl: './recently-viewed-tabs.component.css'
})
export class RecentlyViewedTabsComponent {
  productsService = inject(ProductsService);
  categoriesService = inject(CategoriesService);
  recentlyViewedService = inject(RecentlyViewedService);

  productIds: String[] = [];
  products: Product[] | undefined = [];
  categoriesMap: Map<string, string> = new Map<string, string>;
  showingProducts: Product[] = [];
  offset: number = 0;
  nTiles: number = 5;
  offsetMax: number = 0;

  ngOnInit(): void {
    this.productIds = this.recentlyViewedService.getProductsIds();
    this.recentlyViewedService.getProducts().then((products) => {
      if (products) {
        this.changeOrder(products)
        if (this.products) {
          this.offsetMax = this.products.length - this.nTiles > 0 ? this.products.length - this.nTiles : 0;
          this.showingProducts = this.products.slice(0, this.nTiles)!;
        }

        this.getCategories()
      }
    });
  }

  changeDisplay(move: number): void {
    if (this.products) {
      this.offset = this.offset + move;

      if (this.offset < 0) {
        this.offset = 0;
      }

      if (this.offset > this.offsetMax) {
        this.offset = this.offsetMax;
      }

      this.showingProducts = this.products.slice(this.offset, this.offset + this.nTiles);
    }
  }

  createRouteLink(product: Product) {
    let catTmp =  this.categoriesMap.get(product.categoryId);
    let category = catTmp!=undefined? catTmp : "recently-viewed"

    return "/products/" + category.replaceAll(" ", "-") + "/" + product.name.replaceAll(" ", "-"); 
  }

  changeOrder(products: Product[]) {
    let productsNewOrder: Product[] = []
    for (let i = 0; i < this.productIds.length; i++) {
      for (let j = 0; j < products.length; j++) {
        if (products[j]._id == this.productIds[i]) {
          productsNewOrder.push(products[j]);
          break;
        }

      }
    }

    this.products = productsNewOrder.reverse();
  }

  getCategories() {
    let categoriesIds: string[] = [];

    if (this.products) {
      for (let i = 0; i < this.products.length; i++) {
        let catId = this.products[i].categoryId;
        if (!categoriesIds.includes(catId)) {
          categoriesIds.push(catId)
        }
      }
    }

    this.categoriesService.getCategoriesByIds(categoriesIds).then((categories) => {
      if (categories) {
        for (let i = 0; i < categories?.length; i++) {
          this.categoriesMap.set(categories[i]._id, categories[i].label)
        }
      }
    })
  }
}
