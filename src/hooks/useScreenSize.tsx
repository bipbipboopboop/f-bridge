import { useMediaQuery } from "react-responsive";

export const useScreenSize = () => {
  const isDesktop = useMediaQuery({ minWidth: 930 });
  const isLandscape = useMediaQuery({ orientation: "landscape", maxWidth: 930 });
  const isPortrait = useMediaQuery({ orientation: "portrait" });
  return { isDesktop, isLandscape, isPortrait };
};
