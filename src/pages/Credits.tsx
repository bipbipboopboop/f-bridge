import { useNavigate } from "react-router-dom";
import Button from "../components/buttons/Button";
import { avatarLookup } from "assets/avatar";

const Credits = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="h-3/5 w-1/2 bg-black/20 flex flex-col items-center p-4 select-none">
        <p className="text-3xl mb-5 text-yellow-200">Credits</p>
        <p className="text-xl text-orange-300">UI design</p>
        <p>Ethan</p>

        <p className="text-xl text-orange-300 mt-4">Game design</p>
        <p>Ethan</p>

        <p className="text-xl mt-4 text-orange-300">Assets</p>
        <div className="flex">
          @LazyHamsters <img src={avatarLookup["finn"]} />
        </div>
        <div className="flex">
          @ScissorMarks
          <img src={avatarLookup["blueDino"]} />
          <img src={avatarLookup["redDino"]} />
          <img src={avatarLookup["greenDino"]} />
          <img src={avatarLookup["yellowDino"]} />
        </div>
      </div>
      <Button
        className="mt-5"
        theme="orange"
        onClick={() => {
          navigate("/");
        }}
      >
        Return
      </Button>
    </div>
  );
};

export default Credits;
