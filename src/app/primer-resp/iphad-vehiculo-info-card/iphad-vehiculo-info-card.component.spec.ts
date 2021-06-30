import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IphadVehiculoInfoCardComponent } from './iphad-vehiculo-info-card.component';

describe('IphadVehiculoInfoCardComponent', () => {
  let component: IphadVehiculoInfoCardComponent;
  let fixture: ComponentFixture<IphadVehiculoInfoCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IphadVehiculoInfoCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IphadVehiculoInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
