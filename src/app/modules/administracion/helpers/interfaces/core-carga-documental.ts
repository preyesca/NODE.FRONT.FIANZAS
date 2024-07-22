import { IConfiguracionDocumentalDocumentos } from "./adm-configuracion-documental";
import { ITitular } from "./core-titular";

export interface ICargaDocumentalMasivaCatalogs {
    titular?: ITitular[];
    documento?: IConfiguracionDocumentalDocumentos[];
}

export interface IArchivo {
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