import { ObjectId } from "src/app/shared/helpers/types/objectid.type";

export interface IFnzComentario {
    _id?: ObjectId;
    folio: string;
    actividades: IFnzDetalleComentario;
}

export interface IFnzDetalleComentario {
    bitacora?: ObjectId;
    comentarios: string;
    actividad: number;
    fecha?: Date;
}
