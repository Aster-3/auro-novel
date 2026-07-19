export const PROFILE_COVER_RECOMMENDED_WIDTH = 1600;
export const PROFILE_COVER_RECOMMENDED_HEIGHT = 600;
export const PROFILE_COVER_ASPECT_RATIO =
  PROFILE_COVER_RECOMMENDED_WIDTH / PROFILE_COVER_RECOMMENDED_HEIGHT;

export const PROFILE_HEADER = {
  coverAspectRatio: PROFILE_COVER_ASPECT_RATIO,
  coverRadius: 14,
  avatarSize: 68,
  avatarRadius: 28,
  avatarBorderWidth: 2,
  avatarOverlap: 30,
  containerBottomGap: 34,
} as const;

export const PROFILE_COVER_PICKER_ASPECT: [number, number] = [
  PROFILE_COVER_RECOMMENDED_WIDTH,
  PROFILE_COVER_RECOMMENDED_HEIGHT,
];
