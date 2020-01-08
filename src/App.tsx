import React, { useEffect, useReducer, useRef } from "react";
import { ActionTypes, Gallery } from "./ActionTypes";
import "./App.css"

const audioContext: AudioContext = new ((window as any).AudioContext ||
  (window as any).webkitAudioContext)();

type Modal = "Welcome" | "Map" | "Passage";

const GalleryNames: [string, Gallery][] = [
  ["Objects Study Room", Gallery.study],
  ["Paige Court", Gallery.court],
  ["Japanese Niche", Gallery.niche],
  ["Bridge", Gallery.bridge],
]

const defaultGalleryParam = window.location.hash.slice(1);

const defaultGallery: Gallery = Object.keys(Gallery).includes(defaultGalleryParam) ?
  (Gallery as any)[defaultGalleryParam] : Gallery.niche;

type AppState = {
  iteration: number;
  gallery: Gallery;
  modal?: Modal;
  offset: number;
};

const defaultAppState: AppState = {
  iteration: 0,
  gallery: defaultGallery,
  offset: 0,
  modal: "Welcome"
};

const appStateReducer = (state: AppState, action: ActionTypes): AppState => {
  switch (action.type) {
    case "requestGallery":
      return { ...state, gallery: action.gallery};
     case "requestIteration":
      return { ...state, iteration: action.iteration || 0 };
    case "rollOverToIteration":
      return { ...state, iteration: action.iteration || 0 };
    case "playbackStatus":
      return { ...state, offset: action.offset};
    case "dismissModal":
      return { ...state, modal: undefined};
    default:
      return state;
  }
};

const PARALLEL_DOWNLOADS = 3
const PROGRESS_INTERVAL_MS = 50

  const dialTo = (steps: number, duration: number) => (elt: HTMLAudioElement, target: number) => {
    const initial = elt.volume
    const increment = (target - initial) / steps
    for (let i=0; i < steps; i++) {
      setTimeout(() => elt.volume = Math.min(1, Math.max(0, initial + (i+1) * increment)) , i* duration / steps)
    }
  }

  const dialSoftly = dialTo(10, 250)



const App: React.FC = () => {
  const [state, dispatch] = useReducer(appStateReducer, defaultAppState);

  const audioElements: Record<Gallery, any> = {
    [Gallery.study]: useRef<HTMLAudioElement>(null),
    [Gallery.court]: useRef<HTMLAudioElement>(null),
    [Gallery.niche]: useRef<HTMLAudioElement>(null),
    [Gallery.bridge]: useRef<HTMLAudioElement>(null)
  };

  useEffect(() => {
    let destroy = setInterval(()=> {
      const offset = audioElements[state.gallery].current!.currentTime
      dispatch({
        type: "playbackStatus",
        offset
      })

      const previousIteration = state.iteration
      const currentIteration = Math.floor(offset/ITERATION_DURATION)
      if (previousIteration !== currentIteration){
        dispatch({
          type: "rollOverToIteration",
          iteration: currentIteration
        })
      }
    }, PROGRESS_INTERVAL_MS)

    return () => clearInterval(destroy)
  }, [state.gallery, state.iteration])

  const ITERATION_DURATION = 64.32 // 76;
  const LOOKBACK_ON_SWITCH = 0;

  const fractionComplete = (state.offset % ITERATION_DURATION) / ITERATION_DURATION
  const iterationList: number[] = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

  // iteration_duration = 64.32s
  return (
    <div className="App">
        {state.modal && <div className="modal">
          <div className="modal-content">
            <button
              className="button start-button"
              onClick={() => {
                audioElements[state.gallery].current!.play();
                dispatch({type: "dismissModal"})
              }}
            >Begin</button>
          </div></div>}

      <div className="wrapper">
        <header className="header"> I am standing in a museum... {false && Math.round(state.offset*100)/100}
          {GalleryNames.map(([description, gallery]) => (
            <audio key={gallery} ref={audioElements[gallery]} loop={true} preload="auto" controls src={`${Gallery[gallery]}.mp3`} className="begin" />
          ))}
        </header>
        <div className="menu"></div>
        <div className="gutter"></div>
        {iterationList.map((i, c) => {
          
          const src = `icon-${Gallery[state.gallery]}-${String(c).padStart(2, '0')}.svg`
          const gridArea = `iteration${Math.floor(c / 4)}${c % 4}`
          const className = `iteration 
                ${state.iteration === i ? "playing" : ""}
                gallery-${state.gallery}
              `;

          return (
          <span 
            key={c}
            className={className}
            style={{ gridArea }}>
              {i === state.iteration && <>
              <div key="0"  style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: fractionComplete  < .25 ? `${(fractionComplete - 0) * 4 * 100}%` : "100%",
                borderTop: "1vmin solid black"
              }}></div>
              <div key="1"  style={{
                position: "absolute",
                right: 0,
                top: 0,
                height: fractionComplete  < .5 ? `${(fractionComplete - .25)*4 * 100}%` : "100%",
                borderRight: "1vmin solid black"
              }}></div>
              <div key="2"  style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: fractionComplete  < .75 ? `${(fractionComplete - .50)*4 * 100}%` : "100%",
                borderBottom: "1vmin solid black"
              }}></div>
              <div key="3"  style={{
                position: "absolute",
                left: 0,
                bottom: 0,
                height: fractionComplete  < 1.0 ? `${(fractionComplete - .75)*4 * 100}%` : "100%",
                borderLeft: "1vmin solid black"
              }}></div>
 
              </>}
             
              <img src={src} 
                onClick={() => {
                  GalleryNames.filter(([desc,g]) => g!== state.gallery).forEach(([desc,g]) => audioElements[g].current!.pause())
                  audioElements[state.gallery].current!.play()
                  audioElements[state.gallery].current!.currentTime = ((audioElements[state.gallery].current!.currentTime - LOOKBACK_ON_SWITCH) % ITERATION_DURATION) + c * ITERATION_DURATION
                  dispatch({
                    type: "requestIteration",
                    iteration: i
                  })
                }
                }>
          </img>
          </span>
        )}
        )}
        <footer className="footer">
          <div className="gallery-selection">
            {GalleryNames.map(([description, gallery]) => (
              <button
              key={gallery} 
              onClick={() => {
                dispatch({
                  type: "requestGallery",
                  gallery
                })
                const atTime = audioElements[state.gallery].current!.currentTime;
                GalleryNames.forEach(([desc,g]) => 
                {
                  g !== gallery && dialSoftly(audioElements[g].current!, 0)
                })
                  audioElements[gallery].current!.currentTime = atTime
                  audioElements[gallery].current!.play()
                  dialSoftly(audioElements[gallery].current!, 1)
              }}
              className={`
                ${state.gallery === gallery ? "selected" : "default"}
                ${Gallery[state.gallery]}
              `}>{description}</button>
            ))}
          </div>
          <div>
            Chazen et cetera. 2020.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
