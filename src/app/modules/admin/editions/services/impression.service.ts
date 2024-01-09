import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImpressionService {
  baseApiUrl: string = environment.baseApiUrl;
  private headers = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
  };
  
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }
  
  constructor(private http: HttpClient) { }
  PrintFIS(entity:any){
    return this.http.post(this.baseApiUrl + 'api/ReportInventaire/fis',entity,{observe:'response',responseType:'blob'});
  }
  
  PrintFS1(entity:any){
    return this.http.post(this.baseApiUrl + 'api/ReportInventaire/fs',entity,{observe:'response',responseType:'blob'});
  }
  
  PrintVente(entity:any){
    return this.http.post(this.baseApiUrl + 'api/ReportInventaire/vente',entity,{observe:'response',responseType:'blob'});
  }
  
  PrintResultat(annee:any){
    return this.http.get(this.baseApiUrl + 'api/ReportInventaire/resultat/' + annee,{observe:'response',responseType:'blob'});
  }
}
