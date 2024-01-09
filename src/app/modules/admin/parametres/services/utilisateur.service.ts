import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  baseApiUrl: string = environment.baseApiUrl;
  
  private headers = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
  };
  
  constructor(private http: HttpClient) { }
  
  getAll(id:any){
    return this.http.get(this.baseApiUrl + 'api/Utilisateur/all/'+id);
  }
  
  add(entity: any){
    return this.http.post(this.baseApiUrl + 'api/Utilisateur', entity, this.headers);
  }
  
  get(id: string){
    return this.http.get(this.baseApiUrl + 'api/Utilisateur/' + id);
  }
  
  update(id: any, entity: any)
  {
    return this.http.put(this.baseApiUrl + 'api/Utilisateur/' + id, entity);
  }
  
  delete(id?: string){
    return this.http.delete(this.baseApiUrl +'api/Utilisateur/' + id);
  }
  
  activate(id?: string, entity?: any) {
    return this.http.put(this.baseApiUrl + 'api/Login/active/' + id, entity);
  }
  
}
