import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginateParamsGenerator } from 'src/app/shared/helpers/generator/paginate-params.generator';
import { IPaginateParams } from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FnzActividadesService {
  private readonly apiUrl = `${environment.urlApi}/bitacora/actividad`;

  constructor(private http: HttpClient) {}

  getInfoFolioActividades(folio: string, paginateParams: IPaginateParams) {
    return this.http.get<IResponse<any>>(
      `${this.apiUrl}/select-by-folio-for-detalle/${folio}?${PaginateParamsGenerator.getUri(
        paginateParams
      )}`
    );
  }
}
