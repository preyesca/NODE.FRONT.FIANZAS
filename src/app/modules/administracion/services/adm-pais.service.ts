import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';
import { IPais } from '../helpers/interfaces/adm-proyecto';

@Injectable({
  providedIn: 'root',
})
export class AdmPaisService {
  readonly apiUrl = `${environment.urlApi}/catalogos/pais`;

  constructor(private http: HttpClient) {}

  getCatalogs(): Observable<IResponse<Array<IPais>>> {
    return this.http.get<IResponse<Array<IPais>>>(`${this.apiUrl}/select`);
  }
}
