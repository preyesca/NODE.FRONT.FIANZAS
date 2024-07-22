import { ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AppConsts } from 'src/app/shared/AppConsts';
import { SwalService } from 'src/app/shared/services/notification/swal.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { IResponse } from './../../../../../shared/helpers/interfaces/response';
import { FnzContactoTelefonicoService } from '../../../services/fnz-contacto-telefonico.service';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { FnzWorkFlowService } from '../../../services/fnz.workflow.service';
import { FnzWorkFlowActividadService } from '../../../services/fnz-workflow-actividad.service';
import { IFnzFlujoConsulta } from '../helpers/interfaces/fnz-flujo-consulta';
import { IFnzCatalogos, IFnzContactoTelefonico, IFnzContactoTelefonicoPaginate, IFnzInformacionContactoDto, IFnzInformacionTelefonicaDto, IFznActividad } from '../helpers/interfaces/fnz-contacto-telefonico';
import { IFnzBandejaPaginate } from '../helpers/interfaces/fnz-bandeja';
import { EFnzEstatusActividad } from '../../../helpers/enums/fnz-estatus-actividad.enum';
import { EFnzActividad } from '../../../helpers/enums/fnz-actividad.enum';
import { IFnzWorkflowDetalle, IFnzWorklFlow } from '../helpers/interfaces/fnz-workflow';
import { EFnzNotificacion } from '../helpers/enums/fnz.notificacion.enum';
import { IPaginate } from 'src/app/shared/helpers/interfaces/paginate';
import { ICatalogo } from 'src/app/modules/catalogos/helpers/interfaces/catalogo';
import { FnzEstatusBitacoraConsts } from '../../../helpers/consts/core/fnz-estatus-bitacora.consts';
import { MatSelectChange } from '@angular/material/select';
import { ECatTipoLlamada } from 'src/app/shared/helpers/enums/catalog/cat.tipo-llamada.enum';
import { ECatEstatusContactoTelefonico } from 'src/app/shared/helpers/enums/catalog/cat.estatus-contacto-telefonico.enum';
import { KYCEActividad } from 'src/app/modules/administracion/helpers/enums/kyc-actividad.enum';

@Component({
  selector: 'app-fnz-contacto-telefonico',
  templateUrl: './fnz-contacto-telefonico.component.html',
  styleUrls: ['./fnz-contacto-telefonico.component.scss']
})
export class FnzContactoTelefonicoComponent {
  readonly separatorKeysCodes = [ENTER] as const;
  public modalOpen = false;
  PATTERN_EMAIL: RegExp = AppConsts.PATTERN.EMAIL_ADDRESS;
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('chipGrid') chipGrid: any;

  actividades!: IFznActividad[];
  breadcrumbs: string[] = ['Fianzas', 'Contacto telefonico'];
  itemsPorPage: Array<number> = [];
  catalogos!: IFnzCatalogos;
  estatus!: ICatalogo[];
  contacto: Array<IFnzContactoTelefonicoPaginate> = [];
  displayColumns = [
    'fechaContacto',
    'usuario',
    'tipoLlamada',
    'estatus',
    'fechaProximaLlamada',
    'observaciones',
  ];
  frmContactoTelefonico!: FormGroup;
  frmInformacionContacto!: FormGroup;
  catalogs!: IFnzCatalogos;
  itemTelefonoCorrespondencia: any;
  lstTelefonosCorrespondecia: IFnzInformacionTelefonicaDto[] = [];
  folio!: IFnzBandejaPaginate;
  correos: any = [];
  currentIdContacto: string | undefined = '';
  readonlyModule: boolean = false;
  flujoConsulta!: IFnzFlujoConsulta;
  // @Output() reload: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private router: Router,
    private readonly route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private contactoTelefonicoService: FnzContactoTelefonicoService,
    private readonly notifierService: NotifierService,
    private workflowService: FnzWorkFlowService,
    private swalService: SwalService,
    private userStorageService: UserStorageService,
    private workFlowActividadService: FnzWorkFlowActividadService
  ) {
    this.itemsPorPage = AppConsts.DEFAULT.pagination.table.itemsPorPage;
  }

  ngOnInit(): void {
    this.loadForm();
    this.init();
  }

  init(): void {
    const folio = this.route.snapshot.paramMap.get('id') || undefined;
    this.readonlyModule = history.state.readonlyModule || false;

    if (!folio) {
      this.return();
      return;
    }

    this.workFlowActividadService
      .getActividadByFolioAndActividad(folio, EFnzActividad.CONTACTO_TELEFONICO)
      .subscribe({
        next: (response: IResponse<IFnzWorkflowDetalle>) => {
          if (response.success) {
            // TODO
            this.userStorageService.saveFolioInfo(response.data);
            this.folio = response.data;
            this.loadInformacionContacto();
            this.loadCatalogos();
            this.findAll();
            this.getTelefonosCorrespondecia();
          } else {
            console.error(response.message);
            this.return();
          }
        },
        error: (err) => {
          this.notifierService.warning(err?.error?.message);
          this.return();
        },
      });

    if (this.readonlyModule) {
      this.frmContactoTelefonico.disable();
      this.frmInformacionContacto.disable();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadForm() {
    this.frmContactoTelefonico = this.formBuilder.group({
      idTipoLlamada: ['', [Validators.required]],
      idEstatusLlamada: ['', [Validators.required]],
      fechaProximaLlamada: new UntypedFormControl({
        value: '',
        disabled: true,
      }),
      observaciones: ['', [Validators.required]],
    });

    this.frmInformacionContacto = this.formBuilder.group({
      nombre: new UntypedFormControl('', [Validators.required]),
      tipo: new UntypedFormControl('', [Validators.required]),
      emailCorrespondencia: new UntypedFormControl(''),
      correos: new UntypedFormControl('', [Validators.email]),
    });
  }

  loadInformacionContacto() {
    this.contactoTelefonicoService
      .getInformacionContacto(this.folio.folio)
      .subscribe({
        next: (response: IResponse<IFnzInformacionContactoDto>) => {
          if (response.success) {
            const newobject = {
              nombre: response.data.nombre,
              tipo: response.data.tipo,
            };
            this.currentIdContacto = response.data._id;
            this.getDataEmail(response.data.correos);
            this.frmInformacionContacto.patchValue(newobject);
          }
        },
      });
  }

  loadCatalogos() {
    this.contactoTelefonicoService
      .getCatalogos()
      .subscribe((catalogos: IResponse<IFnzCatalogos>) => {
        this.catalogos = catalogos.data;
        this.estatus = this.catalogos.estatus;
        this.setEstatus();
      });
  }

  setEstatus() {
    this.workflowService
      .getInfoFolioActividades(
        this.folio.folioMultisistema,
        this.folio.proyecto
      )
      .subscribe({
        next: (response: IResponse<IFznActividad[]>) => {
          if (response.success) {

            this.actividades = response.data.filter(
              (x) =>
                x.estatus != EFnzEstatusActividad.COMPLETADA &&
                x.actividad != EFnzActividad.CONTACTO_TELEFONICO
            );

            if (this.actividades.length > 0) {
              switch (this.actividades[0].actividad) {
                case EFnzActividad.VALIDACION_DIGITAL:
                case EFnzActividad.CARGA_DOCUMENTAL:
                  this.estatus = this.estatus.filter((e) =>
                    [1, 2, 3, 4].includes(e.clave)
                  );
                  break;

                case EFnzActividad.GENERACION_FORMATOS:
                  this.estatus = this.estatus.filter((e) =>
                    [2, 4, 9].includes(e.clave)
                  );
                  break;

                case EFnzActividad.FIRMA_DOCUMENTAL:
                  this.estatus = this.estatus.filter((e) =>
                    [2, 4, 5].includes(e.clave)
                  );
                  break;

                case EFnzActividad.VALIDACION_FIRMAS:
                  this.estatus = this.estatus.filter((e) =>
                    [2, 4, 7].includes(e.clave)
                  );
                  break;

                case EFnzActividad.VALIDACION_AFIANZADORA:
                  this.estatus = this.estatus.filter((e) =>
                    [2, 4, 10].includes(e.clave)
                  );
                  break;

                case EFnzActividad.RECOLECCION_DE_FISICOS:
                  this.estatus = this.estatus.filter((e) =>
                    [2, 4, 11].includes(e.clave)
                  );
                  break;

                case EFnzActividad.VALIDACION_DE_ORIGINALES:
                  this.estatus = this.estatus.filter((e) =>
                    [2, 4, 12].includes(e.clave)
                  );
                  break;

                case EFnzActividad.CONFIRMACION_ENTREGA:
                  this.estatus = this.estatus.filter((e) =>
                    [2, 4, 8].includes(e.clave)
                  );
                  break;
              }
            }
          }
        },
      });
  }

  selectEstatus(idEstatus: number) {
    this.contactoTelefonicoService
      .getFechaProximaLlamada(idEstatus)
      .subscribe((response: IResponse<any>) => {
        const fecha = moment(response.data.fechaProximaLlamada).format(AppConsts.FORMAT.DATETIME);
        this.frmContactoTelefonico.controls['fechaProximaLlamada'].setValue(fecha);
      });
  }

  selectLlamada(event: MatSelectChange) {
    if (event.value === ECatTipoLlamada.ENTRANTE) {
      this.estatus = this.estatus.filter(
        (e) => e.clave !== ECatEstatusContactoTelefonico.NO_CONTESTA
      );
    } else {
      this.loadCatalogos();
    }
  }

  agregarContacto() {
    let contactoTelefonico: IFnzContactoTelefonico = {
      folio: this.folio.folio,
      tipoLlamada: this.frmContactoTelefonico.value.idTipoLlamada,
      observaciones: this.frmContactoTelefonico.value.observaciones,
      estatus: this.frmContactoTelefonico.value.idEstatusLlamada,
    };

    let idEstatus = this.frmContactoTelefonico.value.idEstatusLlamada;

    if (this.frmContactoTelefonico.invalid) {
      this.frmContactoTelefonico.markAllAsTouched();
      return;
    }

    if (this.frmContactoTelefonico.valid) {
      switch (idEstatus) {
        //Avanza Actividad
        //Datos Incorrectos
        case 1:
          let workflowca: IFnzWorklFlow = {
            folio: this.folio.folio,
            actividadInicial: this.folio.actividadCodigo,
            actividadFinal: EFnzActividad.CONTACTO_ASEGURADORA,
            actividad: FnzEstatusBitacoraConsts.DATOS_DE_CONTACTO_INCORRECTOS,
            notificacion: EFnzNotificacion.DATOS_CONTACTO,
            comentarios: contactoTelefonico.observaciones
          };

          this.insert(contactoTelefonico);

          this.workflowService.avanzar(workflowca).subscribe({
            next: (response: IResponse<any>) => {
              if (response.success) {

                workflowca.actividadInicial = this.actividades[0].actividad;
                this.workflowService.completar(workflowca).subscribe();

                this.swalService
                  .success({
                    html: 'Información almacenada correctamente, se avanzó la actividad a <b>Contacto Aseguradora</b>',
                  })
                  .then((okay) => {
                    this.router.navigate(['/bandejas']);
                  });
              }
            },
          });

          break;

        //Se cambia a Bandejas Programadas
        case 2: //No contesta
        case 3: //En espera de documentos digitales
        case 5: //En espera firma cliente
        case 6: //En espera firma ejecutivo
        case 7: //validacion firmas
        case 8: //Formatos enviados a aseguradora
          this.insert(contactoTelefonico);
          this.contactoTelefonicoService
            .updateToBandejaProgramada(
              this.folio.folioMultisistema,
              this.folio.actividadCodigo
            )
            .subscribe({
              next: (response: IResponse<any>) => {
                if (response.success) {
                  this.swalService
                    .success({
                      html: 'Información almacenada correctamente, la actividad se encuentra en la <b>Bandeja Programadas</b>',
                    })
                    .then((okay) => {
                      this.router.navigate(['/bandejas']);
                    });
                }
              },
            });
          break;

        //No realiza ninguna accion
        // case 3: //En espera de documentos digitales
        //   this.insert(contactoTelefonico, true);
        //   break;

        //Se finaliza
        case 4: //No desea continuar con el tramite
          let workflowda: IFnzWorklFlow = {
            folio: this.folio.folio,
            actividadInicial: this.folio.actividadCodigo,
            actividadFinal: KYCEActividad.FIN,
            actividad: FnzEstatusBitacoraConsts.NONE,
            comentarios: contactoTelefonico.observaciones,
            notificacion: EFnzNotificacion.NO_CONTINUA_PROCESO,
          };
          this.swalService
            .question({
              html: 'El folio se finalizará, ¿Esta seguro?',
            })
            .then((response) => {
              if (response.isConfirmed) {
                this.insert(contactoTelefonico);
                this.contactoTelefonicoService
                  .finalizaActividad(
                    this.folio.folioMultisistema,
                    this.folio.folio,
                    this.folio.actividadCodigo,
                    contactoTelefonico.observaciones
                  )
                  .subscribe({});
                this.workflowService
                  .notificacionNoContinuaProceso(workflowda)
                  .subscribe({});
                this.router.navigate(['/bandejas']);
              }
            });
          break;
      }
    }
  }

  insert(contactoTelefonico: IFnzContactoTelefonico, flag: boolean = false) {
    this.contactoTelefonicoService.insert(contactoTelefonico).subscribe({
      next: (response: IResponse<any>) => {
        if (response.success) {
          this.limpiarCampos();
          this.findAll();
          if (flag) {
            this.swalService
              .success({
                html: response.message,
              })
              .then((okay) => {
                this.router.navigate(['/bandejas']);
              });
          }
        }
      },
      error: (err) => this.notifierService.warning(err?.error?.message),
    });
  }

  findAll() {
    this.contactoTelefonicoService
      .findAll(this.folio.folio)
      .subscribe(
        (response: IResponse<IPaginate<IFnzContactoTelefonicoPaginate>>) => {
          if (response.success) {
            this.dataSource.data = response.data.docs;
          }
        }
      );
  }

  actualizarContacto() {
    if (this.lstTelefonosCorrespondecia.length === 0) {
      this.swalService.info({
        text: 'No se ha registrado la información telefónica del contacto.',
      });
      return;
    }

    this.validateEmail();

    if (this.frmInformacionContacto.valid) {
      this.validateEmail();
      const email = this.getEmail();
      this.frmInformacionContacto.get('emailCorrespondencia')?.setValue(email);

      let informacionContacto: IFnzInformacionContactoDto = {
        folio: this.folio.folio,
        nombre: this.frmInformacionContacto.value.nombre,
        tipo: this.frmInformacionContacto.value.tipo,
        correos: this.frmInformacionContacto.value.emailCorrespondencia
          .toString()
          .split(','),
      };

      this.contactoTelefonicoService
        .updateInformacionContacto(this.currentIdContacto!, informacionContacto)
        .subscribe({
          next: (response: IResponse<IFnzInformacionContactoDto>) => {
            if (response.success) {
              this.notifierService.success(response.message);
            }
          },
          error: (err) =>
            this.notifierService.error(err?.error?.message, 'Error'),
        });
    } else {
      if (this.frmInformacionContacto.invalid) {
        this.frmInformacionContacto.markAllAsTouched();
        return;
      }
    }
  }

  getTelefonosCorrespondecia() {
    this.contactoTelefonicoService
      .getTelefonosCorrespondencia(this.folio.folio)
      .subscribe({
        next: (response: IResponse<IFnzInformacionTelefonicaDto[]>) => {
          if (response.success) {
            this.lstTelefonosCorrespondecia = response.data;
          }
        },
      });
  }

  limpiarCampos() {
    this.frmContactoTelefonico.controls['fechaProximaLlamada'].setValue('');
    this.frmContactoTelefonico.controls['observaciones'].setValue(' ');
    this.frmContactoTelefonico.controls['idTipoLlamada'].setValue(0);
    this.frmContactoTelefonico.controls['idEstatusLlamada'].setValue(0);
  }

  getDataEmail(email: string[]) {
    email?.forEach((x) => {
      if (x !== '') {
        if (this.validateEmailPattern(x)) {
          this.correos.push({ name: x, invalid: false });
        } else {
          this.correos.push({ name: x, invalid: true });
        }
      }
    });
  }

  checkValidEmail(): void {
    this.chipGrid.errorState = this.correos.length == 0;
    let correo = this.frmInformacionContacto.get('correos');
    correo?.patchValue(this.correos.join(','));
    correo?.setErrors(this.correos.length == 0 ? { required: true } : null);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value == '') return;

    if (!this.PATTERN_EMAIL.test(value)) {
      this.notifierService.info('Escriba un correo electrónico valido', '');
      event.chipInput.clear();
      return;
    }

    if (this.correos.filter((f: any) => f.name == value).length > 0) {
      this.notifierService.info('El correo electrónico ya esta registrado', '');
      event.chipInput.clear();
      return;
    }

    this.correos.push({ name: value, invalid: false });

    this.checkValidEmail();
    event.chipInput.clear();
  }

  remove(email: string): void {
    const index = this.correos.indexOf(email);
    if (index >= 0) this.correos.splice(index, 1);
    this.checkValidEmail();
  }

  validateEmailPattern(email: string) {
    var re = AppConsts.PATTERN.EMAIL_ADDRESS;
    return re.test(String(email).toLowerCase());
  }

  onItemChanged(item: any) {
    this.itemTelefonoCorrespondencia = item;
  }

  onModalOpenChanged(open: boolean) {
    this.modalOpen = open;
    this.getTelefonosCorrespondecia();

  }

  getEmail(): string {
    let email = '';
    this.correos.map((element: any) => {
      if (this.correos.length > 1) {
        email += element.name + ',';
      } else {
        email += element.name;
      }
    });

    if (email.charAt(email.length - 1) == ',')
      email = email.substring(0, email.length - 1);
    return email;
  }

  validateEmail() {
    if (this.correos.length == 0) {
      this.chipGrid.errorState = true;
      this.frmInformacionContacto
        .get('emailCorrespondencia')
        ?.setErrors({ incorrect: true });
    }

    if (
      this.correos.length > 0 &&
      this.correos.filter((f: any) => f.invalid).length > 0
    ) {
      this.chipGrid.errorState = true;
      this.frmInformacionContacto
        .get('emailCorrespondencia')
        ?.setErrors({ incorrect: true });
    }

    if (
      this.correos.length > 0 &&
      this.correos.filter((f: any) => !f.invalid).length == this.correos.length
    ) {
      this.chipGrid.errorState = false;
      this.frmInformacionContacto.get('emailCorrespondencia')?.setErrors(null);
    }
  }

  closeModal($event: any): void {
    this.itemTelefonoCorrespondencia = null;
    this.modalOpen = false;
    this.getTelefonosCorrespondecia();
  }

  reload($event: any) {
    this.getTelefonosCorrespondecia();
  }

  return(): void {
    this.router.navigate([
      this.readonlyModule ? '/busquedas' : '/bandejas',
    ]);
  }
}
