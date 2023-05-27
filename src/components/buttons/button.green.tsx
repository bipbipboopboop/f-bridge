import React from "react";
import "./button.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
}

const GreenButton: React.FC<ButtonProps> = (props) => {
  return <button className="btn-secondary" {...props} />;
};

export default GreenButton;
