const { Customer, validateCustomer } = require("../models/customer");
const mongoose = require("mongoose");
const express = require("express");
const router = express();

router.get("/", async (req, res) => {
    const customers = await Customer.find().sort({ name: 1 });

    res.send(customers);
});

router.post("/", async (req, res) => {
    const { error } = validateCustomer(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold,
    });

    customer = await customer.save();
    res.send(customer);
});

router.put("/:id", async (req, res) => {
    const { error } = validateCustomer(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                phone: req.body.phone,
                isGold: req.body.isGold,
            },
            { new: true }
        );

        if (!customer) {
            return res
                .status(404)
                .send("The customer with the given ID was not found.");
        }
    } catch (err) {
        return res
            .status(404)
            .send("The customer with the given ID was not found.");
    }

    res.send(customer);
});

router.delete("/:id", async (req, res) => {
    try {
        const customer = await Customer.findByIdAndRemove(req.params.id);
        if (!customer) {
            return res
                .status(404)
                .send("The customer with the given ID was not found.");
        }
        res.send(customer);
    } catch (err) {
        return res
            .status(404)
            .send("The customer with the given ID was not found.");
    }
});

router.get("/:id", async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res
                .status(404)
                .send("The customer with the given ID was not found.");
        }
        res.send(customer);
    } catch (err) {
        return res
            .status(404)
            .send("The customer with the given ID was not found.");
    }
});

module.exports = router;
