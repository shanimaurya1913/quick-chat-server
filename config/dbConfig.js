const mongoose = require("mongoose");

const connectionString = process.env.CONN_STRING?.trim();

if (!connectionString) {
  throw new Error(
    "CONN_STRING is missing. Add your MongoDB connection string.",
  );
}

mongoose
  .connect(connectionString, {
    serverSelectionTimeoutMS: 30000,
  })
  .catch(() => {
    // The connection error is logged by the db "error" event below.
  });

const db = mongoose.connection;

db.on("connected", () => {
  console.log("DB Connection Successful!");
});

db.on("disconnected", () => {
  console.log("DB Connection disconnected.");
});

db.on("error", (error) => {
  console.log("DB Connection failed!", error);
});

module.exports = db;
