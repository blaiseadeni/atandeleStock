import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  baseApiUrl: string = environment.baseApiUrl;
  
  private headers = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
  };
  
  constructor(private http: HttpClient) { }
  
  getAll(){
    return this.http.get(this.baseApiUrl + 'api/Location');
  }
  
  add(location: any){
    return this.http.post(this.baseApiUrl + 'api/Location', location, this.headers);
  }
  
  get(id: string){
    return this.http.get(this.baseApiUrl + 'api/Location/' + id);
  }
  
  update(id: any, location: any)
  {
    return this.http.put(this.baseApiUrl + 'api/Location/' + id, location);
  }
  
  delete(id?: string){
    return this.http.delete(this.baseApiUrl +'api/Location/' + id);
  }
}
