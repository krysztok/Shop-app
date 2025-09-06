import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { CategoriesService } from '../../../categories-bar/categories.service';

@Component({
  selector: 'app-admin-category-delete',
  templateUrl: './admin-category-delete.component.html',
  styleUrl: './admin-category-delete.component.css'
})
export class AdminCategoryDeleteComponent {
  @ViewChild('acd') dialog!: ElementRef;
  categoryId!: string;
  categoryName!: string;
  @Output() refreshList: EventEmitter<string> = new EventEmitter<string>();

  constructor(private categoriesService: CategoriesService) { }

  show(categoryId: string, categoryName: string) {
    this.categoryId = categoryId;
    this.categoryName = categoryName;

    this.dialog.nativeElement.show();
  }

  close() {
    this.dialog.nativeElement.close();
  }

  delete() {
    this.categoriesService.deleteCategory(this.categoryId).then(data => {
      this.refreshList.emit("refresh")
      this.close()
    }).catch((error) => {
      let message: string = error.error.message;
      if (message.includes("problem: ")) {
        message = message.split("problem: ")[1]
      }
      console.log(message)
      alert(message)
    });
  }
}
