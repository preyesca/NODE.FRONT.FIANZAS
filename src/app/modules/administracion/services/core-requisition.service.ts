import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, first } from 'rxjs';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { environment } from 'src/environments/environment';
import { IModifyFieldData, IRequisitionChange } from '../../metlife/pages/core/helpers/interfaces';
import { EditionTypeFrom } from '../../metlife/pages/shared/modified-fields-historic/helpers/enums/edition-type-from.enum';

@Injectable({
  providedIn: 'root',
})
export class CoreRequisitionService {
  private readonly baseUrl = `${environment.url_metlife}/core/requisition`;

  constructor(private http: HttpClient) {}

  updateFieldToModify(
    requisitionId: number,
    modifyFieldData: IModifyFieldData
  ) {
    const fullUrl = `${this.baseUrl}/${requisitionId}/field-changes`;
    return this.http
      .put<IResponse<null>>(fullUrl, { ...modifyFieldData })
      .pipe(first());
  }

  getFieldChangesByRequisitionId(
    requisitionId: number,
    editionTypeFrom:EditionTypeFrom
  ): Observable<IResponse<IRequisitionChange[]>> {
    return this.http
      .get<IResponse<IRequisitionChange[]>>(
        `${this.baseUrl}/${requisitionId}/field-changes/${editionTypeFrom}`
      )
      .pipe(first());
  }
}
