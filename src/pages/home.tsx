import { useNavigate } from "react-router-dom";
import spinning from "../assets/spinning.gif";
import Button from "../components/buttons/button";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/navbar";

const Home = () => {
  const { playerAccount } = useAuth();
  const navigate = useNavigate();
  const isPlayerInRoom = !!playerAccount?.roomID;

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex items-center justify-center mb-12">
          <img src={spinning} className="h-12 md:h-16 lg:h-20" alt="Spinning" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mx-4">Floating Bridge</h1>
          <img src={spinning} className="h-12 md:h-16 lg:h-20" alt="Spinning" />
        </div>

        <div className="flex flex-col items-center">
          <Button
            theme="orange"
            style={{ marginBottom: "1rem" }}
            size={4}
            onClick={() => {
              if (isPlayerInRoom) {
                navigate(`party/${playerAccount.roomID}`);
                return;
              }
              navigate("/lobby");
            }}
          >
            {`${isPlayerInRoom ? "Return to game room" : "Create game room"}`}
          </Button>

          <Button theme="yellow" size={4} onClick={() => navigate("/tutorial")}>
            Tutorial
          </Button>
        </div>
      </div>
    </>
  );
};

export default Home;
