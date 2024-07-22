import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';
import { IFnzWorkflowDetalle } from '../pages/core/helpers/interfaces/fnz-workflow';

@Injectable({
  providedIn: 'root',
})
export class FnzWorkFlowActividadService {
  readonly apiUrl = `${environment.urlApi}/core/bandeja`;

  constructor(private http: HttpClient) {}

  getActividadByFolioAndActividad(
    folio: string,
    actividad: number
  ): Observable<IResponse<IFnzWorkflowDetalle>> {
    return this.http.get<IResponse<IFnzWorkflowDetalle>>(
      `${this.apiUrl}/workflow/${folio}/${actividad}`,
      {}
    );
  }
}
