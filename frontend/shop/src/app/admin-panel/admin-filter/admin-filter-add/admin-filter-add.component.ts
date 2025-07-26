import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Category } from '../../../categories-bar/category';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FilterCreateDTO } from './filterCreateDTO';
import { FiltersService } from '../../../products/filters/filters.service';

@Component({
  selector: 'app-admin-filter-add',
  templateUrl: './admin-filter-add.component.html',
  styleUrl: './admin-filter-add.component.css'
})
export class AdminFilterAddComponent {

  @ViewChild('afa') dialog!: ElementRef;
  @Input() categories!: Category[] | undefined;

  filterForm!: FormGroup;
  filterTypes: string[] = ['string', 'boolean', 'int'];
  subSubCategories: Category[] = [];


  constructor(private fb: FormBuilder, private filterService: FiltersService) { }

  ngOnInit() {
    this.filterForm = this.fb.group({
      categoryId: new FormControl(''),
      name: new FormControl(''),
      type: new FormControl(''),
    })

  }

  addFilter() {
    let cFilterDto: FilterCreateDTO = {
      name: this.filterForm.get("name")?.value,
      categoryId: this.filterForm.get("categoryId")?.value,
      type: this.filterForm.get("type")?.value
    }

    this.filterService.createFilter(cFilterDto);
  }


  show() {
    this.dialog.nativeElement.show();

    if (this.categories && this.subSubCategories.length == 0) {
      for (let i = 0; i < this.categories.length; i++) {
        if (this.categories[i].type === "subSubCategory") {
          this.subSubCategories.push(this.categories[i]);
        }
      }
    }
  }

  close() {
    this.dialog.nativeElement.close();
  }


}
