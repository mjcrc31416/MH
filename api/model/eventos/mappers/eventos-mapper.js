
const _ = require('lodash');


const EventosMapper = {};


EventosMapper.buildDummyCordinadora = function() {
    return {
        "coordinadora": "",
        "bid": 9999,
        "abr": ""
    }
};

EventosMapper.buildAtiende = function(eventoObj) {
    if (_.isNil(eventoObj.atiende) || _.isEmpty(eventoObj.atiende)) {
        eventoObj.atiende = {
            "bid": parseInt(eventoObj.institucion.cve),
            "atiende": eventoObj.institucion.institucion
        };
    }

    return eventoObj;
};

EventosMapper.buildReporta = function(eventoObj) {
    if (_.isNil(eventoObj.reporta) || _.isEmpty(eventoObj.reporta)) {
        eventoObj.reporta = {
            "_id": "",
            "nombre": eventoObj.torre.torre
        };
    }

    return eventoObj;
};

EventosMapper.fixTorreObj = function(torreObj) {
    // console.log("######################");
    // console.log("(1) EventosMapper.fixTorreObj");
    // console.log(torreObj);
    // console.log(_.isEmpty(torreObj.bid));
    if (_.isNil(torreObj.bid)) {
        // console.log("(2) EventosMapper.fixTorreObj");
        torreObj.bid = parseInt(torreObj.cve);

        torreObj.bid = (!_.isNumber(torreObj.bid)) ? 9999 : torreObj.bid;
    }
    // console.log("(3) EventosMapper.fixTorreObj");

    return torreObj;
};


EventosMapper.setDummyCordOnList = function(listEventos) {
    for (let item of listEventos) {
        item = EventosMapper.fixEvento(item);
        // if (_.isNil(item.coordinadora) || _.isEmpty(item.coordinadora)) {
        //     item.coordinadora = EventosMapper.buildDummyCordinadora();
        // }
        //
        // item.torre = EventosMapper.fixTorreObj(item.torre);
        // item = EventosMapper.buildAtiende(item);
        // item = EventosMapper.buildReporta(item);
        //
        // if (_.isNil(item.nincidente) || _.isEmpty(item.nincidente)) {
        //     item.nincidente = "";
        // }
    }

    return listEventos;
};

EventosMapper.fixEvento = function(eventoObj) {
    let item = eventoObj;

    if (_.isNil(item.coordinadora) || _.isEmpty(item.coordinadora)) {
        item.coordinadora = EventosMapper.buildDummyCordinadora();
    }

    item.torre = EventosMapper.fixTorreObj(item.torre);
    item = EventosMapper.buildAtiende(item);
    item = EventosMapper.buildReporta(item);

    if (_.isNil(item.nincidente) || _.isEmpty(item.nincidente)) {
        item.nincidente = "";
    }

    return item;
};


module.exports.EventosMapper = EventosMapper;
