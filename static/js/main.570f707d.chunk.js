(this.webpackJsonpsitting=this.webpackJsonpsitting||[]).push([[0],[,,,,,function(e,t,r){e.exports=r(12)},,,,,function(e,t,r){},function(e,t,r){},function(e,t,r){"use strict";r.r(t);var n=r(0),a=r.n(n),o=r(2),c=r.n(o),i=(r(10),r(4)),s=r(3);r(11);function u(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?u(r,!0).forEach((function(t){Object(s.a)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):u(r).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var p=new(window.AudioContext||window.webkitAudioContext),f={progress:[],audioContextStatus:p.state,playbackStatus:{}},m=function(e,t){switch(t.type){case"requestIteration":return l({},e,{requestedIteration:t.iteration});case"beginPlayback":return l({},e,{audioContextStatus:p.state});case"downloadStatus":return l({},e,{progress:t.progress});case"playbackStatus":return l({},e,{playbackStatus:t.status});default:return e}},b=function(){var e=Object(n.useReducer)(m,f),t=Object(i.a)(e,2),r=t[0],o=(t[1],r.progress.filter((function(e){return e.finished})).length,r.progress.length,Object(n.useRef)(null));Object(n.useRef)((function(e){}));return a.a.createElement("div",{className:"App"},a.a.createElement("div",{className:"wrapper"},a.a.createElement("header",{className:"header"},a.a.createElement("audio",{ref:o,preload:"auto",controls:!0,src:"sitting/output.mp3",className:"begin"})),Array(9).fill(0).map((function(e,t){return a.a.createElement("div",{className:"iteration-box"},a.a.createElement("img",{className:"iteration \n              ",src:"sitting.png",style:{gridArea:"iteration".concat(Math.floor(t/3)).concat(t%3)},key:t,onClick:function(){o.current.play(),o.current.currentTime=o.current.currentTime%76+76*t}}))})),a.a.createElement("br",null),a.a.createElement("pre",null,JSON.stringify(r.playbackStatus,null,2)),a.a.createElement("footer",{className:"footer"},a.a.createElement("pre",null,"Chazen \uff06 cetera. 2020."))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(a.a.createElement(b,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}],[[5,1,2]]]);
//# sourceMappingURL=main.570f707d.chunk.js.map