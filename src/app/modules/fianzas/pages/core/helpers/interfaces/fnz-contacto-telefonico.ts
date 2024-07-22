import { ICatalogo } from "src/app/modules/catalogos/helpers/interfaces/catalogo";
import { ObjectId } from "src/app/shared/helpers/types/objectid.type";

export interface IFnzCatalogos {
    tipoLlamada: Array<ICatalogo>;
    estatus: Array<ICatalogo>;
    tipoContacto: Array<ICatalogo>;
}

export interface IFnzContactoTelefonico {
    folio: ObjectId;
    usuario?: ObjectId;
    tipoLlamada: number;
    estatus: number;
    observaciones: string;
}

export interface IFnzContactoTelefonicoPaginate {
    fechaContacto: string;
    usuario: string;
    tipoLlamada: string;
    estatus: string;
    fechaProximaLlamada: string;
    observaciones: string;
}

export interface IFnzInformacionTelefonicaDto {
    folio: ObjectId;
    telefono: string;
    extensiones: string[];
}

export interface IFnzInformacionContactoDto {
    _id?: string;
    folio: ObjectId;
    nombre: string;
    tipo: number;
    correos: string[];
}

export interface IFznActividad {
    _id?: ObjectId;
    proyecto: string;
    folioMultisistema: number;
    actividad: number;
    estatus: number;
    usuario: number;
    rol: number;
}

