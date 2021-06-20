const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const doctorSchema = require("../Schema/doctor.model");
const patientSchema = require("../Schema/patient.model");

const SECRET = process.env.SECRET;

router.post(
  "/register/doctor",
  [
    body("email", "Invalid Email")
      .isEmail()
      .normalizeEmail()
      .custom((value) => {
        return doctorSchema
          .find({
            email: value,
          })
          .then((user) => {
            if (user && user.lenght === 1) {
              return Promise.reject("E-mail already in use");
            }
          });
      }),
    body("password")
      .isLength({
        min: 8,
      })
      .withMessage("Password must be atleast of 8 characters")
      .matches(/[a-zA-Z]/)
      .withMessage("must contain alphabets")
      .matches(/[A-Z]/)
      .withMessage("must contain one Uppercase Alphabet")
      .matches(/[a-z]/)
      .withMessage("must contain one Lowercase Alphabet"),
    // .matches(/\d/)
    // .withMessage("must contain a number")
    // .matches(/[!@#$%^&*()\\]/)
    // .withMessage("must contain a special character"),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    } else {
      let newDoctor = new doctorSchema(req.body);

      bcrypt.genSalt(10, async (saltErr, salt) => {
        if (saltErr) throw saltErr;

        bcrypt.hash(newDoctor.password, salt, async (hashErr, hash) => {
          if (hashErr) throw hashErr;

          newDoctor.password = hash;

          newDoctor.save((docErr, doc) => {
            if (docErr) throw docErr;

            const PAYLOAD = {
              email: doc.email,
              role: "doctor",
            };

            jwt.sign(
              PAYLOAD,
              SECRET,
              {
                expiresIn: "7d",
              },
              (jwtErr, token) => {
                if (jwtErr) throw jwtErr;
                else
                  res.json({
                    token,
                  });
              }
            );
          });
        });
      });
    }
  }
);

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

router.post(
  "/register/patient",
  [
    verifyToken,
    body("email", "Invalid Email")
      .isEmail()
      .normalizeEmail()
      .custom((value) => {
        return patientSchema
          .find({
            email: value,
          })
          .then((user) => {
            if (user && user.lenght === 1) {
              return Promise.reject("E-mail already in use");
            }
          });
      }),
    body("fullName")
      .isString()
      .custom((value) => {
        return patientSchema
          .find({
            fullName: value,
          })
          .then((user) => {
            if (user && user.lenght === 1) {
              return Promise.reject(
                `Already a user present with the name : ${value}`
              );
            }
          });
      }),
    body("phone")
      .isNumeric()
      .custom((value) => {
        return patientSchema
          .find({
            phone: value,
          })
          .then((user) => {
            if (user && user.lenght === 1) {
              return Promise.reject("phone number already in use");
            }
          });
      }),
    body("diagnosis").isArray(),
    body("prescribedMedication").isArray(),
    body("symptoms").isArray(),
    body("address").isString(),
    body("city").isString(),
    body("state").isString(),
    body("country").isString(),
    body("pinCode").isNumeric(),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    } else {
      let newPatient = new patientSchema(req.body);

      bcrypt.genSalt(10, async (saltErr, salt) => {
        if (saltErr) throw saltErr;

        bcrypt.hash(newPatient.password, salt, async (hashErr, hash) => {
          if (hashErr) throw hashErr;

          newPatient.password = hash;

          newPatient.save((docErr, doc) => {
            if (docErr) throw docErr;

            res.json({
              message: "New patient is added succesfully",
            });
          });
        });
      });
    }
  }
);

router.post(
  "/login/doctor",
  [
    body("email", "Invalid Email").isEmail().normalizeEmail(),
    body("password")
      .isLength({
        min: 8,
      })
      .withMessage("Password must be atleast of 8 characters")
      .matches(/[a-zA-Z]/)
      .withMessage("must contain alphabets")
      .matches(/[A-Z]/)
      .withMessage("must contain one Uppercase Alphabet")
      .matches(/[a-z]/)
      .withMessage("must contain one Lowercase Alphabet"),
    // .matches(/\d/)
    // .withMessage("must contain a number")
    // .matches(/[!@#$%^&*()\\]/)
    // .withMessage("must contain a special character"),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    } else {
      const email = req.body.email;
      doctorSchema.findOne(
        {
          email: email,
        },
        (doctorSchemaErr, doc) => {
          if (doctorSchemaErr) throw doctorSchemaErr;

          if (doc === null) {
            return res.json({
              message: "User not found",
            });
          }

          bcrypt.compare(
            req.body.password,
            doc.password,
            (bcryptErr, isMatch) => {
              if (bcryptErr) throw bcryptErr;

              if (isMatch) {
                const PAYLOAD = {
                  email: doc.email,
                  role: "doctor",
                };

                jwt.sign(
                  PAYLOAD,
                  SECRET,
                  {
                    expiresIn: "7d",
                  },
                  (jwtErr, token) => {
                    if (jwtErr) throw jwtErr;
                    else
                      res.json({
                        token,
                      });
                  }
                );
              } else {
                res.json({
                  message: "Incorrect Credentials",
                });
              }
            }
          );
        }
      );
    }
  }
);

router.post(
  "/login/patient",
  [
    body("email", "Invalid Email").isEmail().normalizeEmail(),
    body("password")
      .isLength({
        min: 8,
      })
      .withMessage("Password must be atleast of 8 characters")
      .matches(/[a-zA-Z]/)
      .withMessage("must contain alphabets")
      .matches(/[A-Z]/)
      .withMessage("must contain one Uppercase Alphabet")
      .matches(/[a-z]/)
      .withMessage("must contain one Lowercase Alphabet"),
    // .matches(/\d/)
    // .withMessage("must contain a number")
    // .matches(/[!@#$%^&*()\\]/)
    // .withMessage("must contain a special character"),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    } else {
      const email = req.body.email;
      patientSchema.findOne(
        {
          email: email,
        },
        (patientSchemaErr, doc) => {
          if (patientSchemaErr) throw patientSchemaErr;

          if (doc === null) {
            return res.json({
              message: "User not found",
            });
          }

          bcrypt.compare(
            req.body.password,
            doc.password,
            (bcryptErr, isMatch) => {
              if (bcryptErr) throw bcryptErr;

              if (isMatch) {
                const PAYLOAD = {
                  email: doc.email,
                  _id: doc._id,
                  role: "patient",
                };

                jwt.sign(
                  PAYLOAD,
                  SECRET,
                  {
                    expiresIn: "7d",
                  },
                  (jwtErr, token) => {
                    if (jwtErr) throw jwtErr;
                    else
                      res.json({
                        token,
                      });
                  }
                );
              } else {
                res.json({
                  message: "Incorrect Credentials",
                });
              }
            }
          );
        }
      );
    }
  }
);

module.exports = router;
