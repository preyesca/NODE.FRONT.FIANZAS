import { ObjectId } from "src/app/shared/helpers/types/objectid.type";

export interface ISaveComentario{
    folio: string;
    bitacora?: ObjectId;
    comentarios: string;
    actividad: number;
}

export interface IComentario {
    _id?: ObjectId;
    folio: string;
    actividades: IDetalleComentario;
}

export interface IDetalleComentario {
    bitacora?: ObjectId;
    comentarios: string;
    actividad: number;
    fecha?: Date;
}