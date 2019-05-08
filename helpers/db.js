const mongoose = require("mongoose");

const connection = () => {
  mongoose.connect(process.env.MONGODB_URL);

  mongoose.connection.on("open", () => {
    console.log("mongoDB connected");
  });

  mongoose.connection.on("error", error => {
    console.log("mongoDB error: ", error);
  });
};

module.exports = connection;
