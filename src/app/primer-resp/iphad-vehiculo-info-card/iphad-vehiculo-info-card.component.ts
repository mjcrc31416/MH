import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-iphad-vehiculo-info-card',
  templateUrl: './iphad-vehiculo-info-card.component.html',
  styleUrls: ['./iphad-vehiculo-info-card.component.scss']
})
export class IphadVehiculoInfoCardComponent implements OnInit {
  @Input() vehi: any;

  constructor() { }

  ngOnInit() {
  }

}
