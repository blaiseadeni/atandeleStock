import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  baseApiUrl: string = environment.baseApiUrl;
  
  private headers = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
  };
  
  constructor(private http: HttpClient) { }
  
  getAll(){
    return this.http.get(this.baseApiUrl + 'api/Article/all');
  }
  
  add(article: any){
    return this.http.post(this.baseApiUrl + 'api/Article', article, this.headers);
  }
  
  get(id: string){
    return this.http.get(this.baseApiUrl + 'api/Article/' + id);
  }
  
  update(id: any, article: any)
  {
    return this.http.put(this.baseApiUrl + 'api/Article/' + id, article);
  }
  
  delete(id?: string){
    return this.http.delete(this.baseApiUrl +'api/Article/' + id);
  }
}
