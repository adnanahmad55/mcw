
import { io } from "socket.io-client";


const SOCKET_URL = import.meta.env.VITE_WEB_SOCKET;


const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  reconnection: true,
});


socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Socket disconnected");
});

export default socket;
