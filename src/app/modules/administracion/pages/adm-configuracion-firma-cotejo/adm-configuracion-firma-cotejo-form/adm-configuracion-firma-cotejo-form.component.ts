import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ICatalogoPais } from 'src/app/modules/catalogos/helpers/interfaces/catalogo-pais';
import { EFormAction } from 'src/app/shared/helpers/enums/form-action.enum';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { SwalService } from 'src/app/shared/services/notification/swal.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from '../../../../../shared/helpers/types/objectid.type';
import { IProyectoCodigo } from '../../../helpers/interfaces/adm-proyecto';
import { AdmConfiguradorFirmaCotejoService } from '../../../services/adm-configuracion-firma-cotejo.service';
import { AdmUsuarioService } from '../../../services/adm-usuario.service';

@Component({
  selector: 'app-adm-configuracion-firma-cotejo-form',
  templateUrl: './adm-configuracion-firma-cotejo-form.component.html',
  styleUrls: ['./adm-configuracion-firma-cotejo-form.component.scss'],
})
export class AdmConfiguracionFirmaCotejoFormComponent {
  readonly #usuarioService = inject(AdmUsuarioService);
  readonly #notifierService = inject(NotifierService);
  readonly #formBuilder = inject(FormBuilder);
  readonly #configFirmaService = inject(AdmConfiguradorFirmaCotejoService);
  readonly cdRef = inject(ChangeDetectorRef);
  readonly util = inject(UtilsService);
  readonly #swal = inject(SwalService);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);

  breadcrumbs: string[] = ['Administración', 'Configuración', 'Firma cotejo'];

  currentCountry: ICatalogoPais | undefined = undefined;
  paises: Array<ICatalogoPais> = [];
  proyectos: IProyectoCodigo[] = [];
  proyectosByPais: IProyectoCodigo[] = [];
  proyecto: any;
  frmConfiguracion: FormGroup = <FormGroup>{};
  lstConfiguracionProyectos: string[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  itemsPorPage: Array<number> = [];
  ejecutivos: any[] = [];
  displayedColumns: string[] = ['clave', 'nombre', 'action'];

  @ViewChild('fileUpload') fileUpload!: ElementRef;
  extensionesPermitidas: string[] = ['PNG', 'JPG', 'JPEG'];
  lstFirmaCotejo: IFirmaCotejo = { proyecto: '', ejecutivos: [] };
  archivoSeleccionado: File | null = null;

  operation = EFormAction.CREATE;
  id = '';

  ngOnInit(): void {
    this.id = `${this.#route.snapshot.paramMap.get('id')}`;
    const operation = this.#route.snapshot.paramMap.get('operation');
    if (operation)
      this.operation =
        operation == 'edit' ? EFormAction.UPDATE : EFormAction.VIEW;
    else this.operation = EFormAction.CREATE;

    this.init_form();
    this.get_catalogs();
    this.getConfiguracionesFirmasCotejo();
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  init_form() {
    this.frmConfiguracion = this.#formBuilder.group({
      pais: ['', [Validators.required]],
      proyecto: ['', [Validators.required]],
      clave: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      firma: ['', [Validators.required]],
    });

    this.frmConfiguracion.controls['pais'].valueChanges.subscribe(
      (clave) =>
        (this.currentCountry = this.paises.find((p) => p.clave == clave))
    );
    if (
      this.operation == EFormAction.UPDATE ||
      this.operation == EFormAction.VIEW
    ) {
      this.frmConfiguracion.controls['pais'].disable();
      this.frmConfiguracion.controls['proyecto'].disable();
    }
  }

  load_data() {
    this.#configFirmaService.selectById(this.id).subscribe(async (data) => {
      if (data.success) {
        // const config = data.data.find((x: any) => x._id == this.id)
        const proyecto: any = this.proyectos.find(
          (x) => x._id == data.data!.idProyecto
        );
        this.frmConfiguracion.controls['pais'].setValue(proyecto.pais);
        this.proyectosByPais = this.proyectos.filter(
          (p) => p.pais === proyecto.pais
        );
        this.frmConfiguracion.controls['proyecto'].setValue(proyecto._id);

        const dataConfiguracion = await lastValueFrom(
          this.#configFirmaService.selectByProyecto(proyecto._id)
        );

        this.lstConfiguracionProyectos = dataConfiguracion.data.ejecutivos;

        this.lstFirmaCotejo.proyecto = dataConfiguracion.data.proyecto;
        this.lstFirmaCotejo.ejecutivos = dataConfiguracion.data.ejecutivos;
        this.dataSource.data = this.lstFirmaCotejo.ejecutivos;
      }
    });
  }

  show_consulta() {
    return this.operation == EFormAction.VIEW ? true : false;
  }

  get_catalogs() {
    this.#usuarioService.getCatalogs().subscribe({
      next: (response) => {
        if (response.success) {
          this.paises = response.data.paises;
          this.proyectos = response.data.proyectos;
          if (
            this.operation == EFormAction.UPDATE ||
            this.operation == EFormAction.VIEW
          )
            this.load_data();
        } else this.#notifierService.error(response.message, 'Error');
      },
      error: (err) => {
        this.#notifierService.error(err?.error?.message);
      },
    });
  }

  getConfiguracionesFirmasCotejo() {
    this.#configFirmaService.selectAll().subscribe({
      next: (response: IResponse<any>) => {
        if (response.success) {
          this.lstConfiguracionProyectos = response.data.map(
            (x: any) => x.proyecto
          );
        }
      },
    });
  }

  change_pais(clave: number): void {
    this.frmConfiguracion.controls['proyecto'].setValue(null);
    this.proyectosByPais = this.proyectos.filter(
      (p) =>
        p.pais === clave &&
        !this.lstConfiguracionProyectos.includes(p._id.toString())
    );
  }

  /**
   * Metodo utilizado para seleccionar un archivo, o cada que se cambia el archivo del control
   * @param files Archivos seleccionados en el componente file, por default solo acepta un archivo
   * @returns Si esta todo correcto guarda la informacion en la variable archivo que se utilizara para subir al expediente
   */
  change_file(files: FileList | null) {
    if (files?.length === 0) {
      this.archivoSeleccionado = null;
      return;
    }
    let _file = files![0];
    this.archivoSeleccionado = _file;
    const extension = _file.name.split('.').pop()!.toUpperCase();
    if (this.extensionesPermitidas.includes(extension)) {
      this.frmConfiguracion.controls['firma'].setValue(_file.name);
    } else {
      this.frmConfiguracion.controls['firma'].setValue('');
      this.#notifierService.warning(
        `Ups, el archivo <br> <strong>${_file.name} </strong> <br> tiene una extensión no permitida`
      );
    }
    this.fileUpload.nativeElement.value = '';
  }

  click_add() {
    if (this.frmConfiguracion.valid) {
      const dataForm = this.frmConfiguracion.value;
      const ejecutivo: IEjectivo = {
        _id: uuidv4().toString(),
        clave: dataForm.clave,
        nombre: dataForm.nombre,
        firma: dataForm.firma,
        file: this.archivoSeleccionado,
      };
      const existEjecutivo = this.lstFirmaCotejo.ejecutivos.find(
        (x) => x.clave == dataForm.clave
      );
      if (existEjecutivo) {
        this.#notifierService.warning(
          'La clave de ejecutivo ya se encuentra en la lista de ejecutivos'
        );
        return;
      }

      this.lstFirmaCotejo.proyecto = dataForm.proyecto;
      this.lstFirmaCotejo.ejecutivos.push(ejecutivo);
      this.dataSource.data = this.lstFirmaCotejo.ejecutivos;

      this.frmConfiguracion.controls['clave'].setValue('');
      this.frmConfiguracion.controls['nombre'].setValue('');
      this.frmConfiguracion.controls['firma'].setValue('');
      this.fileUpload.nativeElement.value = '';

      if (this.operation == EFormAction.UPDATE) {
        const proyecto = this.frmConfiguracion.controls['proyecto'].value;
        this.#configFirmaService
          .addEjecutivo(proyecto, ejecutivo)
          .subscribe((data) => {
            if (data.success) {
              this.#notifierService.success(
                'La firma del ejecutivo se guardó correctamente en el sistema'
              );
              this.load_data();
            }
          });
      }
    } else {
      this.#notifierService.warning('Complete la información requerida');
    }
  }

  click_ver(data: any) {
    if (this.operation == EFormAction.CREATE) {
      let fileSelected = data.file;
      let MIMEType = fileSelected.type;
      let reader = new FileReader();

      let self = this;

      reader.onload = function (readerEvt) {
        let binaryString = readerEvt.target?.result!;
        var base64 = btoa(binaryString.toString());

        let blobFile = self.util.b64toBlob(base64, MIMEType, 512);
        let urlBlobFile = window.URL.createObjectURL(blobFile);

        window.open(
          urlBlobFile,
          '_blank',
          'location=yes,height=650,width=600,scrollbars=yes,status=yes'
        );
      };

      reader.readAsBinaryString(fileSelected);
    } else {
      this.#configFirmaService
        .downloadFirma(data.clave, data.firma)
        .subscribe((response) => {
          //const type = response.data.split(',')[0].split(';')[0].split(':')[1];
          const type = response.data.contentType;
          let blobFile = this.util.b64toBlob(
            //response.data.split(',').pop(),
            response.data.base64,
            type,
            512
          );
          let urlBlobFile = window.URL.createObjectURL(blobFile);
          window.open(
            urlBlobFile,
            '_blank',
            'location=yes,height=650,width=600,scrollbars=yes,status=yes'
          );
        });
    }
  }

  click_eliminar(data: any) {
    this.#swal
      .question({
        text: '¿Realmente desea eliminar la firma del ejecutivo?',
      })
      .then((response) => {
        if (response.isConfirmed) {
          this.lstFirmaCotejo.ejecutivos =
            this.lstFirmaCotejo.ejecutivos.filter((x) => x._id != data._id);
          this.dataSource.data = this.lstFirmaCotejo.ejecutivos;
          if (this.operation == EFormAction.UPDATE) {
            const proyecto = this.frmConfiguracion.controls['proyecto'].value;
            this.#configFirmaService
              .deleteFirma(proyecto, data._id, data.clave, data.firma)
              .subscribe((response) => {
                this.#notifierService.success(
                  'La firma del ejecutivo se eliminó del sistema'
                );
              });
          }
        }
      });
  }

  click_guardar() {
    if (this.lstFirmaCotejo.ejecutivos.length == 0) {
      this.#notifierService.warning(
        'Asigne un ejecutivo para la configuración'
      );
      return;
    }
    this.#swal
      .question({
        text: '¿Realmente desea guardar la configuración?',
      })
      .then((response) => {
        if (response.isConfirmed) {
          this.#configFirmaService
            .addConfiguracion(this.lstFirmaCotejo)
            .subscribe({
              next: (data) => {
                if (data.success) {
                  this.#notifierService.success(
                    'Información guardada en el sistema'
                  );
                  this.#router.navigateByUrl(
                    'administracion/configurador-firma-contejo'
                  );
                } else this.#notifierService.warning(data.message);
              },
              error: (err) =>
                this.#notifierService.error(err?.error?.message, 'Error'),
            });
        }
      });
  }
}

export interface IFirmaCotejo {
  proyecto: ObjectId;
  ejecutivos: IEjectivo[];
}

export interface IEjectivo {
  _id: string;
  clave: string;
  nombre: string;
  firma: string;
  file: File | null;
  contentType?: string;
  originalName?: string;
}
