import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Category } from '../../../categories-bar/category';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  @Output() refreshList: EventEmitter<string> = new EventEmitter<string>();


  constructor(private fb: FormBuilder, private filterService: FiltersService) { }

  ngOnInit() {
    this.filterForm = this.fb.group({
      categoryId: new FormControl('', { validators: [Validators.required] }),
      name: new FormControl('', { validators: [Validators.required, Validators.maxLength(40), Validators.pattern("^[0-9a-zA-Z!-\\\\ \\\\/:-@\\[-_\\]]+$")] }),
      type: new FormControl('', { validators: [Validators.required] }),
    })

  }

  addFilter() {
    if (!this.filterForm.valid) {
      return;
    }

    let cFilterDto: FilterCreateDTO = {
      name: this.filterForm.get("name")?.value,
      categoryId: this.filterForm.get("categoryId")?.value,
      type: this.filterForm.get("type")?.value
    }

    this.filterService.createFilter(cFilterDto).then(data => {
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
