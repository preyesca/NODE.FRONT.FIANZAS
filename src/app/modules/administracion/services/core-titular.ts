import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';
import { ITitular } from '../helpers/interfaces/core-titular';

@Injectable({
  providedIn: 'root',
})
export class TitularService {
  readonly apiUrl = `${environment.urlApi}/core/titular`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<IResponse<ITitular[]>> {
    return this.http.get<IResponse<ITitular[]>>(`${this.apiUrl}/find-all`);
  }
}
