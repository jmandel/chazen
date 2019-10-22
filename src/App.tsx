import React, { useEffect, useReducer, useRef } from "react";
import { ActionTypes } from "./ActionTypes";
import { AudioFragment } from "./AudioFragment";
import { downloader, ItemProgress } from "./DownloadManager";
import { FragmentsToDownload } from "./FragmentsToDownload";
import PlaybackManager, { PlaybackRequest, PlaybackStatus } from "./PlaybackManager";

const audioContext: AudioContext = new ((window as any).AudioContext ||
  (window as any).webkitAudioContext)();

type AppState = {
  progress: ItemProgress<AudioFragment>[];
  audioContextStatus: string;
  playbackStatus: PlaybackStatus;
  requestedIteration?: number;
};

const defaultAppState = {
  progress: [],
  audioContextStatus: audioContext.state,
  playbackStatus: {} as PlaybackStatus
};

const appStateReducer = (state: AppState, action: ActionTypes): AppState => {
  switch (action.type) {
    case "requestIteration":
      return { ...state, requestedIteration: action.iteration};
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

const PARALLEL_DOWNLOADS=3

const App: React.FC = () => {
  const [state, dispatch] = useReducer(appStateReducer, defaultAppState);
  const completed = state.progress.filter(p => p.finished).length;
  const total = state.progress.length;

  const dispatchPlaybackRequest = useRef((p: PlaybackRequest): void => {});
  useEffect(() => {
    console.log("DL", FragmentsToDownload.length)
    downloader(FragmentsToDownload, PARALLEL_DOWNLOADS, p =>
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
    audioContext.resume().then(() => {
      dispatch({ type: "beginPlayback" });
    });
  };

  return (
    <div className="App">
      <div className="wrapper">
      <header className="header">
        <button className="begin" onClick={() => startAudio()}>Begin Playback</button>
      </header>
        {state.audioContextStatus === "running" &&
          FragmentsToDownload.map((f,i) => (
            <div className="iteration-box">
            <img className={`iteration 
              ${(f.iteration === state.playbackStatus.iteration) ? "playing" : ""}
              ${(f.iteration === state.requestedIteration) ? "requested" : ""}
              `} src="sitting.svg" style={{
              gridArea: `iteration${Math.floor(i/3)}${i%3}`
            }}
              key={f.iteration}
              onClick={() => {
                dispatch({type: "requestIteration", iteration: f.iteration})
                dispatchPlaybackRequest.current({
                  type: "change-iteration",
                  iteration: f.iteration
                })

              }
              }>
            </img>
            </div>
          ))}
        
        <br></br>
        <pre>{JSON.stringify(state.playbackStatus, null, 2)}</pre>
      <footer className="footer">
        <pre>
          {completed} of {total} files loaded.  
          {" " + state.audioContextStatus}. 
          Chazen ＆ cetera. 2020.
        </pre>
        </footer>
     </div> 
    </div>
  );
};

export default App;
