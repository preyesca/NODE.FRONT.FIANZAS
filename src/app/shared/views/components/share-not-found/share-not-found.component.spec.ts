import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareNotFoundComponent } from './share-not-found.component';

describe('ShareNotFoundComponent', () => {
  let component: ShareNotFoundComponent;
  let fixture: ComponentFixture<ShareNotFoundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShareNotFoundComponent]
    });
    fixture = TestBed.createComponent(ShareNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
