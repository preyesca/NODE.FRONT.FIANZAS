import { ICatalogo } from 'src/app/modules/catalogos/helpers/interfaces/catalogo';
import { ICatalogoPais } from 'src/app/modules/catalogos/helpers/interfaces/catalogo-pais';
import { ObjectId } from 'src/app/shared/helpers/types/objectid.type';
import { IAseguradora, IProyecto } from './adm-proyecto';
import { IDocumento } from './adm-documento';

export interface IConfiguracionDocumental {
  pais: number;
  estatus: number;
  aseguradora: ObjectId;
  proyecto: ObjectId;
  tipoPersona: number;
  giro: number;
  documento: IConfiguracionDocumentalDocumentos[];
}

export interface IConfiguracionDocumentalEdit{
  configuracionDocumental: IConfiguracionDocumental;
  catalogos: IConfiguracionDocumentalCatalogs;
}

export interface IConfiguracionDocumentalPaginate {
  _id: ObjectId;
  pais: IPais;
  proyecto: IProyecto;
  aseguradora: IAseguradora;
  tipoPersona: ICommon;
  giro: ICommon;
}

export interface IPais {
  _id: ObjectId;
  clave: number;
  descripcion: string;
  abreviatura: string;
  icon: string;
  activo: boolean;
}

export interface ICommon {
  _id: ObjectId;
  clave: number;
  descripcion: string;
  activo: boolean;
}
export interface IAseguradoraCatalog {
  _id: ObjectId;
  razonSocial: string;
  nombreComercial: string;
  pais: number;
  estatus: number;
  altaConfiguracionDocumental: boolean;
  documentos: boolean;
}

export interface IProyectoCatalog {
  _id: ObjectId;
  pais: number;
  estatus: number;
  aseguradora: ObjectId;
  proceso: number;
  negocio: number;
  ramo: number;
  ceco: string;
  codigo: string;
}

export interface IConfiguracionDocumentalCodigo {
  _id: ObjectId;
  codigo: string;
}

export interface IConfiguracionDocumentalCatalogs {
  paises: Array<ICatalogoPais>;
  aseguradora: Array<IAseguradoraCatalog>;
  proyecto: Array<IProyectoCatalog>;
  tipoPersona: Array<ICatalogo>;
  giro: Array<ICatalogo>;
  estatus: Array<ICatalogo>;
  documento: Array<IDocumento>;
  motivo: Array<ICatalogo>;
}

export interface IConfiguracionDocumentalDocumentos {
  documento: string;
  nombre: string;
  clave: string;
  categoria?: number;
  activo: boolean;
  obligatorio: boolean;
  ocr: boolean;
  vigencia: boolean;
  motivosRechazo: number[];
  motivo?:any[]
}
