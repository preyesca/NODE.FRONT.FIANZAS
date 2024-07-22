import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';
import { IFnzConfirmacionEntrega } from '../pages/core/helpers/interfaces/fnz-confirmacion-entrega';

@Injectable({
  providedIn: 'root',
})
export class ConfirmacionEntregaService {
  private readonly apiUrl = `${environment.urlApi}/core/confirmacion-entrega`;

  constructor(private http: HttpClient) {}

  getByIdAndGetCatalogosToEdit(
    _id: string
  ): Observable<IResponse<IFnzConfirmacionEntrega>> {
    return this.http.get<IResponse<IFnzConfirmacionEntrega>>(
      `${this.apiUrl}/find-one-to-edit/${_id}`
    );
  }

  update(
    _id: string,
    validacion: IFnzConfirmacionEntrega
  ): Observable<IResponse<IFnzConfirmacionEntrega>> {
    return this.http.put<IResponse<IFnzConfirmacionEntrega>>(
      `${this.apiUrl}/${_id}`,
      validacion
    );
  }

  create(
    validacion: IFnzConfirmacionEntrega
  ): Observable<IResponse<IFnzConfirmacionEntrega>> {
    return this.http.post<IResponse<IFnzConfirmacionEntrega>>(
      `${this.apiUrl}`,
      validacion
    );
  }

  uploadFile(formData: any): Observable<IResponse<any>> {
    return this.http.post<IResponse<any>>(
      `${environment.urlApi}/expedientedigital/archivos`,
      formData
    );
  }

  notifyFormatosFirmados(data: any): Observable<IResponse<any>> {
    return this.http.post<IResponse<any>>(
      `${this.apiUrl}/notify-formatos-firmados`,
      data
    );
  }
}
