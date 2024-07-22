import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginateParamsGenerator } from 'src/app/shared/helpers/generator/paginate-params.generator';
import {
  IPaginate,
  IPaginateParams,
} from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { ObjectId } from 'src/app/shared/helpers/types/objectid.type';
import { environment } from 'src/environments/environment';
import {
  IFnzFolioEstatusPaginate,
  IFnzFolioLayout,
} from '../pages/core/helpers/interfaces/fnz-folio-estatus';

@Injectable({
  providedIn: 'root',
})
export class FnzFolioEstatusService {
  private readonly apiURL = `${environment.urlApi}/core/folio`;

  constructor(private http: HttpClient) {}

  paginateAll(
    paginateParams: IPaginateParams
  ): Observable<IResponse<IPaginate<IFnzFolioEstatusPaginate>>> {
    return this.http.get<IResponse<IPaginate<IFnzFolioEstatusPaginate>>>(
      `${this.apiURL}/paginateLayouts?${PaginateParamsGenerator.getUri(
        paginateParams
      )}`
    );
  }

  getLayoutDetailsByHeader(
    header: ObjectId,
    paginateParams: IPaginateParams
  ): Observable<IResponse<IFnzFolioLayout>> {
    return this.http.get<IResponse<IFnzFolioLayout>>(
      `${this.apiURL}/find-layout/${header}?${PaginateParamsGenerator.getUri(
        paginateParams
      )}`
    );
  }
}
