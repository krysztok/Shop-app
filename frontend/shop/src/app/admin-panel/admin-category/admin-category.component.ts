import { Component, inject } from '@angular/core';
import { CategoriesService } from '../../categories-bar/categories.service';
import { Category } from '../../categories-bar/category';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { Sort } from '@angular/material/sort';


@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrl: './admin-category.component.css',

})
export class AdminCategoryComponent {

  categoriesService: CategoriesService = inject(CategoriesService);
  categories: Category[] | undefined
  sortedData: Category[] | undefined
  displayedColumns: string[] = ['id', 'name', 'type', 'action'];

  dataSource = new MatTableDataSource<Category>();

  ngOnInit() {
    this.categoriesService.getAllCategories().then(res => {
      this.categories = res;
      this.sortedData = res;
    })
  }

  edit(id: string) {
    console.log("edit: " + id);
  }

  delete(id: string) {
    console.log("delete: " + id);
  }

  sortData(sort: Sort) {
    if(!this.categories){
      return;
    }

    if (!sort.active || sort.direction === '') {
      this.sortedData = this.categories;
      return;
    }

    const data = this.categories.slice();

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return this.compareIds(a._id, b._id, isAsc);
        case 'name':
          return this.compare(a.label, b.label, isAsc);
        case 'type':
          return this.compare(a.type, b.type, isAsc);
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
