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
  IConfiguracionAseguradora,
  IConfiguracionAseguradoraCatalogs,
  IConfiguracionAseguradoraEdit,
  IConfiguracionAseguradoraPaginate,
} from '../helpers/interfaces/adm-configuracion-aseguradora';

@Injectable({
  providedIn: 'root',
})
export class AdmConfiguracionAseguradoraService {
  readonly apiUrl = `${environment.urlApi}/administracion/configuracion-aseguradora`;

  constructor(private http: HttpClient) {}

  paginateAll(
    paginateParams: IPaginateParams
  ): Observable<IResponse<IPaginate<IConfiguracionAseguradoraPaginate>>> {
    return this.http.get<
      IResponse<IPaginate<IConfiguracionAseguradoraPaginate>>
    >(
      `${this.apiUrl}/paginate?${PaginateParamsGenerator.getUri(
        paginateParams
      )}`
    );
  }

  getCatalogs(): Observable<IResponse<IConfiguracionAseguradoraCatalogs>> {
    return this.http.get<IResponse<IConfiguracionAseguradoraCatalogs>>(
      `${this.apiUrl}/get-catalogs`
    );
  }

  getById(_id: string): Observable<IResponse<IConfiguracionAseguradora>> {
    return this.http.get<IResponse<IConfiguracionAseguradora>>(
      `${this.apiUrl}/${_id}`
    );
  }

  getByIdAndGetCatalogosToEdit(
    _id: string
  ): Observable<IResponse<IConfiguracionAseguradoraEdit>> {
    return this.http.get<IResponse<IConfiguracionAseguradoraEdit>>(
      `${this.apiUrl}/find-one-to-edit/${_id}`
    );
  }

  update(
    _id: string,
    user: IConfiguracionAseguradora
  ): Observable<IResponse<IConfiguracionAseguradora>> {
    return this.http.put<IResponse<IConfiguracionAseguradora>>(
      `${this.apiUrl}/${_id}`,
      user
    );
  }

  create(
    user: IConfiguracionAseguradora
  ): Observable<IResponse<IConfiguracionAseguradora>> {
    return this.http.post<IResponse<IConfiguracionAseguradora>>(
      `${this.apiUrl}`,
      user
    );
  }
}
