const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const patientSchema = require("../Schema/patient.model");

const SECRET = process.env.SECRET;

function verifyToken(req, res, next) {
  if (req.headers["authorization"]) {
    // Get auth header value
    const bearerHeader = req.headers["authorization"];

    // Check if auth header is undefined
    if (typeof bearerHeader !== undefined) {
      // split at the space
      const bearer = bearerHeader.split(" ");

      // Get token from array
      const bearerToken = bearer[1];

      // Set token onto the req
      req.token = bearerToken;

      // call next
      next();
    } else {
      return res.sendStatus(403);
    }
  } else {
    return res.json({
      message: "there is no jwt token in the header",
    });
  }
}

router.get("/search", [verifyToken], (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  } else {
    patientSchema.find({});
  }
});

module.exports = router;
