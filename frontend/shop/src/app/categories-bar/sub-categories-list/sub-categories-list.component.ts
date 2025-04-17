import { Component, inject, Input } from '@angular/core';
import { Category } from '../category';
import { CategoriesService } from '../categories.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sub-categories-list',
  templateUrl: './sub-categories-list.component.html',
  styleUrl: './sub-categories-list.component.css'
})
export class SubCategoriesListComponent {
  categoriesService = inject(CategoriesService);
  route = inject(ActivatedRoute);

  subCategories: Category[] | undefined
  categoryLabel!: string
  category: Category | undefined
  

  ngOnInit(): void {

    this.categoryLabel = this.route.snapshot.paramMap.get("categoryLabel") as string;

    this.categoriesService.getCategoryByLabel(this.categoryLabel).then(res => {
      this.category = res;

      this.categoriesService.getSubCategories(res?._id!).then(result => {
        this.subCategories = result;
      }
      )
    })
  }

  createRouteLink(label: string): string {
    return "/products/" + label.replaceAll(" ", "-");
  }

}
