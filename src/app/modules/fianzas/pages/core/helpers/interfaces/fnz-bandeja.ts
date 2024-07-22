import { ObjectId } from 'src/app/shared/helpers/types/objectid.type';
import { IFnzFlujoConsulta } from '../../../shared/helpers/interfaces/fnz-flujo-consulta';
import { IFnzEjecutivo } from '../../../shared/helpers/interfaces/fnz-ejecutivo';

export interface IFnzBandejaPaginate {
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
  estatusActividad: number;
  fechaFinal: string;
  flujoConsulta: IFnzFlujoConsulta;
  ejecutivo?: IFnzEjecutivo
}
