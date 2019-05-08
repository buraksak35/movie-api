const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();

const indexRouter = require("./routes/index");
const moviesRouter = require("./routes/movies");
const directorsRouter = require("./routes/directors");
const usersRouter = require("./routes/users");

const app = express();

// DB connection
const db = require("./helpers/db")();

// CONFIG
const config = require("./config");
app.set("API_JWT_KEY", config.API_JWT_KEY);

// MIDDLEWARES
const verifyToken = require("./middlewares/verify-token");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// MIDDLEWARES USAGE
app.use("/api/movies", verifyToken, moviesRouter);
app.use("/api/directors", verifyToken, directorsRouter);

// ROUTES
app.use("/", indexRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/directors", directorsRouter);
app.use("/api/users", usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: { message: err.message, code: err.code } });
});

module.exports = app;
