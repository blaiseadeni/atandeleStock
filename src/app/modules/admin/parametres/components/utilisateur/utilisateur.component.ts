import { Component } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilisateurService } from '../../services/utilisateur.service';
import { RoleService } from '../../services/role.service';
import { LocationService } from '../../../fichiers/services/location.service';
import { JwtHelperService } from '@auth0/angular-jwt';


@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.component.html',
  styleUrls: ['./utilisateur.component.scss'],
  providers: [MessageService, ConfirmationService]
  
})
export class UtilisateurComponent {
  
  cols: any = [];
  rowsPerPageOptions = [5, 10, 20];
  deleteDialog: boolean = false;
  
  utilisateur: any = {};
  utilisateurs: any = [];
  locations: any = [];
  
  role: any = {};
  roles: any = [];
  roleDialog: boolean = false;
  roleForm: FormGroup;
  
  utilisateurDialog: boolean = false;
  utilisateurForm: FormGroup;
  
  locationId: any;
  
  constructor(
    private service: UtilisateurService,
    private roleService: RoleService,
    private locationService: LocationService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private jwtHelper:JwtHelperService
    ) { }
    
    ngOnInit(): void {
      this.utilisateurForm = new FormGroup({
        nom: new FormControl('', Validators.required),
        postnom: new FormControl('', Validators.required),
        utilisateur: new FormControl('', Validators.required),
        locationId: new FormControl('',Validators.required),
        roleId:  new FormControl('',Validators.required),
      });
      
      this.roleForm = new FormGroup({
        libelle: new FormControl('', Validators.required),
      });
      
      const token = localStorage.getItem('jwt');
      const decodeJWT = this.jwtHelper.decodeToken(token);
      this.locationId = decodeJWT.locationId;
      
      this.getAll();
      this.getAllLocations();
      this.getAllRoles();
    }
    
    getAll() {
      this.service.getAll(this.locationId)
      .subscribe({
        next: (response) => {
          this.utilisateurs = response;
          console.log(this.utilisateurs);
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    getAllRoles() {
      this.roleService.getAll(this.locationId)
      .subscribe({
        next: (response) => {
          this.roles = response;
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    getAllLocations() {
      this.locationService.getAll()
      .subscribe({
        next: (response) => {
          this.locations = response;
        },
        error: (errors) => {
          console.log(errors);
        }
      });
    }
    
    save() {
      if (this.utilisateurForm.valid)
      {
        if(this.utilisateur.id){
          this.update();
          this.utilisateurDialog = false;
        }else{
          this.add();
          this.utilisateurDialog = false;
        }
      } else {
        this.validateAllFields(this.utilisateurForm);
      }
      
    }
    
    saveRole() {
      if (this.roleForm.valid)
      {
        if(this.role.id){
          this.updateRole();
          this.roleDialog = false;
        }else{
          this.addRole();
          this.roleDialog = false;
          
        }
      } else {
        this.validateAllFields(this.roleForm);
      }
      
    }
    
    add() {
      const request = {
        nom: this.nomValue.value,
        postnom: this.postnomValue.value,
        utilisateur: this.utilisateurValue.value,
        locationId: this.locationIdValue.value.id,
        roleId: this.roleIdValue.value.id,
        
      }
      console.log(request);
      this.service.add(request)
      .subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Enregistrement', detail: ' Enregistrer avec succès', life: 3000 });
          this.getAll();
          this.reset();
        },
        complete: () => {
          this.messageService.add({ severity: 'success', summary: 'Enregistrement', detail: ' Enregistrer avec succès', life: 3000 });
          this.getAll();
          this.reset();
        },
        error: (e) => {
          this.messageService.add({ severity: 'success', summary: 'Enregistrement', detail: 'Enregistrer avec succès', life: 3000 });
          this.getAll();
          this.reset();
        }
      });
    }
    
    addRole() {
      const request = {
        libelle: this.libelleRoleValue.value,
        locationId:this.locationId
      }
      // console.log(request);
      this.roleService.add(request)
      .subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Enregistrement', detail: ' Enregistrer avec succès', life: 3000 });
          this.getAllRoles();
          this.resetRole();
          window.location.reload();
        },
        complete: () => {
          this.messageService.add({ severity: 'success', summary: 'Enregistrement', detail: ' Enregistrer avec succès', life: 3000 });
          this.getAllRoles();
          this.resetRole();
          window.location.reload();
        },
        error: (e) => {
          this.messageService.add({ severity: 'success', summary: 'Enregistrement', detail: 'Enregistrer avec succès', life: 3000 });
          this.getAllRoles();
          this.resetRole();
          window.location.reload();
        }
      });
    }
    
    update() {
      const request = {
        nom: this.nomValue.value,
        postnom: this.postnomValue.value,
        utilisateur: this.utilisateurValue.value,
        locationId: this.locationIdValue.value.id,
        roleId: this.roleIdValue.value.id,
        
      }
      
      this.service.update(this.utilisateur.id, request)
      .subscribe({
        next: (response) => {
          this.getAllRoles();
          this.resetRole();
        },
        complete: () => {
          this.messageService.add({ severity: 'success', summary: 'Modification', detail: ' Modifier avec succès', life: 3000 });
          this.getAllRoles();
          this.resetRole();
        },
        error: (e) => {
          this.messageService.add({ severity: 'success', summary: 'Modification', detail: 'Modifier avec succès', life: 3000 });
          this.getAllRoles();
          this.resetRole();
        }
      })
    }
    
    updateRole() {
      const request = {
        libelle: this.libelleRoleValue.value,
        
      }
      
      this.roleService.update(this.role.id, request)
      .subscribe({
        next: (response) => {
          this.getAllRoles();
          this.resetRole();
        },
        complete: () => {
          this.messageService.add({ severity: 'success', summary: 'Modification', detail: ' Modifier avec succès', life: 3000 });
          this.getAllRoles();
          this.resetRole();
        },
        error: (e) => {
          this.messageService.add({ severity: 'success', summary: 'Modification', detail: 'Modifier avec succès', life: 3000 });
          this.getAllRoles();
          this.resetRole();
        }
      })
    }
    
    active(event: any,index:any) {
      const request = {
        state: event.checked
      }
      const id = this.utilisateurs[index].id
      
      this.service.activate(id, request)
      .subscribe({
        next: (response) => {
          
        },
        complete: () => {
          if (request.state === true) {
            this.messageService.add({ severity: 'success', summary: 'Activation', detail: ' Compte activer avec succès', life: 3000 });
            
          } else {
            this.messageService.add({ severity: 'error', summary: 'Desactivation', detail: ' Compte desactiver avec succès', life: 3000 });
          }
        },
        error: (e) => {
          if (request.state === true) {
            this.messageService.add({ severity: 'success', summary: 'Activation', detail: ' Compte activer avec succès', life: 3000 });
            
          } else {
            this.messageService.add({ severity: 'error', summary: 'Desactivation', detail: ' Compte desactiver avec succès', life: 3000 });
          }
        }
      })
      
    }
    
    delete(id: any) {
      this.service.delete(id)
      .subscribe({
        next: (response) => {
          this.reset();
        },
        complete: () => {
          this.messageService.add({ severity: 'success', summary: 'Reussi', detail: ' Supprimer avec succès', life: 3000 });
          this.getAll();
          this.deleteDialog = false;
          this.reset();
        },
        error: (e) => {
          this.messageService.add({ severity: 'success', summary: 'Reussi', detail: 'Supprimer avec succès', life: 3000 });
          this.getAll();
          this.deleteDialog = false;
          this.reset();
        }
      });
    }
    
    find(id:any):any {
      this.service.get(id)
      .subscribe({
        next: (response) => {
          this.utilisateur = response;
          this.utilisateurForm.get("nom")?.patchValue(this.utilisateur.nom);
          this.utilisateurForm.get("postnom")?.patchValue(this.utilisateur.postnom);
          this.utilisateurForm.get("utilisateur")?.patchValue(this.utilisateur.utilisateur);
          this.utilisateurForm.get("locationId")?.patchValue(this.utilisateur.locationId);
          this.utilisateurForm.get("roleId")?.patchValue(this.utilisateur.roleId);
        },
        error: (response) => {
          console.log(response);
        }
      })
    }
    
    findRole(id:any):any {
      this.service.get(id)
      .subscribe({
        next: (response) => {
          this.role = response;
          this.roleForm.get("libelle")?.patchValue(this.role.libelle);
        },
        error: (response) => {
          console.log(response);
        }
      })
    }
    
    reset() {
      this.utilisateurForm = this.fb.group({
        nom: [],
        postnom: [],
        utilisateur: [],
        locationId: [],
        roleId: [],
      });
      this.utilisateur = {};
    }
    
    resetRole() {
      this.utilisateurForm = this.fb.group({
        libelle: [],
      });
      this.role = {};
    }
    
    deleteSelected(id: any) {
      this.service.get(id)
      .subscribe({
        next: (response) => {
          this.utilisateur = response;
          this.deleteDialog = true;
        },
        error: (response) => {
          console.log(response);
        }
      })
    }
    
    hideSelect() {
      this.deleteDialog = false;
      this.reset();
    }
    ouvrirDialog() {
      this.utilisateurDialog = true;
    }
    
    fermerDialog() {
      this.utilisateurDialog = false;
    }
    
    ouvrirDialogRole() {
      this.roleDialog = true;
    }
    
    fermerDialogRole() {
      this.roleDialog = false;
    }
    
    get nomValue(){
      return this.utilisateurForm.get("nom")
    }
    
    get postnomValue(){
      return this.utilisateurForm.get("postnom")
    }
    
    get utilisateurValue(){
      return this.utilisateurForm.get("utilisateur")
    }
    
    get locationIdValue(){
      return this.utilisateurForm.get("locationId")
    }
    
    get roleIdValue(){
      return this.utilisateurForm.get("roleId")
    }
    
    get libelleRoleValue(){
      return this.roleForm.get("libelle")
    }
    
    onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
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
  