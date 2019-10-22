import React, { useEffect, useReducer, useRef } from "react";
import { ActionTypes } from "./ActionTypes";
import { AudioFragment } from "./AudioFragment";
import { downloader, ItemProgress } from "./DownloadManager";
import { frags as FragmentsToDownload } from "./FragmentsToDownload";
import PlaybackManager, { PlaybackRequest, PlaybackStatus } from "./PlaybackManager";

const audioContext: AudioContext = new ((window as any).AudioContext ||
  (window as any).webkitAudioContext)();

type AppState = {
  progress: ItemProgress<AudioFragment>[];
  audioContextStatus: string;
  playbackStatus: PlaybackStatus;
};

const defaultAppState = {
  progress: [],
  audioContextStatus: audioContext.state,
  playbackStatus: {} as PlaybackStatus
};

const appStateReducer = (state: AppState, action: ActionTypes): AppState => {
  switch (action.type) {
    case "beginPlayback":
      return { ...state, audioContextStatus: audioContext.state };
    case "downloadStatus":
      return { ...state, progress: action.progress };
    case "playbackStatus":
      return { ...state, playbackStatus: action.status };
    default:
      return state;
  }
};

const App: React.FC = () => {
  const [state, dispatch] = useReducer(appStateReducer, defaultAppState);
  const completed = state.progress.filter(p => p.finished).length;
  const total = state.progress.length;

  const dispatchPlaybackRequest = useRef((p: PlaybackRequest): void => {});
  useEffect(() => {
    downloader(FragmentsToDownload, p =>
      dispatch({
        type: "downloadStatus",
        progress: p
      })
    );
  }, []);

  useEffect(() => {
    const finishedItems = state.progress.filter(p => p.finished).length 
    if ( finishedItems < FragmentsToDownload.length)
      return;

    const allPlaybackFragments = state.progress.map(
      (p: ItemProgress<AudioFragment>): AudioFragment => p.target
    );

    const pm = PlaybackManager(audioContext, allPlaybackFragments, status =>
      dispatch({ type: "playbackStatus", status })
    );

    dispatchPlaybackRequest.current = pm.dispatch;
  }, [state.progress]);

  const startAudio = () => {
    console.log("Starting audio", audioContext);
    audioContext.resume().then(() => {
      dispatch({ type: "beginPlayback" });
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => startAudio()}>Begin Playback</button>
        {state.audioContextStatus === "running" &&
          FragmentsToDownload.map(f => (
            <button
              key={f.iteration}
              onClick={() =>
                dispatchPlaybackRequest.current({
                  type: "change-iteration",
                  iteration: f.iteration
                })
              }>
              {f.iteration}
            </button>
          ))}
        <pre>
          {completed} of {total} files loaded.
          {state.audioContextStatus}
        </pre>
        <br></br>
        <pre>{JSON.stringify(state.playbackStatus, null, 2)}</pre>
      </header>
    </div>
  );
};

export default App;
