import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FormUtilsService {

  stdDateFormat = 'DD/MM/YYYY';

  constructor() { }

  findComboValue(listData, obj, listItemAttrPath, objAttrPath) {
    let tmp01;
    const tmp02 = _.get(obj, objAttrPath, null);
    console.log(tmp02);

    if (_.isNil(tmp02)){
      return null;
    }

    for (const item of listData) {
      tmp01 = _.get(item, listItemAttrPath, null);
      console.log(tmp01);

      if (tmp01 === tmp02) {
        return item;
      }
    }
  }//end findComboValue

  getDateAndTimeObj(date) {
    if (!date) {
      date = new Date();
    }

    return {
      fecha: moment(date).format(this.stdDateFormat),
      strFecha: moment(date).format(this.stdDateFormat),
      hora: moment(date).format('HH'),
      minutos: moment(date).format('mm'),
      fechaObj: moment(date).toDate(),
    };
  }//end getDateAndTimeObj

  getDateFromStdFormat(strDate) {
    return moment(strDate, this.stdDateFormat);
  }//end getDateFromStdFormat

  getDateFromDateTime(dtObj) {
    console.log('getDateFromDateTime =============================');
    console.log(dtObj);

    let strFecha = null;

    if (_.isDate(dtObj.fecha)) {
      console.log('is date');
      strFecha = moment(dtObj.fecha).format('DD/MM/YYYY');
    } else if ( moment(dtObj.fecha).isValid() ) {
      strFecha = moment(dtObj.fecha).format('DD/MM/YYYY');
    } else {
      strFecha = dtObj.fecha;
    }

    const fecha = strFecha + ' ' + this.getTwoStr(dtObj.hora) + ':' + this.getTwoStr(dtObj.minutos);
    console.log(fecha);
    return moment(fecha, 'DD/MM/YYYY HH:mm').toDate();
  }//end getDateFromStdFormat

  getTwoStr(strDat) {
    const tmp = '0' + strDat;
    return this.right(tmp, 2);
  }

  right(str: string, num: number) {
    const strLen = str.length;
    return str.substring(strLen - num, strLen);
  }

  getNewId() {
    return moment(new Date()).format('YYYYMMDDHHmmssSSS');
  }

  getStrFechaCort(fecha) {
    return moment(new Date()).format('YYYYMMDD');
  }

  isNullAndEmpty(obj) {
    let ret = true;
    if (!_.isNil(obj) && obj.length > 0) {
      ret = false;
    }
    return ret;
  }
}
