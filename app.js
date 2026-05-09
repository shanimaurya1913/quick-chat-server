const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRouter = require("./controllers/authController");
const userRouter = require("./controllers/userController");
const chatRouter = require("./controllers/chatController");
const messageRouter = require("./controllers/messageController");

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));

const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  console.log("Express server");
  res.send("Express server");
});

app.get("/health", (req, res) => {
  res.send({
    success: true,
    server: "running",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use("/api", (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  return res.status(503).send({
    success: false,
    message:
      "Database is not connected. Check MongoDB Atlas network access and CONN_STRING.",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

const onlineUser = [];

io.on("connection", (socket) => {
  // console.log("connected with socket Id: " + socket.id);
  socket.on("join-room", (userId) => {
    socket.join(userId);
    // console.log("user join in room", userId);
  });

  socket.on("send-message", (message) => {
    io.to(message.members[0])
      .to(message.members[1])
      .emit("receive-message", message);

    io.to(message.members[0])
      .to(message.members[1])
      .emit("set-message-count", message);
  });

  socket.on("clear-unread-messages", (data) => {
    io.to(data.members[0])
      .to(data.members[1])
      .emit("message-count-cleared", data);
  });

  socket.on("user-typing", (data) => {
    io.to(data.members[0]).to(data.members[1]).emit("started-typing", data);
  });

  socket.on("user-login", (userId) => {
    if (!onlineUser.includes(userId)) {
      onlineUser.push(userId);
    }
    socket.emit("online-users", onlineUser);
  });

  socket.on("user-offline", (userId) => {
    const userIndex = onlineUser.indexOf(userId);
    if (userIndex !== -1) {
      onlineUser.splice(userIndex, 1);
    }
    io.emit("online-users-updated", onlineUser);
  });
});

module.exports = server;
