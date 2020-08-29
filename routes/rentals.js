const { Rental, validateRental } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const Fawn = require("fawn");
const mongoose = require("mongoose");
const express = require("express");
const router = express();

Fawn.init(mongoose);

router.get("/", async (req, res) => {
    const rentals = await Rental.find().sort({ dateOut: -1 });
    res.send(rentals);
});

router.post("/", async (req, res) => {
    const { error } = validateRental(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) {
        return res.status(400).send("Invalid Customer");
    }

    const movie = await Movie.findById(req.body.movieId);
    if(!movie) {
        return res.status(400).send("Invalid Movie");
    }
    
    if (movie.numberInStocks === 0) {
        return res.status(400).send("Movie out of Stock");
    }

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate,
        },
    });

    // rental = await rental.save();

    // movie.numberInStocks--;
    // movie.save();

    try {
        new Fawn.Task()
            .save("rentals", rental)
            .update(
                "movies",
                { _id: movie._id },
                {
                    $inc: { numberInStocks: -1 },
                }
            )
            .run();
    } catch (err) {
        res.status(500).send("Something failed.");
    }

    res.send(rental);
});

router.get("/:id", async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id);
        res.send(rental);
    } catch (err) {
        return res
            .status(404)
            .send("The Rental with the given ID was not found");
    }
});

module.exports = router;
