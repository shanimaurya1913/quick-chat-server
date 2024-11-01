const express = require("express");
const app = express();
const authRouter = require("./controllers/authController");
const userRouter = require("./controllers/userController");
const chatRouter = require("./controllers/chatController");
const messageRouter = require("./controllers/messageController");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000", // Client URL
    credentials: true, // If you’re using cookies or authentication
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  console.log("Express server");
  res.send("Express server");
});
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

module.exports = app;
