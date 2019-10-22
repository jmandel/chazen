import { Gallery } from "./Gallery";
export type AudioFragment = {
  url: string;
  durationMs: number;
  gallery: Gallery;
  iteration: number;
  sequence: number;
  mp3?: ArrayBuffer;
  samples?: AudioBuffer;
  arrayBuffer: ArrayBuffer | null;
};
