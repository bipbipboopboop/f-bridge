import {Route, Routes} from "react-router-dom";
import "./App.css";
import useFunctions from "./hooks/useFunctions";
import Loading from "./components/loading";
import Navbar from "./components/navbar";
import Lobby from "./pages/lobby";

import GameRoomComponent from "./pages/gameroom";
import GameParty from "./pages/party";
import Home from "./pages/home";

function App() {
  const {isLoading} = useFunctions();

  if (isLoading) return <Loading />;

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/party" element={<GameParty />} />
        <Route path="/gameroom" element={<GameRoomComponent />} />
      </Routes>
    </div>
  );
}

export default App;
