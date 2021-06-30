import * as _ from 'lodash';

export class RechazoModel {
  motivo: string = '';
  fecha: Date = new Date();

  constructor(data:any) {
    console.log('RechazoModel constructor init');
    Object.keys(this).forEach(key => {
      if (_.isString(this[key])) {
        this[key] = _.get(data, key, '');
      }

      if (_.isDate(this[key])) {
        this[key] = _.get(data, key, new Date());
      }
    });
    console.log('RechazoModel constructor end');
    console.log(this);
  }
}
