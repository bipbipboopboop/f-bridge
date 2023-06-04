import {Route, Routes} from "react-router-dom";
import "./App.css";
import useFunctions from "./hooks/useFunctions";
import Loading from "./components/loading";
import Navbar from "./components/navbar";
import Lobby from "./pages/lobby";
import GameRoomComponent from "./pages/game.room";
import GameComponent from "./pages/game";

function App() {
  const {isLoading} = useFunctions();

  if (isLoading) return <Loading />;

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/game_room" element={<GameRoomComponent />} />
        <Route path="/game" element={<GameComponent />} />
      </Routes>
    </div>
  );
}

export default App;
