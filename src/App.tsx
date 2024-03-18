import "./App.css";
import { Route, Routes } from "react-router-dom";

import useFunctions from "./hooks/useFunctions";

import Loading from "./components/Loading";
import Navbar from "./components/navbar";

import Lobby from "./pages/lobby";

import Home from "./pages/home";

import NotFound from "./pages/not-founds";
import { useAuth } from "./context/AuthContext";

function App() {
  const { loading, playerProfile, user } = useAuth();
  if (loading) return <Loading />;

  console.log({ playerProfile, user, loading });
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/lobby" element={<Lobby />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
