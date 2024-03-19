import "./App.css";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/navbar";

import Lobby from "./pages/lobby";
import Home from "./pages/home";

import NotFound from "./pages/not-found";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { loading, playerAccount, user } = useAuth();
  console.log({ playerAccount, user, loading });

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/lobby" element={<Lobby />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
