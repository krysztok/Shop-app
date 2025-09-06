import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Category } from '../../../categories-bar/category';
import { Product } from '../../../products/product';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { MatSelect } from '@angular/material/select';
import { ProductsService } from '../../../products/products.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-product-edit',
  templateUrl: './admin-product-edit.component.html',
  styleUrl: './admin-product-edit.component.css'
})
export class AdminProductEditComponent {

  @ViewChild('ape') dialog!: ElementRef;
  @ViewChild(MatTable) table!: MatTable<any>

  @ViewChild('addParamName') addParamName!: ElementRef;
  @ViewChild('addParamType') addParamType!: MatSelect;
  @ViewChild('addParamValueText') addParamValueText!: ElementRef;
  @ViewChild('addParamValueNumber') addParamValueNumber!: ElementRef;
  @ViewChild('addParamValueBoolean') addParamValueBoolean!: MatSelect;

  @Input() categories!: Category[] | undefined;
  @Input() products!: Product[] | undefined;

  @Output() refreshList: EventEmitter<string> = new EventEmitter<string>();

  displayedColumns: string[] = ['name', 'type', 'value', 'action'];
  subSubCategories: Category[] = [];

  //product!: Product
  edit!: boolean
  productForm!: FormGroup;
  paramTypes: string[] = ['string', 'boolean', 'number'];
  booleanValues = [true, false]

  constructor(private fb: FormBuilder, private productService: ProductsService) { }

  ngOnInit() {
    this.productForm = this.fb.group({
      productId: new FormControl(''),
      categoryId: new FormControl(''),
      name: new FormControl('', { validators: [Validators.required, Validators.maxLength(40), Validators.pattern("^[0-9a-zA-Z ]+$")] }),
      price: new FormControl('', { validators: [Validators.required, Validators.min(0.01)] }),
      description: new FormControl('', { validators: [Validators.required, Validators.maxLength(2000), Validators.pattern("^[0-9a-zA-Z!-\\\\ \\\\/:-@\\[-_\\]]+$")] }),
      params: this.fb.array([this.addParamsControl('', '', '')]),
    })

  }

  addParamsControl(name: string, value: (string | boolean | number), type: string) {
    return this.fb.group({
      paramName: [name, { validators: [Validators.required, Validators.maxLength(40), Validators.pattern("^[0-9a-zA-Z!-\\\\ \\\\/:-@\\[-_\\]]+$")] }],
      paramValue: [value, { validators: [Validators.required, Validators.maxLength(20), Validators.pattern("^[0-9a-zA-Z!-\\\\ \\\\/:-@\\[-_\\]]+$"), Validators.min(0)] }],
      paramType: [type, { validators: [Validators.required] }]
    });
  }

  close() {
    this.dialog.nativeElement.close();
  }

  show(edit: boolean, product?: Product) {
    this.edit = edit;
    if (product && edit) {
      //this.product = product;
      this.productForm.patchValue({
        productId: product._id,
        name: product.name,
        categoryId: product.categoryId,
        price: product.price,
        description: product.description,
        params: []
      })
    } else {
      this.productForm.patchValue({
        productId: null,
        name: null,
        categoryId: null,
        price: null,
        description: null,
        params: []
      })
    }

    if (this.params) {
      this.params.clear();
    }


    if (this.categories && this.subSubCategories.length == 0) {
      for (let i = 0; i < this.categories.length; i++) {
        if (this.categories[i].type === "subSubCategory") {
          this.subSubCategories.push(this.categories[i]);
        }
      }
    }


    if (product && product.params) {
      for (let [k, v] of Object.entries(product.params)) { //Ts sometimes thinks it isnt map?
        let type = typeof (v)

        this.params.push(this.addParamsControl(k, v, type))
      }
    }

    this.renderTable();
    this.dialog.nativeElement.show();
  }

  saveProduct() {
    if (!this.productForm.valid) {
      return;
    }

    let p: Map<string, any> = new Map<string, any>();

    for (let i = 0; i < this.params.length; i++) {
      let name = this.params.at(i).get('paramName')?.value;
      let value = this.params.at(i).get('paramValue')?.value;
      if (this.params.at(i).get('paramType')?.value == 'number') {
        p.set(name, Number(value));
      } else {
        p.set(name, value);
      }
    }

    const convMap = Object.create(null);
    p.forEach((val: any, key: string) => {
      convMap[key] = val;
    });


    if (this.edit) { //could be replaced by productDTO
      this.productService.editProduct(this.productForm.get('name')?.value,
        this.productForm.get('productId')?.value,
        this.productForm.get('description')?.value,
        this.productForm.get('price')?.value,
        this.productForm.get('categoryId')?.value,
        convMap
      ).then(data => {
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
    } else {
      this.productService.createProduct(this.productForm.get('name')?.value,
        this.productForm.get('description')?.value,
        this.productForm.get('price')?.value,
        this.productForm.get('categoryId')?.value,
        convMap
      ).then(data => {
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

  get params() {
    return this.productForm.get('params') as FormArray;
  }

  removeParam(index: number) {
    this.params.removeAt(index)
    this.renderTable();
  }

  renderTable() { //force render on content change
    if (this.table) {
      this.table.renderRows()
    }
  }

  paramTypeChanged(index: number) {
    this.params.at(index).get('paramValue')?.setValue(null)
  }


  addParam() {
    let name = this.addParamName.nativeElement.value;

    if (name == "") {
      console.log("no param name")
      return;
    }

    for (let i = 0; i < this.params.length; i++) {
      if (this.params.at(i).get('paramName')?.value == name) {
        console.log("param name already exists")
        return;
      }
    }

    switch (this.addParamType.value) {
      case 'string': {
        let value = this.addParamValueText.nativeElement.value;

        if (value == "") {
          console.log("no value")
          return
        }

        this.params.push(this.addParamsControl(name, value, this.addParamType.value))

        break;
      }
      case 'number': {
        let value: number = this.addParamValueNumber.nativeElement.value;

        if (value.toString() == "") {
          console.log("no value")
          return
        }

        this.params.push(this.addParamsControl(name, value, this.addParamType.value))

        break;
      }
      case 'boolean': {
        let value = this.addParamValueBoolean.value;

        if (value == undefined) {
          console.log("no value")
          return
        }

        this.params.push(this.addParamsControl(name, value, this.addParamType.value))

        break;
      }
      default: {
        console.log("no param type")
        return;
      }
    }

    this.clearAddParams();
    this.renderTable();
  }

  clearAddParams() {
    this.addParamName.nativeElement.value = ""
    this.addParamType.value = undefined;
  }



}
