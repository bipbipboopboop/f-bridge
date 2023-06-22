import "./App.css";
import {Route, Routes} from "react-router-dom";

import useFunctions from "./hooks/useFunctions";

// import Loading from "./components/loading";
import Navbar from "./components/navbar";

import Lobby from "./pages/lobby";
import GameBoard from "./pages/game-board";
import GameRoom from "./pages/game-room";
import Home from "./pages/home";
import Leaderboard from "./pages/leaderboard";
import Test from "./pages/Test";
import {PacmanLoader} from "react-spinners";

function App() {
  const {isLoading} = useFunctions();

  if (isLoading) return <Loading />;

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/gameroom/:roomID" element={<GameRoom />} />
        <Route path="/gameboard/:roomID" element={<GameBoard />} />
        <Route path="/test" element={<Test />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </div>
  );
}

const Loading = () => {
  return (
    <div className="h-100 d-flex justify-content-center align-items-center">
      <div>
        <h2>Loading</h2>
        <PacmanLoader color={"#98FB98"} />
      </div>
    </div>
  );
};
export default App;
