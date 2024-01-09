import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventaireExtraService {
  baseApiUrl: string = environment.baseApiUrl;
  
  private headers = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
  };
  
  constructor(private http: HttpClient) { }
  
  add(entity:any){
    return this.http.post(this.baseApiUrl + 'api/Inventaire/', entity,this.headers );
  }
  
  update(id: any, entity: any)
  {
    return this.http.put(this.baseApiUrl + 'api/Inventaire/' + id, entity);
  }
  
  get(entity:any){
    return this.http.post(this.baseApiUrl + 'api/Inventaire/invCompt', entity,this.headers );
  }
  
  getAll(){
    return this.http.get(this.baseApiUrl + 'api/Inventaire/');
  }
  
  getInvent(entity:any){
    return this.http.post(this.baseApiUrl + 'api/Inventaire/inventaire/', entity,this.headers);
  }
  
  PrintFIS(entity:any){
    return this.http.post(this.baseApiUrl + 'api/ReportInventaire/fis/',entity,{observe:'response',responseType:'blob'});
  }
  
  PrintFS1(entity:any){
    return this.http.post(this.baseApiUrl + 'api/ReportInventaire/fs/',entity,{observe:'response',responseType:'blob'});
  }
  
  PrintVente(entity:any){
    return this.http.post(this.baseApiUrl + 'api/ReportInventaire/vente/',entity,{observe:'response',responseType:'blob'});
  }
  
  
}
