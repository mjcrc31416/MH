import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DlgGmdirComponent } from './dlg-gmdir.component';

describe('DlgGmdirComponent', () => {
  let component: DlgGmdirComponent;
  let fixture: ComponentFixture<DlgGmdirComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DlgGmdirComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DlgGmdirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
