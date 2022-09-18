const { getContacts } = require("../controller/user");
const { addMessage, getMessages } = require("../controller/message");
const jwt = require("jsonwebtoken");
const EVENTS = {
  SEND_MESSAGE: "SEND_MESSAGE",
  NEW_MESSAGE: "NEW_MESSAGE",
  LOAD_CONTACTS: "LOAD_CONTACTS",
  CONTACTS: "CONTACTS",
  LOAD_MESSAGES: "LOAD_MESSAGES",
  MESSAGES: "MESSAGES",
};

const getIdSender = (token) => {
  const secret = process.env.SECRET_TOKEN;
  const { id } = jwt.verify(token, secret);
  return id;
};

const connectedUser = {};
const socketIo = (io) => {
  io.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      
      next();
    } else {
      next(new Error("Not Authorized"));
    }
  });

  io.on("connection", (socket) => {
    const token = socket.handshake?.auth?.token;
    const idSender = getIdSender(token);
    connectedUser[idSender] = socket.id;

    socket.on(EVENTS.LOAD_CONTACTS, async (idUser) => {
      const contacts = await getContacts(idUser);

      socket.emit(EVENTS.CONTACTS, contacts);
    });

    socket.on(EVENTS.SEND_MESSAGE, async (form) => {
      await addMessage(form);
      socket.emit(EVENTS.NEW_MESSAGE, form.idReceiver);
      io.to(socket.id)
      .to(connectedUser[form.idReceiver]).emit(EVENTS.LOAD_CONTACTS,form.idUser)

    });

    socket.on(EVENTS.LOAD_MESSAGES, async (idReceiver) => {
      const token = socket.handshake?.auth?.token;
      const idSender = getIdSender(token);
      connectedUser[idSender] = socket.id;

      const dataMessages = await getMessages(idReceiver, idSender);
      io.to(socket.id)
        .to(connectedUser[idReceiver])
        .emit(EVENTS.MESSAGES, dataMessages);

      io.to(socket.id)
        .to(connectedUser[idReceiver])
        .emit("RELOAD_CONTACTS")
    });

    socket.on("disconnect", () => {
      const token = socket.handshake?.auth?.token;
      const idSender = getIdSender(token);
      delete connectedUser[idSender];
    });
  });
};

module.exports = socketIo;
