import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientFormData } from './clientFormData';

@Component({
  selector: 'app-client-data-form',
  templateUrl: './client-data-form.component.html',
  styleUrl: './client-data-form.component.css'
})
export class ClientDataFormComponent {
  clientForm!: FormGroup;
  @Output() formEmitter: EventEmitter<FormGroup | null> = new EventEmitter<FormGroup | null>();

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.clientForm = this.fb.group({
      name: new FormControl('', { validators: [Validators.required, Validators.maxLength(15), Validators.pattern("^[a-zA-Z]+$")] }),
      surname: new FormControl('', { validators: [Validators.required, Validators.maxLength(40), Validators.pattern("^[a-zA-Z \\-]+$")] }),
      email: new FormControl('', { validators: [Validators.required, Validators.maxLength(60), 
        Validators.pattern("^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$")] }), //https://www.baeldung.com/java-email-validation-regex
      phoneNumber: new FormControl('', { validators: [Validators.required, Validators.maxLength(40), Validators.pattern("^(\\+)?[0-9 \\-]+$")] }),
    })

  }

  getValue(): ClientFormData | null {
    if (this.isValid()) {
      let clientFormData: ClientFormData = {
        name: this.clientForm.get("name")?.value,
        surname: this.clientForm.get("surname")?.value,
        email: this.clientForm.get("email")?.value,
        phoneNumber: this.clientForm.get("phoneNumber")?.value,
      }

      return clientFormData
    }

    return null;
  }

  isValid() {
    return this.clientForm.valid;
  }

}
