import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import spinning from "../assets/spinning.gif";

import Button from "../components/buttons/Button";
import Navbar from "../components/Navbar";

const Home = () => {
  const { playerAccount } = useAuth();
  const navigate = useNavigate();
  const isPlayerInRoom = !!playerAccount?.roomID;

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen w-full">
        <div className="flex items-center justify-center mb-12">
          <img src={spinning} className="h-12 md:h-16 lg:h-20" alt="Spinning" style={{ imageRendering: "pixelated" }} />
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold mx-4 select-none">Floating Bridge</h1>
          <img src={spinning} className="h-12 md:h-16 lg:h-20" alt="Spinning" style={{ imageRendering: "pixelated" }} />
        </div>

        <div className="flex flex-col items-center min-w-1/5">
          <Button
            theme="orange"
            className="mb-3 w-full"
            size={3}
            onClick={() => {
              if (isPlayerInRoom) {
                navigate(`rooms/${playerAccount.roomID}`);
                return;
              }
              navigate("/lobby");
            }}
          >
            {`${isPlayerInRoom ? "Return to game room" : "Enter lobby"}`}
          </Button>
          <Button
            theme="yellow"
            className="w-full"
            onClick={() => {
              navigate("/credits");
            }}
          >
            Credits
          </Button>
        </div>
      </div>
    </>
  );
};

export default Home;
