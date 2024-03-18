import { useContext } from "react";
import { FunctionContext } from "../context/FunctionContext";

export const useFunctions = () => {
  const context = useContext(FunctionContext);
  if (!context) {
    throw new Error("useFunctions must be used within a FunctionProvider");
  }
  return context;
};
