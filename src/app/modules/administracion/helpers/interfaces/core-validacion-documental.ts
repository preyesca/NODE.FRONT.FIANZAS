import { ICatalogo } from "src/app/modules/catalogos/helpers/interfaces/catalogo";
import { ObjectId } from "src/app/shared/helpers/types/objectid.type";

export interface IArchivoValidacion {
  id: ObjectId;
  documento: string;
  url: string;
  motivos: ICatalogo[];
  vigencia?: boolean;
  fechaVigencia: string;
  correcto: boolean;
  idMotivo?: number;
  categoria: number;
  clave: string;

}

export interface IArchivoComplementarios {
  id: ObjectId;
  documento: string;
  url: string;
}


//ajustes
export interface IValidacionDigital {
  folio?: ObjectId;
  archivos?: any[]
}


export interface IValidacionDigitalEdit {
  documentos: Array<IValidacionDigital>;
  catalogos: IValidacionDigitalCatalogs;
}

export interface IValidacionDigitalCatalogs {
  motivos: Array<ICatalogo>;
}

export interface IFileBase64 {
  base64: string;
  contentType: string
}

export interface IValidacionDigitalArchivos {
  expediente?: ObjectId;
  documento: ObjectId;
  motivo?: number;
  vigencia?:boolean;
  correcto?: boolean;
  url?: string;
  fechaVigencia?:Date
}
