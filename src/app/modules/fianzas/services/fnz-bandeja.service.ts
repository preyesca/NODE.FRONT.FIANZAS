import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginateParamsGenerator } from 'src/app/shared/helpers/generator/paginate-params.generator';
import {
  IPaginate,
  IPaginateParams,
} from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';
import { IFnzBandejaPaginate } from '../pages/core/helpers/interfaces/fnz-bandeja';

@Injectable({
  providedIn: 'root',
})
export class FnzBandejaService {
  readonly apiUrl = `${environment.urlApi}/core/bandeja`;

  constructor(private http: HttpClient) {}

  entradas(
    paginateParams: IPaginateParams
  ): Observable<IResponse<IPaginate<IFnzBandejaPaginate>>> {
    return this.http.get<IResponse<IPaginate<IFnzBandejaPaginate>>>(
      `${this.apiUrl}/entradas?${PaginateParamsGenerator.getUri(
        paginateParams
      )}`
    );
  }

  reprocesos(
    paginateParams: IPaginateParams
  ): Observable<IResponse<IPaginate<IFnzBandejaPaginate>>> {
    return this.http.get<IResponse<IPaginate<IFnzBandejaPaginate>>>(
      `${this.apiUrl}/reprocesos?${PaginateParamsGenerator.getUri(
        paginateParams
      )}`
    );
  }

  suspendidas(
    paginateParams: IPaginateParams
  ): Observable<IResponse<IPaginate<IFnzBandejaPaginate>>> {
    return this.http.get<IResponse<IPaginate<IFnzBandejaPaginate>>>(
      `${this.apiUrl}/suspendidas?${PaginateParamsGenerator.getUri(
        paginateParams
      )}`
    );
  }

  programadas(
    paginateParams: IPaginateParams
  ): Observable<IResponse<IPaginate<IFnzBandejaPaginate>>> {
    return this.http.get<IResponse<IPaginate<IFnzBandejaPaginate>>>(
      `${this.apiUrl}/programadas?${PaginateParamsGenerator.getUri(
        paginateParams
      )}`
    );
  }

  busquedas(
    showFinalizados: string,
    paginateParams: IPaginateParams
  ): Observable<IResponse<IPaginate<IFnzBandejaPaginate>>> {
    return this.http.get<IResponse<IPaginate<IFnzBandejaPaginate>>>(
      `${
        this.apiUrl
      }/busqueda/${showFinalizados}?${PaginateParamsGenerator.getUri(
        paginateParams
      )}`
    );
  }
}
