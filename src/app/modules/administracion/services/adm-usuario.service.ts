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
  IUsuario,
  IUsuarioEdit,
  IUsuarioGetCatalogs,
  IUsuarioPaginate,
} from '../helpers/interfaces/adm-usuario';

@Injectable({
  providedIn: 'root',
})
export class AdmUsuarioService {
  readonly apiUrl = `${environment.urlApi}/administracion/usuario`;

  constructor(private http: HttpClient) {}

  paginateAll(
    paginateParams: IPaginateParams
  ): Observable<IResponse<IPaginate<IUsuarioPaginate>>> {
    return this.http.get<IResponse<IPaginate<IUsuarioPaginate>>>(
      `${this.apiUrl}/paginate?${PaginateParamsGenerator.getUri(
        paginateParams
      )}`
    );
  }

  getCatalogs(): Observable<IResponse<IUsuarioGetCatalogs>> {
    return this.http.get<IResponse<IUsuarioGetCatalogs>>(
      `${this.apiUrl}/get-catalogs`
    );
  }

  getById(_id: string): Observable<IResponse<IUsuario>> {
    return this.http.get<IResponse<IUsuario>>(`${this.apiUrl}/${_id}`);
  }

  getByIdAndGetCatalogosToEdit(
    _id: string
  ): Observable<IResponse<IUsuarioEdit>> {
    return this.http.get<IResponse<IUsuarioEdit>>(
      `${this.apiUrl}/find-one-to-edit/${_id}`
    );
  }

  update(_id: string, user: IUsuario): Observable<IResponse<IUsuario>> {
    return this.http.put<IResponse<IUsuario>>(`${this.apiUrl}/${_id}`, user);
  }

  updateClave(_id: string, body: any): Observable<IResponse<any>> {
    return this.http.put<IResponse<any>>(
      `${this.apiUrl}/update-clave/${_id}`,
      body
    );
  }

  create(user: IUsuario): Observable<IResponse<IUsuario>> {
    return this.http.post<IResponse<IUsuario>>(`${this.apiUrl}`, user);
  }
}
