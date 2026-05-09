const mongoose = require("mongoose");

// connection logic
mongoose.connect(process.env.CONN_STRING);

// connection start
const db = mongoose.connection;

db.on("connected", () => {
  console.log("DB Connection Successful!");
});

db.on("error", (error) => {
  console.log("DB Connection failed!", error.message);
});

module.exports = db;
