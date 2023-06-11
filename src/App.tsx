import "./App.css";
import {Route, Routes} from "react-router-dom";

import useFunctions from "./hooks/useFunctions";

import Loading from "./components/loading";
import Navbar from "./components/navbar";

import Lobby from "./pages/lobby";
import GameRoomComponent from "./pages/gameroom";
import GameParty from "./pages/party";
import Home from "./pages/home";
import Leaderboard from "./pages/leaderboard";
import Test from "./pages/Test";

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
        <Route path="/party/:roomID" element={<GameParty />} />
        <Route path="/gameroom" element={<GameRoomComponent />} />
        <Route path="/test" element={<Test />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </div>
  );
}

export default App;
