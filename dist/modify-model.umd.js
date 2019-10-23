/*!
 * modify-model v1.0.2
 * (c) 2018-2019 yuda-lyu(semisphere)
 * Released under the MIT License.
 */
!function(t,r){"object"==typeof exports&&"undefined"!=typeof module?module.exports=r(require("fs")):"function"==typeof define&&define.amd?define(["fs"],r):(t=t||self)["modify-model"]=r(t.fs)}(this,(function(t){"use strict";t=t&&t.hasOwnProperty("default")?t.default:t;var r=function(t,r){for(var n=-1,e=null==t?0:t.length;++n<e&&!1!==r(t[n],n,t););return t};var n=function(t){return function(r,n,e){for(var o=-1,u=Object(r),c=e(r),i=c.length;i--;){var f=c[t?i:++o];if(!1===n(u[f],f,u))break}return r}}();var e=function(t,r){for(var n=-1,e=Array(t);++n<t;)e[n]=r(n);return e};function o(t){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var u="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function c(t,r){return t(r={exports:{}},r.exports),r.exports}var i="object"==o(u)&&u&&u.Object===Object&&u,f="object"==("undefined"==typeof self?"undefined":o(self))&&self&&self.Object===Object&&self,a=i||f||Function("return this")(),l=a.Symbol,b=Object.prototype,y=b.hasOwnProperty,p=b.toString,s=l?l.toStringTag:void 0;var j=function(t){var r=y.call(t,s),n=t[s];try{t[s]=void 0;var e=!0}catch(t){}var o=p.call(t);return e&&(r?t[s]=n:delete t[s]),o},v=Object.prototype.toString;var d=function(t){return v.call(t)},g="[object Null]",O="[object Undefined]",m=l?l.toStringTag:void 0;var h=function(t){return null==t?void 0===t?O:g:m&&m in Object(t)?j(t):d(t)};var A=function(t){return null!=t&&"object"==o(t)},S="[object Arguments]";var x=function(t){return A(t)&&h(t)==S},w=Object.prototype,F=w.hasOwnProperty,T=w.propertyIsEnumerable,P=x(function(){return arguments}())?x:function(t){return A(t)&&F.call(t,"callee")&&!T.call(t,"callee")},U=Array.isArray;var B=function(){return!1},E=c((function(t,r){var n=r&&!r.nodeType&&r,e=n&&t&&!t.nodeType&&t,o=e&&e.exports===n?a.Buffer:void 0,u=(o?o.isBuffer:void 0)||B;t.exports=u})),I=9007199254740991,k=/^(?:0|[1-9]\d*)$/;var q=function(t,r){var n=o(t);return!!(r=null==r?I:r)&&("number"==n||"symbol"!=n&&k.test(t))&&t>-1&&t%1==0&&t<r},D=9007199254740991;var K=function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=D},M={};M["[object Float32Array]"]=M["[object Float64Array]"]=M["[object Int8Array]"]=M["[object Int16Array]"]=M["[object Int32Array]"]=M["[object Uint8Array]"]=M["[object Uint8ClampedArray]"]=M["[object Uint16Array]"]=M["[object Uint32Array]"]=!0,M["[object Arguments]"]=M["[object Array]"]=M["[object ArrayBuffer]"]=M["[object Boolean]"]=M["[object DataView]"]=M["[object Date]"]=M["[object Error]"]=M["[object Function]"]=M["[object Map]"]=M["[object Number]"]=M["[object Object]"]=M["[object RegExp]"]=M["[object Set]"]=M["[object String]"]=M["[object WeakMap]"]=!1;var N=function(t){return A(t)&&K(t.length)&&!!M[h(t)]};var R=function(t){return function(r){return t(r)}},C=c((function(t,r){var n=r&&!r.nodeType&&r,e=n&&t&&!t.nodeType&&t,o=e&&e.exports===n&&i.process,u=function(){try{var t=e&&e.require&&e.require("util").types;return t||o&&o.binding&&o.binding("util")}catch(t){}}();t.exports=u})),G=C&&C.isTypedArray,L=G?R(G):N,V=Object.prototype.hasOwnProperty;var W=function(t,r){var n=U(t),o=!n&&P(t),u=!n&&!o&&E(t),c=!n&&!o&&!u&&L(t),i=n||o||u||c,f=i?e(t.length,String):[],a=f.length;for(var l in t)!r&&!V.call(t,l)||i&&("length"==l||u&&("offset"==l||"parent"==l)||c&&("buffer"==l||"byteLength"==l||"byteOffset"==l)||q(l,a))||f.push(l);return f},$=Object.prototype;var z=function(t){var r=t&&t.constructor;return t===("function"==typeof r&&r.prototype||$)};var H=function(t,r){return function(n){return t(r(n))}}(Object.keys,Object),J=Object.prototype.hasOwnProperty;var Q=function(t){if(!z(t))return H(t);var r=[];for(var n in Object(t))J.call(t,n)&&"constructor"!=n&&r.push(n);return r};var X=function(t){var r=o(t);return null!=t&&("object"==r||"function"==r)},Y="[object AsyncFunction]",Z="[object Function]",_="[object GeneratorFunction]",tt="[object Proxy]";var rt=function(t){if(!X(t))return!1;var r=h(t);return r==Z||r==_||r==Y||r==tt};var nt=function(t){return null!=t&&K(t.length)&&!rt(t)};var et=function(t){return nt(t)?W(t):Q(t)};var ot=function(t,r){return function(n,e){if(null==n)return n;if(!nt(n))return t(n,e);for(var o=n.length,u=r?o:-1,c=Object(n);(r?u--:++u<o)&&!1!==e(c[u],u,c););return n}}((function(t,r){return t&&n(t,r,et)}));var ut=function(t){return t};var ct=function(t){return"function"==typeof t?t:ut};var it=function(t,n){return(U(t)?r:ot)(t,ct(n))},ft=Array.prototype.join;var at=function(t,r){return null==t?"":ft.call(t,r)};function lt(t){return!(!function(t){return"[object String]"===Object.prototype.toString.call(t)}(t)||""===t)}function bt(t,r){if(!lt(t))return[];if(!lt(r))return[];var n=function(t,r){return lt(t)&&lt(r)?t.split(r):[]}(t,r),e=[];return it(n,(function(t){lt(t)&&e.push(t)})),e}return function(r){var n=t.readFileSync(r,"utf8"),e=new RegExp("define[\\s\\S]+}, {","g"),o=bt(n.match(e)[0],"\n"),u=null,c=null,i=!1;it(o,(function(t,r){"    id: {"===t&&(u=r),null!==u&&null===c&&t.indexOf("primaryKey: true")>=0&&(i=!0),null!==u&&t.indexOf("    }")>=0&&(c=r)})),null===u||i||(o[u]+="primaryKey: true",u+2<c&&(o[u]+=","),console.log("modify:",r));var f=at(o,"\n"),a=n.replace(e,f);t.writeFileSync(r,a,"utf8")}}));
//# sourceMappingURL=modify-model.umd.js.map
