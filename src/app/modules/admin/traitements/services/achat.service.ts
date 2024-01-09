import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AchatService {
  baseApiUrl: string = environment.baseApiUrl;
  
  private headers = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
  };
  
  constructor(private http: HttpClient) { }
  
  getAll(id:any){
    return this.http.get(this.baseApiUrl + 'api/Achat/all/'+id);
  }
  
  add(entity: any){
    return this.http.post(this.baseApiUrl + 'api/Achat', entity, this.headers);
  }
  
  get(id: string){
    return this.http.get(this.baseApiUrl + 'api/Achat/' + id);
  }
  
  update(id: any, entity: any)
  {
    return this.http.put(this.baseApiUrl + 'api/Achat/' + id, entity);
  }
  
  delete(id?: string){
    return this.http.delete(this.baseApiUrl +'api/Achat/' + id);
  }
  
  GeneratePDF(id:any){
    return this.http.get(this.baseApiUrl + 'api/Report/ba/' + id,{observe:'response',responseType:'blob'});
  }
}
