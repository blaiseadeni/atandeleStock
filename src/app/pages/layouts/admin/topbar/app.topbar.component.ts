import { Component, OnInit } from '@angular/core';
import { AppComponent} from '../../../../app.component';
import { AdminComponent } from '../admin.component';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { LoginService } from '../../guards/login.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  providers: [MessageService, ConfirmationService]
})
export class AppTopBarComponent  implements OnInit{
  
  utilisateur: any;
  utilisateurId: any;
  login: any = {};
  
  loginDialog: boolean = false;
  loginForm: FormGroup;
  
  constructor(
    public app: AppComponent,
    public appMain: AdminComponent,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private service: LoginService,
    private fb: FormBuilder,
    private messageService: MessageService,
    ) { }
    
    ngOnInit(): void {
      this.loginForm = new FormGroup({
        userName: new FormControl({value:'',disabled:true}, Validators.required),
        password: new FormControl('', Validators.required),
        newPassword: new FormControl('', Validators.required),
      });  
      
      
      const token = localStorage.getItem('jwt');
      const decodeJWT = this.jwtHelper.decodeToken(token);
      this.utilisateur = decodeJWT.name;
      this.utilisateurId = decodeJWT.utilisateurId;
    }
    
    logOut() {
      this.router.navigateByUrl('/login')
      localStorage.removeItem("jwt");
      
    }
    
    reset() {
      this.loginForm = this.fb.group({
        userName: {value:'',disabled:true},
        password: [],
        newPassword: [],
      });
      this.login = {};
    }
    
    find(id:any):any {
      this.service.get(id)
      .subscribe({
        next: (response) => {
          this.login = response;
          this.loginForm.get("userName")?.patchValue(this.login.utilisateur);
        },
        error: (response) => {
          console.log(response);
        }
      })
    }
    
    save() {
      if (this.loginForm.valid) {
        if (this.passwordValue.value != this.newPasswordValue.value) {
          this.messageService.add({ severity: 'error', summary: 'Avertissement', detail: 'Les deux mots de passe ne correspondent pas !', life: 3000 });
        } else {
          this.update();
        }
      } else {
        this.validateAllFields(this.loginForm)
      }
    }
    update() {
      const request = {
        userName: this.userNameValue.value,
        password: this.passwordValue.value,
      }
      
      this.service.update(this.utilisateurId, request)
      .subscribe({
        next: (response) => {
          this.reset();
          this.fermerDialog()
        },
        complete: () => {
          this.messageService.add({ severity: 'success', summary: 'Modification', detail: ' Modifier avec succès', life: 3000 });
          this.reset();
          this.fermerDialog();
        },
        error: (e) => {
          this.messageService.add({ severity: 'success', summary: 'Modification', detail: 'Modifier avec succès', life: 3000 });
          this.reset();
          this.fermerDialog();
        }
      })
    }
    
    
    ouvrirDialog() {
      this.loginDialog = true;
      this.find(this.utilisateurId);
    }
    
    fermerDialog() {
      this.loginDialog = false;
    }
    
    get userNameValue(){
      return this.loginForm.get("userName")
    }
    
    get passwordValue(){
      return this.loginForm.get("password")
    }
    
    get newPasswordValue(){
      return this.loginForm.get("newPassword")
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
  