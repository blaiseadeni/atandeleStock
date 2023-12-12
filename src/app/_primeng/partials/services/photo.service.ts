import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Image } from '../../common/models/image';

@Injectable()
export class PhotoService {

    constructor(private http: HttpClient) { }

    getImages() {
    return this.http.get<any>('assets/data/photos.json')
      .toPromise()
      .then(res => res.data as Image[])
      .then(data => data);
    }
}
