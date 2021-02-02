// TODO: write server code here
const express = require("express");
const cors = require("cors");
const app = express();
const uniqid = require("uniqid");
const port = 8000;
const messages = [
  { id: uniqid(), author: 'server', text: "Welcome in WildChat" }
];

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ["GET", "POST", "PUT", "DELETE"],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
const server = app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});

const io = require("socket.io")(server, {
  cors: corsOptions
});

io.on('connect', (socket) => {
  console.log("user is connected: ", socket.client.id);
  socket.on("disconnect", () => {
    console.log("user is disconnected");
  });
  socket.emit("initialMessageList", messages);
  socket.on("messageFromClient", (messageTextAuthor) => {
    const message = { id: uniqid(), ...messageTextAuthor };
    console.log(message);
    messages.push(message);
    io.emit("messageFromServer", messages);
  });
});