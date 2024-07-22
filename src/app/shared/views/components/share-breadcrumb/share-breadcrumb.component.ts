import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-share-breadcrumb',
  templateUrl: './share-breadcrumb.component.html',
  styleUrls: ['./share-breadcrumb.component.scss']
})
export class ShareBreadcrumbComponent {

  @Input() breadcrumbs: string[] = [];

}
