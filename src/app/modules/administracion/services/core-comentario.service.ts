import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';
import {
  IComentario,
  ISaveComentario,
} from '../helpers/interfaces/core-comentario';

@Injectable({
  providedIn: 'root',
})
export class ComentarioService {
  readonly apiUrl = `${environment.urlApi}/core/comentario`;

  constructor(private http: HttpClient) {}

  create(data: ISaveComentario) {
    return this.http.post<IResponse<IComentario>>(`${this.apiUrl}`, data);
  }

  find(folio: string, actividad: string) {
    return this.http.get<IResponse<IComentario[]>>(
      `${this.apiUrl}/findOne-by-folio-actividad?folio=${folio}&actividad=${actividad}`
    );
  }

  update(id: string, data: IComentario) {
    return this.http.put<IResponse<IComentario[]>>(
      `${this.apiUrl}/${id}`,
      data
    );
  }
}
