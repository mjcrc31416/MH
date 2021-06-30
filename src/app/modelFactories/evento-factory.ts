import { Injectable } from '@angular/core';
import {IDireccionModel} from '../models/idireccion.model';
import {IEventoModel} from '../models/ievento-model';
import * as _ from 'lodash';
import {HttpClient} from '@angular/common/http';
import {LogServiceService} from '../shared/log-service.service';

@Injectable({
  providedIn: 'root'
})
export class EventoFactory {
  constructor(
  ) { }

  newEventoFromForm(data) {
    // Establecer dirección
    let dir: IDireccionModel = {
      lat: data.lat,
      long: data.long,
      entidad: data.coordinadora,
      municipio: data.municipioemer
    };

    dir.cp = data.cp;
    dir.colonia = data.colonia;
    dir.calle = data.calle;
    dir.numero = data.numext;
    dir.numInt = data.numint;
    dir.referencias = data.referencia;
    dir.entreCalle = data.entre;
    dir.entreCalle2 = data.ycalle;

    // Establecer datos de Evento
    let evento: IEventoModel = {
      reporta: data.reporta,
      atiende: data.atiende,
      incidente: data.incidente,
      coordinadora: data.coordinadora,
      municipio: data.municipio,
      torre: data.torre,
      texto: data.texto,
      fecha: data.fecha,
    };

    evento.denunciante = data.denunciante;
    evento.ubicacionEvento = dir;

    // Establecer ids si existen
    if (!_.isNil(data._id)) {
      evento._id = data._id;
    }

    console.log(evento);

    return evento;
  }

  getFormDataFromEvento(evento: IEventoModel, reporta,
                        entidades, atiende, incidente,
                        coordinadora, municipio, torre) {

    let data:any = {};

    // Establecer datos de combos
    data.reporta = ''
    if (evento.reporta) {
      for (let r of reporta) {
        if (r.id === evento.reporta.id) {
          data.reporta = r;
          break;
        }
      }
    }

    data.atiende = '';
    if (evento.atiende) {
      for (let obj of atiende) {
        if (obj.bid === evento.atiende.bid) {
          data.atiende = obj;
          break;
        }
      }
    }

    data.coordinadora = '';
    if (evento.coordinadora) {
      for (let obj of coordinadora) {
        if (obj.bid === evento.coordinadora.bid) {
          data.coordinadora = obj;
          break;
        }
      }
    }

    data.municipio = '';
    if (evento.municipio) {
      for (let obj of municipio) {
        if (obj.bid === evento.municipio.bid) {
          data.municipio = obj;
          break;
        }
      }
    }

    data.incidente = '';
    if (evento.incidente) {
          data.incidente
    }

    data.torre = '';
    if (evento.torre) {
      for (let obj of torre) {
        if (obj.bid === evento.torre.bid) {
          data.torre = obj;
          break;
        }
      }
    }


    data.nincidente = (evento.nincidente) ? evento.nincidente : '';
    data.denunciante = (evento.denunciante) ? evento.denunciante : '';
    data.texto = (evento.texto) ? evento.texto : '';
    data.fecha = (evento.fecha) ? evento.fecha : '';
    data.sector = '';

    if (evento.ubicacionEvento) {
      const ubi = evento.ubicacionEvento;
      data.colonia = (ubi.colonia) ? ubi.colonia : '';
      data.calle = (ubi.calle) ? ubi.calle : '';
      data.entre = (ubi.entreCalle) ? ubi.entreCalle : '';
      data.ycalle = (ubi.entreCalle2) ? ubi.entreCalle2 : '';
      data.numext = (ubi.numero) ? ubi.numero : '';
      data.numint = (ubi.numInt) ? ubi.numInt : '';
      data.referencia = (ubi.referencias) ? ubi.referencias : '';
      data.municipioemer = (ubi.municipio) ? ubi.municipio : '';
      data.cp = (ubi.cp) ? ubi.cp : '';
      data.lat = (ubi.lat) ? ubi.lat : '';
      data.long = (ubi.long) ? ubi.long : '';
    }

    console.log(data);

    return data;
  }

}
