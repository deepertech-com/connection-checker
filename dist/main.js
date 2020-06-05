!function(t){var e={};function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(o,r,function(e){return t[e]}.bind(null,r));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/home/xoxefdp/WORKSPACE/PROJECTS/CONNECTION_CHECKER/connection-checker/dist",n(n.s=0)}([function(t,e,n){"use strict";n.r(e);var o={CONNECTED:"CONNECTED",DISCONNECTED:"DISCONNECTED"};var r={ON_NETWORK_CHECKING:"onNetworkChecking",ON_NETWORK_CHANGED:"onNetworkChanged",ON_NETWORK_CONNECTED:"onNetworkConnected",ON_NETWORK_DISCONNECTED:"onNetworkDisconnected"};const c=[{url:"https://www.google.com",method:"HEAD"},{url:"https://yandex.ru",method:"HEAD"},{url:"https://www.baidu.com",method:"HEAD"}];let i=null,s=null,h=null,a=null;const l=t=>{i=t},N=()=>h,u=()=>a;class C{constructor(){this.networkState=null,this.checkerInterval=null,this.fetchTimeout=N()?N():2e3,this.intervalTime=u()?u():1e4}_checkNetwork(){this._dispatchNetworkChecking();const t=btoa(Date.now()),e=[];let n=null;for(let n=0;n<c.length;n++){const o=c[n].url,r=c[n].method,i=fetch(`${o}/?nc=${t}`,{method:r,mode:"cors",timeout:this.fetchTimeout});e.push(i)}return n=Promise.allSettled(e).then(t=>{let e=0;for(let n=0;n<t.length;n++)"rejected"===t[n].status&&e++;const n=e===t.length;e>0&&t.length;n?this._evaluateNetwork(o.DISCONNECTED):this._evaluateNetwork(o.CONNECTED)}),n}_getNetworkState(){return this.networkState}_setNetworkState(t){this.networkState=t}_resetState(){this._setNetworkState(null)}_hasNetworkChanged(t){return this._getNetworkState()!==t}_evaluateNetwork(t){this._hasNetworkChanged(t)&&this._dispatchNetworkChanged(t)}_dispatchNetworkChecking(){window.dispatchEvent(new Event(r.ON_NETWORK_CHECKING))}_dispatchNetworkChanged(t){var e;window.dispatchEvent((e={from:this._getNetworkState(),to:t},new CustomEvent(r.ON_NETWORK_CHANGED,{detail:e}))),t===o.CONNECTED?this._dispatchNetworkConnected():this._dispatchNetworkDisconnected()}_dispatchNetworkConnected(){this._setNetworkState(o.CONNECTED),l(this._getNetworkState()),window.dispatchEvent(new Event(r.ON_NETWORK_CONNECTED))}_dispatchNetworkDisconnected(){this._setNetworkState(o.DISCONNECTED),l(this._getNetworkState()),window.dispatchEvent(new Event(r.ON_NETWORK_DISCONNECTED))}_isCheckerActive(){return!!this.checkerInterval}_startConnectionChecker(){this._isCheckerActive()||(this.checkerInterval=setInterval(()=>{this._checkNetwork()},this.intervalTime))}_stopConnectionChecker(){this._isCheckerActive()&&(clearInterval(this.checkerInterval),this._resetState())}_checkConnectionOnDemand(){return this._checkNetwork()}}const d=()=>!!s;exports.ConnectionState=o,exports.ConnectionEvent=r,exports.getConnectionState=()=>i,exports.changeTimeout=(t=null)=>{h=t},exports.changeInterval=(t=null)=>{a=t},exports.isCheckerActive=d,exports.startChecker=()=>{d()||(l(null),s=new C,s._startConnectionChecker())},exports.stopChecker=()=>{d()&&(s._stopConnectionChecker(),s=null)},exports.checkOnDemand=()=>{let t=new C;t._checkConnectionOnDemand().finally(()=>{t=null})}}]);