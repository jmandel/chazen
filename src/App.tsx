import React, { useEffect, useReducer, useRef } from "react";
import { ActionTypes, Gallery } from "./ActionTypes";
import "./App.css"

const audioContext: AudioContext = new ((window as any).AudioContext ||
  (window as any).webkitAudioContext)();


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
  gallery: Gallery
};

const defaultAppState: AppState = {
  iteration: 0,
  gallery: defaultGallery
};

const appStateReducer = (state: AppState, action: ActionTypes): AppState => {
  switch (action.type) {
    case "requestGallery":
      return { ...state, gallery: action.gallery};
     case "requestIteration":
      return { ...state, iteration: action.iteration || 0 };
    case "rollOverToIteration":
      return { ...state, iteration: action.iteration || 0 };
    default:
      return state;
  }
};

const PARALLEL_DOWNLOADS = 3

const App: React.FC = () => {
  const [state, dispatch] = useReducer(appStateReducer, defaultAppState);

  const audioElements: Record<Gallery, any> = {
    [Gallery.study]: useRef<HTMLAudioElement>(null),
    [Gallery.court]: useRef<HTMLAudioElement>(null),
    [Gallery.niche]: useRef<HTMLAudioElement>(null),
    [Gallery.bridge]: useRef<HTMLAudioElement>(null)
  };

  const ITERATION_DURATION = 64.32 // 76;
  const LOOKBACK_ON_SWITCH = 0;
  const iterationList: [number, string][] = [
    [0, "sitting.01.png"],
    [1, "sitting.02.png"],
    [2, "sitting.03.png"],
    [3, "sitting.04.png"],
    [4, "sitting.01.png"],
    [5, "sitting.02.png"],
    [6, "sitting.03.png"],
    [7, "sitting.04.png"],
    [8, "sitting.01.png"],
    [9, "sitting.02.png"],
    [10, "sitting.03.png"],
    [11, "sitting.04.png"],
    [12, "sitting.01.png"],
    [13, "sitting.02.png"],
    [14, "sitting.03.png"],
    [15, "sitting.04.png"],
  ]

  // iteration_duration = 64.32s
  return (
    <div className="App">
      <div className="wrapper">
        <header className="header">
          {GalleryNames.map(([description, gallery]) => (
            <audio ref={audioElements[gallery]} preload="auto" controls src={`${Gallery[gallery]}.mp3`} className="begin" />
          ))}
        </header>
        <div className="menu"></div>
        <div className="gutter"></div>
        {iterationList.map(([i, icon], c) => {
          
          const src = `icon-${Gallery[state.gallery]}-${String(c).padStart(2, '0')}.svg`
          const gridArea = `iteration${Math.floor(c / 4)}${c % 4}`
          const className = `iteration 
                ${state.iteration === i ? "playing" : ""}
                gallery-${state.gallery}
              `;

          return (
          <img className={className} src={src} style={{ gridArea }}
            key={c}
            onClick={() => {
              GalleryNames.filter(([desc,g]) => g!== state.gallery).forEach(([desc,g]) => 
              {
                console.log("For ", g, "!-", typeof state.gallery, "pausing");
                audioElements[g].current!.pause()
              })
              audioElements[state.gallery].current!.play()
              audioElements[state.gallery].current!.currentTime = ((audioElements[state.gallery].current!.currentTime - LOOKBACK_ON_SWITCH) % ITERATION_DURATION) + c * ITERATION_DURATION
              dispatch({
                type: "requestIteration",
                iteration: i
              })
            }
            }>
          </img>
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
                  console.log("new galFor ", g, "!-", typeof state.gallery, "pausing");
                  g !== gallery && audioElements[g].current!.pause()
                })
                  audioElements[gallery].current!.currentTime = atTime + .010;
                  audioElements[gallery].current!.play()
                console.log("Dine stet", atTime)
              }}
              className={`
                ${state.gallery == gallery ? "selected" : "default"}
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
