import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPaginate } from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';
import {
  IFnzCatalogos,
  IFnzContactoTelefonico,
  IFnzContactoTelefonicoPaginate,
  IFnzInformacionContactoDto,
  IFnzInformacionTelefonicaDto,
} from '../pages/core/helpers/interfaces/fnz-contacto-telefonico';

@Injectable({
  providedIn: 'root',
})
export class FnzContactoTelefonicoService {
  readonly apiUrl = `${environment.urlApi}/core/contacto-telefonico`;

  constructor(private http: HttpClient) {}

  getCatalogos(): Observable<IResponse<IFnzCatalogos>> {
    return this.http.get<IResponse<IFnzCatalogos>>(
      `${this.apiUrl}/get-catalogos`
    );
  }

  getFechaProximaLlamada(clave: number): Observable<IResponse<any>> {
    return this.http.get<IResponse<any>>(`${this.apiUrl}/estatus/${clave}`);
  }

  insert(contacto: IFnzContactoTelefonico): Observable<IResponse<any>> {
    return this.http.post<IResponse<any>>(`${this.apiUrl}`, contacto);
  }

  findAll(
    folio: string
  ): Observable<IResponse<IPaginate<IFnzContactoTelefonicoPaginate>>> {
    return this.http.get<IResponse<IPaginate<IFnzContactoTelefonicoPaginate>>>(
      `${this.apiUrl}/find-all/${folio}`
    );
  }

  insertTelefonoCorrespondencia(
    informacionTelefonicaDto: any
  ): Observable<IResponse<any>> {
    return this.http.post<IResponse<any>>(
      `${this.apiUrl}/create-informacion-telefonica`,
      informacionTelefonicaDto
    );
  }

  getTelefonosCorrespondencia(
    id: string
  ): Observable<IResponse<IFnzInformacionTelefonicaDto[]>> {
    return this.http.get<IResponse<IFnzInformacionTelefonicaDto[]>>(
      `${this.apiUrl}/find-informacion-telefonica/${id}`
    );
  }

  getInformacionContacto(
    id: string
  ): Observable<IResponse<IFnzInformacionContactoDto>> {
    return this.http.get<IResponse<IFnzInformacionContactoDto>>(
      `${this.apiUrl}/find-one-informacion-contacto/${id}`
    );
  }

  updateInformacionContacto(
    _id: string,
    contacto: IFnzInformacionContactoDto
  ): Observable<IResponse<IFnzInformacionContactoDto>> {
    return this.http.put<IResponse<IFnzInformacionContactoDto>>(
      `${this.apiUrl}/informacion-contacto/${_id}`,
      contacto
    );
  }

  deleteTelefonoCorrespondencia(id: string): Observable<IResponse<any>> {
    return this.http.delete<IResponse<any>>(
      `${this.apiUrl}/delete-informacion-telefonica/${id}`
    );
  }

  updateToBandejaProgramada(
    folio: number,
    actividad: number
  ): Observable<IResponse<any>> {
    return this.http.put<IResponse<any>>(
      `${this.apiUrl}/update-to-bandeja-programada/${folio}/${actividad}`,
      {}
    );
  }

  finalizaActividad(
    folioMultisistema: number,
    folio: string,
    actividad: number,
    comentario:string
  ): Observable<IResponse<any>> {
    return this.http.put<IResponse<any>>(
      `${this.apiUrl}/finaliza-actividad/${folioMultisistema}/${folio}/${actividad}`,
      {comentario}
    );
  }
}
