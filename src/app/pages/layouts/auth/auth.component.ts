import { Component, OnInit } from '@angular/core';
import { LoginService } from '../guards/login.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  providers: [MessageService, ConfirmationService]
  
})
export class AuthComponent implements OnInit {
  
  loginForm: FormGroup;
  invalidLogin: boolean;
  
  /**
  *
  */
  constructor(
    private service: LoginService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    
    ) {
      
    }
    ngOnInit(): void {
      this.loginForm = new FormGroup({
        user: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
      });
    }
    
    connect() {
      if (this.loginForm.valid) {
        this.login();
      } else {
        this.validateAllFields(this.loginForm);
      }
    }
    
    login() {
      const request = {
        UserName: this.userValue.value,
        Password: this.passwordValue.value,
      }
      this.service.post(request).subscribe(
        (response: any) => {
          
        },
        err => {
          if (err.status == 200) {
            const token = err;
            localStorage.setItem("jwt", token.error.text);
            this.router.navigateByUrl('/admin/dashboard')
            this.invalidLogin = false;
          } else if (err.status == 400) {
            this.messageService.add({ severity: 'error', summary: 'Login', detail: 'Incorrect username or password.', life: 3000 });
          } else if (err.status == 401) {
            this.messageService.add({ severity: 'error', summary: 'Login', detail: 'Vous n’êtes pas autorisé !', life: 3000 });
          } else if (err.status == 500) {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Le serveur est éteint', life: 3000 });
          } else {
            console.log(err);
          }
        }
        );
      }
      
      
      get userValue() {
        return this.loginForm.get("user")
      }
      get passwordValue() {
        return this.loginForm.get("password")
      }
      
      private validateAllFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach((field) => {
          const control = formGroup.get(field)
          
          if (control instanceof FormControl) {
            control.markAsDirty({ onlySelf: true })
          } else if (control instanceof FormGroup) {
            this.validateAllFields(control)
          }
        })
      }
    }
    