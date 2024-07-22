import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDocumentsComponent } from './input-documents.component';

describe('InputDocumentsComponent', () => {
  let component: InputDocumentsComponent;
  let fixture: ComponentFixture<InputDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
