import { Route, Routes } from "react-router-dom";

import Lobby from "./pages/Lobby";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Room from "./pages/Room";

import { RoomProvider } from "./context/RoomContext";
import Credits from "./pages/Credits";

function App() {
  return (
    <div className="h-screen w-screen flex flex-col text-xs lg:text-base select-none">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="credits" element={<Credits />} />
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
