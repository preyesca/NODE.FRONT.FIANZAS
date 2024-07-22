import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmReporteSeguimientoComponent } from './adm-reporte-seguimiento.component';

describe('AdmReporteSeguimientoComponent', () => {
  let component: AdmReporteSeguimientoComponent;
  let fixture: ComponentFixture<AdmReporteSeguimientoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdmReporteSeguimientoComponent]
    });
    fixture = TestBed.createComponent(AdmReporteSeguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
