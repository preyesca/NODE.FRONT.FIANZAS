import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';
import { IValidacionDigital } from '../helpers/interfaces/core-validacion-documental';

@Injectable({
  providedIn: 'root',
})
export class FirmaClienteService {
  private readonly apiUrl = `${environment.urlApi}/core/firma-cliente`;

  constructor(private http: HttpClient) {}

  getByIdAndGetCatalogosToEdit(
    _id: string
  ): Observable<IResponse<IValidacionDigital>> {
    return this.http.get<IResponse<IValidacionDigital>>(
      `${this.apiUrl}/find-one-to-edit/${_id}`
    );
  }

  update(
    _id: string,
    validacion: IValidacionDigital
  ): Observable<IResponse<IValidacionDigital>> {
    return this.http.put<IResponse<IValidacionDigital>>(
      `${this.apiUrl}/${_id}`,
      validacion
    );
  }

  create(
    validacion: IValidacionDigital
  ): Observable<IResponse<IValidacionDigital>> {
    return this.http.post<IResponse<IValidacionDigital>>(
      `${this.apiUrl}`,
      validacion
    );
  }
}
