require("dotenv").config();
const cors = require("cors");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const messageRouter = require("./routes/message");
const express = require("express");
const connect = require("./database/db");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());

app.use(
  cors({
    // origin: "http://localhost:3000", // Set the allowed origin
    origin: "https://chatting-tom-frontend.vercel.app/", // Set the allowed origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Set the allowed HTTP methods
    allowedHeaders: ["Content-Type"], // Set the allowed headers
    credentials: true, // Allow cookies and authorization headers
  })
);

connect();

app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);
app.get("/", (req, res) => {
  res.send("Hey WElcome to Chatting Tom");
});

app.use(notFound);
app.use(errorHandler);

const server = app.listen(5000, () => {
  console.log("Server started at Port 5000");
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    // origin: "http://localhost:3000",
    origin: "https://chatting-tom-frontend.vercel.app/",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message received", newMessageRecieved);
    });
  });
  // socket.off("setup", () => {
  //   console.log("USER DISCONNECTED");

  // });

  socket.off("disconnect", (userData) => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
    // Handle any necessary cleanup or disconnection logic here
  });
});
