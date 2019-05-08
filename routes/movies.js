const express = require("express");
const router = express.Router();

// Models
const Movie = require("../models/Movie");

router.get("/", async (req, res, next) => {
  try {
    const allMovies = await Movie.aggregate([
      {
        $lookup: {
          from: "directors",
          localField: "director_id",
          foreignField: "_id",
          as: "director"
        }
      },
      {
        $unwind: "$director" //sadece id yi almak isterse ??
      }
    ]);

    res.json(allMovies);
  } catch (error) {
    res.json(error);
  }
});

router.post("/", async (req, res, next) => {
  // const { title, category, country, year, imdb_score, date, director_id } = req.body;
  try {
    const movie = new Movie(req.body);

    const result = await movie.save();

    res.json(result);
  } catch (error) {
    res.json(error);
  }
});

router.get("/top10", async (req, res, next) => {
  try {
    const top10 = await Movie.find({})
      .limit(10)
      .sort({ imdb_score: -1 });

    res.json(top10);
  } catch (error) {
    res.json(error);
  }
});


router.get("/:movie_id", async (req, res, next) => {
  try {
    const { movie_id } = req.params;

    const movie = await Movie.findById(movie_id);

    if (!movie) next({ message: "The movie was not found!", code: 99 });
    else res.json(movie);
  } catch (error) {
    res.json(error);
  }
});

router.put("/:movie_id", async (req, res, next) => {
  try {
    const { movie_id } = req.params;

    const movie = await Movie.findByIdAndUpdate(movie_id, req.body, { new: true });

    if (!movie) next({ message: "The movie was not found!", code: 99 });
    else res.json(movie);
  } catch (error) {
    res.json(error);
  }
});

router.delete("/:movie_id", async (req, res, next) => {
  try {
    const { movie_id } = req.params;

    const movie = await Movie.findByIdAndRemove(movie_id);

    if (!movie) next({ message: "The movie was not found!", code: 99 });
    else res.json({ status: 1 });
  } catch (error) {
    res.json(error);
  }
});

router.get("/between/:start_year/:end_year", async (req, res, next) => {
  try {
    const { start_year, end_year } = req.params;

    const result = await Movie.find({
      year: {
        $gte: parseInt(start_year),
        $lte: parseInt(end_year)
      }
    });

    res.json(result);
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
