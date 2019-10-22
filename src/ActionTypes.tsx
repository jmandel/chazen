import { AudioFragment } from "./AudioFragment";
import { ItemProgress } from "./DownloadManager";
import { PlaybackStatus } from "./PlaybackManager";
export type ActionTypes =
  | { type: "beginPlayback" }
  | { type: "pickIteration"; selectedIteration: number }
  | { type: "pickTime"; subtype: "a"; selectedTime: number }
  | { type: "downloadStatus"; progress: ItemProgress<AudioFragment>[] }
  | { type: "playbackStatus"; status: PlaybackStatus }
  | { type: "requestIteration"; iteration: number };
