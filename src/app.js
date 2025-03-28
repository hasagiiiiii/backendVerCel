const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { v4 } = require("uuid");

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://trendyttesst.netlify.app", // Cho phép kết nối từ Netlify
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors());

app.get("/login", (req, res) => {
  const idUser = v4();
  res.json(idUser);
});

io.on("connection", (socket) => {
  const Room = 20;
  socket.on("createRoom", (idUser) => {
    socket.emit("createRoomResponse", Room);
    socket.join(Room);
  });

  socket.on("joinRoom", (idUser, roomId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", idUser);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Chạy server trên cổng 5000
server.listen(5000, () => {
  console.log(`Server is running on port 5000`);
});
