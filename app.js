const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
require("dotenv").config();
const errorHandler = require("./middleware/error-handler.js");
const errorMessage = require("./middleware/error-message.js");
const accessControls = require("./middleware/access-controls.js");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(
  cors({
    origin: ["http://localhost:4200"],
    methods: ["GET", "PUT", "POST", "DELETE"],
  })
);



const OauthRoutes = require("./routes/Oauth.routes.js");

// connection to mongoose
const mongoCon = process.env.mongoCon;
mongoose.connect(mongoCon);

app.use(express.static("public"));
app.get("/", function (req, res) {
  res.status(200).send({
    message: "Express backend server",
  });
});

// process
//   .on("unhandledRejection", (reason, p) => {
//     console.log("Inside Unhandled Rejection");
//     console.error(reason, "Unhandled Rejection at Promise", p);
//     process.exit(1);
//   })
//   .on("uncaughtException", (err) => {
//     console.log("Inside Uncaught Exception");
//     console.error(err, "Uncaught Exception thrown");
//     process.exit(1);
//   });
app.use(bodyParser.json());
app.set("port", process.env.PORT);

// Routes which should handle requests
app.use("/Oauth", OauthRoutes);

app.use(cors());
app.use(errorHandler);
app.use(errorMessage);

server.listen(app.get("port"));
console.log("listening on port", app.get("port"));
