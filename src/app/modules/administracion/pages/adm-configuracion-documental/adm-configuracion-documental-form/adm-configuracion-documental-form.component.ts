import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ICatalogo } from 'src/app/modules/catalogos/helpers/interfaces/catalogo';
import { ICatalogoPais } from 'src/app/modules/catalogos/helpers/interfaces/catalogo-pais';
import { AppConsts } from 'src/app/shared/AppConsts';
import { EDocumento } from 'src/app/shared/helpers/enums/core/documento.enum';
import { EProceso } from 'src/app/shared/helpers/enums/core/proceso.enum';
import { EFormAction } from 'src/app/shared/helpers/enums/form-action.enum';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { FormActionValidator } from 'src/app/shared/validators/form-action.validator';
import {
  IAseguradoraCatalog,
  IConfiguracionDocumental,
  IConfiguracionDocumentalCatalogs,
  IConfiguracionDocumentalDocumentos,
  IConfiguracionDocumentalEdit,
  IProyectoCatalog,
} from '../../../helpers/interfaces/adm-configuracion-documental';
import { IDocumento } from '../../../helpers/interfaces/adm-documento';
import { IProyectoEdit } from '../../../helpers/interfaces/adm-proyecto';
import { AdmConfiguracionDocumentalService } from '../../../services/adm-configuracion-documental.service';
import { AdmProyectoService } from '../../../services/adm-proyecto.service';

@Component({
  selector: 'app-admin-configuracion-documental-form',
  templateUrl: './adm-configuracion-documental-form.component.html',
  styleUrls: ['./adm-configuracion-documental-form.component.scss'],
})
export class AdmConfiguracionDocumentalFormComponent implements OnInit {
  frmConfiguracionDocumental: FormGroup = <FormGroup>{};
  action!: EFormAction;
  title: string = 'Nuevo';
  breadcrumbs: Array<string> = [
    'Dashboard',
    'Administracion',
    'Configuración documental',
  ];

  currentConfiguracionDocumentalId: string = '';
  currentCountry: ICatalogoPais | undefined = undefined;
  paises: Array<ICatalogoPais> = [];
  aseguradora: Array<IAseguradoraCatalog> = [];
  aseguradoraAux: Array<IAseguradoraCatalog> = [];
  proyectoAux: Array<IProyectoCatalog> = [];
  proyecto: Array<IProyectoCatalog> = [];
  tipoPersona: Array<ICatalogo> = [];
  tipoPersonaAux: Array<ICatalogo> = [];
  giro: Array<ICatalogo> = [];
  estatus: Array<ICatalogo> = [];
  documentoAux: Array<IDocumento> = [];
  documento: Array<IDocumento> = [];
  motivo: Array<ICatalogo> = [];
  configuracion: IConfiguracionDocumentalDocumentos[] = [];
  proceso: number = 0;

  constructor(
    private readonly notifierService: NotifierService,
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private ConfiguracionDocumentalService: AdmConfiguracionDocumentalService,
    private proyectoService: AdmProyectoService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.checkActivatedRoute();
  }

  initForm() {
    this.frmConfiguracionDocumental = this.formBuilder.group({
      pais: ['', [Validators.required]],
      aseguradora: ['', [Validators.required]],
      proyecto: ['', [Validators.required]],
      tipoPersona: ['', [Validators.required]],
      giro: ['', [Validators.required]],
      estatus: ['', [Validators.required]],
      documento: [],
    });

    this.frmConfiguracionDocumental.controls['pais'].valueChanges.subscribe(
      (clave) => {
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
        this.documento = [
          ...new Set(
            this.documentoAux.filter((element) => element.pais === clave)
          ),
        ];
        this.tipoPersona = [
          ...new Set(
            this.tipoPersonaAux.filter((element) => element.pais === clave)
          ),
        ];
        this.checkExistLoadDocumentos(this.currentConfiguracionDocumentalId);
      }
    );
  }

  checkActivatedRoute(): void {
    this.activatedRoute.params.subscribe((p) => {
      const result = FormActionValidator.checkRoute(
        this.activatedRoute.snapshot.routeConfig?.path,
        p['id']
      );

      if (!result) {
        this.router.navigateByUrl(`/administracion/configuracion-documental`);
        return;
      }

      this.currentConfiguracionDocumentalId = result.id || '';
      this.action = result.action;
      this.breadcrumbs.push(result.breadcrumb);

      this.title =
        result.action === EFormAction.CREATE
          ? 'Nuevo'
          : result.action === EFormAction.UPDATE
            ? 'Editar'
            : 'Ver';
      this.checkActionAndLoad(this.currentConfiguracionDocumentalId);
    });
  }

  checkActionAndLoad(_id: string | null): void {
    if (_id) {
      if (this.action === EFormAction.VIEW)
        this.frmConfiguracionDocumental.disable();

      this.ConfiguracionDocumentalService.getByIdAndGetCatalogosToEdit(
        _id
      ).subscribe({
        next: (response: IResponse<IConfiguracionDocumentalEdit>) => {
          if (response.success) {
            const { configuracionDocumental, catalogos } = response.data;
            this.paises = catalogos.paises;
            this.aseguradoraAux = [
              ...new Set(
                catalogos.aseguradora.filter((element) => element.documentos)
              ),
            ];
            this.aseguradora = [
              ...new Set(
                this.aseguradoraAux.filter(
                  (element) => element.pais === configuracionDocumental?.pais
                )
              ),
            ];
            this.proyectoAux = catalogos.proyecto;
            this.proyecto = [
              ...new Set(
                this.proyectoAux.filter(
                  (element) => element.pais === configuracionDocumental?.pais
                )
              ),
            ];
            this.tipoPersonaAux = catalogos.tipoPersona;
            this.tipoPersona = [
              ...new Set(
                this.tipoPersonaAux.filter(
                  (element) => element.pais === configuracionDocumental?.pais
                )
              ),
            ];
            this.giro = catalogos.giro;
            this.estatus = catalogos.estatus;
            this.documentoAux = catalogos.documento;
            this.motivo = catalogos.motivo;
            this.proceso =
              this.proyecto.find(
                (p) => p._id == configuracionDocumental.proyecto
              )?.proceso || 0;
            this.frmConfiguracionDocumental.patchValue(configuracionDocumental);
            this.checkExistLoadDocumentos(
              _id!,
              configuracionDocumental.documento
            );
          } else console.error(response.message);
        },
        error: (err) => {
          this.return();
          this.notifierService.error(err?.error?.message, 'Error');
        },
      });
    } else {
      this.ConfiguracionDocumentalService.getCatalogs().subscribe({
        next: (response: IResponse<IConfiguracionDocumentalCatalogs>) => {
          if (response.success) {
            this.paises = response.data.paises;
            this.aseguradoraAux = [
              ...new Set(
                response.data.aseguradora.filter(
                  (element) => element.documentos
                )
              ),
            ];
            this.aseguradora = this.aseguradoraAux;
            this.proyectoAux = response.data.proyecto;
            this.proyecto = response.data.proyecto;
            this.tipoPersonaAux = response.data.tipoPersona;
            this.tipoPersona = response.data.tipoPersona;
            this.giro = response.data.giro;
            this.estatus = response.data.estatus;
            this.documentoAux = response.data.documento;
            this.motivo = response.data.motivo;
            this.checkExistLoadDocumentos(_id!);
          } else console.error(response.message);
        },
        error: (err) => {
          this.return();
          this.notifierService.error(err?.error?.message, 'Error');
        },
      });
    }
  }

  checkExistLoadDocumentos(
    _id: string,
    paramConfiguracion?: IConfiguracionDocumentalDocumentos[]
  ) {
    this.configuracion = [];
    if (!_id) {
      this.documento.forEach((element: any) => {
        const newConfiguracion: IConfiguracionDocumentalDocumentos = {
          documento: element._id,
          nombre: element.nombre,
          clave: element.clave,
          activo: false,
          obligatorio: false,
          ocr: false,
          vigencia: false,
          motivosRechazo: [],
          motivo: this.getMotivos(element.categoria, element.clave),
        };
        this.configuracion.push(newConfiguracion);
      });
    } else {
      this.documento.forEach((element: any) => {
        let configDocumento: any = paramConfiguracion?.filter(
          (item: any) => item._id === element._id
        )[0];

        const newConfiguracion: IConfiguracionDocumentalDocumentos = {
          documento: configDocumento ? configDocumento._id : element._id,
          nombre: element.nombre,
          clave: element.clave,
          activo: configDocumento ? configDocumento.activo : false,
          obligatorio: configDocumento ? configDocumento.obligatorio : false,
          ocr: configDocumento ? configDocumento.ocr : false,
          vigencia: configDocumento ? configDocumento.vigencia : false,
          motivosRechazo: configDocumento ? configDocumento.motivosRechazo : [],
          motivo: this.getMotivos(element.categoria, element.clave),
        };
        this.configuracion.push(newConfiguracion);
      });
    }
  }

  getMotivos<T>(categoria: number, clave: string): any {
    if (clave === EDocumento.CONFIRMACION_ENTREGA) {
      return this.motivo.filter((element) => element.clave === 5);
    } else if (categoria === 3) {
      return this.motivo.filter(
        (element) => element.clave === 6 || element.clave === 7
      );
    } else {
      return this.motivo.filter(
        (element) => element.clave !== 6 && element.clave !== 7
      );
    }
  }

  onChangeProyecto(proyecto: string): void {
    this.proyectoService.getByIdAndGetCatalogosToEdit(proyecto).subscribe({
      next: (response: IResponse<IProyectoEdit>) => {
        if (response.success) {
          const { proyecto } = response.data;
          this.proceso = proyecto.proceso;
          this.checkActionAndLoad(this.currentConfiguracionDocumentalId);
        }
      },
    });
  }

  updateConfiguracionEvent() {
    const configuracion = [
      ...new Set(this.configuracion.filter((element) => element.activo)),
    ];
    this.frmConfiguracionDocumental.controls['documento']?.setValue(
      configuracion
    );
  }

  submit(): void {
    if (this.action === EFormAction.VIEW) return;

    if (this.frmConfiguracionDocumental.invalid) {
      this.frmConfiguracionDocumental.markAllAsTouched();
      return;
    }

    const configuracionDocumental: IConfiguracionDocumental = <
      IConfiguracionDocumental
      >this.frmConfiguracionDocumental.value;

    if (!configuracionDocumental.documento) {
      this.notifierService.warning(
        'Es necesario seleccionar al menos un documento'
      );
      return;
    }

    const arrayDocumentos =
      this.proceso == EProceso.FIANZAS
        ? [EDocumento.FIC, EDocumento.ACUSE_ENVIO]
        : [EDocumento.FIC];

    const documentosFic = configuracionDocumental.documento.filter(
      (element: any) => arrayDocumentos.includes(element.clave)
    );

    const documentosObligatorios = this.proceso == EProceso.FIANZAS ? 2 : 2;

    if (
      documentosFic.length < documentosObligatorios &&
      [EProceso.FIANZAS, EProceso.KYC].includes(this.proceso)
    ) {
      const notificacion = [EProceso.FIANZAS].includes(this.proceso)
        ? 'Es necesario seleccionar los documentos (FIC, Acuse de envió)'
        : 'Es necesario seleccionar los documentos (Formato de identificación del cliente (FIC), Anexo)';
      this.notifierService.warning(notificacion);
      return;
    }

    const arrayDocumentosSinMotivos = [
      EDocumento.FIC,
      EDocumento.ANEXO,
      EDocumento.ACUSE_ENVIO,
      EDocumento.VALIDACION_DE_ORIGINALES,
      EDocumento.CONFIRMACION_ENTREGA
    ];

    const validaMotivos = configuracionDocumental.documento.filter(
      (element: any) =>
        element.motivosRechazo.length === 0 &&
        !arrayDocumentosSinMotivos.includes(element.clave)
    );
    if (validaMotivos.length > 0) {
      this.notifierService.warning(
        'Es necesario seleccionar un motivo de rechazo'
      );
      return;
    }

    const ficValid = documentosFic.filter(documento => documento.clave === "FIC");
    if(ficValid[0].obligatorio == false){
      this.notifierService.warning("El FIC debe ser obligatorio.");
      return;
    }

    if (this.currentConfiguracionDocumentalId) {
      this.ConfiguracionDocumentalService.update(
        this.currentConfiguracionDocumentalId,
        configuracionDocumental
      ).subscribe({
        next: (response: IResponse<IConfiguracionDocumental>) => {
          if (response.success) {
            this.notifierService.success(response.message);
            this.return();
          } else this.notifierService.warning(response.message);
        },
        error: (err) =>
          this.notifierService.error(err?.error?.message, 'Error'),
      });
    } else {
      this.ConfiguracionDocumentalService.create(
        configuracionDocumental
      ).subscribe({
        next: (response: IResponse<IConfiguracionDocumental>) => {
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

  return(): void {
    this.router.navigateByUrl(`/administracion/configuracion-documental`);
  }
}
