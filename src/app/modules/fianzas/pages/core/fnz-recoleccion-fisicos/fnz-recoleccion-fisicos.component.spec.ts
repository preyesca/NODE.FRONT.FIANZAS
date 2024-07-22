import { ComponentFixture, TestBed } from '@angular/core/testing';

import {  FnzRecoleccionFisicosComponent } from './fnz-recoleccion-fisicos.component';

describe('FnzRecoleccionFisicosComponent', () => {
  let component: FnzRecoleccionFisicosComponent;
  let fixture: ComponentFixture<FnzRecoleccionFisicosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FnzRecoleccionFisicosComponent]
    });
    fixture = TestBed.createComponent(FnzRecoleccionFisicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
