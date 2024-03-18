import { useNavigate } from "react-router-dom";
import spinning from "../assets/spinning.gif";
import Button from "../components/buttons/button";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const { playerProfile } = useAuth();
  const navigate = useNavigate();

  const isPlayerInRoom = !!playerProfile?.roomID;

  return (
    <div className="w-100 h-100 d-flex flex-column align-items-center">
      <div className="w-100 d-flex justify-content-center">
        <img src={spinning} style={{ height: "4rem" }} />
        <p style={{ fontSize: "4rem" }}>Floating Bridge</p>
        <img src={spinning} style={{ height: "4rem" }} />
      </div>
      <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
        <Button
          theme="orange"
          style={{ marginBottom: "1rem" }}
          onClick={() => {
            if (isPlayerInRoom) {
              navigate(`party/${playerProfile.roomID}`);
              return;
            }
            navigate("/lobby");
          }}
        >
          {`${isPlayerInRoom ? "Return to game room" : "Create game room"}`}
        </Button>

        <Button
          theme="yellow"
          style={{ marginBottom: "1rem", width: "300px", height: "90px" }}
          onClick={() => navigate("/tutorial")}
        >
          Tutorial
        </Button>
      </div>
    </div>
  );
};

export default Home;
