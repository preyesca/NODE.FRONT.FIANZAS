import {Subject, takeUntil} from "rxjs";
import {Moment} from "moment";
import * as moment from 'moment';
import {ENTER} from "@angular/cdk/keycodes";
import {TranslateService} from "@ngx-translate/core";
import {MatChipInputEvent} from "@angular/material/chips";
import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, NgForm, UntypedFormControl, Validators} from "@angular/forms";
import {AppConsts} from "../../../../shared/AppConsts";
import {IReporte} from "../../helpers/interfaces/core-reporte";
import {CoreReporteService} from "../../services/core-reporte.service";
import {ICatalogo} from "../../../catalogos/helpers/interfaces/catalogo";
import {SwalService} from "../../../../shared/services/notification/swal.service";
import {NotifierService} from "../../../../shared/services/notification/notifier.service";

@Component({
  selector: 'app-adm-reporte-seguimiento',
  templateUrl: './adm-reporte-seguimiento.component.html',
  styleUrls: ['./adm-reporte-seguimiento.component.scss']
})
export class AdmReporteSeguimientoComponent implements OnInit, OnDestroy {

  breadcrumbs: string[] = [
    'administracion.title',
    'administracion.reporte.titlePlural',
  ];
  readonly separatorKeysCodes = [ENTER] as const;
  PATTERN_EMAIL: RegExp = AppConsts.PATTERN.EMAIL_ADDRESS;
  destroy$ = new Subject<void>();


  frmReporte = new FormGroup({
    tipoReporte: new FormControl<number | null>(null, [Validators.required]),
    fechaInicio: new FormControl<Moment | null>(null, [Validators.required]),
    fechaFin: new FormControl<Moment | null>(null, [Validators.required]),
    destinatarios: new FormControl<string[]>([], []),
    correos: new UntypedFormControl('', []),
  })

  @ViewChild('chipGrid') chipGrid: any;
  // @ts-ignore
  @ViewChild('formDirective') formDirective: NgForm;
  reportes: ICatalogo[] = []
  correos: any = [];

  minDateInicio = new Date(2021, 12, 1)
  maxDateInicio = new Date();

  minDateFin = moment();
  maxDateFin = moment();

  readonly notifierService = inject(NotifierService)
  readonly #coreReporteService = inject(CoreReporteService)
  readonly #swal = inject(SwalService);
  readonly #translate = inject(TranslateService)

  ngOnInit(): void {
    this.getReports()
  }

  getReports() {
    this.#coreReporteService.getReports().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.reportes = response.data
        } else console.error(response.message);
      },
      error: (err) => this.notifierService.error(err?.error?.message),
    })
  }

  submit(): void {
    if (!this.frmReporte.valid) {
      this.frmReporte.markAllAsTouched()
      return
    }
    const formValue = this.frmReporte.getRawValue()
    const report: IReporte = {
      tipoReporte: formValue.tipoReporte!,
      fechaInicio: formValue.fechaInicio!.toISOString().substring(0, 10) + 'T05:00:00.000Z',
      fechaFin: formValue.fechaFin!.toISOString().substring(0, 10) + 'T05:00:00.000Z',
      destinatarios: formValue.destinatarios! || []
    }
    this.#coreReporteService.createReport(report)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.#swal.success({
              text: this.#translate.instant('administracion.reporte.successMessage')
            }).then(() => {
              this.frmReporte.reset()
              this.correos = []
              this.formDirective.resetForm()
            })
          } else console.error(response.message);
        },
        error: (err) => this.notifierService.error(err?.error?.message),
      })
  }

  checkValidEmail(): void {
    this.chipGrid.errorState = this.correos.length == 0;
    let correo = this.frmReporte.get('correos');
    correo?.patchValue(this.correos.join(','));
    correo?.setErrors(this.correos.length == 0 ? {required: true} : null);
  }

  remove(email: string): void {
    const index = this.correos.indexOf(email);
    if (index >= 0) this.correos.splice(index, 1);
    this.checkValidEmail();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value == '') return;
    if (!this.PATTERN_EMAIL.test(value)) {
      this.notifierService.warning(this.#translate.instant('administracion.reporte.messageEmailInvalid'));
      event.chipInput.clear();
      return;
    }
    if (this.correos.filter((f: any) => f.name == value).length > 0) {
      this.notifierService.info(this.#translate.instant('administracion.reporte.messageEmailDuplicate'));
      event.chipInput.clear();
      return;
    }
    this.correos.push({name: value, invalid: false});
    this.checkValidEmail();
    event.chipInput.clear();
  }

  fechaInicioChange() {
    const fechaInicio = moment(this.frmReporte.controls.fechaInicio.value, 'MM-DD-YYYY');
    this.minDateFin = moment(this.frmReporte.controls.fechaInicio.value, 'MM-DD-YYYY');
    this.maxDateFin = fechaInicio.add(12, 'M');
    if (moment(this.maxDateInicio) < this.maxDateFin) {
      this.maxDateFin = moment(this.maxDateInicio);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
