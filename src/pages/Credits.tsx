import Button from "../components/buttons/Button";

const Credits = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="h-1/2 w-1/2 bg-black/20 flex flex-col items-center p-4">
        <p>Credits</p>
        <p>Game designed by Ethan</p>
      </div>
      <Button>Back To Lobby</Button>
    </div>
  );
};

export default Credits;
