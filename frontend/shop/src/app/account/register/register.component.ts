import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ClientsService } from '../clients.service';
import { AddressFormComponent } from '../address-form/address-form.component';
import { ClientDataFormComponent } from '../client-data-form/client-data-form.component';
import { Router } from '@angular/router';
import { ClientCreateDTO } from './clientCreateDTO';
import { ClientData } from '../clientData';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent?.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  @ViewChild('addressForm') addressForm!: AddressFormComponent;
  @ViewChild('clientDataForm') clientDataForm!: ClientDataFormComponent;

  registerForm!: FormGroup;

  matcher = new MyErrorStateMatcher();

  constructor(private fb: FormBuilder, private clientsService: ClientsService, private router: Router) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      password: new FormControl('', { validators: [Validators.required] }),
      cPassword: new FormControl('', { validators: [Validators.required] }),
    }, { validators: this.checkPasswords })
  }

  checkPasswords(group: FormGroup) {
    let pass = group.controls['password'].value;
    let confirmPass = group.controls['cPassword'].value;

    return pass === confirmPass ? null : { notSame: true }
  }

  register() {
    if (this.addressForm.isValid() && this.clientDataForm.isValid() && this.registerForm.valid) {
      let address = this.addressForm.getValue();
      let clientFormData = this.clientDataForm.getValue();

      if (address != null && clientFormData != null) {
        let clientData: ClientData = {
          name: clientFormData.name,
          surname: clientFormData.surname,
          email: clientFormData.email,
          phoneNumber: clientFormData.phoneNumber,
          address: address,
          idC: -1,
          active: true
        }

        let clientCreateDTO: ClientCreateDTO = {
          clientData: clientData,
          password: this.registerForm.get('password')?.value
        };

        this.clientsService.createClient(clientCreateDTO).then((res) => {
          this.router.navigate(['/login'])
        }).catch((error) => {
          let message: string = error.error.message;
          if (message && message.includes("problem: ")) {
            message = message.split("problem: ")[1]
          }
          console.log(message)
          alert(message)
        });
      }
    } else {
      this.addressForm.mark()
      this.clientDataForm.mark()
    }
  }

  login() {
    this.router.navigate(['login'], {});
  }
}
