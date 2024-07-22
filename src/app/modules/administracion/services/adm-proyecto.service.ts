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
  IProyecto,
  IProyectoCatalogs,
  IProyectoCodigo,
  IProyectoEdit,
  IProyectoPaginate,
} from '../helpers/interfaces/adm-proyecto';

@Injectable({
  providedIn: 'root',
})
export class AdmProyectoService {
  readonly apiUrl = `${environment.urlApi}/administracion/proyecto`;

  constructor(private http: HttpClient) {}

  paginateAll(
    paginateParams: IPaginateParams
  ): Observable<IResponse<IPaginate<IProyectoPaginate>>> {
    return this.http.get<IResponse<IPaginate<IProyectoPaginate>>>(
      `${this.apiUrl}/paginate?${PaginateParamsGenerator.getUri(
        paginateParams
      )}`
    );
  }

  getCatalogs(): Observable<IResponse<IProyectoCatalogs>> {
    return this.http.get<IResponse<IProyectoCatalogs>>(
      `${this.apiUrl}/get-catalogs`
    );
  }

  getById(_id: string): Observable<IResponse<IProyecto>> {
    return this.http.get<IResponse<IProyecto>>(`${this.apiUrl}/${_id}`);
  }

  getByIdAndGetCatalogosToEdit(
    _id: string
  ): Observable<IResponse<IProyectoEdit>> {
    return this.http.get<IResponse<IProyectoEdit>>(
      `${this.apiUrl}/find-one-to-edit/${_id}`
    );
  }

  update(_id: string, proyecto: IProyecto): Observable<IResponse<IProyecto>> {
    return this.http.put<IResponse<IProyecto>>(
      `${this.apiUrl}/${_id}`,
      proyecto
    );
  }

  create(proyecto: IProyecto): Observable<IResponse<IProyecto>> {
    return this.http.post<IResponse<IProyecto>>(`${this.apiUrl}`, proyecto);
  }

  getAllByPais(pais: number) {
    return this.http.get<IResponse<IProyectoCodigo[]>>(
      `${this.apiUrl}/find-all-by-pais/${pais}`
    );
  }
}
