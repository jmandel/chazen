export const GalleryTypes = ["first-floor", "cross-beam", "coat-closet"] as const;

export type Gallery = typeof GalleryTypes[number]