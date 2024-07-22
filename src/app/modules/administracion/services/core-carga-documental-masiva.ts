import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class CargaDocumentalMasivaService {
  readonly apiUrl = `${environment.urlApi}`;

  constructor(private http: HttpClient) {}

  // getCatalogsDocumentos() {
  //   let queryParams = new HttpParams();
  //   return this.http.get<IResponse<IConfiguracionDocumental>>(
  //     `${this.apiUrl}/administracion/configuracion-documental/find-configuracion_documental_masiva`
  //   );
  // }

  // getCatalogsTitulares() {
  //   return this.http.get<IResponse<Array<ITitular>>>(
  //     `${this.apiUrl}/expedientedigital/archivos/getAllTitularesSelect`
  //   );
  // }
  // create(data: FormData): Observable<IResponse<any>> {
  //   return this.http.post<IResponse<any>>(
  //     `${this.apiUrl}/expedientedigital/archivos`,
  //     data
  //   );
  // }
}
