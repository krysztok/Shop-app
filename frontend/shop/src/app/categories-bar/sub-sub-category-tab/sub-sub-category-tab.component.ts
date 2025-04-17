import { Component, Input } from '@angular/core';
import { Category } from '../category';

@Component({
  selector: 'app-sub-sub-category-tab',
  templateUrl: './sub-sub-category-tab.component.html',
  styleUrl: './sub-sub-category-tab.component.css'
})
export class SubSubCategoryTabComponent {

  @Input() category!: Category;


}
