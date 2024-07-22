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
  IAseguradora,
  IAseguradoraEdit,
  IAseguradoraGetCatalogs,
  IAseguradoraPaginate,
} from '../helpers/interfaces/adm-aseguradora';

@Injectable({
  providedIn: 'root',
})
export class AdmAseguradoraService {
  readonly apiUrl = `${environment.urlApi}/administracion/aseguradora`;

  constructor(private http: HttpClient) {}

  paginateAll(
    paginateParams: IPaginateParams
  ): Observable<IResponse<IPaginate<IAseguradoraPaginate>>> {
    return this.http.get<IResponse<IPaginate<IAseguradoraPaginate>>>(
      `${this.apiUrl}/paginate?${PaginateParamsGenerator.getUri(
        paginateParams
      )}`
    );
  }

  getCatalogs(): Observable<IResponse<IAseguradoraGetCatalogs>> {
    return this.http.get<IResponse<IAseguradoraGetCatalogs>>(
      `${this.apiUrl}/get-catalogs`
    );
  }

  getByIdAndGetCatalogosToEdit(
    _id: string
  ): Observable<IResponse<IAseguradoraEdit>> {
    return this.http.get<IResponse<IAseguradoraEdit>>(
      `${this.apiUrl}/find-one-to-edit/${_id}`
    );
  }

  create(aseguradora: IAseguradora): Observable<IResponse<IAseguradora>> {
    return this.http.post<IResponse<IAseguradora>>(
      `${this.apiUrl}`,
      aseguradora
    );
  }

  update(
    _id: string,
    aseguradora: IAseguradora
  ): Observable<IResponse<IAseguradora>> {
    return this.http.put<IResponse<IAseguradora>>(
      `${this.apiUrl}/${_id}`,
      aseguradora
    );
  }
}
