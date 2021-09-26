const express = require("express");
const app = express();
const server = require("http").createServer(app);

const cors = require("cors");

const PORT = process.env.PORT || 7000;

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`Server @ ${PORT}`);
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);
  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });
  socket.on("calluser", ({ userToCallID, siganlData, from, name }) => {
    io.to(userToCallID).emit("calluser", { signal: siganlData, from, name });
  });
  socket.on("ansercall", (data) => {
    io.to(data.to).emit("callaccepted", data.signal);
  });
});

server.listen(PORT, () => console.log(`Server @ ${PORT}`));
