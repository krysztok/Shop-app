import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../product';
import { ProductsService } from '../products.service';
import { Filters } from '../filters/filters';
import { FiltersService } from '../filters/filters.service';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Category } from '../../categories-bar/category';
import { CategoriesService } from '../../categories-bar/categories.service';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  route = inject(ActivatedRoute)
  productService: ProductsService = inject(ProductsService);
  filtersService: FiltersService = inject(FiltersService);
  categoriesService: CategoriesService = inject(CategoriesService);

  filters: Filters = {
    priceFrom: null,
    priceTo: null,
    rating: null,
    filters: [],
    _id: null,
    category_id: null
  }

  categoryLabel!: string
  products: Product[] | undefined

  /* need for navigation component */
  mainCategoryLabel!: string | undefined
  subCategoryLabel!: string | undefined

  compareProducts: Product[] = [];

  sortOptions: string[] = ["Rating", "Name A-Z", "Name Z-A", "Price Low-High", "Price High-Low"];
  selectedSort: string = this.sortOptions[0];

  subCategories: Category[] | undefined

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.categoryLabel = this.route.snapshot.paramMap.get("category") as string;

      this.productService.getProductsWithSubCategoriesByCategoryLabel(this.categoryLabel).then(res => {
        this.products = res;
      }
      )

      this.categoriesService.getSubCategoriesByLabel(this.categoryLabel).then(res => {
        this.subCategories = res;
      }
      )

      this.filtersService.getFiltersByCategoryLabel(this.categoryLabel).then(res => {
        this.filters.filters = res!;
      }
      );

      this.categoriesService.getCategoryNav(this.categoryLabel).then(res => {
        this.mainCategoryLabel = res?.mainCategory;
        this.subCategoryLabel = res?.subCategory;
      })

    });
  }



  getCategoryLabel() {
    return this.categoryLabel.replaceAll("-", " ");
  }

  public assignFilters(input: Filters) {
    //making new object to force reload
    let newFilters = Object.assign({}, input);
    this.filters = newFilters;
  }

  addToCompare(product: Product) {
    if (this.compareProducts.length < 3) {

      for (let i = 0; i < this.compareProducts.length; i++) {
        if (this.compareProducts[i]._id === product._id) {
          return;
        }
      }

      this.compareProducts.push(product);
    }
  }

}
