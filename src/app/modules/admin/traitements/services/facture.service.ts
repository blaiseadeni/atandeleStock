import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  baseApiUrl: string = environment.baseApiUrl;
  
  private headers = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
  };
  
  constructor(private http: HttpClient) { }
  
  getAll(id:any){
    return this.http.get(this.baseApiUrl + 'api/Facture/all/'+id);
  }
  
  getAllNp(id:any){
    return this.http.get(this.baseApiUrl + 'api/Facture/np/'+id);
  }
  
  add(entity: any){
    return this.http.post(this.baseApiUrl + 'api/Facture', entity, this.headers);
  }
  
  get(id: string){
    return this.http.get(this.baseApiUrl + 'api/Facture/' + id);
  }
  
  getFacture(numero: string){
    return this.http.get(this.baseApiUrl + 'api/PaieFacture/' + numero);
  }
  
  update(id: any, entity: any)
  {
    return this.http.put(this.baseApiUrl + 'api/Facture/' + id, entity);
  }
  
  delete(id?: string){
    return this.http.delete(this.baseApiUrl +'api/Facture/' + id);
  }
  
  
  
  PrintPOS(id:any){
    return this.http.get(this.baseApiUrl + 'api/Report/pos/' + id,{observe:'response',responseType:'blob'});
  }
  
  PrintA4(id:any){
    return this.http.get(this.baseApiUrl + 'api/Report/facture/' + id,{observe:'response',responseType:'blob'});
  }
  
  GeneratePDF(id:any){
    return this.http.get(this.baseApiUrl + 'api/Report/facture/' + id,{observe:'response',responseType:'blob'});
  }
}
