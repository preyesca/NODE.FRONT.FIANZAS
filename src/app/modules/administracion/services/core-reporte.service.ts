import {inject, Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {IResponse} from "../../../shared/helpers/interfaces/response";
import {ICatalogo} from "../../catalogos/helpers/interfaces/catalogo";
import {IReporte} from "../helpers/interfaces/core-reporte";

@Injectable({
  providedIn: 'root',
})
export class CoreReporteService {
  readonly apiUrl = `${environment.urlApi}`;
  readonly #http = inject(HttpClient)

  getReports() {
    return this.#http.get<IResponse<ICatalogo[]>>(`${this.apiUrl}/catalogos/reporte/select`)
  }

  createReport(reporte: IReporte) {
    return this.#http.post<IResponse>(`${this.apiUrl}/core/reporte`, reporte)
  }

}
