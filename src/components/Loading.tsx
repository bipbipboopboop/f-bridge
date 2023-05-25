import {PacmanLoader} from "react-spinners";

const Loading = () => {
  return (
    <div className="h-100 d-flex justify-content-center align-items-center">
      <div>
        <h2>Loading</h2>
        <PacmanLoader color={"#98FB98"} />
      </div>
    </div>
  );
};

export default Loading;
