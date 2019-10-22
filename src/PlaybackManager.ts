import { AudioFragment } from "./AudioFragment";
import { Gallery } from "./Gallery";

const RAMP_TIME = 0.1;
const TIMER_INVERTAL_SECONDS = 0.2;

type PlayerStateInternal = {
  node: AudioBufferSourceNode;
  gainNode: GainNode;
  logicalStartTime: number;
  media: AudioFragment;
  bufferDuration: number;
};


export default function PlaybackManager(
  audioContext: AudioContext,
  fragments: AudioFragment[],
  cb: (pmStatus: PlaybackStatus) => void
): PlaybackManager {
  const TotalIterations = 1 + Math.max.apply(null, fragments.map(f => f.iteration));
  let playerStateInternal: PlayerStateInternal[] = [];

  const enqueue = (request: {
    segment: AudioFragment;
    startTime: number;
    offset: number;
    audioBuffer: AudioBuffer;
  }): PlayerStateInternal => {
    const source = audioContext.createBufferSource();
    source.buffer = request.audioBuffer;

    const gainNode = audioContext.createGain();
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.gain.setValueAtTime(0.00000001, request.startTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.999,
      request.startTime + RAMP_TIME
    );
    source.start(request.startTime, request.offset);
    return {
      bufferDuration: request.audioBuffer.duration,
      logicalStartTime: request.startTime,
      media: request.segment,
      node: source,
      gainNode: gainNode
    };
  };

  let audioDriverPublicState: PlaybackStatus | null = null;
  let pendingPlayerState: PlayerStateInternal | null = null;

  const enqueueItemAfter = (currentItem: PlaybackItem) => {
    if (pendingPlayerState) {
      pendingPlayerState.node.disconnect();
    }

    const comesAfter = (a: AudioFragment) => (other: AudioFragment) => {
      const targetIteration = (a.iteration + 1) % TotalIterations;
      return other.iteration === targetIteration && other.gallery === a.gallery;
    };

    const current = playerStateInternal.slice(-1)[0];
    const whenToPlay = current.logicalStartTime + current.bufferDuration;
    const desiredOffset = 0;

    let toPlayMedia = fragments.filter(comesAfter(current.media))[0];
    let toPlay = toPlayMedia.arrayBuffer!;
    toPlay = toPlay.slice(0, toPlay.byteLength);

    audioContext.decodeAudioData(
      toPlay,
      audioBuffer => {
        let nextPlayerState = enqueue({
          segment: toPlayMedia,
          startTime: whenToPlay,
          offset: desiredOffset,
          audioBuffer
        });

        pendingPlayerState = nextPlayerState;
        const snapshotPlayingState = playerStateInternal;
        current.node.addEventListener("ended", () => {
          if (snapshotPlayingState === playerStateInternal) {
            playerStateInternal = [nextPlayerState];
            pendingPlayerState = null;
          }
        });
      },
      err => {
        console.log("Decode err", err);
      }
    );
  };

  setInterval(() => {
    if (!audioDriverPublicState) return;
    if (playerStateInternal.length === 0) return;

    // TODO save work here if 10x per second
    const currentMedia = playerStateInternal.slice(-1)[0].media;

    // TODO handle gallery changes too
    if (currentMedia.iteration !== audioDriverPublicState.iteration) {
      audioDriverPublicState = {
        gallery: audioDriverPublicState.gallery,
        iteration: currentMedia.iteration,
        offset: 0
      };
      enqueueItemAfter(audioDriverPublicState);
    }
    cb({
      ...audioDriverPublicState,
      offset: audioContext.currentTime - playerStateInternal[0].logicalStartTime
    });
  }, TIMER_INVERTAL_SECONDS * 1000);

  return {
    dispatch: desiredChange => {
      if (desiredChange.type !== "change-iteration") return;

      if (
        !audioDriverPublicState ||
        audioDriverPublicState.iteration !== desiredChange.iteration
      ) {
        let toPlayMedia = fragments.filter(
          m => m.iteration === desiredChange.iteration
        )[0];

        let toPlay = toPlayMedia.arrayBuffer!;

        // (shallow) copy, because we can't decode
        // the same === buffer while playing
        toPlay = toPlay.slice(0, toPlay.byteLength);
        audioContext.decodeAudioData(
          toPlay,
          audioBuffer => {
            const targetOffset = playerStateInternal.length
              ? audioContext.currentTime -
                playerStateInternal.slice(-1)[0].logicalStartTime
              : 0;

            const nextStartTime = audioContext.currentTime + 0.1;
            const nextPlayerState = enqueue({
              segment: toPlayMedia,
              startTime: nextStartTime,
              offset: targetOffset,
              audioBuffer
            });

            playerStateInternal.forEach(p => {
              p.gainNode.gain.setValueAtTime(0.9999, nextStartTime);
              p.gainNode.gain.exponentialRampToValueAtTime(
                0.00001,
                nextStartTime + RAMP_TIME * 3
              );
            });
            playerStateInternal = [
              {
                node: nextPlayerState.node,
                gainNode: nextPlayerState.gainNode,
                logicalStartTime: audioContext.currentTime - targetOffset,
                bufferDuration: audioBuffer.duration,
                media: toPlayMedia
              }
            ];
            const desiredPlay: PlaybackItem = {
              iteration: desiredChange.iteration,
              gallery: "first-floor" // TODO get from current public state
            };

            enqueueItemAfter(desiredPlay);
            audioDriverPublicState = { ...desiredPlay, offset: 0 };
          },
          err => {
            console.log("Decode err", err);
          }
        );
      }
    }
  };
}

export type PlaybackRequest =
  | { type: "change-gallery"; gallery: Gallery; }
  | { type: "change-iteration"; iteration: number; };

export type PlaybackManager = {
  dispatch: (p: PlaybackRequest) => void;
};

export type PlaybackStatus = {
  gallery: Gallery;
  iteration: number;
  offset: number;
};

type PlaybackItem = {
  [K in Exclude<keyof PlaybackStatus, "offset">]: PlaybackStatus[K];
};
