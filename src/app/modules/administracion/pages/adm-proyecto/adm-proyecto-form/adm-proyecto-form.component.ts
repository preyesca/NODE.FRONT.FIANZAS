import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ICatalogo } from 'src/app/modules/catalogos/helpers/interfaces/catalogo';
import { ICatalogoPais } from 'src/app/modules/catalogos/helpers/interfaces/catalogo-pais';
import { EProceso } from 'src/app/shared/helpers/enums/core/proceso.enum';
import { ERamo } from 'src/app/shared/helpers/enums/core/ramo.enum';
import { EFormAction } from 'src/app/shared/helpers/enums/form-action.enum';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { FormActionValidator } from 'src/app/shared/validators/form-action.validator';
import {
  IAseguradora,
  IProyecto,
  IProyectoCatalogs,
  IProyectoEdit,
} from '../../../helpers/interfaces/adm-proyecto';
import { AdmProyectoService } from '../../../services/adm-proyecto.service';

@Component({
  selector: 'app-admin-proyecto-form',
  templateUrl: './adm-proyecto-form.component.html',
  styleUrls: ['./adm-proyecto-form.component.scss'],
})
export class AdmProyectoFormComponent implements OnInit {
  frmProyecto: FormGroup = <FormGroup>{};
  action!: EFormAction;
  title: string = 'Nuevo';
  breadcrumbs: Array<string> = ['Dashboard', 'Administracion', 'Proyectos'];

  currentProyectoId: string = '';
  currentCountry: ICatalogoPais | undefined = undefined;
  paises: Array<ICatalogoPais> = [];
  aseguradora: Array<IAseguradora> = [];
  aseguradoraAux: Array<IAseguradora> = [];

  ramo: Array<ICatalogo> = [];
  ramoAux: Array<ICatalogo> = [];

  proceso: Array<ICatalogo> = [];
  negocio: Array<ICatalogo> = [];
  estatus: Array<ICatalogo> = [];

  codeAbrPais: string = '';
  codeAseguradora: string = '';
  codeProceso: string = '';
  codeNegocio: string = '';
  codeRamo: string = '';

  constructor(
    private readonly notifierService: NotifierService,
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private proyectoService: AdmProyectoService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkActivatedRoute();
  }

  initForm() {
    this.frmProyecto = this.formBuilder.group({
      pais: ['', [Validators.required]],
      aseguradora: ['', [Validators.required]],
      ramo: ['', [Validators.required]],
      proceso: ['', [Validators.required]],
      negocio: ['', [Validators.required]],
      ceco: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9 áéíóúñÁÉÍÓÚÑ.,]+$/),
        ],
      ],
      codigo: [''],
      estatus: ['', [Validators.required]],
      portal: ['', [Validators.pattern(/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/)]],
      nombreCliente: ['', Validators.required],
      nombreComercial: ['', Validators.required]
    });

    this.frmProyecto.controls['pais'].valueChanges.subscribe((clave) => {
      this.currentCountry = this.paises.find((p) => p.clave === clave);
      this.aseguradora = [
        ...new Set(
          this.aseguradoraAux.filter((element) => element.pais === clave)
        ),
      ];
      //this.frmProyecto.controls['aseguradora'].setValue('')
    });
  }

  checkActivatedRoute(): void {
    this.activatedRoute.params.subscribe((p) => {
      const result = FormActionValidator.checkRoute(
        this.activatedRoute.snapshot.routeConfig?.path,
        p['id']
      );

      if (!result) {
        this.router.navigateByUrl(`/administracion/proyectos`);
        return;
      }

      this.currentProyectoId = result.id || '';
      this.action = result.action;
      this.breadcrumbs.push(result.breadcrumb);

      this.title =
        result.action === EFormAction.CREATE
          ? 'Nuevo'
          : result.action === EFormAction.UPDATE
          ? 'Editar'
          : 'Ver';
      this.checkActionAndLoad(this.currentProyectoId);
    });
  }

  checkActionAndLoad(_id: string | null): void {
    if (_id) {
      if (this.action === EFormAction.VIEW) this.frmProyecto.disable();

      this.proyectoService.getByIdAndGetCatalogosToEdit(_id).subscribe({
        next: (response: IResponse<IProyectoEdit>) => {
          if (response.success) {
            const { proyecto, catalogos } = response.data;
            this.paises = catalogos.paises;
            this.aseguradoraAux = [
              ...new Set(
                catalogos.aseguradora.filter((element) => element.altaProyecto)
              ),
            ];
            this.aseguradora = [
              ...new Set(
                this.aseguradoraAux.filter(
                  (element) => element.pais === proyecto?.pais
                )
              ),
            ];

            this.ramoAux = catalogos.ramo;
            this.ramo = catalogos.ramo;
            this.proceso = catalogos.proceso;
            this.negocio = catalogos.negocio;
            this.estatus = catalogos.estatus;

            if ([EProceso.FIANZAS].includes(proyecto.proceso))
              this.ramo = [
                ...new Set(
                  this.ramo.filter(
                    (element) => element.clave === ERamo.NO_APLICA
                  )
                ),
              ];
            if(proyecto.proceso == EProceso.KYC)
              this.ramo = [
                ...new Set(
                  this.ramoAux.filter((r) => [ERamo.CUATRO_NUEVE_DOS, ERamo.FINANCIERAS, ERamo.NO_APLICA].includes(r.clave))
                )
              ];
            else this.ramo = this.ramoAux.filter((r) => ![ERamo.CUATRO_NUEVE_DOS, ERamo.FINANCIERAS].includes(r.clave));
            this.frmProyecto.patchValue(proyecto);
          } else console.error(response.message);
        },
        error: (err) => {
          this.return();
          this.notifierService.error(err?.error?.message, 'Error');
        },
      });
    } else {
      this.proyectoService.getCatalogs().subscribe({
        next: (response: IResponse<IProyectoCatalogs>) => {
          if (response.success) {
            this.paises = response.data.paises;
            this.aseguradoraAux = [
              ...new Set(
                response.data.aseguradora.filter(
                  (element) => element.altaProyecto
                )
              ),
            ];
            this.aseguradora = this.aseguradoraAux;
            this.ramoAux = response.data.ramo;
            this.ramo = response.data.ramo;
            this.proceso = response.data.proceso;
            this.negocio = response.data.negocio;
            this.estatus = response.data.estatus;
          } else console.error(response.message);
        },
        error: (err) => {
          this.return();
          this.notifierService.error(err?.error?.message, 'Error');
        },
      });
    }
  }

  onChangeProceso(proceso: EProceso): void {
    if(proceso != EProceso.KYC) {
      if(proceso != EProceso.FIANZAS) {
        this.ramo = this.ramoAux.filter((r) => ![ERamo.CUATRO_NUEVE_DOS, ERamo.FINANCIERAS].includes(r.clave));
      } else this.ramo = this.ramoAux.filter((r) =>
        proceso === EProceso.FIANZAS
          ? r.clave === ERamo.NO_APLICA
          : true
        );
    } else this.ramo = this.ramoAux.filter((r) => [ERamo.CUATRO_NUEVE_DOS, ERamo.FINANCIERAS, ERamo.NO_APLICA].includes(r.clave));

    this.onChangeGenerateCode();
  }

  onChangeGenerateCode(): void {
    this.codeAbrPais =
      this.paises.find(
        (a) => a.clave === this.frmProyecto.controls['pais']?.value
      )?.abreviatura ?? '?';

    this.codeAseguradora =
      this.aseguradora.find(
        (a) => a._id === this.frmProyecto.controls['aseguradora']?.value
      )?.nombreComercial ?? '?';

    this.codeProceso =
      this.proceso.find(
        (a) => a.clave === this.frmProyecto.controls['proceso']?.value
      )?.descripcion ?? '?';

    this.codeRamo =
      this.ramo.find(
        (a) => a.clave === this.frmProyecto.controls['ramo']?.value
      )?.descripcion ?? '?';

    this.codeNegocio =
      this.negocio.find(
        (a) => a.clave === this.frmProyecto.controls['negocio']?.value
      )?.descripcion ?? '?';

    this.frmProyecto.controls['codigo']?.setValue('');

    this.frmProyecto.controls['codigo']?.setValue(
      `${this.codeAbrPais}-${this.codeAseguradora}-${this.codeProceso}-${this.codeRamo}-${this.codeNegocio}`.toUpperCase()
    );
  }

  submit(): void {
    if (this.action === EFormAction.VIEW) return;

    if (this.frmProyecto.invalid) {
      this.frmProyecto.markAllAsTouched();
      return;
    }

    const proyecto: IProyecto = <IProyecto>this.frmProyecto.value;

    if (this.currentProyectoId) {
      this.proyectoService.update(this.currentProyectoId, proyecto).subscribe({
        next: (response: IResponse<IProyecto>) => {
          if (response.success) {
            this.return();
            this.notifierService.success(response.message);
          } else console.error(response.message);
        },
        error: (err) =>
          this.notifierService.error(err?.error?.message, 'Error'),
      });
    } else {
      this.proyectoService.create(proyecto).subscribe({
        next: (response: IResponse<IProyecto>) => {
          if (response.success) {
            this.return();
            this.notifierService.success(response.message);
          } else {
            this.notifierService.warning(response.message);
          }
        },
        error: (err) =>
          this.notifierService.error(err?.error?.message, 'Error'),
      });
    }
  }

  return(): void {
    this.router.navigateByUrl(`/administracion/proyectos`);
  }
}
