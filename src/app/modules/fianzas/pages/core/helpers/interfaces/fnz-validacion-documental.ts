import { ICatalogo } from "src/app/modules/catalogos/helpers/interfaces/catalogo";
import { ObjectId } from "src/app/shared/helpers/types/objectid.type";

export interface IFnzArchivoValidacion {
  id: ObjectId;
  documento: string;
  url: string;
  motivos: ICatalogo[];
  vigencia?: boolean;
  fechaVigencia: string;
  correcto: boolean;
  idMotivo?: number;
  categoria: number;
  documento_id: string;
}

export interface IFnzArchivoComplementarios {
  id: ObjectId;
  documento: string;
  url: string;
}


//ajustes
export interface IFnzValidacionDigital {
  _id?: ObjectId;
  folio?: ObjectId;
  archivoFic?: ObjectId;
  archivoAnexo?: ObjectId;
  archivos?: any[]
}

export interface IFnzValidacionDigitalArchivos {
  documento: number;
  correcto: boolean;
  motivo: number;
}

export interface IFnzValidacionDigitalEdit {
  documentos: Array<IFnzValidacionDigital>;
  catalogos: IFnzValidacionDigitalCatalogs;
}

export interface IFnzValidacionDigitalCatalogs {
  motivos: Array<ICatalogo>;
}

export interface IFnzFileBase64 {
  base64: string;
  contentType: string
}

export interface IFnzValidacionArchivos {
  expediente?: ObjectId;
  documento: ObjectId;
  motivo?: number;
  vigencia?: boolean;
  correcto?: boolean;
  url?: string;
  fechaVigencia?: Date
}

