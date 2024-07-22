import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { NotifierService } from 'src/app/shared/services/notification/notifier.service';
import { SwalService } from 'src/app/shared/services/notification/swal.service';
import { FnzFolioService } from '../../../services/fnz-folio.service';

@Component({
  selector: 'app-fnz-folio',
  templateUrl: './fnz-folio.component.html',
  styleUrls: ['./fnz-folio.component.scss'],
})
export class FnzFolioComponent implements OnInit {
  @ViewChild('inputFile', { static: false }) fileInputRef!: ElementRef;

  file: File | null = null;
  frmFolio: FormGroup = <FormGroup>{};
  uploading: boolean = false;

  allowedExtensions: string = '.xls,.xlsx';
  breadcrumbs: string[] = [
    'fianzas.title',
    'fianzas.core.folio.title',
    'fianzas.core.folio.nuevo.title',
  ];

  constructor(
    private readonly notifierService: NotifierService,
    private readonly swalDialog: SwalService,
    private readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private folioService: FnzFolioService
  ) {}

  ngOnInit(): void {
    this.frmFolio = this.formBuilder.group({
      file: [
        '',
        [Validators.required, Validators.pattern(/^[\w,\s-]+\.(xls|xlsx)$/i)],
      ],
    });
  }

  onDragover(event: DragEvent): void {
    event.stopPropagation();
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.stopPropagation();
    event.preventDefault();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) this.handleFileInputChange(files);
  }

  handleFileInputChange(files: FileList | null): void {
    if (files && files.length === 1) {
      this.file = files[0];
      this.frmFolio.controls['file'].setValue(files[0].name);
    } else this.clear();
  }

  selectFile(input: any): void {
    if (!this.uploading) input.click();
  }

  clear(): void {
    if (this.fileInputRef) this.fileInputRef.nativeElement.value = '';
    this.frmFolio.reset();
    this.file = null;
    this.frmFolio.controls['file'].markAsUntouched();
  }

  upload(): void {
    if (
      this.file == null ||
      this.frmFolio.invalid ||
      !/^[\w,\s-]+\.(xls|xlsx)$/i.test(this.file.name)
    ) {
      this.notifierService.warning(
        this.translate.instant('fianzas.core.folio.nuevo.requiredFile')
      );
      return;
    }

    this.uploading = true;
    this.frmFolio.controls['file'].disable();
    this.folioService
      .upload(this.file)
      .pipe(
        finalize(() => {
          this.uploading = false;
          this.frmFolio.controls['file'].enable();
          this.clear();
        })
      )
      .subscribe({
        next: (response: IResponse<any>) => {
          if (response.success)
            this.swalDialog.success({
              title: this.translate.instant(
                'fianzas.core.folio.nuevo.uploadSuccessful'
              ),
              text: response.message,
            });
          else console.error(response.message);
        },
        error: (err) => this.notifierService.error(err?.error?.message),
      });
  }
}
