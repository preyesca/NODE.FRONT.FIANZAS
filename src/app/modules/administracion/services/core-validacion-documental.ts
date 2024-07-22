import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';
import {
  IKycArchivoValidacion,
  IKycValidacionDigital,
} from '../../kyc/pages/core/helpers/interfaces/kyc-core-validacion-documental';

@Injectable({
  providedIn: 'root',
})
export class ValidacionService {
  private readonly apiUrl = `${environment.urlApi}/core/validacion-digital`;

  constructor(private http: HttpClient) {}

  findDocumentosByTitular(
    pais: number,
    aseguradora: string,
    proyecto: string,
    titular: string
  ) {
    return this.http.get<IResponse<IKycArchivoValidacion[]>>(
      `${this.apiUrl}/find-titular?pais=${pais}&aseguradora=${aseguradora}&proyecto=${proyecto}&titular=${titular}`
    );
  }

  // getCatalogs(titular:string): Observable<IResponse<IValidacionDigitalCatalogs>> {
  //   return this.http.get<IResponse<IValidacionDigitalCatalogs>>(
  //     `${this.apiUrl}/get-catalogs/${titular}`
  //   );
  // }

  // getById(_id: string): Observable<IResponse<IValidacionDigitalEdit>> {
  //   return this.http.get<IResponse<IProyecto>>(`${this.apiUrl}/${_id}`);
  // }

  getByIdAndGetCatalogosToEdit(
    _id: string
  ): Observable<IResponse<IKycValidacionDigital>> {
    return this.http.get<IResponse<IKycValidacionDigital>>(
      `${this.apiUrl}/find-one-to-edit/${_id}`
    );
  }

  update(
    _id: string,
    validacion: IKycValidacionDigital
  ): Observable<IResponse<IKycValidacionDigital>> {
    return this.http.put<IResponse<IKycValidacionDigital>>(
      `${this.apiUrl}/${_id}`,
      validacion
    );
  }

  create(
    validacion: IKycValidacionDigital
  ): Observable<IResponse<IKycValidacionDigital>> {
    return this.http.post<IResponse<IKycValidacionDigital>>(
      `${this.apiUrl}`,
      validacion
    );
  }
}
