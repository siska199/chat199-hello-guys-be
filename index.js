require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const router = require("./src/routes");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.BASE_URL_FE,
  },
});

require("./src/socket")(io);

const PORT = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/api199/v1", router);

server.listen(PORT, () => {
  console.log(`Listening to port: ${PORT}`);
});
