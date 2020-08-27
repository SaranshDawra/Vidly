const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
    },
    genre: {
        type: genreSchema,
        required: true,
    },
    numberInStocks: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
    },
});

const Movie = mongoose.model("Movie", movieSchema);

function validateMovie(movie) {
    const schema = Joi.object({
        title: Joi.string().min(5).max(100).required(),
        numberInStocks: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required(),
        genreId: Joi.objectId().required()
    });

    return schema.validate(movie);
}

module.exports.Movie = Movie;
module.exports.validateMovie = validateMovie;
