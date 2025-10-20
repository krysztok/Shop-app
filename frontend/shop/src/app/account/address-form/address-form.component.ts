import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Address } from '../address';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.css'
})
export class AddressFormComponent {
  addressForm!: FormGroup;
  @Output() formEmitter: EventEmitter<FormGroup | null> = new EventEmitter<FormGroup | null>();

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.addressForm = this.fb.group({
      city: new FormControl('', { validators: [Validators.required, Validators.maxLength(40), Validators.pattern("^[a-zA-Z \\-]+$")] }),
      street: new FormControl('', { validators: [Validators.required, Validators.maxLength(60), Validators.pattern("^[a-zA-Z \\-]+$")] }),
      number: new FormControl('', { validators: [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9a-zA-Z \\-\\\\/]+$")] }),
    })

  }

  getValue(): Address | null {
    if (this.isValid()) {
      let address: Address = {
        city: this.addressForm.get("city")?.value,
        street: this.addressForm.get("street")?.value,
        number: this.addressForm.get("number")?.value,
      }

      return address
    }

    return null;
  }

  isValid() {
    return this.addressForm.valid;
  }
}
