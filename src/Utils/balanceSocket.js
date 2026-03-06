import { io } from "socket.io-client";

const BALANCE_SOCKET_URL = import.meta.env.VITE_APP_BALANCE_SOCKET;

const balanceSocket = io(BALANCE_SOCKET_URL, {
  transports: ["websocket"],
  reconnection: true,
});

balanceSocket.on("connect", () => {
  console.log("✅ Balance Socket connected:", balanceSocket.id);

  const player_id = JSON.parse(localStorage.getItem("playerId"));
  const opr_id = JSON.parse(localStorage.getItem("oprId"));

  if (player_id && opr_id) {
    const payload = JSON.stringify({ player_id, opr_id });
    balanceSocket.emit("connect_socket", payload);
    console.log("➡️ Emitted connect_socket with:", payload);
  }
});


balanceSocket.on("send_socket_data", (data) => {
  console.log("⬅️ Received send_socket_data:", data);
});


balanceSocket.on("disconnect", () => {
  console.log("❌ Balance Socket disconnected");
});

export default balanceSocket;
