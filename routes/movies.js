const { Movie, validateMovie } = require("../models/movie");
const { Genre } = require("../models/genre");
const express = require("express");
const router = express();

router.get("/", async (req, res) => {
    const movies = await Movie.find().sort({ title: 1 });
    res.send(movies);
});

router.post("/", async (req, res) => {
    const { error } = validateMovie(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        const genre = await Genre.findById(req.body.genreId);
        let movie = new Movie({
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name,
            },
            numberInStocks: req.body.numberInStocks,
            dailyRentalRate: req.body.dailyRentalRate,
        });

        movie = await movie.save();
        res.send(movie);
    } catch (err) {
        return res.status(400).send("Invalid genre.");
    }
});

router.put("/:id", async (req, res) => {
    const { error } = validateMovie(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let genre = null;
    try {
        genre = await Genre.findById(req.body.genreId);
        if(!genre) {
            return res.status(400).send("Invalid Genre.");
        }
    } catch (err) {
        return res.status(400).send("Invalid Genre.");
    }

    let movie = null;
    try {
        movie = await Movie.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                genre: {
                    _id: genre._id,
                    name: genre.name,
                },
                numberInStocks: req.body.numberInStocks,
                dailyRentalRate: req.body.dailyRentalRate,
            },
            { new: true }
        );

        if (!movie) {
            return res
                .status(400)
                .send("The movie with the given ID was not found.");
        }

        res.send(movie);
    } catch (err) {
        return res
            .status(400)
            .send("The movie with the given ID was not found.");
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const movie = await Movie.findByIdAndRemove(req.params.id);
        if (!movie) {
            return res
                .status(404)
                .send("The Movie with the given ID was not found.");
        }
        res.send(movie);
    } catch (err) {
        return res
            .status(404)
            .send("The Movie with the given ID was not found.");
    }
});

router.get("/:id", async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (movie === null) {
            return res
                .status(404)
                .send("The Movie with the given ID was not found.");
        }
        res.send(movie);
    } catch (err) {
        return res
            .status(404)
            .send("The Movie with the given ID was not found.");
    }
});

module.exports = router;
