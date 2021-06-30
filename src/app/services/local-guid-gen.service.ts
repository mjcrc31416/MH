import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class LocalGuidGenService {

  constructor() { }

  public newGuid(): string {
    let guid = '';
    //console.log(moment());
    //console.log(moment().format('YYYYMMDDHHmmssSSS'));
    guid = moment().format('YYYYMMDDHHmmssSSS').toString();
    console.log(guid);
    return guid;
  }
}
