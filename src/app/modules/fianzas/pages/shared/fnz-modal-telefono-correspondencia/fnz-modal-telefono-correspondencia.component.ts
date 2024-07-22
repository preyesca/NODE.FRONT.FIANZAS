import { ENTER } from "@angular/cdk/keycodes";
import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";
import { AppConsts } from "src/app/shared/AppConsts";
import { IResponse } from "src/app/shared/helpers/interfaces/response";
import { NotifierService } from "src/app/shared/services/notification/notifier.service";
import { UserStorageService } from "src/app/shared/services/storage/user-storage.service";
import { FnzContactoTelefonicoService } from "../../../services/fnz-contacto-telefonico.service";
import { IFnzBandejaPaginate } from "../../core/helpers/interfaces/fnz-bandeja";

@Component({
  selector: 'app-fnz-modal-telefono-correspondencia',
  templateUrl: './fnz-modal-telefono-correspondencia.component.html',
  styleUrls: ['./fnz-modal-telefono-correspondencia.component.scss']
})
export class FnzModalTelefonoCorrespondenciaComponent {
  public activate: boolean = false;
  readonly separatorKeysCodes = [ENTER] as const;

  @Input() title: string = '';
  @Input() itemTelefonoCorrespondencia: any;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  @ViewChild("chipGrid") chipList: any;
  @Input() lstTelefonosCorrespondecia: any[] = [];
  @Input() modoConsulta: boolean = false;
  @Output() itemChanged: EventEmitter<any> = new EventEmitter();
  @Output() modalOpenChanged: EventEmitter<boolean> = new EventEmitter();

  frmTelefonos!: UntypedFormGroup;
  folio!: IFnzBandejaPaginate;
  extension: any = [];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private contactoTelefonicoService: FnzContactoTelefonicoService,
    private notifierService: NotifierService,
    private userStorageService: UserStorageService
  ) { }


  ngOnInit(): void {
        const infoFolio = this.userStorageService.getFolioInfo() as IFnzBandejaPaginate;
    if (!infoFolio) {
      this.notifierService.warning(
        'No se logró obtener la información del folio.'
      );
      return;
    }
    
    this.folio = infoFolio;
    this.frmTelefonos = this.formBuilder.group({
      id: new UntypedFormControl({ value: "0", disabled: true }),
      folio: new UntypedFormControl({ value: this.folio.folio, disabled: true }),
      telefonoCorrespondencia: new UntypedFormControl('', [Validators.required]),
      extensionCorrespondencia: new UntypedFormControl(''),
      extension: new UntypedFormControl(''),
    })

    if (this.itemTelefonoCorrespondencia) {
      this.edicion();
    }

  }

  edicion() {
    const item = this.itemTelefonoCorrespondencia;
    this.getDataExtension(item.extensiones);
    this.frmTelefonos.patchValue({
      id: item._id,
      idFolio: item.folio,
      telefonoCorrespondencia: item.telefono,
      extensiones: this.extension
    })
  }

  click_guardar() {
    
    if (this.frmTelefonos.invalid) {
      if (this.frmTelefonos.invalid) {
        this.frmTelefonos.markAllAsTouched();
        return;
      }
    }

    const extension = this.getExtension();
    this.frmTelefonos.get('extensionCorrespondencia')?.setValue(extension);
    const telefono = this.frmTelefonos.getRawValue();

    let req: any = {
      id: telefono.id,
      folio: telefono.folio,
      telefono: telefono.telefonoCorrespondencia,
      extensiones: telefono.extensionCorrespondencia
    }

    this.contactoTelefonicoService.insertTelefonoCorrespondencia(req).subscribe({
      next: (response: IResponse<any>) => {
        if (response.success) {
          this.notifierService.success(response.message, 'Exito');
          this.closeModal.emit(false);
          return;
        }
      }
    })

  }

  add(event: MatChipInputEvent): void {

    const value = (event.value || '').trim();

    if (value) {
      if (this.validateNumberPattern(value)) {
        this.extension.push({ name: value, invalid: false });
      } else {
        this.extension.push({ name: value, invalid: true });
      }
    }

    event.chipInput.clear();
  }

  remove(fruit: string): void {
    const index = this.extension.indexOf(fruit);

    if (index >= 0) {
      this.extension.splice(index, 1);
    }

  }

  validateNumberPattern(value: string) {
    var re = AppConsts.PATTERN.ONLY_NUMBERS;
    return re.test(value);
  }

  getExtension(): string[] {
    let extension = '';
    this.extension.map((element: any) => {

      if (this.extension.length > 1) {
        extension += element.name + ','
      } else {
        extension += element.name
      }
    });


    if (extension.charAt(extension.length - 1) == ",")
      extension = extension.substring(0, extension.length - 1)

    return extension.split(',');
  }

  getDataExtension(x: string[]) {
    x?.forEach(x => {
      if (x !== "") {
        if (this.validateNumberPattern(x)) {
          this.extension.push({ name: x, invalid: false });
        } else {
          this.extension.push({ name: x, invalid: true });
        }
      }
    })
  }

  onCloseModal() {
    this.closeModal.emit();
  }

}
