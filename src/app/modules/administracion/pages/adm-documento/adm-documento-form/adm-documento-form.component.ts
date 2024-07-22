import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ICatalogo } from 'src/app/modules/catalogos/helpers/interfaces/catalogo';
import { ICatalogoPais } from 'src/app/modules/catalogos/helpers/interfaces/catalogo-pais';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { SwalService } from 'src/app/shared/services/notification/swal.service';
import {
  IDocumento,
  IDocumentoEdit,
  IDocumentoGetCatalogs,
} from '../../../helpers/interfaces/adm-documento';
import { AdmDocumentoService } from '../../../services/adm-documento.service';

@Component({
  selector: 'app-adm-documento-form',
  templateUrl: './adm-documento-form.component.html',
})
export class AdmDocumentoFormComponent {
  documentoId: string | null = null;
  paises: Array<ICatalogoPais> = [];
  estatus: Array<ICatalogo> = [];
  categoriaDocumento: Array<ICatalogo> = [];
  formDocumentos!: UntypedFormGroup;
  catalogos!: IDocumentoGetCatalogs;
  currentCountry: ICatalogoPais | undefined = undefined;
  breadcrumbs: Array<string> = ['Dashboard', 'Administracion', 'Documentos'];

  constructor(
    private formBuilder: FormBuilder,
    private documentoService: AdmDocumentoService,
    private route: ActivatedRoute,
    private swal: SwalService
  ) {}

  @Input()
  public title: string = '';

  @Input()
  public breadcrumbsLabel: string = '';

  @Input()
  public titleButton: string = '';

  @Input()
  public ver: boolean = false;

  @Output()
  onSubmit: EventEmitter<IDocumento> = new EventEmitter<IDocumento>();

  @Output() clickCancel: EventEmitter<boolean> = new EventEmitter();

  @Output() validForm: EventEmitter<boolean> = new EventEmitter();

  cancelModal() {
    this.clickCancel.emit(true);
  }

  ngOnInit(): void {
    this.breadcrumbs.push(this.breadcrumbsLabel);

    this.formDocumentos = this.formBuilder.group({
      pais: [0, [Validators.required, Validators.min(1)]],
      categoria: [0, [Validators.required, Validators.min(1)]],
      estatus: [0, [Validators.required, Validators.min(1)]],
      nombre: ['', [Validators.required]],
      clave: [''],
    });

    this.route.params.subscribe((params) => {
      this.documentoId = params['id'];

      this.documentoService
        .getCatalogs()
        .subscribe((catalogos: IResponse<IDocumentoGetCatalogs>) => {
          this.catalogos = catalogos.data;
        });

      if (this.documentoId) {
        if (this.ver) this.formDocumentos.disable();

        this.documentoService.getByIdToEdit(this.documentoId).subscribe({
          next: (response: IResponse<IDocumentoEdit>) => {
            if (response.success) {
              const { documento, catalogo } = response.data;
              this.categoriaDocumento = catalogo.categoriaDocumento;
              this.estatus = catalogo.estatus;
              this.paises = catalogo.paises;

              setTimeout(() => {
                this.formDocumentos.patchValue(documento);
                this.changeCategoria();
              }, 100);
            } else console.error(response.message);
          },
          error: (err) => this.swal.error(err?.error?.message),
        });
      }

      this.formDocumentos.controls['pais'].valueChanges.subscribe(
        (clave) =>
          (this.currentCountry = this.catalogos.paises.find(
            (p) => p.clave == clave
          ))
      );
    });
  }

  validateForm() {
    if (this.formDocumentos.invalid) {
      this.validForm.emit(true);
    } else {
      this.validForm.emit(false);
    }
  }

  changeCategoria() {
    const categoria = this.formDocumentos.controls['categoria'].value;
    $('#div_nombre').removeClass();
    if (categoria == 4) $('#div_nombre').addClass('col-md-8');
    else $('#div_nombre').addClass('col-md-12');
  }
}
