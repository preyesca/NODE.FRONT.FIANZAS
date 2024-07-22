import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';
import { RecoleccionFisicosType } from '../pages/core/fnz-recoleccion-fisicos/interfaces/recoleccion-fisicos-response.interface';

@Injectable({
  providedIn: 'root',
})
export class FnzRecoleccionFisicosService {
  readonly apiUrl = `${environment.urlApi}`;

  constructor(private http: HttpClient) {}

  sendCoreRecoFisic(data: RecoleccionFisicosType) {
    return this.http.post<IResponse<RecoleccionFisicosType>>(
      `${this.apiUrl}/core/recoleccion-fisicos`,
      data
    );
  }

  findOneRecoFisic(folio: any) {
    return this.http.get<IResponse<RecoleccionFisicosType>>(
      `${this.apiUrl}/core/recoleccion-fisicos/find-one-to-edit/${folio}`
    );
  }

  sendEmailNotification() {
    return this.http.get<IResponse<RecoleccionFisicosType>>(
      `${this.apiUrl}/core/recoleccion-fisicos/find-one-to-edit`
    );
  }
}
