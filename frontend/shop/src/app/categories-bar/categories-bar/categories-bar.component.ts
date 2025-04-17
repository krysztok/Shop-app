import { Component, inject, Inject } from '@angular/core';
import { MegaMenuItem } from 'primeng/api';
import { CategoriesService } from '../categories.service';

@Component({
  selector: 'app-categories-bar',
  templateUrl: './categories-bar.component.html',
  styleUrl: './categories-bar.component.css'
})
export class CategoriesBarComponent {

  items: MegaMenuItem[] = [];
  categoriesService = inject(CategoriesService);

  ngOnInit(): void { 
      
      this.categoriesService.getCategories().then(result => 
        {
          this.items = result
        }
      )

  } 

}
