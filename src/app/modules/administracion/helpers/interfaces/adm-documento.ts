import { ICatalogo } from "src/app/modules/catalogos/helpers/interfaces/catalogo";
import { ICatalogoPais } from "src/app/modules/catalogos/helpers/interfaces/catalogo-pais";
import { ObjectId } from "src/app/shared/helpers/types/objectid.type";

export interface IDocumentoPaginate {
  _id: ObjectId;
  pais: string;
  categoria: string;
  estatus: string;
  nombreBase: string;
  nombre: string;
  estadoFlag: boolean;
  abreviatura: string;

}

export interface IDocumentoEdit {
  documento: IDocumento;
  catalogo: IDocumentoGetCatalogs;
}

export interface IDocumento {
  _id: ObjectId;
  pais: string;
  categoria: number;
  estatus: string;
  nombre: string;
  clave: string;
  nombreBase: string;
  activo: boolean;
}

export interface IDocumentoGetCatalogs {
  paises: Array<ICatalogoPais>;
  estatus: Array<ICatalogo>;
  categoriaDocumento: Array<ICatalogo>;
}
