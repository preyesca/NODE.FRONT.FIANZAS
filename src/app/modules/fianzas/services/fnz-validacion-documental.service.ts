import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';
import {
  IFnzArchivoValidacion,
  IFnzValidacionDigital,
} from '../pages/core/helpers/interfaces/fnz-validacion-documental';

@Injectable({
  providedIn: 'root',
})
export class FnzValidacionService {
  private readonly apiUrl = `${environment.urlApi}/core/validacion-digital`;

  constructor(private http: HttpClient) {}

  findDocumentosByTitular(
    pais: number,
    aseguradora: string,
    proyecto: string,
    titular: string
  ) {
    return this.http.get<IResponse<IFnzArchivoValidacion[]>>(
      `${this.apiUrl}/find-titular?pais=${pais}&aseguradora=${aseguradora}&proyecto=${proyecto}&titular=${titular}`
    );
  }

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
