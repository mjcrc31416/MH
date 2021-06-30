/// <reference path="../../../../node_modules/@types/googlemaps/index.d.ts" />


import {Component, OnInit, ViewChild, ElementRef, NgZone, Inject} from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import * as _ from 'lodash';


@Component({
  selector: 'app-gmdir',
  templateUrl: './gmdir.component.html',
  styleUrls: ['./gmdir.component.scss']
})
export class GmdirComponent implements OnInit {

  title: string = 'AGM project';
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  direccionMx: any;
  private geoCoder;

  parmData;
  isParmLocSet = false;

  @ViewChild('search',{static: false})
  public searchElementRef: ElementRef;


  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public dialogRef: MatDialogRef<GmdirComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.zoom = 8;
    console.log('DATA   ===');
    console.log(data);
    this.parmData = data;
  }



  ngOnInit() {
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {


      this.setCurrentLocation();

      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;

          this.getAddress(this.latitude, this.longitude);
        });
      });


    });
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        // this.getAddress(this.latitude, this.longitude);

        if (!this.isParmLocSet) {
          this.getAddress(+this.parmData.lat, +this.parmData.long );
          this.latitude = +this.parmData.lat;
          this.longitude = +this.parmData.long;
          this.isParmLocSet = true;
        }
      });
    }
  }


  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
          this.setDirecciion(results);
          // this.address = getDireccionFormato();
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  onElegirDir() {
    if (!_.isNil(this.direccionMx)) {
      this.dialogRef.close(this.direccionMx);
    }
  }

  onCerrar() {
    this.dialogRef.close(null);
  }

  setDirecciion(obj:any) {
    let direccion:any = {};
    let entidad = {};
    for(let o of obj) {
      console.log(o);
      for(let t of o.address_components) {

        for (let tipo of t.types) {
          if (tipo === 'administrative_area_level_1') {
            direccion.entidad = (direccion.entidad) ? (direccion.entidad) : t;
          }

          if (tipo === 'administrative_area_level_2') {
            direccion.municipio = (direccion.municipio) ? (direccion.municipio) : t;
          }

          if (tipo === 'administrative_area_level_3' && _.isNil(direccion.municipio)) {
            direccion.municipio = (direccion.municipio) ? (direccion.municipio) : t;
          }

          if (tipo === 'sublocality') {
            direccion.colonia = (direccion.colonia) ? (direccion.colonia) : t;
          }

          if (tipo === 'neighborhood') {
            direccion.colonia = (direccion.colonia) ? (direccion.colonia) : t;
          }

          if (tipo === 'street_number') {
            direccion.numcalle = (direccion.numcalle) ? (direccion.numcalle) : t;
          }

          if (tipo === 'postal_code') {
            direccion.codigoPostal = (direccion.codigoPostal) ? (direccion.codigoPostal) : t;
          }

          if (tipo === 'route') {
            direccion.calle = (direccion.calle) ? (direccion.calle) : t;
          }
        }
      }
    }

    this.direccionMx = direccion;
    this.direccionMx.lat = this.latitude;
    this.direccionMx.long = this.longitude;

    console.log(this.direccionMx);
  }

}
