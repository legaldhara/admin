import { io } from "socket.io-client";
import { auth } from "./FirebaseConfiguration";

const socket = io(import.meta.env.VITE_BACKEND_API_URL || "/", {
  transports: ["websocket"], withCredentials: true, autoConnect: false,
  auth: (callback) => { void auth.currentUser?.getIdToken().then((token) => callback({ token })); },
});
export default socket;
