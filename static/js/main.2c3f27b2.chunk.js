(this.webpackJsonpsitting=this.webpackJsonpsitting||[]).push([[0],[,,,,,function(e,t,n){e.exports=n(12)},,,,,function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var r,a=n(0),o=n.n(a),i=n(4),c=n.n(i),l=(n(10),n(1)),s=n(2);!function(e){e[e.study=0]="study",e[e.court=1]="court",e[e.niche=2]="niche",e[e.bridge=3]="bridge"}(r||(r={}));n(11);function u(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function g(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?u(n,!0).forEach((function(t){Object(s.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):u(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}new(window.AudioContext||window.webkitAudioContext);var m=[["Objects Study Room",r.study],["Paige Court",r.court],["Japanese Niche",r.niche],["Bridge",r.bridge]],p=window.location.hash.slice(1),d={iteration:0,gallery:Object.keys(r).includes(p)?r[p]:r.niche,offset:0,modal:"Welcome"},y=function(e,t){switch(t.type){case"requestGallery":return g({},e,{gallery:t.gallery});case"requestIteration":case"rollOverToIteration":return g({},e,{iteration:t.iteration||0});case"playbackStatus":return g({},e,{offset:t.offset});case"dismissModal":return g({},e,{modal:void 0});default:return e}},f=function(){var e,t=Object(a.useReducer)(y,d),n=Object(l.a)(t,2),i=n[0],c=n[1],u=(e={},Object(s.a)(e,r.study,Object(a.useRef)(null)),Object(s.a)(e,r.court,Object(a.useRef)(null)),Object(s.a)(e,r.niche,Object(a.useRef)(null)),Object(s.a)(e,r.bridge,Object(a.useRef)(null)),e);Object(a.useEffect)((function(){var e=setInterval((function(){var e=u[i.gallery].current.currentTime;c({type:"playbackStatus",offset:e});var t=i.iteration,n=Math.floor(e/g);t!==n&&(console.log("Rollover to iteration",t,n),c({type:"rollOverToIteration",iteration:n}))}),50);return function(){return clearInterval(e)}}),[i.gallery,i.iteration]);var g=64.32,p=i.offset%g/g;return o.a.createElement("div",{className:"App"},i.modal&&o.a.createElement("div",{className:"modal"},o.a.createElement("div",{className:"modal-content"},o.a.createElement("button",{className:"button start-button",onClick:function(){u[i.gallery].current.play(),c({type:"dismissModal"})}},"Begin"))),o.a.createElement("div",{className:"wrapper"},o.a.createElement("header",{className:"header"}," I am standing in a museum... ",!1,m.map((function(e){var t=Object(l.a)(e,2),n=(t[0],t[1]);return o.a.createElement("audio",{key:n,ref:u[n],loop:!0,preload:"auto",controls:!0,src:"".concat(r[n],".mp3"),className:"begin"})}))),o.a.createElement("div",{className:"menu"}),o.a.createElement("div",{className:"gutter"}),[[0,"sitting.01.png"],[1,"sitting.02.png"],[2,"sitting.03.png"],[3,"sitting.04.png"],[4,"sitting.01.png"],[5,"sitting.02.png"],[6,"sitting.03.png"],[7,"sitting.04.png"],[8,"sitting.01.png"],[9,"sitting.02.png"],[10,"sitting.03.png"],[11,"sitting.04.png"],[12,"sitting.01.png"],[13,"sitting.02.png"],[14,"sitting.03.png"],[15,"sitting.04.png"]].map((function(e,t){var n=Object(l.a)(e,2),a=n[0],s=(n[1],"icon-".concat(r[i.gallery],"-").concat(String(t).padStart(2,"0"),".svg")),d="iteration".concat(Math.floor(t/4)).concat(t%4),y="iteration \n                ".concat(i.iteration===a?"playing":"","\n                gallery-").concat(i.gallery,"\n              ");return o.a.createElement("span",{key:t,className:y,style:{gridArea:d}},a===i.iteration&&o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{key:"0",style:{position:"absolute",top:0,left:0,width:p<.25?"".concat(4*(p-0)*100,"%"):"100%",borderTop:"1vmin solid black"}}),o.a.createElement("div",{key:"1",style:{position:"absolute",right:0,top:0,height:p<.5?"".concat(4*(p-.25)*100,"%"):"100%",borderRight:"1vmin solid black"}}),o.a.createElement("div",{key:"2",style:{position:"absolute",bottom:0,right:0,width:p<.75?"".concat(4*(p-.5)*100,"%"):"100%",borderBottom:"1vmin solid black"}}),o.a.createElement("div",{key:"3",style:{position:"absolute",left:0,bottom:0,height:p<1?"".concat(4*(p-.75)*100,"%"):"100%",borderLeft:"1vmin solid black"}})),o.a.createElement("img",{src:s,onClick:function(){m.filter((function(e){var t=Object(l.a)(e,2);t[0];return t[1]!==i.gallery})).forEach((function(e){var t=Object(l.a)(e,2),n=(t[0],t[1]);return u[n].current.pause()})),u[i.gallery].current.play(),u[i.gallery].current.currentTime=(u[i.gallery].current.currentTime-0)%g+t*g,c({type:"requestIteration",iteration:a})}}))})),o.a.createElement("footer",{className:"footer"},o.a.createElement("div",{className:"gallery-selection"},m.map((function(e){var t=Object(l.a)(e,2),n=t[0],a=t[1];return o.a.createElement("button",{key:a,onClick:function(){c({type:"requestGallery",gallery:a});var e=u[i.gallery].current.currentTime;m.forEach((function(e){var t=Object(l.a)(e,2),n=(t[0],t[1]);console.log("new galFor ",n,"!-",typeof i.gallery,"pausing"),n!==a&&u[n].current.pause()})),u[a].current.currentTime=e+.01,u[a].current.play(),console.log("Dine stet",e)},className:"\n                ".concat(i.gallery===a?"selected":"default","\n                ").concat(r[i.gallery],"\n              ")},n)}))),o.a.createElement("div",null,"Chazen et cetera. 2020."))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(o.a.createElement(f,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}],[[5,1,2]]]);
//# sourceMappingURL=main.2c3f27b2.chunk.js.map