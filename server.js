const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    autoIndex: true,
    useFindAndModify: true,
  })
  .then(() => console.log("DB Connected Successfully"))
  .catch((err) => console.log(err));

const auth = require("./Routes/auth");
const search = require("./Routes/search");

app.use("/api/auth", auth);
app.use("/api/search", search);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
