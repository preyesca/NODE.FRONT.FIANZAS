import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IResponse } from "src/app/shared/helpers/interfaces/response";
import { NotifierService } from "src/app/shared/services/notification/notifier.service";
import { SwalService } from "src/app/shared/services/notification/swal.service";
import { FnzContactoTelefonicoService } from "../../../services/fnz-contacto-telefonico.service";

@Component({
  selector: 'app-fnz-info-telefono-correspondencia',
  templateUrl: './fnz-info-telefono-correspondencia.component.html',
  styleUrls: ['./fnz-info-telefono-correspondencia.component.scss']
})
export class FnzInfoTelefonoCorrespondenciaComponent {
  
  public activateSaveTelefonoCorrespondencia: boolean = false;
  public modalOpen = false;

  @Input() lstTelefonosCorrespondecia: any[] = [];
  @Input() modoConsulta: boolean = false;
  @Output() itemChanged: EventEmitter<any> = new EventEmitter();
  @Output() modalOpenChanged: EventEmitter<boolean> = new EventEmitter();

  messageTelefonosCorrespondecia: string = '';
  itemTelefonoCorrespondencia: any;
  displayedColumns: string[] = ['phone', 'extensions', 'edit', 'delete'];

  constructor(
    private swal: SwalService,
    private contactoTelefonicoService: FnzContactoTelefonicoService,
    private notifierService: NotifierService,
  ) { }

  deletePhone(element: any) {

    this.swal.question({
      text: '¿Desea eliminar el registro seleccionado?',
      icon: 'question'
    }).then((result) => {
      if (result.value) {
        
        this.contactoTelefonicoService.deleteTelefonoCorrespondencia(element._id).subscribe({
          next: (response: IResponse<any>) => {
            if (response.success) {
              this.notifierService.success(response.message, 'Exito');
              this.modalOpen = false;
              this.modalOpenChanged.emit(this.modalOpen);
            }
          }
        })

      }
    });
  }

  editPhone(element: any) {
    this.itemTelefonoCorrespondencia = element;
    this.modalOpen = true;
    this.itemChanged.emit(this.itemTelefonoCorrespondencia);
    this.modalOpenChanged.emit(this.modalOpen);

  }

}
