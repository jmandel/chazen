import { AudioFragment } from "./AudioFragment";
import "./App.css";

export const FragmentsToDownload: AudioFragment[] = Array(9)
  .fill(0)
  .map((_, i) => (i).toString().padStart(2, "0"))
  .map(n => `sitting/sitting.${n}.mp3`)
  .map(
    (url: string, i): AudioFragment => ({
      url,
      durationMs: 0,
      gallery: "coat-closet",
      iteration: i,
      sequence: 0,
      arrayBuffer: null
    })
  );
