import { ENTER } from '@angular/cdk/keycodes';
import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AppConsts } from 'src/app/shared/AppConsts';
import { EDocumento } from 'src/app/shared/helpers/enums/core/documento.enum';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { SwalService } from 'src/app/shared/services/notification/swal.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';
import { FnzEstatusBitacoraConsts } from '../../../helpers/consts/core/fnz-estatus-bitacora.consts';
import { EFnzActividad } from '../../../helpers/enums/fnz-actividad.enum';
import { EFnzEstatusActividad } from '../../../helpers/enums/fnz-estatus-actividad.enum';
import { FnzContactoTelefonicoService } from '../../../services/fnz-contacto-telefonico.service';
import { FnzExpedienteDigitalService } from '../../../services/fnz-expediente-digital.service';
import { FnzWorkFlowActividadService } from '../../../services/fnz-workflow-actividad.service';
import { FnzWorkFlowService } from '../../../services/fnz.workflow.service';
import { EFnzNotificacion } from '../helpers/enums/fnz.notificacion.enum';
import { IFnzBandejaPaginate } from '../helpers/interfaces/fnz-bandeja';
import {
  IFnzCatalogos,
  IFnzInformacionContactoDto,
  IFnzInformacionTelefonicaDto,
} from '../helpers/interfaces/fnz-contacto-telefonico';
import {
  IFnzWorkflowDetalle,
  IFnzWorklFlow,
} from '../helpers/interfaces/fnz-workflow';
import { IResponse } from './../../../../../shared/helpers/interfaces/response';

@Component({
  selector: 'app-fnz-contacto-aseguradora',
  templateUrl: './fnz-contacto-aseguradora.component.html',
  styleUrls: ['./fnz-contacto-aseguradora.component.scss'],
})
export class FnzContactoAseguradoraComponent {
  public modalOpen = false;
  readonly separatorKeysCodes = [ENTER] as const;
  @ViewChild('chipGrid') chipGrid: any;
  PATTERN_EMAIL: RegExp = AppConsts.PATTERN.EMAIL_ADDRESS;
  frmTelefonos!: UntypedFormGroup;
  frmContactoAseguradora!: UntypedFormGroup;
  folio!: IFnzBandejaPaginate;
  catalogos!: IFnzCatalogos;
  itemTelefonoCorrespondencia: any;
  listaCorreos: string[] = [];
  modoConsulta: boolean = false;
  lstTelefonosCorrespondecia: any[] = [];
  correos: any = [];
  currentIdContacto: string | undefined = '';
  displayedColumns: string[] = ['phone', 'extensions', 'edit', 'delete'];
  breadcrumbs: string[] = ['Fianzas', 'Contacto aseguradora'];
  readonlyModule: boolean = false;
  currentActividad!: EFnzActividad;
  currenActividadEstatus!: EFnzEstatusActividad;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private readonly notifierService: NotifierService,
    private userStorageService: UserStorageService,
    private contactoTelefonicoService: FnzContactoTelefonicoService,
    private swalService: SwalService,
    private workflowService: FnzWorkFlowService,
    private expedienteService: FnzExpedienteDigitalService,
    private readonly route: ActivatedRoute,
    private workFlowActividadService: FnzWorkFlowActividadService
  ) {}

  ngOnInit(): void {
    this.loadForm();
    this.init();
  }

  init() {
    const folio = this.route.snapshot.paramMap.get('id') || undefined;
    this.readonlyModule = history.state.readonlyModule || false;

    if (!folio) {
      this.cancelar();
      return;
    }

    this.workFlowActividadService
      .getActividadByFolioAndActividad(
        folio,
        EFnzActividad.CONTACTO_ASEGURADORA
      )
      .subscribe({
        next: (response: IResponse<IFnzWorkflowDetalle>) => {
          if (response.success) {
            this.userStorageService.saveFolioInfo(response.data);
            this.folio = response.data;
            this.currentActividad = response.data.actividadCodigo;
            this.currenActividadEstatus = response.data.estatusActividad;
            this.loadInformacionContacto();
            this.loadCatalogos();
            this.getTelefonosCorrespondecia();
          } else {
            console.error(response.message);
            this.cancelar();
          }
        },
        error: (err) => {
          this.notifierService.warning(err?.error?.message);
          this.cancelar();
        },
      });

    if (this.readonlyModule) this.frmContactoAseguradora.disable();
  }

  loadForm() {
    this.frmContactoAseguradora = this.formBuilder.group({
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
            this.frmContactoAseguradora.patchValue(newobject);
          }
        },
      });
  }

  async continue() {
    this.validateEmail();

    if (this.frmContactoAseguradora.valid) {
      const email = this.getEmail();
      this.frmContactoAseguradora.get('emailCorrespondencia')?.setValue(email);

      let informacionContacto: IFnzInformacionContactoDto = {
        folio: this.folio.folio,
        nombre: this.frmContactoAseguradora.value.nombre,
        tipo: this.frmContactoAseguradora.value.tipo,
        correos: this.frmContactoAseguradora.value.emailCorrespondencia
          .toString()
          .split(','),
      };

      this.contactoTelefonicoService
        .updateInformacionContacto(this.currentIdContacto!, informacionContacto)
        .subscribe();

      const responses = await lastValueFrom(
        this.expedienteService.check_by_titular(
          this.folio.pais,
          this.folio.aseguradoraId,
          this.folio.proyecto,
          this.folio.titular
        )
      );

      const filterResponse = responses.data?.filter(
        (x: any) => x.clave != EDocumento.FIC && x.clave != EDocumento.ANEXO
      );

      if (filterResponse.length > 0) {
        const workflow: IFnzWorklFlow = {
          folio: this.folio.folio,
          actividadInicial: this.folio.actividadCodigo,
          actividadFinal: EFnzActividad.CARGA_DOCUMENTAL,
          actividad: FnzEstatusBitacoraConsts.PENDIENTE_DE_DOCUMENTACION,
          notificacion: EFnzNotificacion.SOLICITUD,
        };
        this.workflowService.avanzar(workflow).subscribe((response) => {
          this.swalService
            .success({
              html: 'Información almacenada correctamente, se avanzó la actividad a <b>Carga Documental</b>',
            })
            .then(() => {
              this.router.navigate(['/bandejas']);
            });
        });
      } else {
        const workflow: IFnzWorklFlow = {
          folio: this.folio.folio,
          actividadInicial: this.folio.actividadCodigo,
          actividadFinal: EFnzActividad.VALIDACION_DIGITAL,
          actividad: FnzEstatusBitacoraConsts.EN_PROCESO_DE_GESTION,
          notificacion: EFnzNotificacion.SOLICITUD,
        };

        this.workflowService.avanzar(workflow).subscribe((response) => {
          this.swalService
            .success({
              html: 'Información almacenada correctamente, se avanzó la actividad a <b>Validación Documental</b>',
            })
            .then(() => {
              this.router.navigate(['/bandejas']);
            });
        });
      }
    } else {
      if (this.frmContactoAseguradora.invalid) {
        this.frmContactoAseguradora.markAllAsTouched();
        return;
      }
    }
  }

  generarMensajeHtml(documentos: Array<string>): string {
    let mensaje = '';
    mensaje += "<div style='text-align: left'> </br>";
    mensaje += '<ul>';
    documentos.forEach((element: any) => {
      mensaje += '<li>';
      mensaje += element;
      mensaje += '</li>';
    });
    mensaje += '</ul>';
    mensaje += '</div> </br>';
    return mensaje;
  }

  validateEmail() {
    if (this.correos.length == 0) {
      this.chipGrid.errorState = true;
      this.frmContactoAseguradora
        .get('emailCorrespondencia')
        ?.setErrors({ incorrect: true });
    }

    if (
      this.correos.length > 0 &&
      this.correos.filter((f: any) => f.invalid).length > 0
    ) {
      this.chipGrid.errorState = true;
      this.frmContactoAseguradora
        .get('emailCorrespondencia')
        ?.setErrors({ incorrect: true });
    }

    if (
      this.correos.length > 0 &&
      this.correos.filter((f: any) => !f.invalid).length == this.correos.length
    ) {
      this.chipGrid.errorState = false;
      this.frmContactoAseguradora.get('emailCorrespondencia')?.setErrors(null);
    }
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

  loadCatalogos() {
    this.contactoTelefonicoService
      .getCatalogos()
      .subscribe((catalogos: IResponse<IFnzCatalogos>) => {
        this.catalogos = catalogos.data;
      });
  }

  async getTelefonosCorrespondecia() {
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

  addEmail(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value == '') return;

    if (!this.PATTERN_EMAIL.test(value)) {
      this.notifierService.info('Escriba un correo electrónico valido', '');
      event.chipInput.clear();
      return;
    }

    this.listaCorreos.includes(value)
      ? this.notifierService.info(
          'El correo electrónico ya esta registrado',
          ''
        )
      : this.listaCorreos.push(value);

    this.checkValidEmail();
    event.chipInput.clear();
  }

  validatorCheckAllZeros(control: any): ValidationErrors | null {
    return /^0+$/.test(control.value) ? { allZerosError: true } : null;
  }

  checkValidEmail(): void {
    this.chipGrid.errorState = this.correos.length == 0;
    let correo = this.frmContactoAseguradora.get('correos');
    correo?.patchValue(this.correos.join(','));
    correo?.setErrors(this.correos.length == 0 ? { required: true } : null);
  }

  onCloseModal() {
    this.modalOpen = false;
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

  validateEmailPattern(email: string) {
    var re = AppConsts.PATTERN.EMAIL_ADDRESS;
    return re.test(String(email).toLowerCase());
  }

  remove(email: string): void {
    const index = this.correos.indexOf(email);
    if (index >= 0) this.correos.splice(index, 1);
    this.checkValidEmail();
  }

  onItemChanged(item: any) {
    this.itemTelefonoCorrespondencia = item;
  }

  onModalOpenChanged(open: boolean) {
    this.modalOpen = open;
    this.getTelefonosCorrespondecia();
  }

  closeModal($event: any) {
    this.itemTelefonoCorrespondencia = null;
    this.modalOpen = false;
    this.getTelefonosCorrespondecia();
  }

  cancelar(): void {
    this.router.navigate([this.readonlyModule ? '/busquedas' : '/bandejas']);
  }
}
