import { Component, inject } from '@angular/core';
import { CategoriesService } from '../../categories-bar/categories.service';
import { Category } from '../../categories-bar/category';
import {MatTableModule} from '@angular/material/table'


@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrl: './admin-category.component.css',
  
})
export class AdminCategoryComponent {
  categoriesService: CategoriesService = inject(CategoriesService);
  categories: Category[] | undefined
  displayedColumns: string[] = ['id', 'name', 'type', 'action'];

  ngOnInit(){
    this.categoriesService.getAllCategories().then(res => {
      this.categories = res;
    })
  }

  edit(id:string){
    console.log("edit: " + id);
  }

  delete(id:string){
    console.log("delete: " + id);
  }

}
