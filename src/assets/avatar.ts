/**
 * This contains exports of all the avatars
 */

import { AvatarID } from "types/Avatar";
import BLUE_DINO from "./player_assets/dino_sprite_1.gif";
import RED_DINO from "./player_assets/dino_sprite_2.gif";
import YELLOW_DINO from "./player_assets/dino_sprite_3.gif";
import GREEN_DINO from "./player_assets/dino_sprite_4.gif";

// avatarLookup maps AvatarID to the corresponding image, the keys are the AvatarID and the values are the image paths
export const avatarLookup: Record<AvatarID, string> = {
  blueDino: BLUE_DINO,
  redDino: RED_DINO,
  yellowDino: YELLOW_DINO,
  greenDino: GREEN_DINO,
};
