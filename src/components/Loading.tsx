import {PacmanLoader} from "react-spinners";

const Loading = (props: {text?: string}) => {
  const {text} = props;
  return (
    <div className="h-100 d-flex justify-content-center align-items-center">
      <div>
        {text ?? <h2>Loading</h2>}
        <PacmanLoader color={"#98FB98"} />
      </div>
    </div>
  );
};

export default Loading;
