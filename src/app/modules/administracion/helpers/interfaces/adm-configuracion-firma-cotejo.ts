import { ObjectId } from "src/app/shared/helpers/types/objectid.type";

export interface IConfiguracionFirmaCotejoPaginate {
    idProyecto: ObjectId;
    paisDescripcion: string;
    paisIcon: string;
    proyecto: string;
}


export interface IConfiguracionFirmaCotejo {
    idProyecto: ObjectId;
    paisDescripcion: string;
    paisIcon: string;
    proyecto: string;
}
