const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      default: "Healthcare",
    },
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    diagnosis: [
      {
        type: String,
        required: true,
      },
    ],
    prescribedMedication: [
      {
        type: String,
        required: true,
      },
    ],
    symptoms: [
      {
        type: String,
        required: true,
      },
    ],
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    pinCode: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PatientSchema", patientSchema, "patients");
