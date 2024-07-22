import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareBreadcrumbComponent } from './share-breadcrumb.component';

describe('ShareBreadcrumbComponent', () => {
  let component: ShareBreadcrumbComponent;
  let fixture: ComponentFixture<ShareBreadcrumbComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShareBreadcrumbComponent]
    });
    fixture = TestBed.createComponent(ShareBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
