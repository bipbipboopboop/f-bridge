import "./App.css";
import { Route, Routes } from "react-router-dom";

import useFunctions from "./hooks/useFunctions";

import Loading from "./components/Loading";
import Navbar from "./components/navbar";

import Lobby from "./pages/lobby";
import GameBoard from "./pages/game-board";
import GameRoom from "./pages/game-room";
import Home from "./pages/home";
import Leaderboard from "./pages/leaderboard";
import Test from "./pages/Test";
import Tutorial from "./pages/tutorial";
import GameResult from "./pages/game-result";

function App() {
  const { isLoading } = useFunctions();

  if (isLoading) return <Loading />;

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/gameroom/:roomID" element={<GameRoom />} />
        <Route path="/gameboard/:roomID" element={<GameBoard />} />
        <Route path="/result/:roomID" element={<GameResult />} />
        <Route path="/test" element={<Test />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </div>
  );
}

export default App;
