const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
require("dotenv").config();
const errorHandler = require("./middleware/error-handler");
const errorMessage = require("./middleware/error-message");
const accessControls = require("./middleware/access-controls");
const mongoose = require("mongoose");
const cors = require("cors");

//  this is for the routes paths
const UsersRoutes = require("./routes/users.routes.js");

// connection to mongoose
// const mongoCon = process.env.mongoCon;
// mongoose.connect(mongoCon, {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true,
// });


app.use(express.static("public"));


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

app.set("port", process.env.PORT);

// Routes which should handle requests
app.use("/api/users", UsersRoutes);

app.use(cors());
app.use(errorHandler);
app.use(errorMessage);

app.get("/", function (req, res) {
  res.status(200).send({
    message: "Express backend server",
  });
});


server.listen(app.get("port"));
console.log("listening on port", app.get("port"));