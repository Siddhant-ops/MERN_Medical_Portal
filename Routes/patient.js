const router = require("express").Router();
const patientSchema = require("../Schema/patient.model");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

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

function processData(
  nameInput = "",
  symptoms = [],
  prescribedMedication = [],
  diagnosis = []
) {
  // checks if an Array has values
  function hasValues(arrayName = []) {
    if (arrayName !== null && arrayName.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  var data = {};

  if (nameInput !== "") {
    data["fullName"] = { $all: [nameInput] };
  }

  if (hasValues(symptoms)) {
    data["symptoms"] = { $in: symptoms };
  }
  if (hasValues(prescribedMedication)) {
    data["prescribedMedication"] = { $in: prescribedMedication };
  }
  if (hasValues(diagnosis)) {
    data["diagnosis"] = { $in: diagnosis };
  }

  return data;
}

router.post("/searchAll", [verifyToken], (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  } else {
    var dataObj = req.body;

    var queryData = processData(
      dataObj.name,
      dataObj.symptoms,
      dataObj.prescribedMedication,
      dataObj.diagnosis
    );

    patientSchema.find(
      queryData,
      ["fullName", "_id", "email", "phone"],
      (docErr, doc) => {
        if (docErr) throw docErr;
        res.json(doc);
      }
    );
  }
});

router.post("/get/patient", verifyToken, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  } else {
    if (!req.body._id) {
      return Promise.reject("No id present in body");
    }

    const id = req.body._id;

    const patientFeilds = [
      "fullName",
      "createdAt",
      "phone",
      "email",
      "symptoms",
      "diagnosis",
      "prescribedMedication",
    ];

    patientSchema.findById(id, patientFeilds, (docErr, doc) => {
      if (docErr) throw docErr;

      res.json(doc);
    });
  }
});

router.post("/get/allPatientData", verifyToken, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  } else {
    if (!req.body._id) {
      return Promise.reject("No id present in body");
    }

    const id = req.body._id;

    const patientFeilds = [
      "fullName",
      "phone",
      "email",
      "symptoms",
      "diagnosis",
      "prescribedMedication",
      "address",
      "city",
      "state",
      "country",
      "pinCode",
    ];

    patientSchema.findById(id, patientFeilds, (docErr, doc) => {
      if (docErr) throw docErr;
      res.json(doc);
    });
  }
});

router.patch("/edit", verifyToken, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  } else {
    if (!req.body._id) {
      return Promise.reject("No id is present in body");
    }

    const id = req.body._id;
    const data = req.body;

    delete data["_id"];

    patientSchema.findByIdAndUpdate(id, data, (docErr, doc) => {
      if (docErr) throw docErr;

      res.json({ message: "Patient profile updated successfully" });
    });
  }
});

router.patch("/change-password", verifyToken, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  } else {
    const id = req.body?._id;

    patientSchema.findOne(
      {
        _id: id,
      },
      (docErr, doc) => {
        if (docErr) throw docErr;

        if (doc === null) {
          return res.json({
            message: "User not found",
          });
        }

        bcrypt.compare(
          req.body.oldPassword,
          doc.password,
          (bcryptErr, isMatch) => {
            if (bcryptErr) throw bcryptErr;

            if (isMatch) {
              bcrypt.genSalt(10, async (saltErr, salt) => {
                if (saltErr) throw saltErr;

                bcrypt.hash(
                  req.body?.newPassword,
                  salt,
                  async (hashErr, hash) => {
                    if (hashErr) throw hashErr;

                    var newPassword = hash;

                    patientSchema.updateOne(
                      {
                        password: newPassword,
                      },
                      (updateErr, doc) => {
                        if (updateErr) throw updateErr;

                        if (doc !== null) {
                          return res.json({
                            message: "Password changed Successfully",
                          });
                        }
                      }
                    );
                  }
                );
              });
            } else {
              res.json({
                message: "Invalid Credentials",
              });
            }
          }
        );
      }
    );
  }
});

router.post("/delete", verifyToken, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  } else {
    if (!req.body?._id) {
      return Promise.reject("No id present in the body");
    }

    const id = req.body?._id;

    patientSchema.findByIdAndDelete(id, (docErr, doc) => {
      if (docErr) throw docErr;

      res.json({ message: "Patient deleted successfully" });
    });
  }
});

module.exports = router;
