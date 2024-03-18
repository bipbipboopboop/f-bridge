import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: "orange" | "green" | "yellow" | "brown";
  size?: 1 | 2 | 3 | 4 | 5;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ theme = "green", size = 3, disabled, children, ...props }) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded shadow-md transition-colors duration-300";

  const sizeStyles = {
    1: "px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm md:px-4 md:py-2 md:text-base lg:px-5 lg:py-3 lg:text-lg",
    2: "px-3 py-2 text-sm sm:px-4 sm:py-3 sm:text-base md:px-6 md:py-4 md:text-lg lg:px-8 lg:py-5 lg:text-xl",
    3: "px-4 py-2 text-base sm:px-6 sm:py-4 sm:text-lg md:px-8 md:py-6 md:text-xl lg:px-10 lg:py-8 lg:text-2xl",
    4: "px-6 py-4 text-lg sm:px-8 sm:py-6 sm:text-xl md:px-10 md:py-8 md:text-2xl lg:px-12 lg:py-10 lg:text-3xl",
    5: "px-8 py-6 text-xl sm:px-10 sm:py-8 sm:text-2xl md:px-12 md:py-10 md:text-3xl lg:px-16 lg:py-12 lg:text-4xl",
  };

  const colorStyles = {
    orange: "bg-orange-500 text-white hover:bg-orange-600 disabled:bg-orange-400 disabled:cursor-not-allowed",
    green: "bg-green-500 text-white hover:bg-green-600 disabled:bg-green-400 disabled:cursor-not-allowed",
    yellow:
      "bg-yellow-400 text-gray-800 border-2 border-gray-800 rounded-lg hover:bg-yellow-300 disabled:bg-yellow-400 disabled:cursor-not-allowed",
    brown:
      "bg-brown-400 text-white border-4 border-brown-600 hover:bg-brown-500 disabled:bg-brown-300 disabled:cursor-not-allowed",
  };

  const styles = `${baseStyles} ${sizeStyles[size]} ${colorStyles[theme]}`;

  return (
    <button {...props} disabled={disabled} className={styles}>
      {children}
    </button>
  );
};

export default Button;
