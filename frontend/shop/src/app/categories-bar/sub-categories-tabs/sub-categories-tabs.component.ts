import { Component, inject, Input } from '@angular/core';
import { Category } from '../category';
import { CategoriesService } from '../categories.service';

@Component({
  selector: 'app-sub-categories-tabs',
  templateUrl: './sub-categories-tabs.component.html',
  styleUrl: './sub-categories-tabs.component.css'
})
export class SubCategoriesTabsComponent {

  categoriesService = inject(CategoriesService);

  @Input() subCategory!: Category;
  subSubCategories: Category[] = [];
  showingCategories: Category[] = [];
  offset: number = 0;
  nTiles: number = 5;
  offsetMax: number = 0;


  ngOnInit(): void {
    this.categoriesService.getSubCategories(this.subCategory?._id).then(result => {
      this.subSubCategories = result!;

      this.offsetMax = this.subSubCategories.length - this.nTiles > 0 ? this.subSubCategories.length - this.nTiles : 0;
      this.showingCategories = result?.slice(0, this.nTiles)!;
    }
    )
  }

  changeDisplay(move: number): void {
    this.offset = this.offset + move;

    if (this.offset < 0) {
      this.offset = 0;
    }

    if (this.offset > this.offsetMax) {
      this.offset = this.offsetMax;
    }


    this.showingCategories = this.subSubCategories.slice(this.offset, this.offset + this.nTiles);
  }

  createRouteLink(label: string): string {
    return "/products/" + label.replaceAll(" ", "-");
  }

}
