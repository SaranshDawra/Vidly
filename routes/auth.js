const _ = require('lodash');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { User } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express();

router.post("/", async (req, res) => {
    const { error } = validateAuth(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    let user = await User.findOne({ email: req.body.email });
    if(!user) {
        return res.status(400).send('Invalid Email or Password');
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password)

    if(!validPassword) {
        return res.status(400).send('Invalid Email or Password');
    }

    const token = user.generateAuthToken();

    res.send(token);

});

function validateAuth(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });

    return schema.validate(req);
}

module.exports = router;
 