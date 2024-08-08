import { useNavigate } from "react-router-dom";
import Button from "../components/buttons/Button";
import { avatarLookup } from "assets/avatar";

const Credits = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="h-4/5 w-1/2 max-h-[80%] overflow-scroll bg-black/20 flex flex-col items-center p-4 select-none">
        <p className="text-3xl mb-5 text-yellow-200">Credits</p>
        <p className="text-xl text-orange-300">UI and Game design</p>
        <p>Ethan</p>

        <p className="text-xl text-orange-300 mt-4">Code Review</p>
        <div className="flex">
          <a href="https://github.com/DystoriaX" className="text-orange-500">
            Dasco Gabriel
          </a>
          <img src={avatarLookup["kucingDasco"]} />
        </div>

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

        <p className="text-xl mt-4 text-orange-300">P.S</p>
        <p className="text-2xs mt-4">
          This game is dedicated to my friends from high school, university and TESP, now scattered across the world.
        </p>
        <p className="text-2xs mt-4">
          May we one day reunite in person to play again, but until then, let this online version keep us always
          connected.
        </p>
        <p className="text-xs mt-4">
          此游戏献予我高中，大学和TESP之挚友，今各散五湖四海。愿他日得以重聚，携手再戏。未至之时，愿此线上版本常伴左右，系我等情谊不渝。
        </p>

        <p className="text-2xs mt-4">
          Game ini dipersembahkan kepada teman-temanku dari SMA, universitas dan TESP, yang kini tersebar di seluruh
          dunia. Semoga suatu hari nanti kita bisa bertemu lagi untuk bermain bersama, namun sampai saat itu tiba,
          biarlah versi online ini menjaga kita tetap terhubung selalu.
        </p>
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
