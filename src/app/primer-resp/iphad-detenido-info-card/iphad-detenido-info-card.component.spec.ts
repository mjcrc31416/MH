import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IphadDetenidoInfoCardComponent } from './iphad-detenido-info-card.component';

describe('IphadDetenidoInfoCardComponent', () => {
  let component: IphadDetenidoInfoCardComponent;
  let fixture: ComponentFixture<IphadDetenidoInfoCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IphadDetenidoInfoCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IphadDetenidoInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
