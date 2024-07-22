import { ObjectId } from 'src/app/shared/helpers/types/objectid.type';

export interface RecoleccionFisicosType {
    folio: ObjectId;
    archivo: ObjectId;
    claveGuia?:string;
}
