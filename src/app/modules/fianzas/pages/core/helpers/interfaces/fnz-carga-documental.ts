import { IConfiguracionDocumentalDocumentos } from "../../../../../administracion/helpers/interfaces/adm-configuracion-documental";
import { IFnzTitular } from "./fnz-titular";

export interface IFnzCargaDocumentalMasivaCatalogs {
    titular?: IFnzTitular[];
    documento?: IConfiguracionDocumentalDocumentos[];
}

export interface IFnzArchivo {
    titular: string,
    documento: string,
    aseguradora: string,
    nombreOriginal: string,
    nombreDocumento: string,
    indexDocumento?: number,
    fechaVigencia: Date,
    vigencia:boolean,
    file: File
  }