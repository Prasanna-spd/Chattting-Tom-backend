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
    origin: "http://localhost:3000", // Set the allowed origin
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

app.listen(5000, () => {
  console.log("Server started at Port 5000");
});
