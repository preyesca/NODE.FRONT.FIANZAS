import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginateParamsGenerator } from 'src/app/shared/helpers/generator/paginate-params.generator';
import { IPaginateParams } from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';
import {
  IFnzArchivoValidacion,
  IFnzFileBase64,
} from '../../fianzas/pages/core/helpers/interfaces/fnz-validacion-documental';
import { IFnzCotejo } from '../pages/core/helpers/interfaces/fnz-cotejo';
import {
  IFnzTitular,
  IFnzTitularArchivos,
} from '../pages/core/helpers/interfaces/fnz-titular';

@Injectable({
  providedIn: 'root',
})
export class FnzExpedienteDigitalService {
  private readonly apiUrl = `${environment.urlApi}/expedientedigital/archivos`;

  constructor(private http: HttpClient) { }

  find_by_Titular(
    pais: number,
    aseguradora: string,
    proyecto: string,
    titular: string
  ) {
    return this.http.get<IResponse<IFnzArchivoValidacion[]>>(
      `${this.apiUrl}/find-by-titular?pais=${pais}&aseguradora=${aseguradora}&proyecto=${proyecto}&titular=${titular}`
    );
  }

  find_by_titular_paginate(
    pais: number,
    aseguradora: string,
    proyecto: string,
    titular: string,
    paginateParams: IPaginateParams
  ) {
    return this.http.get<IResponse<any>>(
      `${this.apiUrl
      }/find-by-titular-paginated/${pais}/${aseguradora}/${proyecto}/${titular}?${PaginateParamsGenerator.getUri(
        paginateParams
      )}`
    );
  }

  find_by_titular_cotejo_paginate(
    pais: number,
    aseguradora: string,
    proyecto: string,
    titular: string,
    paginateParams: IPaginateParams
  ) {
    return this.http.get<IResponse<any>>(
      `${this.apiUrl
      }/find-by-titular-cotejo-paginated?pais=${pais}&aseguradora=${aseguradora}&proyecto=${proyecto}&titular=${titular}&${PaginateParamsGenerator.getUri(
        paginateParams
      )}`
    );
  }

  check_by_titular(
    pais: number,
    aseguradora: string,
    proyecto: string,
    titular: string
  ) {
    return this.http.get<any>(
      `${this.apiUrl}/check-by-titular?pais=${pais}&aseguradora=${aseguradora}&proyecto=${proyecto}&titular=${titular}`
    );
  }

  getByTitularAndTypeDocument(
    pais: number,
    aseguradora: string,
    proyecto: string,
    titular: string,
    idDocument: string
  ) {
    return this.http.get<IResponse<IFnzTitularArchivos[]>>(
      `${this.apiUrl}/getByTitularAndTypeDocument?pais=${pais}&aseguradora=${aseguradora}&proyecto=${proyecto}&titular=${titular}&idDocument=${idDocument}`
    );
  }

  getByArchivo(id: string) {
    return this.http.get<IResponse<IFnzTitularArchivos[]>>(
      `${this.apiUrl}/${id}`
    );
  }

  getCatalogsTitulares() {
    return this.http.get<IResponse<Array<IFnzTitular>>>(
      `${this.apiUrl}/expedientedigital/archivos/getAllTitularesSelect`
    );
  }

  getFileBase64ByFileName(
    fileName: string,
    titular: string
  ): Observable<IResponse<IFnzFileBase64>> {
    return this.http.get<IResponse<IFnzFileBase64>>(
      `${this.apiUrl}/download?fileName=${fileName}&titular=${titular}`
    );
  }

  deleteFile(id: string): Observable<IResponse<any>> {
    return this.http.delete<IResponse<any>>(`${this.apiUrl}/${id}`);
  }

  cotejarODescotejarDocumentos(data: IFnzCotejo) {
    //return this.http.post(`${this.apiUrlCotejo}`, data);
    return this.http.post(`${this.apiUrl}/cotejar-o-descotejar-documentos`, data);
  }

  getByArchivoCotejadoByBase64(id: string) {
    return this.http.get<IResponse<IFnzFileBase64>>(
      `${this.apiUrl}/find-Cotejo/${id}`
    );
  }

  updateEnviado(id: string, seleccionado: boolean) {
    return this.http.put(
      `${this.apiUrl}/updateEnviado/${id}/${seleccionado}`,
      null
    );
  }

  getSeleccionados(titular: string) {
    return this.http.get<IResponse<string[]>>(
      `${this.apiUrl}/get-seleccionados/${titular}/`
    );
  }
}
