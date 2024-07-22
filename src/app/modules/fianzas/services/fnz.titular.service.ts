import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IPaginate,
  IRequestPaginate,
} from 'src/app/shared/helpers/interfaces/paginate';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FnzTitularService {
  private readonly apiUrl = `${environment.urlApi}/core/titular`;

  constructor(private http: HttpClient) {}

  getTitulares() {
    return this.http.get<IResponse<any>>(`${this.apiUrl}/find-all`);
  }

  getTitularesSolicitudes({
    paginate,
  }: IRequestPaginate): Observable<IResponse<IPaginate<any>>> {
    return this.http.get<IResponse<IPaginate<any>>>(
      `${this.apiUrl}/find-titular-solicitudes`,
      { params: paginate }
    );
  }
}
