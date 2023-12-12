import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MonnaieService {
 baseApiUrl: string = environment.baseApiUrl;
  
  private headers = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
  };
  
  constructor(private http: HttpClient) { }
  
  getAll(){
    return this.http.get(this.baseApiUrl + 'api/Monnaie');
  }
  
  add(monnaie: any){
    return this.http.post(this.baseApiUrl + 'api/Monnaie', monnaie, this.headers);
  }
  
  get(id: string){
    return this.http.get(this.baseApiUrl + 'api/Monnaie/' + id);
  }
  
  update(id: any, monnaie: any)
  {
    return this.http.put(this.baseApiUrl + 'api/Monnaie/' + id, monnaie);
  }
  
  delete(id?: string){
    return this.http.delete(this.baseApiUrl +'api/Monnaie/' + id);
  }
}
