import { ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { ICatalogoPais } from 'src/app/modules/catalogos/helpers/interfaces/catalogo-pais';
import { AppConsts } from 'src/app/shared/AppConsts';
import { EFormAction } from 'src/app/shared/helpers/enums/form-action.enum';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { FormActionValidator } from 'src/app/shared/validators/form-action.validator';
import {
  IConfiguracionAseguradora,
  IConfiguracionAseguradoraCatalogs,
  IConfiguracionAseguradoraEdit,
  IOficinaCorreo,
} from '../../../helpers/interfaces/adm-configuracion-aseguradora';
import {
  IAseguradoraCatalog,
  IProyectoCatalog,
} from '../../../helpers/interfaces/adm-configuracion-documental';
import { AdmConfiguracionAseguradoraService } from '../../../services/adm-configuracion-aseguradora.service';
import { ICatalogo } from 'src/app/modules/catalogos/helpers/interfaces/catalogo';
import { map } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { KYCProceso } from '../../../helpers/enums/kyc-proceso.enum';

@Component({
  selector: 'app-adm-configuracion-aseguradora-form',
  templateUrl: './adm-configuracion-aseguradora-form.component.html',
  styleUrls: ['./adm-configuracion-aseguradora-form.component.scss'],
})
export class AdmConfiguracionAseguradoraFormComponent {
  readonly separatorKeysCodes = [ENTER] as const;
  PATTERN_EMAIL: RegExp = AppConsts.PATTERN.EMAIL_ADDRESS;
  @ViewChild('chipGrid') chipGrid: any;

  frmConfiguracionAseguradora!: FormGroup;
  action!: EFormAction;
  title: string = 'Nuevo';
  breadcrumbs: string[] = [
    'administracion.title',
    'administracion.configuracion-aseguradora.titlePlural',
  ];

  currentConfiguracionAseguradoraId: string = '';
  currentCountry: ICatalogoPais | undefined = undefined;

  paises: Array<ICatalogoPais> = [];
  aseguradora: Array<IAseguradoraCatalog> = [];
  aseguradoraAux: Array<IAseguradoraCatalog> = [];
  proyectoAux: Array<IProyectoCatalog> = [];
  proyectoFilter: Array<IProyectoCatalog> = [];
  oficinasCatalogo: Array<ICatalogo> = [];
  oficinasCatalogoFilter: Array<ICatalogo> = [];
  proyecto: Array<IProyectoCatalog> = [];
  @ViewChild('matRef') matRef!: MatSelect;
  idProceso: number = 0;
  disabledMatChip: boolean = false;
  disableInputs: boolean = false;
  flagOficinas: boolean = false;
  showLabelCorreos: boolean = false;

  constructor(
    private readonly notifierService: NotifierService,
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private configuracionAseguradoraService: AdmConfiguracionAseguradoraService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.checkActivatedRoute();
  }

  initForm() {

    this.frmConfiguracionAseguradora = this.formBuilder.group({
      pais: ['', [Validators.required]],
      aseguradora: ['', [Validators.required]],
      proyecto: ['', [Validators.required]],
      oficinas: this.formBuilder.array([])
    });

    this.frmConfiguracionAseguradora.controls['pais'].valueChanges.subscribe(
      (clave) => {
        this.changeCountry();
        this.currentCountry = this.paises.find((p) => p.clave == clave);
        this.aseguradora = [
          ...new Set(
            this.aseguradoraAux.filter((element) => element.pais === clave)
          ),
        ];
        this.proyecto = [
          ...new Set(
            this.proyectoAux.filter((element) => element.pais === clave)
          ),
        ];
      }
    );

    this.frmConfiguracionAseguradora.controls['proyecto'].valueChanges.subscribe((idProyecto) => {
      if (idProyecto) {
        this.proyectoFilter = [...new Set(this.proyectoAux.filter((element) => element._id === idProyecto)),];
        this.idProceso = this.proyectoFilter[0]?.proceso;
        this.matRef.options?.forEach((data: MatOption) => data?.deselect());
        this.flagOficinas = true;
        this.showLabelCorreos = false;
        if (this.idProceso != KYCProceso.FIANZAS) {
          this.clearOficinas();
          this.setInicializarOficina();
        } else {
          this.clearOficinas();
        }
      }

    })
  }

  private initOficinas(): FormGroup {
    return new FormGroup({
      'oficina': new FormControl(undefined),
      'descripcion': new FormControl(''),
      'correos': new FormArray([])
    })
  }


  get getOficinas() {
    return this.frmConfiguracionAseguradora.controls['oficinas'] as FormArray;
  }

  getCorreos(index: number) {
    return this.getOficinas.at(index).get('correos') as FormArray;
  }

  clearOficinas() {
    const oficinas = this.getOficinas;
    oficinas.clear();
  }

  setInicializarOficina() {
    const oficinaForm: FormGroup = this.initOficinas();
    this.getOficinas.push(oficinaForm);
    this.showLabelCorreos = true;
  }

  changeCountry() {
    this.clearOficinas();
    this.showLabelCorreos = false;
    this.idProceso = KYCProceso.FIANZAS;
    this.flagOficinas = true;
    this.frmConfiguracionAseguradora.get('aseguradora')?.reset();
    this.frmConfiguracionAseguradora.get('proyecto')?.reset();
  }

  onChangeAseguradora(aseguradora: any, event: any) {

    if (event.isUserInput) {

      const oficinas = this.getOficinas;
      oficinas.clear();

      if (aseguradora.oficinas.length > 0 && this.idProceso == KYCProceso.FIANZAS) {
        this.flagOficinas = true;
        this.showLabelCorreos = true;
        this.configuracionAseguradoraService.getCatalogs().subscribe({
          next: (response: IResponse<IConfiguracionAseguradoraCatalogs>) => {
            if (response.success) {
              this.oficinasCatalogo = response.data.oficinas;
              this.oficinasCatalogoFilter = [
                ...new Set(
                  this.oficinasCatalogo.filter((element) => aseguradora.oficinas.some((item: any) => item === element.clave))
                ),
              ];

              this.oficinasCatalogoFilter.map(x => {
                const oficinaForm = this.formBuilder.group({
                  oficina: x.clave,
                  descripcion: x.descripcion,
                  correos: new FormArray([])
                });
                oficinas.push(oficinaForm);
              })
            } else console.error(response.message);
          },
          error: (err) => {
            this.return();
            this.notifierService.error(err?.error?.message, 'Error');
          },
        });
      } else {
        this.showLabelCorreos = false;
        this.flagOficinas = false;
        if (this.idProceso != KYCProceso.FIANZAS)
          this.setInicializarOficina();
      }
    }
  }

  checkActivatedRoute(): void {
    this.activatedRoute.params.subscribe((p) => {
      const result = FormActionValidator.checkRoute(
        this.activatedRoute.snapshot.routeConfig?.path,
        p['id']
      );

      if (!result) {
        this.router.navigateByUrl(`/administracion/configuracion-aseguradora`);
        return;
      }

      this.currentConfiguracionAseguradoraId = result.id || '';
      this.action = result.action;
      this.breadcrumbs.push(result.breadcrumb);
      this.title =
        result.action === EFormAction.CREATE
          ? 'administracion.configuracion-aseguradora.form.titles.create'
          : result.action === EFormAction.UPDATE
            ? 'administracion.configuracion-aseguradora.form.titles.edit'
            : 'administracion.configuracion-aseguradora.form.titles.view';
      this.checkActionAndLoad(this.currentConfiguracionAseguradoraId);
    });
  }

  checkActionAndLoad(_id: string | null): void {
    if (_id) {
      if (this.action === EFormAction.VIEW)
        this.disableInput();

      this.configuracionAseguradoraService
        .getByIdAndGetCatalogosToEdit(_id)
        .subscribe({
          next: (response: IResponse<IConfiguracionAseguradoraEdit>) => {
            if (response.success) {
              const { configuracionAseguradora, catalogos } = response.data;
              this.paises = catalogos.paises;
              this.aseguradoraAux = catalogos.aseguradora;
              this.aseguradora = [
                ...new Set(
                  this.aseguradoraAux.filter(
                    (element) => element.pais === configuracionAseguradora?.pais
                  )
                ),
              ];
              this.proyectoAux = catalogos.proyecto;
              this.proyecto = [
                ...new Set(
                  this.proyectoAux.filter(
                    (element) => element.pais === configuracionAseguradora?.pais
                  )
                ),
              ];

              this.frmConfiguracionAseguradora.patchValue(
                configuracionAseguradora
              );

              const oficinas = this.getOficinas;
              oficinas.clear();
              configuracionAseguradora.oficinas.forEach((x, i) => { this.setOficina(x, i); }
              )

              if (configuracionAseguradora.oficinas.length > 1) this.flagOficinas = true;

              this.showLabelCorreos = true;

            } else console.error(response.message);
          },
          error: (err) => {
            this.return();
            this.notifierService.error(err?.error?.message, 'Error');
          },
        });
    } else {
      this.disabledMatChip = false;
      this.disableInputs = false;
      this.configuracionAseguradoraService.getCatalogs().subscribe({
        next: (response: IResponse<IConfiguracionAseguradoraCatalogs>) => {
          if (response.success) {
            this.paises = response.data.paises;
            this.aseguradoraAux = response.data.aseguradora;
            this.aseguradora = response.data.aseguradora;
            this.proyectoAux = response.data.proyecto;
            this.proyecto = response.data.proyecto;
            this.oficinasCatalogo = response.data.oficinas;
          } else console.error(response.message);
        },
        error: (err) => {
          this.return();
          this.notifierService.error(err?.error?.message, 'Error');
        },
      });
    }
  }

  disableInput() {
    this.disableInputs = true;
    this.frmConfiguracionAseguradora.get('aseguradora')?.disable()
    this.frmConfiguracionAseguradora.get('pais')?.disable()
    this.frmConfiguracionAseguradora.get('proyecto')?.disable()
  }

  submit(): void {

    if (this.action === EFormAction.VIEW) return;

    if (this.frmConfiguracionAseguradora.invalid) {
      this.frmConfiguracionAseguradora.markAllAsTouched();
      return;
    }

    if (this.frmConfiguracionAseguradora.valid) {

      const configuracionAseguradora: IConfiguracionAseguradora =
        <IConfiguracionAseguradora>this.frmConfiguracionAseguradora.value;

      if (this.idProceso == KYCProceso.FIANZAS && configuracionAseguradora.oficinas.length == 0) return;

      if (configuracionAseguradora.oficinas.filter(x => x.correos.length == 0).length > 0) {
        this.notifierService.warning(
          'Escriba al menos un correo electrónico',
          'Validación'
        );
        return;
      }

      if (this.currentConfiguracionAseguradoraId) {
        this.configuracionAseguradoraService
          .update(
            this.currentConfiguracionAseguradoraId,
            configuracionAseguradora
          )
          .subscribe({
            next: (response: IResponse<IConfiguracionAseguradora>) => {
              if (response.success) {
                this.notifierService.success(response.message);
                this.return();
              } else this.notifierService.warning(response.message);
            },
            error: (err) =>
              this.notifierService.error(err?.error?.message, 'Error'),
          });
      } else {
        this.configuracionAseguradoraService
          .create(configuracionAseguradora)
          .subscribe({
            next: (response: IResponse<IConfiguracionAseguradora>) => {
              if (response.success) {
                this.notifierService.success(response.message);
                this.return();
              } else this.notifierService.warning(response.message);
            },
            error: (err) =>
              this.notifierService.error(err?.error?.message, 'Error'),
          });
      }
    }
  }

  return(): void {
    this.router.navigateByUrl(`/administracion/configuracion-aseguradora`);
  }


  setOficina(oficina: any, index: number) {

    const oficinaForm: FormGroup = this.initOficinas();
    oficinaForm.controls['oficina'].setValue(oficina.oficina);
    oficinaForm.controls['descripcion'].setValue(oficina.descripcion);
    this.getOficinas.push(oficinaForm);

    const correos = this.getCorreos(index);
    oficina.correos.forEach((correo: any) => { correos.value.push(correo) })
  }

  remove(email: string, position: number): void {
    const correos = this.getCorreos(position);
    const index = correos.value.indexOf(email);
    if (index >= 0) correos.value.splice(index, 1);
  }

  add(event: MatChipInputEvent, oficina: string, index: number): void {

    const correos = this.getCorreos(index);
    const value = (event.value || '').trim();
    if (value == '') return;

    if (!this.PATTERN_EMAIL.test(value)) {
      this.notifierService.warning(
        'Escriba un correo electrónico válido',
        'Validación'
      );
      event.chipInput.clear();
      return;
    }

    if (correos.value.filter((f: any) => f == value).length > 0) {
      this.notifierService.warning(
        'El correo electrónico ya esta registrado',
        'Validación'
      );
      event.chipInput.clear();
      return;
    }

    this.getOficinas.controls.map(x => {
      if (x.value.descripcion == oficina) {
        x.value.correos.push(value);
      }
    });

    event.chipInput.clear();
  }

}
