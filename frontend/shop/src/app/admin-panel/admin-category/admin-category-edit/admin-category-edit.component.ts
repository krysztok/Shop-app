import { Component, ElementRef, input, Input, ViewChild } from '@angular/core';
import { Category } from '../../../categories-bar/category';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { MatSelect } from '@angular/material/select';
import { CategoriesService } from '../../../categories-bar/categories.service';

@Component({
  selector: 'app-admin-category-edit',
  templateUrl: './admin-category-edit.component.html',
  styleUrl: './admin-category-edit.component.css'
})
export class AdminCategoryEditComponent {


  @ViewChild('ace') dialog!: ElementRef;
  @ViewChild(MatTable) table!: MatTable<any>
  @ViewChild('addItemSelect') addItemSelect!: MatSelect;

  @Input() categories!: Category[];

  // category!: Category
  edit!: boolean
  categoryType!: string
  categoryTypes: string[] = ["category", "subCategory", "subSubCategory"]
  categoryForm!: FormGroup;
  possibleItems!: any[];
  subCategories: Category[] = [];
  mainCategories: Category[] = [];

  displayedColumns: string[] = ['id', 'name', 'action'];

  constructor(private fb: FormBuilder, private categoriesService: CategoriesService) { }

  ngOnInit() {
    this.categoryForm = this.fb.group({
      categoryId: new FormControl(''),
      label: new FormControl(''),
      type: new FormControl(''),
      parentId: new FormControl(''),
      items: this.fb.array([this.addItemControl()]),
    })

  }

  addItemControl() {
    return this.fb.group({ _id: [''], _label: [''] });
  }

  show(edit: boolean, category?: Category) {
    this.edit = edit;
    //this.category = category;
    if (category && edit) {
      this.categoryType = category.type;
      this.categoryForm.patchValue({
        categoryId: category._id,
        label: category.label,
        type: category.type,
        parentId: category.parentId,
        items: []
      })
    } else {
      this.categoryForm.patchValue({
        categoryId: null,
        label: null,
        type: null,
        parentId: null,
        items: []
      })
    }


    this.items.clear();

    // while(this.items.length !== 0) {
    //   console.log("??")
    //   this.items.removeAt(0);
    // }

    if (category && category.items) {
      category.items.map(
        (item) => {
          const itemForm = this.fb.group({
            _id: item,
            _label: this.getCategoryName(item)
          });

          this.items.push(itemForm);
        }
      );
    }

    this.setPossibleParentCategories();
    this.setPossibleItems();
    this.renderTable();
    this.dialog.nativeElement.show();
  }

  saveCategory() {
    if (this.edit) {
      console.log("edit")
    } else {
      this.categoriesService.createCategory(this.categoryForm.get('label')?.value,
        this.categoryForm.get('type')?.value,
        this.categoryForm.get('parentId')?.value
      )
    }

  }

  get items() {
    return this.categoryForm.get('items') as FormArray;
  }

  getCategoryName(_id: string) {
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i]._id === _id) {
        return this.categories[i].label;
      }
    }
    return ""
  }

  removeItem(index: number) {
    let item = this.items.at(index).value
    this.possibleItems.push(item)

    this.items.removeAt(index)
    this.renderTable();
  }

  renderTable() { //force render on content change
    if (this.table) {
      this.table.renderRows()
    }
  }

  setPossibleItems() {
    this.possibleItems = [];
    if (this.categoryType == "subSubCategory") {
      return;
    }

    let type: string = this.categoryType == "category" ? "subCategory" : "subSubCategory";
    for (let i = 0; i < this.categories.length; i++) {
      let cat = this.categories[i]
      if (cat.type == type && cat.parentId == null) {
        this.possibleItems.push({
          _id: cat._id,
          _label: cat.label
        })
      }
    }
  }

  setPossibleParentCategories() {
    this.mainCategories = [];
    this.subCategories = [];
    for (let i = 0; i < this.categories.length; i++) {
      switch (this.categories[i].type) {
        case "category": {
          this.mainCategories.push(this.categories[i])
          break;
        }
        case "subCategory": {
          this.subCategories.push(this.categories[i])
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  removeParentCategory() {
    if (!this.edit)
      this.categoryForm.controls['parentId'].setValue(null);
  }

  addItem() {
    if (this.addItemSelect.value == undefined) {
      return
    }

    let index = this.addItemSelect.value

    const itemForm = this.fb.group({
      _id: this.possibleItems[index]._id,
      _label: this.possibleItems[index]._label
    });

    this.items.push(itemForm);
    this.possibleItems.splice(index, 1);
    this.renderTable()
  }

}
