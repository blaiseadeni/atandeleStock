import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepenseService {
  baseApiUrl: string = environment.baseApiUrl;
  
  private headers = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
  };
  
  constructor(private http: HttpClient) { }
  
  getAll(id:any){
    return this.http.get(this.baseApiUrl + 'api/Depense/all/'+id);
  }
  
  add(entity: any){
    return this.http.post(this.baseApiUrl + 'api/Depense', entity, this.headers);
  }

  verify(entity: any){
    return this.http.post(this.baseApiUrl + 'api/Depense/verify', entity, this.headers);
  }
  
  get(id: string){
    return this.http.get(this.baseApiUrl + 'api/Depense/' + id);
  }
  
  update(id: any, entity: any)
  {
    return this.http.put(this.baseApiUrl + 'api/Depense/' + id, entity);
  }
  
  delete(id?: string){
    return this.http.delete(this.baseApiUrl +'api/Depense/' + id);
  }
}
