import "./App.css";
import { Route, Routes } from "react-router-dom";

import Lobby from "./pages/lobby";
import Home from "./pages/home";
import NotFound from "./pages/not-found";
import Room from "./pages/room";

import { RoomProvider } from "./context/RoomContext";

function App() {
  return (
    <div className="App">
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
