import { ObjectId } from 'src/app/shared/helpers/types/objectid.type';

export interface IPais {
  _id: ObjectId;
  clave: number;
  descripcion: string;
  abreviatura: string;
  icon: string;
  activo: boolean;
}
 
 
