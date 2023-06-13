import React from "react";
import "./button.css";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
}

const OrangeButton: React.FC<ButtonProps> = (props) => {
  return <button className="btn-primary" {...props} />;
};

export default OrangeButton;
