import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventaireService {
  baseApiUrl: string = environment.baseApiUrl;
  
  private headers = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
  };
  
  constructor(private http: HttpClient) { }
  
  add(entity:any){
    return this.http.post(this.baseApiUrl + 'api/InventaireComptable/ajouter', entity,this.headers );
  }
  
  get(entity:any){
    return this.http.post(this.baseApiUrl + 'api/InventaireComptable/invCompt', entity,this.headers );
  }
  
  getAll(id:any){
    return this.http.get(this.baseApiUrl + 'api/InventaireComptable/'+id);
  }
}
