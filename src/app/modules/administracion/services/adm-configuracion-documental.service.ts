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
  IConfiguracionDocumental,
  IConfiguracionDocumentalCatalogs,
  IConfiguracionDocumentalEdit,
  IConfiguracionDocumentalPaginate,
} from '../helpers/interfaces/adm-configuracion-documental';

@Injectable({
  providedIn: 'root',
})
export class AdmConfiguracionDocumentalService {
  readonly apiUrl = `${environment.urlApi}/administracion/configuracion-documental`;

  constructor(private http: HttpClient) {}

  paginateAll(
    paginateParams: IPaginateParams
  ): Observable<IResponse<IPaginate<IConfiguracionDocumentalPaginate>>> {
    return this.http.get<
      IResponse<IPaginate<IConfiguracionDocumentalPaginate>>
    >(
      `${this.apiUrl}/paginate?${PaginateParamsGenerator.getUri(
        paginateParams
      )}`
    );
  }

  getCatalogs(): Observable<IResponse<IConfiguracionDocumentalCatalogs>> {
    return this.http.get<IResponse<IConfiguracionDocumentalCatalogs>>(
      `${this.apiUrl}/get-catalogs`
    );
  }

  getById(_id: string): Observable<IResponse<IConfiguracionDocumental>> {
    return this.http.get<IResponse<IConfiguracionDocumental>>(
      `${this.apiUrl}/${_id}`
    );
  }

  getByIdAndGetCatalogosToEdit(
    _id: string
  ): Observable<IResponse<IConfiguracionDocumentalEdit>> {
    return this.http.get<IResponse<IConfiguracionDocumentalEdit>>(
      `${this.apiUrl}/find-one-to-edit/${_id}`
    );
  }

  update(
    _id: string,
    user: IConfiguracionDocumental
  ): Observable<IResponse<IConfiguracionDocumental>> {
    return this.http.put<IResponse<IConfiguracionDocumental>>(
      `${this.apiUrl}/${_id}`,
      user
    );
  }

  create(
    user: IConfiguracionDocumental
  ): Observable<IResponse<IConfiguracionDocumental>> {
    return this.http.post<IResponse<IConfiguracionDocumental>>(
      `${this.apiUrl}`,
      user
    );
  }

  getConfiguracionDocumentalByProyecto(proyecto: string, aseguradora: string, titular:string) {
    return this.http.get<IResponse<IConfiguracionDocumental>>(
      `${this.apiUrl}/find-configuracion-documental-masiva?proyecto=${proyecto}&aseguradora=${aseguradora}&titular=${titular}`
    );
  }
}
