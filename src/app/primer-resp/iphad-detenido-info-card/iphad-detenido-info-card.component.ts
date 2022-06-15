import {Component, Input, OnInit} from '@angular/core';
import {IphadService} from '../iphad/iphad.service';

@Component({
  selector: 'app-iphad-detenido-info-card',
  templateUrl: './iphad-detenido-info-card.component.html',
  styleUrls: ['./iphad-detenido-info-card.component.scss']
})
export class IphadDetenidoInfoCardComponent implements OnInit {

  @Input() idDetenido: string;
  detenido;

  constructor(
    private iphadSrv: IphadService,
  ) { }

  ngOnInit() {
    this.getDetenidoInfo();
  }

  async getDetenidoInfo() {
    this.detenido = await this.iphadSrv.getDetenidoById(this.idDetenido);
    // console.log(this.detenido);
  }

  get nombreCompleto() {
    try {
      const nombre = this.detenido.intervencion.datPer.nombre;
      const appat = this.detenido.intervencion.datPer.appat;
      const apmat = this.detenido.intervencion.datPer.apmat;

      let nomcomp = nombre + " " + appat + " " + apmat;
      return nomcomp;
    } catch (e) {
      // console.log(e);
    }
    return "NO ESPECIFICADO";
  }

  get fechaDetencion() {
    try {
      const fechaDetencion = this.detenido.intervencion.fechaDetencion;
      return fechaDetencion;
    } catch (e) {
      // console.log(e);
    }
    return null;
  }

  get fechaNacimiento() {
    try {
      const fecha = this.detenido.intervencion.datPer.fecnac;
      return fecha;
    } catch (e) {
      // console.log(e);
    }
    return null;
  }

  get edad() {
    try {
      console.log("= = = = = = = = = = =  = = = = = = = = = = = ");
      const fecha = this.detenido.intervencion.datPer.fecnac;
      console.log(fecha);
      const edad = this._calculateAge(new Date(fecha));
      console.log(edad);
      return edad.toString();
    } catch (e) {
      // console.log(e);
    }
    return null;
  }

  get descripcion() {
    try {
      const descripcion = this.detenido.intervencion.descripcion;
      return descripcion;
    } catch (e) {
      // console.log(e);
    }
    return '';
  }

  get sexo() {
    try {
      const sexo = this.detenido.intervencion.datPer.sexo.nom;
      return sexo;
    } catch (e) {
      // console.log(e);
    }
    return '';
  }

  get nacionalidad() {
    try {
      const nacionalidad = this.detenido.intervencion.datPer.nacionalidad.nom;
      return nacionalidad;
    } catch (e) {
      // console.log(e);
    }
    return '';
  }

  get imgUrl() {
    try {
      const img = this.detenido.intervencion.imgs[0].filename;
      //return `https://iphmov.azurewebsites.net/api/mov/getfile/${img}`;
      return `https://cni05.sesnsp.net/iphmov/api/mov/getfile/${img}`;
    } catch (e) {
      // console.log(e);
    }
    return '';
  }

  _calculateAge(birthday) { // birthday is a date
    let ageDifMs = Date.now() - birthday.getTime();
    let ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

}
