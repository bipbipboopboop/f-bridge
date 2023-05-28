import {Route, Routes} from "react-router-dom";
import "./App.css";
import useFunctions from "./hooks/useFunctions";
import Loading from "./components/loading";
import Navbar from "./components/navbar";
import Lobby from "./pages/lobby";
import Room from "./pages/game.room";
import GamePanel from "./pages/game.panel";

function App() {
  const {isLoading} = useFunctions();

  if (isLoading) return <Loading />;

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/game_room" element={<Room />} />
        <Route path="/game_table" element={<GamePanel />} />
      </Routes>
    </div>
  );
}

export default App;
