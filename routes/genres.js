const validateObjectId = require('../middleware/validateObjectId');
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const mongoose = require("mongoose");
const router = express();
const { Genre, validateGenre } = require("../models/genre");

router.get("/", async (req, res) => {
    // throw new Error('Could not get the genres.');
    const genres = await Genre.find().sort({ names: 1 });
    res.send(genres);
});

router.post("/", auth, async (req, res) => {
    const { error } = validateGenre(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    let genre = new Genre({
        name: req.body.name,
    });

    genre = await genre.save();
    res.send(genre);
});

router.put("/:id", auth, async (req, res) => {
    const { error } = validateGenre(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    try {
        const genre = await Genre.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
            },
            { new: true }
        );
        if (!genre) {
            return res
                .status(404)
                .send("The genre with the given ID was not found.");
        }
        res.send(genre);
    } catch (err) {
        return res
            .status(404)
            .send("The genre with the given ID was not found.");
    }
});

router.delete("/:id", [auth, admin], async (req, res) => {
    try {
        const genre = await Genre.findByIdAndRemove(req.params.id);
        if (!genre) {
            return res
                .status(404)
                .send("The genre with the given ID was not found.");
        }
        res.send(genre);
    } catch (err) {
        return res
            .status(404)
            .send("The genre with the given ID was not found.");
    }
});

router.get("/:id", validateObjectId, async (req, res) => {
    
    const genre = await Genre.findById(req.params.id);
    if (!genre) {
        return res
            .status(404)
            .send("The genre with the given ID was not found.");
    }
    res.send(genre);
});

module.exports = router;
