import { Observable } from 'rxjs';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';
//import { IFnzWorkflow, IFnzWorlFlow } from "../pages/core/helpers/interfaces/fnz-workflow";
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginateParamsGenerator } from 'src/app/shared/helpers/generator/paginate-params.generator';
import { IPaginateParams } from 'src/app/shared/helpers/interfaces/paginate';
import { IFnzWorklFlow } from '../pages/core/helpers/interfaces/fnz-workflow';

@Injectable({
  providedIn: 'root',
})
export class FnzWorkFlowService {
  private readonly apiUrl = `${environment.urlApi}/workflow`;

  constructor(private http: HttpClient) {}

  getInfoFolioActividad(folio: number, actividad: number, proyecto: string) {
    return this.http.get<IResponse<any>>(
      `${this.apiUrl}/actividad-by-folio?folio=${folio}&actividad=${actividad}&proyecto=${proyecto}`
    );
  }

  getInfoFolioActividades(folio: number, proyecto: string) {
    return this.http.get<IResponse<any>>(
      `${this.apiUrl}/actividades-by-folio?folio=${folio}&proyecto=${proyecto}`
    );
  }

  getInfoFolioActividadesPaginate(
    folio: number,
    proyecto: string,
    paginateParams: IPaginateParams
  ) {
    return this.http.get<IResponse<any>>(
      `${
        this.apiUrl
      }/actividades-by-folio-paginated/${folio}/${proyecto}?${PaginateParamsGenerator.getUri(
        paginateParams
      )}`
    );
  }

  actualizarActividad(_id: string): Observable<IResponse<any>> {
    return this.http.put<IResponse<any>>(
      `${this.apiUrl}/actualizar-actividad/${_id}`,
      {}
    );
  }

  avanzar(workflow: IFnzWorklFlow): Observable<IResponse<any>> {
    return this.http.post<IResponse<any>>(
      `${environment.urlApi}/core/solicitud/avanzar-solicitud`,
      workflow
    );
  }

  reenviarFormatosFirmadosSolicitud(
    workflow: IFnzWorklFlow
  ): Observable<IResponse<any>> {
    return this.http.post<IResponse<any>>(
      `${environment.urlApi}/core/solicitud/reenviar-formatos-firmados-solicitud`,
      workflow
    );
  }

  notificacionNoContinuaProceso(
    workflow: IFnzWorklFlow
  ): Observable<IResponse<any>> {
    return this.http.post<IResponse<any>>(
      `${environment.urlApi}/core/solicitud/notificacion-no-continua-proceso`,
      workflow
    );
  }

  completar(workflow: IFnzWorklFlow): Observable<IResponse<any>> {
    return this.http.post<IResponse<any>>(
      `${this.apiUrl}/completar-actividad`,
      workflow
    );
  }
}
