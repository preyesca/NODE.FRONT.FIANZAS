import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';
import { IFnzEncabezado } from '../pages/shared/helpers/interfaces/fnz-encabezado';

@Injectable({
  providedIn: 'root',
})
export class FnzEncabezadoService {
  private readonly apiURL = `${environment.urlApi}/core/folio`;

  constructor(private http: HttpClient) {}

  // upload(file: File): Observable<IResponse<any>> {
  //     return this.http.get<IResponse<IBandejaPaginate>>(
  //         `${this.apiUrl}/info-general/:folio`, { params: paginate }
  //       );
  // }

  getInfoGeneralByFolio(folio: string): Observable<IResponse<IFnzEncabezado>> {
    return this.http.get<IResponse<IFnzEncabezado>>(
      `${this.apiURL}/info-general/${folio}`
    );
  }
}
