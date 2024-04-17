import "./App.css";
import { Route, Routes } from "react-router-dom";

import Lobby from "./pages/Lobby";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Room from "./pages/Room";

import { RoomProvider } from "./context/RoomContext";

function App() {
  return (
    <div className="App text-xs md:text-base">
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/lobby" element={<Lobby />} />
        <Route
          path="/rooms/:roomID"
          element={
            <RoomProvider>
              <Room />
            </RoomProvider>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
