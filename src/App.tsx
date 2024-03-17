import "./App.css";
import { Route, Routes } from "react-router-dom";

import useFunctions from "./hooks/useFunctions";

import Loading from "./components/Loading";
import Navbar from "./components/navbar";

import Lobby from "./pages/lobby";
import GameBoard from "./pages/game-board";
import GameParty from "./pages/game-party";
import Home from "./pages/home";
import Leaderboard from "./pages/leaderboard";
import Test from "./pages/Test";
import Tutorial from "./pages/tutorial";
import GameResult from "./pages/game-result";
import NotFound from "./pages/not-founds";
import { useAuth } from "./context/AuthContext";

function App() {
  const { loading, playerProfile, user } = useAuth();
  if (loading) return <Loading />;

  console.log({ playerProfile, user });
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/party/:roomID" element={<GameParty />} />
        <Route path="/gameboard/:roomID" element={<GameBoard />} />
        <Route path="/result/:roomID" element={<GameResult />} />
        <Route path="/test" element={<Test />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
