import { Route, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./Pages/Homepage/Homepage";
import { io } from "socket.io-client";
import Chat from "./Pages/Chat/Chat";
import { DOMAIN } from "./Redux/Constants";

const socket = io.connect(DOMAIN);

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage socket={socket} />} />
        <Route path="/chatbox" element={<Chat socket={socket} />} />
      </Routes>
    </div>

  );
}

