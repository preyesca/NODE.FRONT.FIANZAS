import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FnzFolioService {
  private readonly apiURL = `${environment.urlApi}/core/folio`;

  constructor(private http: HttpClient) {}

  upload(file: File): Observable<IResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<IResponse<any>>(`${this.apiURL}/upload`, formData);
  }
}
