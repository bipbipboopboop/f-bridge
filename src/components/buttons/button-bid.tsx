import {ComponentProps} from "react";
import Button from "./button";

type BidButtonProps = ComponentProps<"button">;

const BidButton = (props: BidButtonProps) => {
  const {style, ...others} = props;
  return (
    <Button theme="yellow" style={{height: "3rem", width: "3rem", ...style}} {...others}>
      {props.children}
    </Button>
  );
};

export default BidButton;
