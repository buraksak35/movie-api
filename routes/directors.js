const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Models
const Director = require("../models/Director");

router.post("/", async (req, res, next) => {
  try {
    const director = new Director(req.body);

    const result = await director.save(req.body);

    res.json({ status: 1 });
  } catch (error) {
    res.json(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const result = await Director.aggregate([
      {
        $lookup: {
          from: "movies",
          localField: "_id",
          foreignField: "director_id",
          as: "movies"
        }
      },
      {
        $unwind: {
          path: "$movies",
          preserveNullAndEmptyArrays: true // filmi olmayan yönetmenlerin de görünmesi için
        }
      },
      {
        $group: {
          _id: {
            _id: "$_id",
            full_name: "$full_name",
            bio: "$bio"
          },
          movies: {
            $push: "$movies"
          }
        }
      },
      {
        $project: {
          _id: "$_id._id",
          full_name: "$_id.name",
          bio: "$_id.bio",
          movies: "$movies"
        }
      }
    ]);

    res.json(result);
  } catch (error) {
    res.json(error);
  }
});

router.get("/:director_id", async (req, res, next) => {
  const { director_id } = req.params;
  try {
    const result = await Director.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(director_id)
        }
      },
      {
        $lookup: {
          from: "movies",
          localField: "_id",
          foreignField: "director_id",
          as: "movies"
        }
      },
      {
        $unwind: {
          path: "$movies",
          preserveNullAndEmptyArrays: true // filmi olmayan yönetmenlerin de görünmesi için
        }
      },
      {
        $group: {
          _id: {
            _id: "$_id",
            full_name: "$full_name",
            bio: "$bio"
          },
          movies: {
            $push: "$movies"
          }
        }
      },
      {
        $project: {
          _id: "$_id._id",
          full_name: "$_id.name",
          bio: "$_id.bio",
          movies: "$movies"
        }
      }
    ]);

    res.json(result);
  } catch (error) {
    res.json(error);
  }
});

router.put("/:director_id", async (req, res, next) => {
  try {
    const { director_id } = req.params;

    const director = await Director.findByIdAndUpdate(director_id, req.body, { new: true });

    if (!director) next({ message: "The director was not found!", code: 99 });
    else res.json({ director: director, status: 1 });
  } catch (error) {
    res.json(error);
  }
});

router.delete("/:director_id", async (req, res, next) => {
  try {
    const { director_id } = req.params;

    const director = await Movie.findByIdAndRemove(director_id);

    if (!director) next({ message: "The director was not found!", code: 99 });
    else res.json({ status: 1 });
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
