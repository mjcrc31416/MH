// ENTIDAD FEDERATIVA

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let LogData = new Schema({
    logDate: {
        type: Date
    },
    msg: {
        type: String
    },
});

module.exports = mongoose.model('log-data', LogData);
