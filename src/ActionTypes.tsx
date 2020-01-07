import { AudioFragment } from "./AudioFragment";
import { ItemProgress } from "./DownloadManager";
import { PlaybackStatus } from "./PlaybackManager";

export enum Gallery {
  study,
  court,
  niche,
  bridge,
}


export type ActionTypes =
  | { type: "beginPlayback" }
  | { type: "pickIteration"; selectedIteration: number }
  | { type: "pickTime"; subtype: "a"; selectedTime: number }
  | { type: "downloadStatus"; progress: ItemProgress<AudioFragment>[] }
  | { type: "playbackStatus"; offset: number }
  | { type: "dismissModal"; }
  | { type: "requestGallery"; gallery: Gallery }
  | { type: "requestIteration"; iteration: number }
  | { type: "rollOverToIteration"; iteration: number };
