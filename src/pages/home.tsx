import spinning from "assets/spinning.gif";
const Home = () => {
  return (
    <div className="w-100 h-100 d-flex">
      <div className="w-50">
        {/* <img src={spinning} className="h-100 w-100" /> */}
      </div>
      <div className="w-50 h-100 d-flex flex-column align-items-center justify-content-center">
        <h1 style={{fontSize: "5rem"}}>FOR DA BOIS</h1>
      </div>
    </div>
  );
};

export default Home;
