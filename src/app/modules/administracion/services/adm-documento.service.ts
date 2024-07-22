import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginateParamsGenerator } from 'src/app/shared/helpers/generator/paginate-params.generator';
import {
  IPaginate,
  IPaginateParams,
} from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';
import {
  IDocumento,
  IDocumentoEdit,
  IDocumentoGetCatalogs,
  IDocumentoPaginate,
} from '../helpers/interfaces/adm-documento';

@Injectable({
  providedIn: 'root',
})
export class AdmDocumentoService {
  readonly apiUrl = `${environment.urlApi}/administracion/documento`;

  constructor(private http: HttpClient) {}

  paginate(
    paginateParams: IPaginateParams
  ): Observable<IResponse<IPaginate<IDocumentoPaginate>>> {
    return this.http.get<IResponse<IPaginate<IDocumentoPaginate>>>(
      `${this.apiUrl}/paginate?${PaginateParamsGenerator.getUri(
        paginateParams
      )}`
    );
  }

  getCatalogs(): Observable<IResponse<IDocumentoGetCatalogs>> {
    return this.http.get<IResponse<IDocumentoGetCatalogs>>(
      `${this.apiUrl}/get-catalogs`
    );
  }

  create(documento: IDocumento): Observable<IResponse<IDocumento>> {
    return this.http.post<IResponse<IDocumento>>(`${this.apiUrl}`, documento);
  }

  update(
    _id: string,
    documento: IDocumento
  ): Observable<IResponse<IDocumento>> {
    return this.http.put<IResponse<IDocumento>>(
      `${this.apiUrl}/${_id}`,
      documento
    );
  }

  getByIdToEdit(_id: string): Observable<IResponse<IDocumentoEdit>> {
    return this.http.get<IResponse<IDocumentoEdit>>(
      `${this.apiUrl}/find-one-to-edit/${_id}`
    );
  }
  getByClave(clave: string): Observable<IResponse<IDocumento>> {
    return this.http.get<IResponse<IDocumento>>(
      `${this.apiUrl}/find-by-clave/${clave}`
    );
  }

  getAll(): Observable<any> {
    return this.http.get<IResponse<IDocumento>>(
      `${this.apiUrl}/find-all-option-select`
    );
  }
}
