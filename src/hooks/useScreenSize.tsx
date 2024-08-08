import { useMediaQuery } from "react-responsive";

export const useScreenSize = () => {
  const isDesktop = useMediaQuery({ minWidth: 1100 });
  const isLandscape = useMediaQuery({ orientation: "landscape", maxWidth: 1100 });
  const isPortrait = useMediaQuery({ orientation: "portrait" });
  return { isDesktop, isLandscape, isPortrait };
};
