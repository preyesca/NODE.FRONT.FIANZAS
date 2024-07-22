import { ObjectId } from 'src/app/shared/helpers/types/objectid.type';
import { IFnzFlujoConsulta } from '../../../shared/helpers/interfaces/fnz-flujo-consulta';
export interface IFnzWorkflowDetalle {
  folio: ObjectId;
  folioMultisistema: number;
  folioCodigo: string;
  cliente: string;
  aseguradora: string;
  actividad: string;
  idActividad: number;
  estado: string;
  fechaInicio: string;
  titular: string;
  proyecto: string;
  actividadCodigo: number;
  actividadId: string;
  fechaInicial: string;
  aseguradoraId: string;
  pais: number;
  estatusActividad: number,
  fechaFinal: string,
  flujoConsulta: IFnzFlujoConsulta;
}


export interface IFnzWorklFlow {
  folio: string;
  actividadInicial: number;
  actividadFinal: number;
  actividad:string;
  notificacion?:number
  idDocumento?:string;
  reproceso?:boolean;
  comentarios?:string;
}