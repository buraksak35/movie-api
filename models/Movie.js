const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  title: {
    type: String,
    required: [true, "${PATH} is required!"],
    maxlength: 15,
    minlength: 3
  },
  category: {
    type: String,
    maxlength: 20,
    minlength: 3
  },
  country: {
    type: String,
    maxlength: 20,
    minlength: 3
  },
  year: { type: Number, required: true, max: new Date().getFullYear() },
  imdb_score: {
    type: Number,
    maxlength: 10,
    minlength: 1
  },
  director_id: Schema.Types.ObjectId,
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("movie", MovieSchema);
