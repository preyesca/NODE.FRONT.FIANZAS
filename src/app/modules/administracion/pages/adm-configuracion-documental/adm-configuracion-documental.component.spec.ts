import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmConfiguracionDocumentalComponent } from './adm-configuracion-documental.component';

describe('AdmConfiguracionDocumentalComponent', () => {
  let component: AdmConfiguracionDocumentalComponent;
  let fixture: ComponentFixture<AdmConfiguracionDocumentalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdmConfiguracionDocumentalComponent]
    });
    fixture = TestBed.createComponent(AdmConfiguracionDocumentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
