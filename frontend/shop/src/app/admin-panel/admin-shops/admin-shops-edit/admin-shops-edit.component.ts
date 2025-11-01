import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ShopsService } from '../../../contact/shops.service';
import { Shop } from '../../../contact/shop';
import { AddressFormComponent } from '../../../account/address-form/address-form.component';
import { Address } from '../../../account/address';
import { Coords } from '../../../contact/coords';
import { MatTable } from '@angular/material/table';
import { Time } from '@angular/common';
import { ShopHours } from '../../../contact/shopHours';

@Component({
  selector: 'app-admin-shops-edit',
  templateUrl: './admin-shops-edit.component.html',
  styleUrl: './admin-shops-edit.component.css'
})
export class AdminShopsEditComponent {

  @ViewChild('ase') dialog!: ElementRef;
  @ViewChild('addressForm') addressForm!: AddressFormComponent;
  @ViewChild(MatTable) table!: MatTable<any>

  @Output() refreshList: EventEmitter<string> = new EventEmitter<string>();
  shopForm!: FormGroup;
  edit!: boolean

  displayedColumns: string[] = ['day', 'openFrom', 'openTo', 'action'];
  days: string[] = ['Monday', "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  constructor(private fb: FormBuilder, private shopService: ShopsService) { }

  ngOnInit() {
    this.shopForm = this.fb.group({
      shopId: new FormControl(''),
      name: new FormControl('', { validators: [Validators.required, Validators.maxLength(40), Validators.pattern("^[0-9a-zA-Z ]+$")] }),
      email: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(60),
        Validators.pattern("^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$")]
      }), //https://www.baeldung.com/java-email-validation-regex
      phoneNumber: new FormControl('', { validators: [Validators.required, Validators.maxLength(40), Validators.pattern("^(\\+)?[0-9 \\-]+$")] }),
      lat: new FormControl('', { validators: [Validators.required, Validators.min(-90), Validators.max(90)] }),
      long: new FormControl('', { validators: [Validators.required, Validators.min(-180), Validators.max(180)] }),
      openHours: this.fb.array([this.addOpenHoursControl('', null, null)]),
    })
  }

  addOpenHoursControl(day: string, valueFrom: Time | null, valueTo: Time | null) {
    return this.fb.group({
      day: [day],
      openFrom: [valueFrom],
      openTo: [valueTo]
    });
  }

  get openHours() {
    return this.shopForm.get('openHours') as FormArray;
  }

  close() {
    this.dialog.nativeElement.close();
  }

  show(edit: boolean, shop?: Shop) {
    this.edit = edit;

    if (shop && edit) {
      this.shopForm.patchValue({
        shopId: shop._id,
        name: shop.name,
        email: shop.email,
        phoneNumber: shop.phoneNumber,
        lat: shop.coords.latitude,
        long: shop.coords.longitude,
        openHours: []
      })
      this.addressForm.setValues(shop.address);
    } else {
      this.shopForm.patchValue({
        shopId: null,
        name: null,
        email: null,
        phoneNumber: null,
        lat: null,
        long: null,
        openHours: []
      })
      this.addressForm.clear();
    }

    if (this.openHours) {
      this.openHours.clear();
    }

    for (let i = 0; i < this.days.length; i++) {
      let openHours = shop ? shop.shopHours[i] : null
      if (openHours) {
        this.openHours.push(this.addOpenHoursControl(this.days[i], openHours.from, openHours.to))
      } else {
        this.openHours.push(this.addOpenHoursControl(this.days[i], null, null))
      }
    }

    this.renderTable();
    this.dialog.nativeElement.show();
  }

  clearHours(day: number) {
    this.openHours.controls[day].patchValue({ day: this.days[day], openFrom: null, openTo: null })
    this.renderTable()
  }

  renderTable() { //force render on content change
    if (this.table) {
      this.table.renderRows()
    }
  }

  saveShop() {
    if (!this.shopForm.valid || !this.addressForm.isValid()) {
      return;
    }

    let address: Address = {
      city: '',
      street: '',
      number: ''
    }

    let a = this.addressForm.getValue()
    if (a != null) {
      address = a
    }

    let coords: Coords = {
      latitude: this.shopForm.get("lat")?.value,
      longitude: this.shopForm.get("long")?.value
    }

    let shopHours: ShopHours[] = []

    for (let i = 0; i < this.days.length; i++) {
      let sHours: ShopHours = {
        from: this.openHours.at(i).get('openFrom')?.value,
        to: this.openHours.at(i).get('openTo')?.value
      }

      shopHours.push(sHours);
    }

    let shop: Shop = {
      _id: this.edit ? this.shopForm.get("shopId")?.value : '',
      name: this.shopForm.get("name")?.value,
      address: address,
      coords: coords,
      email: this.shopForm.get("email")?.value,
      phoneNumber: this.shopForm.get("phoneNumber")?.value,
      shopHours: shopHours
    }

    if (this.edit) {
      this.shopService.editShop(shop).then(data => {
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
      this.shopService.createShop(shop).then(data => {
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
}
