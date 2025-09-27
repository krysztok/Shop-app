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
  search: boolean = false;
  searchText: string = '';

  compareProducts: Product[] = [];

  sortOptions: string[] = ["Rating", "Name A-Z", "Name Z-A", "Price Low-High", "Price High-Low"];
  selectedSort: string = this.sortOptions[0];

  subCategories: Category[] | undefined

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loadData();
    });

    this.route.queryParamMap.subscribe((params) => {
      this.loadData();
    })
  }

  loadData() {
    this.categoryLabel = this.route.snapshot.paramMap.get("category") as string;

    if (this.categoryLabel != "search") {
      this.search = false;
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
    } else {
      let text = this.route.snapshot.queryParamMap.get('search');

      if (text != null) {
        this.searchText = text;
        this.productService.searchProductsByText(text).then(res => {
          this.products = res;
          this.subCategories = undefined;
          this.filters.filters = [];
          this.search = true;
        })
      }
    }
  }



  getCategoryLabel() {
    if(this.categoryLabel == 'search'){
      return "Search: \"" + this.searchText + "\"";
    }

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
