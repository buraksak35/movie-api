const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DirectorSchema = new Schema({
  full_name: {
    type: String,
    maxlength: 40,
    minlength: 3
  },
  bio: {
    type: String,
    maxlength: 1000,
    minlength: 10
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("director", DirectorSchema);
