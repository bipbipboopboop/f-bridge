import React from "react";
import { PacmanLoader } from "react-spinners";
import { LoaderSizeMarginProps } from "react-spinners/helpers/props";

interface LoadingProps {
  text?: string;
  loaderProps?: LoaderSizeMarginProps;
}

const Loading: React.FC<LoadingProps> = ({ text, loaderProps }) => {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <PacmanLoader color="#98FB98" {...loaderProps} />
      <p className="my-4">{text}</p>
    </div>
  );
};

export default Loading;
