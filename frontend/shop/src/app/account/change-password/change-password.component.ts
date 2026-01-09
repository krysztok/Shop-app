import { Component, ElementRef, ViewChild } from '@angular/core';
import { MyErrorStateMatcher } from '../register/register.component';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ClientsService } from '../clients.service';
import { ChangePasswordDTO } from './changePasswordDTO';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  @ViewChild('acp') dialog!: ElementRef;

  changePasswordForm!: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(private fb: FormBuilder, private clientsService: ClientsService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.changePasswordForm = this.fb.group({
      oldPassword: new FormControl('', { validators: [Validators.required] }),
      password: new FormControl('', { validators: [Validators.required] }),
      cPassword: new FormControl('', { validators: [Validators.required] }),
    }, { validators: this.checkPasswords })
  }

  checkPasswords(group: FormGroup) {
    let pass = group.controls['password'].value;
    let confirmPass = group.controls['cPassword'].value;

    return pass === confirmPass ? null : { notSame: true }
  }

  changePassword() {
    if (this.changePasswordForm.valid) {
      let password = this.changePasswordForm.controls['password'].value;


      let changePasswordDTO: ChangePasswordDTO = {
        oldPassword: this.changePasswordForm.controls['oldPassword'].value,
        newPassword: this.changePasswordForm.controls['password'].value
      }

      this.clientsService.changeMyPassword(changePasswordDTO).then((res) => {
        this.authService.logout();
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
  }

  show() {
    this.changePasswordForm.reset();
    this.dialog.nativeElement.show();
  }

  close() {
    this.dialog.nativeElement.close();
  }
}
