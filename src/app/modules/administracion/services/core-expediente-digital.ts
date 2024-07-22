import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';
import { ITitular } from '../helpers/interfaces/core-titular';
import {
  IArchivoValidacion,
  IFileBase64,
} from '../helpers/interfaces/core-validacion-documental';

@Injectable({
  providedIn: 'root',
})
export class ExpedienteDigitalService {
  private readonly apiUrl = `${environment.urlApi}/expedientedigital/archivos`;
  constructor(private http: HttpClient) {}

  find_by_Titular(
    pais: number,
    aseguradora: string,
    proyecto: string,
    titular: string
  ) {
    return this.http.get<IResponse<IArchivoValidacion[]>>(
      `${this.apiUrl}/find-by-titular?pais=${pais}&aseguradora=${aseguradora}&proyecto=${proyecto}&titular=${titular}`
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

  getCatalogsTitulares() {
    return this.http.get<IResponse<Array<ITitular>>>(
      `${this.apiUrl}/expedientedigital/archivos/getAllTitularesSelect`
    );
  }

  getFileBase64ByFileName(
    fileName: string,
    titular: string
  ): Observable<IResponse<IFileBase64>> {
    return this.http.get<IResponse<IFileBase64>>(
      `${this.apiUrl}/download?fileName=${fileName}&titular=${titular}`
    );
  }
}
