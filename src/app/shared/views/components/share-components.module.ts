import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AngularMaterialModule } from '../../modules/angular-material/angular-material.module';
import { InputDocumentsComponent } from './input-documents/input-documents.component';
import { ShareBreadcrumbComponent } from './share-breadcrumb/share-breadcrumb.component';
import { ShareNotFoundComponent } from './share-not-found/share-not-found.component';

@NgModule({
  declarations: [
    ShareBreadcrumbComponent,
    ShareNotFoundComponent,
    InputDocumentsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    TranslateModule
  ],
  exports: [ShareBreadcrumbComponent, InputDocumentsComponent],
})
export class ShareComponentsModule {}
