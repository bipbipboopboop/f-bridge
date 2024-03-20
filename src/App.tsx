import "./App.css";
import { Route, Routes } from "react-router-dom";

import Lobby from "./pages/lobby";
import Home from "./pages/home";

import NotFound from "./pages/not-found";
import { useAuth } from "./hooks/useAuth";
import Room from "./pages/room";

function App() {
  const { loading, playerAccount, user } = useAuth();

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/lobby" element={<Lobby />} />
        <Route path="/rooms/:roomID" element={<Room />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
