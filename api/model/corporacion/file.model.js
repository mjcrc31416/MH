// Calling the "mongoose" package
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creating a Schema for uploaded files
let File = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    required: [true, "Uploaded file must have a name"],
  },
});

module.exports = mongoose.model('files', File);