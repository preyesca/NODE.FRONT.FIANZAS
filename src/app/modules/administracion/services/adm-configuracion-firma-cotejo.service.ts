import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IPaginate,
  IPaginateParams,
} from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';

import { PaginateParamsGenerator } from 'src/app/shared/helpers/generator/paginate-params.generator';
import {
  IConfiguracionFirmaCotejo,
  IConfiguracionFirmaCotejoPaginate,
} from '../helpers/interfaces/adm-configuracion-firma-cotejo';
import {
  IEjectivo,
  IFirmaCotejo,
} from '../pages/adm-configuracion-firma-cotejo/adm-configuracion-firma-cotejo-form/adm-configuracion-firma-cotejo-form.component';

@Injectable({
  providedIn: 'root',
})
export class AdmConfiguradorFirmaCotejoService {
  private API_ADMINISTRACION = `${environment.urlApi}/administracion`;

  constructor(private http: HttpClient) {}

  paginate(
    paginateParams: IPaginateParams
  ): Observable<IResponse<IPaginate<IConfiguracionFirmaCotejoPaginate>>> {
    return this.http.get<
      IResponse<IPaginate<IConfiguracionFirmaCotejoPaginate>>
    >(
      `${
        this.API_ADMINISTRACION
      }/configurador-firma-cotejo/paginate?${PaginateParamsGenerator.getUri(
        paginateParams
      )}`
    );
  }

  selectAll(): Observable<IResponse<any>> {
    return this.http.get<
      IResponse<IPaginate<IConfiguracionFirmaCotejoPaginate>>
    >(`${this.API_ADMINISTRACION}/configurador-firma-cotejo/select-all`);
  }

  selectById(id: string): Observable<IResponse<IConfiguracionFirmaCotejo>> {
    return this.http.get<IResponse<IConfiguracionFirmaCotejoPaginate>>(
      `${this.API_ADMINISTRACION}/configurador-firma-cotejo/select-by-id/${id}`
    );
  }

  selectByProyecto(proyecto: string): Observable<IResponse<any>> {
    return this.http.get<IResponse<any>>(
      `${this.API_ADMINISTRACION}/configurador-firma-cotejo/select-by-proyecto/${proyecto}`
    );
  }

  findEjecutivoByClave(clave: string): Observable<IResponse<any>> {
    return this.http.get<IResponse<any>>(
      `${this.API_ADMINISTRACION}/configurador-firma-cotejo/find-ejecutivo-by-clave/${clave}`
    );
  }

  addConfiguracion(data: IFirmaCotejo): Observable<IResponse<any>> {
    const formData = new FormData();
    data.ejecutivos.forEach((element) => {
      formData.append(
        'firmas',
        element.file!,
        //`firma_${element.clave}.${element.file?.name.split('.').pop()}`
      );
    });
    const infoEjecutivos = data.ejecutivos.map((x) => {
      return {
        clave: x.clave,
        nombre: x.nombre,
        firma: `firma_${x.clave}.${x.firma.split('.').pop()}`,
      };
    });
    formData.append(
      'data',
      JSON.stringify({ proyecto: data.proyecto, ejecutivos: infoEjecutivos })
    );
    return this.http.post<IResponse<any>>(
      `${this.API_ADMINISTRACION}/configurador-firma-cotejo`,
      formData
    );
  }

  downloadFirma(clave: string, firma: string) {
    return this.http.get<any>(
      `${this.API_ADMINISTRACION}/configurador-firma-cotejo/download-firma?clave=${clave}&firma=${firma}`
    );
  }

  deleteFirma(proyecto: string, id: string, clave: string, firma: string) {
    return this.http.get<any>(
      `${this.API_ADMINISTRACION}/configurador-firma-cotejo/delete-firma?proyecto=${proyecto}&idFirma=${id}&clave=${clave}&firma=${firma}`
    );
  }

  addEjecutivo(proyecto: string, data: IEjectivo) {
    const formData = new FormData();
    const nameFile = `firma_${data.clave}.${data.file?.name.split('.').pop()}`;
    formData.append('file', data.file!);
    formData.append('proyecto', proyecto);
    formData.append('clave', data.clave);
    formData.append('nombre', data.nombre);
    formData.append('firma', nameFile);

    return this.http.post<IResponse<any>>(
      `${this.API_ADMINISTRACION}/configurador-firma-cotejo/add-ejecutivo`,
      formData
    );
  }
}
