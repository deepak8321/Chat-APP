const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messagesRoute = require("./routes/messagesRoute");
const socket = require("socket.io");
const app = express();
require("dotenv").config();
// middleware
app.use(cors());
app.use(express.json());
// Call Router:-
app.use("/api/auth", userRoutes);
app.use("/api/messages", messagesRoute);
// app.use("/api/auth",userRoutes)
// Mongoose Connection:-
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("DB conection Sucessfully");
}).catch((err) => {
    console.log(err.message);
});
// Server Connection:-
const server = app.listen(process.env.PORT, () => {
    console.log(`Server Started on Post ${process.env.PORT}`);
});
const io = socket(server, {
    cors: {
        origin: process.env.ORIGIN,
        Credential: true,
    },
});
global.onlineUsers = new Map();
io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });
    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.message);
        }
    });
});
