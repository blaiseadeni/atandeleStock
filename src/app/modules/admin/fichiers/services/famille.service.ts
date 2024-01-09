import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FamilleService {
  baseApiUrl: string = environment.baseApiUrl;
  
  private headers = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
  };
  
  constructor(private http: HttpClient) { }
  
  getAll(id: any){
    return this.http.get(this.baseApiUrl + 'api/Famille/all/'+ id);
  }
  
  add(famille: any){
    return this.http.post(this.baseApiUrl + 'api/Famille', famille, this.headers);
  }
  
  get(id: string){
    return this.http.get(this.baseApiUrl + 'api/Famille/' + id);
  }
  
  update(id: any, famille: any)
  {
    return this.http.put(this.baseApiUrl + 'api/Famille/' + id, famille);
  }
  
  delete(id?: string){
    return this.http.delete(this.baseApiUrl +'api/Famille/' + id);
  }
}
