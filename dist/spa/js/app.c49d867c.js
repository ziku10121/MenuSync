(function(e){function t(t){for(var r,o,c=t[0],i=t[1],l=t[2],s=0,f=[];s<c.length;s++)o=c[s],Object.prototype.hasOwnProperty.call(a,o)&&a[o]&&f.push(a[o][0]),a[o]=0;for(r in i)Object.prototype.hasOwnProperty.call(i,r)&&(e[r]=i[r]);d&&d(t);while(f.length)f.shift()();return u.push.apply(u,l||[]),n()}function n(){for(var e,t=0;t<u.length;t++){for(var n=u[t],r=!0,o=1;o<n.length;o++){var c=n[o];0!==a[c]&&(r=!1)}r&&(u.splice(t--,1),e=i(i.s=n[0]))}return e}var r={},o={1:0},a={1:0},u=[];function c(e){return i.p+"js/"+({}[e]||e)+"."+{2:"a6e4a45c",3:"5cb804bd",4:"c94152b1",5:"127db794",6:"de0de17f",7:"0ae38997",8:"c88263d3",9:"c6d30259"}[e]+".js"}function i(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.e=function(e){var t=[],n={2:1,3:1,4:1,5:1,6:1,7:1};o[e]?t.push(o[e]):0!==o[e]&&n[e]&&t.push(o[e]=new Promise((function(t,n){for(var r="css/"+({}[e]||e)+"."+{2:"8f5ea689",3:"6acfeca9",4:"9b9972db",5:"8f7deca5",6:"0c129018",7:"12050224",8:"31d6cfe0",9:"31d6cfe0"}[e]+".css",a=i.p+r,u=document.getElementsByTagName("link"),c=0;c<u.length;c++){var l=u[c],s=l.getAttribute("data-href")||l.getAttribute("href");if("stylesheet"===l.rel&&(s===r||s===a))return t()}var f=document.getElementsByTagName("style");for(c=0;c<f.length;c++){l=f[c],s=l.getAttribute("data-href");if(s===r||s===a)return t()}var d=document.createElement("link");d.rel="stylesheet",d.type="text/css",d.onload=t,d.onerror=function(t){var r=t&&t.target&&t.target.src||a,u=new Error("Loading CSS chunk "+e+" failed.\n("+r+")");u.code="CSS_CHUNK_LOAD_FAILED",u.request=r,delete o[e],d.parentNode.removeChild(d),n(u)},d.href=a;var p=document.getElementsByTagName("head")[0];p.appendChild(d)})).then((function(){o[e]=0})));var r=a[e];if(0!==r)if(r)t.push(r[2]);else{var u=new Promise((function(t,n){r=a[e]=[t,n]}));t.push(r[2]=u);var l,s=document.createElement("script");s.charset="utf-8",s.timeout=120,i.nc&&s.setAttribute("nonce",i.nc),s.src=c(e);var f=new Error;l=function(t){s.onerror=s.onload=null,clearTimeout(d);var n=a[e];if(0!==n){if(n){var r=t&&("load"===t.type?"missing":t.type),o=t&&t.target&&t.target.src;f.message="Loading chunk "+e+" failed.\n("+r+": "+o+")",f.name="ChunkLoadError",f.type=r,f.request=o,n[1](f)}a[e]=void 0}};var d=setTimeout((function(){l({type:"timeout",target:s})}),12e4);s.onerror=s.onload=l,document.head.appendChild(s)}return Promise.all(t)},i.m=e,i.c=r,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)i.d(n,r,function(t){return e[t]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/",i.oe=function(e){throw console.error(e),e};var l=window["webpackJsonp"]=window["webpackJsonp"]||[],s=l.push.bind(l);l.push=t,l=l.slice();for(var f=0;f<l.length;f++)t(l[f]);var d=s;u.push([0,0]),n()})({0:function(e,t,n){e.exports=n("2f39")},"2f39":function(e,t,n){"use strict";n.r(t);n("5319"),n("7d6e"),n("e54f"),n("a4b7"),n("985d"),n("31cd");var r=n("2b0e"),o=n("1f91"),a=n("42d2"),u=n("b05d");r["a"].use(u["a"],{config:{},lang:o["a"],iconSet:a["a"]});var c=function(){var e=this,t=e._self._c;return t("div",{attrs:{id:"q-app"}},[t("router-view")],1)},i=[],l={name:"App"},s=l,f=n("2877"),d=Object(f["a"])(s,c,i,!1,null,null,null),p=d.exports,h=n("2f62");r["a"].use(h["a"]);var m=function(){const e=new h["a"].Store({modules:{},strict:!1});return e},b=n("8c4f");n("ddb0");const v=[{path:"/",component:()=>Promise.all([n.e(0),n.e(8)]).then(n.bind(null,"4231")),children:[{path:"",name:"main",component:()=>Promise.all([n.e(0),n.e(7)]).then(n.bind(null,"f12b"))},{path:"makeMenu",component:()=>Promise.all([n.e(0),n.e(4)]).then(n.bind(null,"52b8"))},{path:"preview",component:()=>Promise.all([n.e(0),n.e(5)]).then(n.bind(null,"378d"))},{path:"capture",component:()=>Promise.all([n.e(0),n.e(2)]).then(n.bind(null,"6824"))},{name:"detect",path:"detect",component:()=>Promise.all([n.e(0),n.e(6)]).then(n.bind(null,"f05f"))},{path:"machineTest",component:()=>Promise.all([n.e(0),n.e(3)]).then(n.bind(null,"bb52"))}]},{path:"*",component:()=>Promise.all([n.e(0),n.e(9)]).then(n.bind(null,"e51e"))}];var y=v,g=n("bf83"),w=n.n(g);r["a"].use(w.a),r["a"].use(b["a"]);var P=function(){const e=new b["a"]({scrollBehavior:()=>({x:0,y:0}),routes:y,mode:"history",base:"/"});return e},O=async function(){const e="function"===typeof m?await m({Vue:r["a"]}):m,t="function"===typeof P?await P({Vue:r["a"],store:e}):P;e.$router=t;const n={router:t,store:e,render:e=>e(p),el:"#q-app"};return{app:n,store:e,router:t}},j=n("bc3a"),_=n.n(j);r["a"].prototype.$axios=_.a;var x=n("daa7"),S=n.n(x),C=n("ac5e"),E=({Vue:e})=>{console.log("boot",C["b"]),e.use(S.a,C["b"],{clientId:"WebClient-"+parseInt(1e5*Math.random())})},k=n("d8c5"),T=n.n(k),A=async({Vue:e})=>{e.use(T.a)};const M="/";async function q(){const{app:e,store:t,router:n}=await O();let o=!1;const a=e=>{o=!0;const t=Object(e)===e?n.resolve(e).route.fullPath:e;window.location.href=t},u=window.location.href.replace(window.location.origin,""),c=[void 0,E,A];for(let l=0;!1===o&&l<c.length;l++)if("function"===typeof c[l])try{await c[l]({app:e,router:n,store:t,Vue:r["a"],ssrContext:null,redirect:a,urlPath:u,publicPath:M})}catch(i){return i&&i.url?void(window.location.href=i.url):void console.error("[Quasar] boot error:",i)}!0!==o&&new r["a"](e)}q()},"31cd":function(e,t,n){},ac5e:function(e,t,n){"use strict";n.d(t,"a",(function(){return r})),n.d(t,"b",(function(){return o}));const r="http://192.168.168.61:1880/menu_setup",o="ws://192.168.168.61:9000/mqtt"}});