import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IAseguradora, IAseguradoraEdit, IAseguradoraGetCatalogs } from '../../../helpers/interfaces/adm-aseguradora';
import { AdmAseguradoraService } from '../../../services/adm-aseguradora.service';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { ActivatedRoute } from '@angular/router';
import { ICatalogoPais } from 'src/app/modules/catalogos/helpers/interfaces/catalogo-pais';
import { ICatalogo } from 'src/app/modules/catalogos/helpers/interfaces/catalogo';
import { ICatalogoOficina } from 'src/app/modules/catalogos/helpers/interfaces/catalogo-oficina';

@Component({
  selector: 'app-adm-aseguradora-form',
  templateUrl: './adm-aseguradora-form.component.html'
})
export class AdmAseguradoraFormComponent {

  altaProyecto = false;
  documentos = false;
  idAseguradora: string = "";
  paises: Array<ICatalogoPais> = [];
  oficinas: Array<ICatalogoOficina> = [];
  oficinasByPais: Array<ICatalogoOficina> = [];
  estatus: Array<ICatalogo> = [];
  catalogos!: IAseguradoraGetCatalogs;
  formAseguradora!: UntypedFormGroup;
  currentCountry: ICatalogoPais | undefined = undefined;
  breadcrumbs: Array<string> = ['Dashboard', 'Administracion', 'Aseguradoras'];

  constructor(
    private formBuilder: FormBuilder,
    private aseguradoraService: AdmAseguradoraService,
    private route: ActivatedRoute

  ) { }

  @Input()
  public title: string = '';

  @Input()
  public breadcrumbsLabel: string = '';

  @Input()
  public titleButton: string = '';

  @Input()
  public ver: boolean = false;

  @Output()
  onSubmit: EventEmitter<IAseguradora> = new EventEmitter<IAseguradora>();

  @Output() clickCancel: EventEmitter<boolean> = new EventEmitter();
  @Output() validForm: EventEmitter<boolean> = new EventEmitter();


  cancelModal() {
    this.clickCancel.emit(true)
  }

  ngOnInit(): void {

    this.breadcrumbs.push(this.breadcrumbsLabel);
    this.formAseguradora = this.formBuilder.group({
      nombreComercial: ['', [Validators.required]],
      razonSocial: ['', [Validators.required]],
      pais: [0, [Validators.required, Validators.min(1)]],
      estatus: [0, [Validators.required, Validators.min(1)]],
      oficinas: [[], []],
      altaProyecto: [false, []],
      documentos: [false, []],
    })

    this.route.params.subscribe(params => {
      this.idAseguradora = params['id'];

      this.aseguradoraService.getCatalogs().subscribe((catalogos: IResponse<IAseguradoraGetCatalogs>) => {
        this.catalogos = catalogos.data;

        if (this.idAseguradora) {

          if(this.ver) this.formAseguradora.disable();

          this.aseguradoraService.getByIdAndGetCatalogosToEdit(this.idAseguradora).subscribe({
            next: (response: IResponse<IAseguradoraEdit>) => {
              if (response.success) {
                const { aseguradora, catalagos } = response.data;
                this.paises = catalagos.paises;
                this.estatus = catalagos.estatus;
                this.oficinas = catalagos.oficinas;
                this.oficinasByPais = this.oficinas.filter((o) => o.pais === aseguradora.pais);
                this.formAseguradora.reset(aseguradora);
                //setTimeout(() => this.formAseguradora.patchValue(aseguradora), 100)
              }
            }
          })
        }
      })

    })

    this.formAseguradora.controls['pais'].valueChanges.subscribe((clave) =>
      (this.currentCountry = this.catalogos.paises.find((p) => p.clave == clave))
    );

  }

  onPaisSelectionChange(clave: number): void {
    this.formAseguradora.controls['oficinas'].setValue([]);
    this.oficinasByPais = this.catalogos.oficinas.filter((o) => o.pais === clave);
  }

  validateForm() {
    if (this.formAseguradora.invalid) this.validForm.emit(true);
    else this.validForm.emit(false);
  }

}
