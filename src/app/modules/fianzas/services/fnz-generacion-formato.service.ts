import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';
import { ICatalogo } from '../../catalogos/helpers/interfaces/catalogo';
import { IFnzGeneracionFormato } from '../pages/core/helpers/interfaces/fnz-generacion-formatos';
@Injectable({
  providedIn: 'root',
})
export class FnzGeneracionFormatoService {
  readonly apiUrl = `${environment.urlApi}`;

  constructor(private http: HttpClient) {}

  getByIdAndGetCatalogosToEdit(_id: string): Observable<IResponse<any>> {
    return this.http.get<IResponse<any>>(
      `${this.apiUrl}/core/generacion-formatos/find-one-to-edit/${_id}`
    );
  }

  getCatalogoEstatus() {
    return this.http.get<IResponse<ICatalogo[]>>(
      `${this.apiUrl}/catalogos/estatus-generacion-formato/select`
    );
  }

  create(
    generacionFormato: IFnzGeneracionFormato
  ): Observable<IResponse<IFnzGeneracionFormato>> {
    return this.http.post<IResponse<IFnzGeneracionFormato>>(
      `${this.apiUrl}/core/generacion-formatos`,
      generacionFormato
    );
  }

  update(
    _id: string,
    data: IFnzGeneracionFormato
  ): Observable<IResponse<IFnzGeneracionFormato>> {
    return this.http.put<IResponse<IFnzGeneracionFormato>>(
      `${this.apiUrl}/core/generacion-formatos/${_id}`,
      data
    );
  }
}
