import { EFnzActividad } from 'src/app/modules/fianzas/helpers/enums/fnz-actividad.enum';
import { EFnzEstatusActividad } from 'src/app/modules/fianzas/helpers/enums/fnz-estatus-actividad.enum';
import { ObjectId } from 'src/app/shared/helpers/types/objectid.type';

export interface IFnzFlujoConsulta {
  folio: ObjectId;
  actividadActual: EFnzActividad;
  actividadActualEstatus: EFnzEstatusActividad;
  ultimaActividadActual: EFnzActividad;
  ultimaActividadEstatus: EFnzEstatusActividad;
  actividadContactoTelefonico: EFnzActividad | undefined;
  actividadContactoTelefonicoEstatus: EFnzEstatusActividad | undefined;
  actividadContactoAseguradora: EFnzActividad | undefined;
  actividadContactoAseguradoraEstatus: EFnzEstatusActividad | undefined;
}
