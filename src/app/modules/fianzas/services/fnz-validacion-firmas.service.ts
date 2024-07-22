import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';
import { IFnzValidacionDigital } from '../../fianzas/pages/core/helpers/interfaces/fnz-validacion-documental';

@Injectable({
  providedIn: 'root',
})
export class FnzValidacionFirmasService {
  private readonly apiUrl = `${environment.urlApi}/core/validacion-firmas`;

  constructor(private http: HttpClient) {}

  getByIdAndGetCatalogosToEdit(
    _id: string
  ): Observable<IResponse<IFnzValidacionDigital>> {
    return this.http.get<IResponse<IFnzValidacionDigital>>(
      `${this.apiUrl}/find-one-to-edit/${_id}`
    );
  }

  update(
    _id: string,
    validacion: IFnzValidacionDigital
  ): Observable<IResponse<IFnzValidacionDigital>> {
    return this.http.put<IResponse<IFnzValidacionDigital>>(
      `${this.apiUrl}/${_id}`,
      validacion
    );
  }

  create(
    validacion: IFnzValidacionDigital
  ): Observable<IResponse<IFnzValidacionDigital>> {
    return this.http.post<IResponse<IFnzValidacionDigital>>(
      `${this.apiUrl}`,
      validacion
    );
  }
}
