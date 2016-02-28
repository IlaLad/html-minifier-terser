!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,e.RelateUrl=t()}}(function(){var t;return function e(t,r,n){function o(a,i){if(!r[a]){if(!t[a]){var u="function"==typeof require&&require;if(!i&&u)return u(a,!0);if(s)return s(a,!0);var h=new Error("Cannot find module '"+a+"'");throw h.code="MODULE_NOT_FOUND",h}var l=r[a]={exports:{}};t[a][0].call(l.exports,function(e){var r=t[a][1][e];return o(r?r:e)},l,l.exports,e,t,r,n)}return r[a].exports}for(var s="function"==typeof require&&require,a=0;a<n.length;a++)o(n[a]);return o}({1:[function(e,r,n){(function(e){!function(o){function s(t){throw new RangeError(H[t])}function a(t,e){for(var r=t.length,n=[];r--;)n[r]=e(t[r]);return n}function i(t,e){var r=t.split("@"),n="";r.length>1&&(n=r[0]+"@",t=r[1]),t=t.replace(C,".");var o=t.split("."),s=a(o,e).join(".");return n+s}function u(t){for(var e,r,n=[],o=0,s=t.length;s>o;)e=t.charCodeAt(o++),e>=55296&&56319>=e&&s>o?(r=t.charCodeAt(o++),56320==(64512&r)?n.push(((1023&e)<<10)+(1023&r)+65536):(n.push(e),o--)):n.push(e);return n}function h(t){return a(t,function(t){var e="";return t>65535&&(t-=65536,e+=D(t>>>10&1023|55296),t=56320|1023&t),e+=D(t)}).join("")}function l(t){return 10>t-48?t-22:26>t-65?t-65:26>t-97?t-97:j}function c(t,e){return t+22+75*(26>t)-((0!=e)<<5)}function f(t,e,r){var n=0;for(t=r?Q(t/E):t>>1,t+=Q(t/e);t>L*A>>1;n+=j)t=Q(t/L);return Q(n+(L+1)*t/(t+R))}function m(t){var e,r,n,o,a,i,u,c,m,p,v=[],x=t.length,y=0,d=q,g=S;for(r=t.lastIndexOf(P),0>r&&(r=0),n=0;r>n;++n)t.charCodeAt(n)>=128&&s("not-basic"),v.push(t.charCodeAt(n));for(o=r>0?r+1:0;x>o;){for(a=y,i=1,u=j;o>=x&&s("invalid-input"),c=l(t.charCodeAt(o++)),(c>=j||c>Q((I-y)/i))&&s("overflow"),y+=c*i,m=g>=u?w:u>=g+A?A:u-g,!(m>c);u+=j)p=j-m,i>Q(I/p)&&s("overflow"),i*=p;e=v.length+1,g=f(y-a,e,0==a),Q(y/e)>I-d&&s("overflow"),d+=Q(y/e),y%=e,v.splice(y++,0,d)}return h(v)}function p(t){var e,r,n,o,a,i,h,l,m,p,v,x,y,d,g,b=[];for(t=u(t),x=t.length,e=q,r=0,a=S,i=0;x>i;++i)v=t[i],128>v&&b.push(D(v));for(n=o=b.length,o&&b.push(P);x>n;){for(h=I,i=0;x>i;++i)v=t[i],v>=e&&h>v&&(h=v);for(y=n+1,h-e>Q((I-r)/y)&&s("overflow"),r+=(h-e)*y,e=h,i=0;x>i;++i)if(v=t[i],e>v&&++r>I&&s("overflow"),v==e){for(l=r,m=j;p=a>=m?w:m>=a+A?A:m-a,!(p>l);m+=j)g=l-p,d=j-p,b.push(D(c(p+g%d,0))),l=Q(g/d);b.push(D(c(l,0))),a=f(r,y,n==o),r=0,++n}++r,++e}return b.join("")}function v(t){return i(t,function(t){return T.test(t)?m(t.slice(4).toLowerCase()):t})}function x(t){return i(t,function(t){return U.test(t)?"xn--"+p(t):t})}var y="object"==typeof n&&n&&!n.nodeType&&n,d="object"==typeof r&&r&&!r.nodeType&&r,g="object"==typeof e&&e;g.global!==g&&g.window!==g&&g.self!==g||(o=g);var b,O,I=2147483647,j=36,w=1,A=26,R=38,E=700,S=72,q=128,P="-",T=/^xn--/,U=/[^\x20-\x7E]/,C=/[\x2E\u3002\uFF0E\uFF61]/g,H={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},L=j-w,Q=Math.floor,D=String.fromCharCode;if(b={version:"1.3.2",ucs2:{decode:u,encode:h},decode:m,encode:p,toASCII:x,toUnicode:v},"function"==typeof t&&"object"==typeof t.amd&&t.amd)t("punycode",function(){return b});else if(y&&d)if(r.exports==y)d.exports=b;else for(O in b)b.hasOwnProperty(O)&&(y[O]=b[O]);else o.punycode=b}(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],2:[function(t,e,r){"use strict";function n(t,e){return Object.prototype.hasOwnProperty.call(t,e)}e.exports=function(t,e,r,s){e=e||"&",r=r||"=";var a={};if("string"!=typeof t||0===t.length)return a;var i=/\+/g;t=t.split(e);var u=1e3;s&&"number"==typeof s.maxKeys&&(u=s.maxKeys);var h=t.length;u>0&&h>u&&(h=u);for(var l=0;h>l;++l){var c,f,m,p,v=t[l].replace(i,"%20"),x=v.indexOf(r);x>=0?(c=v.substr(0,x),f=v.substr(x+1)):(c=v,f=""),m=decodeURIComponent(c),p=decodeURIComponent(f),n(a,m)?o(a[m])?a[m].push(p):a[m]=[a[m],p]:a[m]=p}return a};var o=Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)}},{}],3:[function(t,e,r){"use strict";function n(t,e){if(t.map)return t.map(e);for(var r=[],n=0;n<t.length;n++)r.push(e(t[n],n));return r}var o=function(t){switch(typeof t){case"string":return t;case"boolean":return t?"true":"false";case"number":return isFinite(t)?t:"";default:return""}};e.exports=function(t,e,r,i){return e=e||"&",r=r||"=",null===t&&(t=void 0),"object"==typeof t?n(a(t),function(a){var i=encodeURIComponent(o(a))+r;return s(t[a])?n(t[a],function(t){return i+encodeURIComponent(o(t))}).join(e):i+encodeURIComponent(o(t[a]))}).join(e):i?encodeURIComponent(o(i))+r+encodeURIComponent(o(t)):""};var s=Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)},a=Object.keys||function(t){var e=[];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.push(r);return e}},{}],4:[function(t,e,r){"use strict";r.decode=r.parse=t("./decode"),r.encode=r.stringify=t("./encode")},{"./decode":2,"./encode":3}],5:[function(t,e,r){"use strict";e.exports={ABSOLUTE:"absolute",PATH_RELATIVE:"pathRelative",ROOT_RELATIVE:"rootRelative",SHORTEST:"shortest"}},{}],6:[function(t,e,r){"use strict";function n(t,e){return!t.auth||e.removeAuth||!t.extra.relation.maximumHost&&e.output!==v.ABSOLUTE?"":t.auth+"@"}function o(t,e){return t.hash?t.hash:""}function s(t,e){return t.host.full&&(t.extra.relation.maximumAuth||e.output===v.ABSOLUTE)?t.host.full:""}function a(t,e){var r="",n=t.path.absolute.string,o=t.path.relative.string,s=p(t,e);if(t.extra.relation.maximumHost||e.output===v.ABSOLUTE||e.output===v.ROOT_RELATIVE)r=n;else if(o.length<=n.length&&e.output===v.SHORTEST||e.output===v.PATH_RELATIVE){if(r=o,""===r){var a=m(t,e)&&!!f(t,e);t.extra.relation.maximumPath&&!s?r="./":!t.extra.relation.overridesQuery||s||a||(r="./")}}else r=n;return"/"!==r||s||!e.removeRootTrailingSlash||t.extra.relation.minimumPort&&e.output!==v.ABSOLUTE||(r=""),r}function i(t,e){return t.port&&!t.extra.portIsDefault&&t.extra.relation.maximumHost?":"+t.port:""}function u(t,e){return m(t,e)?f(t,e):""}function h(t,e){return p(t,e)?t.resource:""}function l(t,e){var r="";return(t.extra.relation.maximumHost||e.output===v.ABSOLUTE)&&(r+=t.extra.relation.minimumScheme&&e.schemeRelative&&e.output!==v.ABSOLUTE?"//":t.scheme+"://"),r}function c(t,e){var r="";return r+=l(t,e),r+=n(t,e),r+=s(t,e),r+=i(t,e),r+=a(t,e),r+=h(t,e),r+=u(t,e),r+=o(t,e)}function f(t,e){var r=e.removeEmptyQueries&&t.extra.relation.minimumPort;return t.query.string[r?"stripped":"full"]}function m(t,e){return!t.extra.relation.minimumQuery||e.output===v.ABSOLUTE||e.output===v.ROOT_RELATIVE}function p(t,e){var r=e.removeDirectoryIndexes&&t.extra.resourceIsIndex,n=t.extra.relation.minimumResource&&e.output!==v.ABSOLUTE&&e.output!==v.ROOT_RELATIVE;return!!t.resource&&!n&&!r}var v=t("./constants");e.exports=c},{"./constants":5}],7:[function(t,e,r){"use strict";function n(t,e){if(s.isPlainObject(t)){var r={};for(var n in e)e.hasOwnProperty(n)&&(void 0!==t[n]?r[n]=o(t[n],e[n]):r[n]=e[n]);return r}return e}function o(t,e){return e instanceof Object&&t instanceof Object?e instanceof Array&&t instanceof Array?e.concat(t):s.shallowMerge(t,e):t}var s=t("./util/object");e.exports=n},{"./util/object":19}],8:[function(t,e,r){"use strict";function n(t,e){if(e.ignore_www){var r=t.host.full;if(r){var n=r;0===r.indexOf("www.")&&(n=r.substr(4)),t.host.stripped=n}}}e.exports=n},{}],9:[function(t,e,r){"use strict";function n(t){var e=!(t.scheme||t.auth||t.host.full||t.port),r=e&&!t.path.absolute.string,n=r&&!t.resource,o=n&&!t.query.string.full.length,s=o&&!t.hash;t.extra.hrefInfo.minimumPathOnly=e,t.extra.hrefInfo.minimumResourceOnly=r,t.extra.hrefInfo.minimumQueryOnly=n,t.extra.hrefInfo.minimumHashOnly=o,t.extra.hrefInfo.empty=s}e.exports=n},{}],10:[function(t,e,r){"use strict";function n(t,e,r){if(t){var n=o(t,e),s=c.resolveDotSegments(n.path.absolute.array);return n.path.absolute.array=s,n.path.absolute.string="/"+c.join(s),n}return r}function o(t,e){var r=l(t,e);return r.valid===!1?r:(a(r,e),u(r,e),i(r,e),h(r,e),s(r),r)}var s=t("./hrefInfo"),a=t("./host"),i=t("./path"),u=t("./port"),h=t("./query"),l=t("./urlstring"),c=t("../util/path");e.exports={from:n,to:o}},{"../util/path":20,"./host":8,"./hrefInfo":9,"./path":11,"./port":12,"./query":13,"./urlstring":14}],11:[function(t,e,r){"use strict";function n(t,e){var r=!1;return e.directoryIndexes.every(function(e){return e===t?(r=!0,!1):!0}),r}function o(t,e){var r=t.path.absolute.string;if(r){var o=r.lastIndexOf("/");if(o>-1){if(++o<r.length){var a=r.substr(o);"."!==a&&".."!==a?(t.resource=a,r=r.substr(0,o)):r+="/"}t.path.absolute.string=r,t.path.absolute.array=s(r)}else"."===r||".."===r?(r+="/",t.path.absolute.string=r,t.path.absolute.array=s(r)):(t.resource=r,t.path.absolute.string=null);t.extra.resourceIsIndex=n(t.resource,e)}}function s(t){if("/"!==t){var e=[];return t.split("/").forEach(function(t){""!==t&&e.push(t)}),e}return[]}e.exports=o},{}],12:[function(t,e,r){"use strict";function n(t,e){var r=-1;for(var n in e.defaultPorts)if(n===t.scheme&&e.defaultPorts.hasOwnProperty(n)){r=e.defaultPorts[n];break}r>-1&&(r=r.toString(),null===t.port&&(t.port=r),t.extra.portIsDefault=t.port===r)}e.exports=n},{}],13:[function(t,e,r){"use strict";function n(t,e){t.query.string.full=o(t.query.object,!1),e.removeEmptyQueries&&(t.query.string.stripped=o(t.query.object,!0))}function o(t,e){var r=0,n="";for(var o in t)if(""!==o&&t.hasOwnProperty(o)){var s=t[o];""===s&&e||(n+=1===++r?"?":"&",o=encodeURIComponent(o),n+=""!==s?o+"="+encodeURIComponent(s).replace(/%20/g,"+"):o)}return n}e.exports=n},{}],14:[function(t,e,r){"use strict";function n(t){var e=t.protocol;return e&&e.indexOf(":")===e.length-1&&(e=e.substr(0,e.length-1)),t.host={full:t.hostname,stripped:null},t.path={absolute:{array:null,string:t.pathname},relative:{array:null,string:null}},t.query={object:t.query,string:{full:null,stripped:null}},t.extra={hrefInfo:{minimumPathOnly:null,minimumResourceOnly:null,minimumQueryOnly:null,minimumHashOnly:null,empty:null,separatorOnlyQuery:"?"===t.search},portIsDefault:null,relation:{maximumScheme:null,maximumAuth:null,maximumHost:null,maximumPort:null,maximumPath:null,maximumResource:null,maximumQuery:null,maximumHash:null,minimumScheme:null,minimumAuth:null,minimumHost:null,minimumPort:null,minimumPath:null,minimumResource:null,minimumQuery:null,minimumHash:null,overridesQuery:null},resourceIsIndex:null,slashes:t.slashes},t.resource=null,t.scheme=e,delete t.hostname,delete t.pathname,delete t.protocol,delete t.search,delete t.slashes,t}function o(t,e){var r=!0;return e.rejectedSchemes.every(function(e){return r=!(0===t.indexOf(e+":"))}),r}function s(t,e){return o(t,e)?n(a(t,!0,e.slashesDenoteHost)):{href:t,valid:!1}}var a=t("url").parse;e.exports=s},{url:22}],15:[function(t,e,r){"use strict";function n(t,e,r){i.upToPath(t,e,r),t.extra.relation.minimumScheme&&(t.scheme=e.scheme),t.extra.relation.minimumAuth&&(t.auth=e.auth),t.extra.relation.minimumHost&&(t.host=u.clone(e.host)),t.extra.relation.minimumPort&&s(t,e),t.extra.relation.minimumScheme&&o(t,e),i.pathOn(t,e,r),t.extra.relation.minimumResource&&a(t,e),t.extra.relation.minimumQuery&&(t.query=u.clone(e.query)),t.extra.relation.minimumHash&&(t.hash=e.hash)}function o(t,e){if(t.extra.relation.maximumHost||!t.extra.hrefInfo.minimumResourceOnly){var r=t.path.absolute.array,n="/";r?(t.extra.hrefInfo.minimumPathOnly&&0!==t.path.absolute.string.indexOf("/")&&(r=e.path.absolute.array.concat(r)),r=h.resolveDotSegments(r),n+=h.join(r)):r=[],t.path.absolute.array=r,t.path.absolute.string=n}else t.path=u.clone(e.path)}function s(t,e){t.port=e.port,t.extra.portIsDefault=e.extra.portIsDefault}function a(t,e){t.resource=e.resource,t.extra.resourceIsIndex=e.extra.resourceIsIndex}var i=t("./findRelation"),u=t("../util/object"),h=t("../util/path");e.exports=n},{"../util/object":19,"../util/path":20,"./findRelation":16}],16:[function(t,e,r){"use strict";function n(t,e,r){var n=t.extra.hrefInfo.minimumPathOnly,o=t.scheme===e.scheme||!t.scheme,s=o&&(t.auth===e.auth||r.removeAuth||n),a=r.ignore_www?"stripped":"full",i=s&&(t.host[a]===e.host[a]||n),u=i&&(t.port===e.port||n);t.extra.relation.minimumScheme=o,t.extra.relation.minimumAuth=s,t.extra.relation.minimumHost=i,t.extra.relation.minimumPort=u,t.extra.relation.maximumScheme=!o||o&&!s,t.extra.relation.maximumAuth=!o||o&&!i,t.extra.relation.maximumHost=!o||o&&!u}function o(t,e,r){var n=t.extra.hrefInfo.minimumQueryOnly,o=t.extra.hrefInfo.minimumHashOnly,s=t.extra.hrefInfo.empty,a=t.extra.relation.minimumPort,i=t.extra.relation.minimumScheme,u=a&&t.path.absolute.string===e.path.absolute.string,h=t.resource===e.resource||!t.resource&&e.extra.resourceIsIndex||r.removeDirectoryIndexes&&t.extra.resourceIsIndex&&!e.resource,l=u&&(h||n||o||s),c=r.removeEmptyQueries?"stripped":"full",f=t.query.string[c],m=e.query.string[c],p=l&&!!f&&f===m||(o||s)&&!t.extra.hrefInfo.separatorOnlyQuery,v=p&&t.hash===e.hash;t.extra.relation.minimumPath=u,t.extra.relation.minimumResource=l,t.extra.relation.minimumQuery=p,t.extra.relation.minimumHash=v,t.extra.relation.maximumPort=!i||i&&!u,t.extra.relation.maximumPath=!i||i&&!l,t.extra.relation.maximumResource=!i||i&&!p,t.extra.relation.maximumQuery=!i||i&&!v,t.extra.relation.maximumHash=!i||i&&!v,t.extra.relation.overridesQuery=u&&t.extra.relation.maximumResource&&!p&&!!m}e.exports={pathOn:o,upToPath:n}},{}],17:[function(t,e,r){"use strict";function n(t,e,r){return o(e,t,r),s(e,t,r),e}var o=t("./absolutize"),s=t("./relativize");e.exports=n},{"./absolutize":15,"./relativize":18}],18:[function(t,e,r){"use strict";function n(t,e){var r=[],n=!0,o=-1;return e.forEach(function(e,s){n&&(t[s]!==e?n=!1:o=s),n||r.push("..")}),t.forEach(function(t,e){e>o&&r.push(t)}),r}function o(t,e,r){if(t.extra.relation.minimumScheme){var o=n(t.path.absolute.array,e.path.absolute.array);t.path.relative.array=o,t.path.relative.string=s.join(o)}}var s=t("../util/path");e.exports=o},{"../util/path":20}],19:[function(t,e,r){"use strict";function n(t){if(t instanceof Object){var e=t instanceof Array?[]:{};for(var r in t)t.hasOwnProperty(r)&&(e[r]=n(t[r]));return e}return t}function o(t){return!!t&&"object"==typeof t&&t.constructor===Object}function s(t,e){if(t instanceof Object&&e instanceof Object)for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r]);return t}e.exports={clone:n,isPlainObject:o,shallowMerge:s}},{}],20:[function(t,e,r){"use strict";function n(t){return t.length?t.join("/")+"/":""}function o(t){var e=[];return t.forEach(function(t){".."!==t?"."!==t&&e.push(t):e.length&&e.splice(e.length-1,1)}),e}e.exports={join:n,resolveDotSegments:o}},{}],21:[function(t,e,r){"use strict";function n(t,e){this.options=a(e,{defaultPorts:{ftp:21,http:80,https:443},directoryIndexes:["index.html"],ignore_www:!1,output:n.SHORTEST,rejectedSchemes:["data","javascript","mailto"],removeAuth:!1,removeDirectoryIndexes:!0,removeEmptyQueries:!1,removeRootTrailingSlash:!0,schemeRelative:!0,site:void 0,slashesDenoteHost:!0}),this.from=u.from(t,this.options,null)}var o=t("./constants"),s=t("./format"),a=t("./options"),i=t("./util/object"),u=t("./parse"),h=t("./relate");n.prototype.relate=function(t,e,r){if(i.isPlainObject(e)?(r=e,e=t,t=null):e||(e=t,t=null),r=a(r,this.options),t=t||r.site,t=u.from(t,r,this.from),!t||!t.href)throw new Error("from value not defined.");if(t.extra.hrefInfo.minimumPathOnly)throw new Error("from value supplied is not absolute: "+t.href);return e=u.to(e,r),e.valid===!1?e.href:(e=h(t,e,r),e=s(e,r))},n.relate=function(t,e,r){return(new n).relate(t,e,r)},i.shallowMerge(n,o),e.exports=n},{"./constants":5,"./format":6,"./options":7,"./parse":10,"./relate":17,"./util/object":19}],22:[function(t,e,r){"use strict";function n(){this.protocol=null,this.slashes=null,this.auth=null,this.host=null,this.port=null,this.hostname=null,this.hash=null,this.search=null,this.query=null,this.pathname=null,this.path=null,this.href=null}function o(t,e,r){if(t&&h.isObject(t)&&t instanceof n)return t;var o=new n;return o.parse(t,e,r),o}function s(t){return h.isString(t)&&(t=o(t)),t instanceof n?t.format():n.prototype.format.call(t)}function a(t,e){return o(t,!1,!0).resolve(e)}function i(t,e){return t?o(t,!1,!0).resolveObject(e):e}var u=t("punycode"),h=t("./util");r.parse=o,r.resolve=a,r.resolveObject=i,r.format=s,r.Url=n;var l=/^([a-z0-9.+-]+:)/i,c=/:[0-9]*$/,f=/^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,m=["<",">",'"',"`"," ","\r","\n","	"],p=["{","}","|","\\","^","`"].concat(m),v=["'"].concat(p),x=["%","/","?",";","#"].concat(v),y=["/","?","#"],d=255,g=/^[+a-z0-9A-Z_-]{0,63}$/,b=/^([+a-z0-9A-Z_-]{0,63})(.*)$/,O={javascript:!0,"javascript:":!0},I={javascript:!0,"javascript:":!0},j={http:!0,https:!0,ftp:!0,gopher:!0,file:!0,"http:":!0,"https:":!0,"ftp:":!0,"gopher:":!0,"file:":!0},w=t("querystring");n.prototype.parse=function(t,e,r){if(!h.isString(t))throw new TypeError("Parameter 'url' must be a string, not "+typeof t);var n=t.indexOf("?"),o=-1!==n&&n<t.indexOf("#")?"?":"#",s=t.split(o),a=/\\/g;s[0]=s[0].replace(a,"/"),t=s.join(o);var i=t;if(i=i.trim(),!r&&1===t.split("#").length){var c=f.exec(i);if(c)return this.path=i,this.href=i,this.pathname=c[1],c[2]?(this.search=c[2],e?this.query=w.parse(this.search.substr(1)):this.query=this.search.substr(1)):e&&(this.search="",this.query={}),this}var m=l.exec(i);if(m){m=m[0];var p=m.toLowerCase();this.protocol=p,i=i.substr(m.length)}if(r||m||i.match(/^\/\/[^@\/]+@[^@\/]+/)){var A="//"===i.substr(0,2);!A||m&&I[m]||(i=i.substr(2),this.slashes=!0)}if(!I[m]&&(A||m&&!j[m])){for(var R=-1,E=0;E<y.length;E++){var S=i.indexOf(y[E]);-1!==S&&(-1===R||R>S)&&(R=S)}var q,P;P=-1===R?i.lastIndexOf("@"):i.lastIndexOf("@",R),-1!==P&&(q=i.slice(0,P),i=i.slice(P+1),this.auth=decodeURIComponent(q)),R=-1;for(var E=0;E<x.length;E++){var S=i.indexOf(x[E]);-1!==S&&(-1===R||R>S)&&(R=S)}-1===R&&(R=i.length),this.host=i.slice(0,R),i=i.slice(R),this.parseHost(),this.hostname=this.hostname||"";var T="["===this.hostname[0]&&"]"===this.hostname[this.hostname.length-1];if(!T)for(var U=this.hostname.split(/\./),E=0,C=U.length;C>E;E++){var H=U[E];if(H&&!H.match(g)){for(var L="",Q=0,D=H.length;D>Q;Q++)L+=H.charCodeAt(Q)>127?"x":H[Q];if(!L.match(g)){var _=U.slice(0,E),B=U.slice(E+1),N=H.match(b);N&&(_.push(N[1]),B.unshift(N[2])),B.length&&(i="/"+B.join(".")+i),this.hostname=_.join(".");break}}}this.hostname.length>d?this.hostname="":this.hostname=this.hostname.toLowerCase(),T||(this.hostname=u.toASCII(this.hostname));var k=this.port?":"+this.port:"",z=this.hostname||"";this.host=z+k,this.href+=this.host,T&&(this.hostname=this.hostname.substr(1,this.hostname.length-2),"/"!==i[0]&&(i="/"+i))}if(!O[p])for(var E=0,C=v.length;C>E;E++){var F=v[E];if(-1!==i.indexOf(F)){var V=encodeURIComponent(F);V===F&&(V=escape(F)),i=i.split(F).join(V)}}var M=i.indexOf("#");-1!==M&&(this.hash=i.substr(M),i=i.slice(0,M));var $=i.indexOf("?");if(-1!==$?(this.search=i.substr($),this.query=i.substr($+1),e&&(this.query=w.parse(this.query)),i=i.slice(0,$)):e&&(this.search="",this.query={}),i&&(this.pathname=i),j[p]&&this.hostname&&!this.pathname&&(this.pathname="/"),this.pathname||this.search){var k=this.pathname||"",K=this.search||"";this.path=k+K}return this.href=this.format(),this},n.prototype.format=function(){var t=this.auth||"";t&&(t=encodeURIComponent(t),t=t.replace(/%3A/i,":"),t+="@");var e=this.protocol||"",r=this.pathname||"",n=this.hash||"",o=!1,s="";this.host?o=t+this.host:this.hostname&&(o=t+(-1===this.hostname.indexOf(":")?this.hostname:"["+this.hostname+"]"),this.port&&(o+=":"+this.port)),this.query&&h.isObject(this.query)&&Object.keys(this.query).length&&(s=w.stringify(this.query));var a=this.search||s&&"?"+s||"";return e&&":"!==e.substr(-1)&&(e+=":"),this.slashes||(!e||j[e])&&o!==!1?(o="//"+(o||""),r&&"/"!==r.charAt(0)&&(r="/"+r)):o||(o=""),n&&"#"!==n.charAt(0)&&(n="#"+n),a&&"?"!==a.charAt(0)&&(a="?"+a),r=r.replace(/[?#]/g,function(t){return encodeURIComponent(t)}),a=a.replace("#","%23"),e+o+r+a+n},n.prototype.resolve=function(t){return this.resolveObject(o(t,!1,!0)).format()},n.prototype.resolveObject=function(t){if(h.isString(t)){var e=new n;e.parse(t,!1,!0),t=e}for(var r=new n,o=Object.keys(this),s=0;s<o.length;s++){var a=o[s];r[a]=this[a]}if(r.hash=t.hash,""===t.href)return r.href=r.format(),r;if(t.slashes&&!t.protocol){for(var i=Object.keys(t),u=0;u<i.length;u++){var l=i[u];"protocol"!==l&&(r[l]=t[l])}return j[r.protocol]&&r.hostname&&!r.pathname&&(r.path=r.pathname="/"),r.href=r.format(),r}if(t.protocol&&t.protocol!==r.protocol){if(!j[t.protocol]){for(var c=Object.keys(t),f=0;f<c.length;f++){var m=c[f];r[m]=t[m]}return r.href=r.format(),r}if(r.protocol=t.protocol,t.host||I[t.protocol])r.pathname=t.pathname;else{for(var p=(t.pathname||"").split("/");p.length&&!(t.host=p.shift()););t.host||(t.host=""),t.hostname||(t.hostname=""),""!==p[0]&&p.unshift(""),p.length<2&&p.unshift(""),r.pathname=p.join("/")}if(r.search=t.search,r.query=t.query,r.host=t.host||"",r.auth=t.auth,r.hostname=t.hostname||t.host,r.port=t.port,r.pathname||r.search){var v=r.pathname||"",x=r.search||"";r.path=v+x}return r.slashes=r.slashes||t.slashes,r.href=r.format(),r}var y=r.pathname&&"/"===r.pathname.charAt(0),d=t.host||t.pathname&&"/"===t.pathname.charAt(0),g=d||y||r.host&&t.pathname,b=g,O=r.pathname&&r.pathname.split("/")||[],p=t.pathname&&t.pathname.split("/")||[],w=r.protocol&&!j[r.protocol];if(w&&(r.hostname="",r.port=null,r.host&&(""===O[0]?O[0]=r.host:O.unshift(r.host)),r.host="",t.protocol&&(t.hostname=null,t.port=null,t.host&&(""===p[0]?p[0]=t.host:p.unshift(t.host)),t.host=null),g=g&&(""===p[0]||""===O[0])),d)r.host=t.host||""===t.host?t.host:r.host,r.hostname=t.hostname||""===t.hostname?t.hostname:r.hostname,r.search=t.search,r.query=t.query,O=p;else if(p.length)O||(O=[]),O.pop(),O=O.concat(p),r.search=t.search,r.query=t.query;else if(!h.isNullOrUndefined(t.search)){if(w){r.hostname=r.host=O.shift();var A=r.host&&r.host.indexOf("@")>0?r.host.split("@"):!1;A&&(r.auth=A.shift(),r.host=r.hostname=A.shift())}return r.search=t.search,r.query=t.query,h.isNull(r.pathname)&&h.isNull(r.search)||(r.path=(r.pathname?r.pathname:"")+(r.search?r.search:"")),r.href=r.format(),r}if(!O.length)return r.pathname=null,r.search?r.path="/"+r.search:r.path=null,r.href=r.format(),r;for(var R=O.slice(-1)[0],E=(r.host||t.host||O.length>1)&&("."===R||".."===R)||""===R,S=0,q=O.length;q>=0;q--)R=O[q],"."===R?O.splice(q,1):".."===R?(O.splice(q,1),S++):S&&(O.splice(q,1),S--);if(!g&&!b)for(;S--;S)O.unshift("..");!g||""===O[0]||O[0]&&"/"===O[0].charAt(0)||O.unshift(""),E&&"/"!==O.join("/").substr(-1)&&O.push("");var P=""===O[0]||O[0]&&"/"===O[0].charAt(0);if(w){r.hostname=r.host=P?"":O.length?O.shift():"";var A=r.host&&r.host.indexOf("@")>0?r.host.split("@"):!1;A&&(r.auth=A.shift(),r.host=r.hostname=A.shift())}return g=g||r.host&&O.length,g&&!P&&O.unshift(""),O.length?r.pathname=O.join("/"):(r.pathname=null,r.path=null),h.isNull(r.pathname)&&h.isNull(r.search)||(r.path=(r.pathname?r.pathname:"")+(r.search?r.search:"")),r.auth=t.auth||r.auth,r.slashes=r.slashes||t.slashes,r.href=r.format(),r},n.prototype.parseHost=function(){var t=this.host,e=c.exec(t);e&&(e=e[0],":"!==e&&(this.port=e.substr(1)),t=t.substr(0,t.length-e.length)),t&&(this.hostname=t)}},{"./util":23,punycode:1,querystring:4}],23:[function(t,e,r){"use strict";e.exports={isString:function(t){return"string"==typeof t},isObject:function(t){return"object"==typeof t&&null!==t},isNull:function(t){return null===t},isNullOrUndefined:function(t){return null==t}}},{}]},{},[21])(21)});