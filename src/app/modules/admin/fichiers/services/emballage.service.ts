import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmballageService {
  baseApiUrl: string = environment.baseApiUrl;
  
  private headers = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
  };
  
  constructor(private http: HttpClient) { }
  
  getAll(id: any){
    return this.http.get(this.baseApiUrl + 'api/Emballage/all/'+id);
  }
  
  add(emballage: any){
    return this.http.post(this.baseApiUrl + 'api/Emballage', emballage, this.headers);
  }
  
  get(id: string){
    return this.http.get(this.baseApiUrl + 'api/Emballage/' + id);
  }
  getEmballageByArticle(id: any){
    return this.http.get(this.baseApiUrl + 'api/EmballageByArticle/' + id);
  }
  
  update(id: any, emballage: any)
  {
    return this.http.put(this.baseApiUrl + 'api/Emballage/' + id, emballage);
  }
  
  delete(id?: string){
    return this.http.delete(this.baseApiUrl +'api/Emballage/' + id);
  }
}
