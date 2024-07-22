import { ObjectId } from 'src/app/shared/helpers/types/objectid.type';

export interface ICatalogo {
  _id: ObjectId;
  clave: number;
  descripcion: string;
  activo: true;
  pais:number;
}
