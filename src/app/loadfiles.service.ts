import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadfilesService {

  constructor(
    private http: HttpClient
  ) { }

  //load file with progress
  loadUrlWithProgress(url: string): Observable<any> {
    return this.http.get(url, {
      responseType: 'arraybuffer',
      // observe: 'events',
      // reportProgress: true,
      // headers: new HttpHeaders(
      //   { 'Content-Type': 'application/json' },
      // )
    })
  }

  // loadFileWithProgress(filename: string): Observable<HttpEvent<ArrayBuffer>> {
  //   const url = `assets/js/${filename}`;
  //   const req = new HttpRequest('GET', url, {
  //     responseType: 'arraybuffer',
  //     reportProgress: true,
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  //   });

  //   return this.http.request(req);
  // }

}
