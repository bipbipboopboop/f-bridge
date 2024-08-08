import React, { createContext } from "react";
import { useMediaQuery } from "react-responsive";
import { useScreenSize } from "../hooks/useScreenSize";

interface OrientationContextProps {}

export const OrientationContext = createContext<OrientationContextProps>({});

interface OrientationProviderProps {
  children: React.ReactNode;
}

export const OrientationProvider: React.FC<OrientationProviderProps> = ({ children }) => {
  const { isPortrait } = useScreenSize();
  if (isPortrait) return <PortraitHint />;
  return <OrientationContext.Provider value={{}}>{children}</OrientationContext.Provider>;
};

const PortraitHint: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* Smartphone icon */}
      <svg
        className="w-[50%] h-[50%] text-white animate-[phone-rotate-hint_5s_linear_infinite]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12" y2="18" />
      </svg>
      <p className="text-center text-white mt-4">Please rotate your device to landscape mode</p>
    </div>
  );
};
