const mongoose = require("mongoose");

// connection logic
mongoose.connect(process.env.CONN_STRING);

// connection start
const db = mongoose.connection;

db.on("connected", () => {
  console.log("DB Connection Successful!");
});

db.on("err", () => {
  console.log("DB Connection failed!");
});

module.exports = db;
