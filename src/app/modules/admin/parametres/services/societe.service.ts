import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocieteService {
  baseApiUrl: string = environment.baseApiUrl;
  
  private headers = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
  };
  
  constructor(private http: HttpClient) { }
  
  getAll(){
    return this.http.get(this.baseApiUrl + 'api/ParametreSociete');
  }
  
  add(societe: any){
    return this.http.post(this.baseApiUrl + 'api/ParametreSociete', societe, this.headers);
  }
  
  get(id: string){
    return this.http.get(this.baseApiUrl + 'api/ParametreSociete/' + id);
  }
  
  update(id: any, societe: any)
  {
    return this.http.put(this.baseApiUrl + 'api/ParametreSociete/' + id, societe);
  }
  
  delete(id?: string){
    return this.http.delete(this.baseApiUrl +'api/ParametreSociete/' + id);
  }
}
