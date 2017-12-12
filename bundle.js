/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const cp = __webpack_require__(1);
const cs = __webpack_require__(2);
const {el, mount, on, getel} = __webpack_require__(3);

on(window, "load", () => {

    console.log("page loaded!");

    const canvas = el("canvas#canvas", {width: 400, height: 400});
    mount(getel("#app"), canvas);
    const coSt = new cs(canvas);
    let c = cp.hsvToRgb({h: 128, s: 255, v: 255});
    console.log(c);
    for(let i = 0; i < 100; i++) {
        for(let j = 0; j < 100; j++) {
            coSt.setColor({
                x: i + 100, y: j + 100, r: c.r, g: c.g, b: c.b, a: 255
            });
        }
    }
    coSt.render();

});

/***/ }),
/* 1 */
/***/ (function(module, exports) {

exports.rgbToHsv = function(rgb) {
  let r = rgb.r;
  let g = rgb.g;
  let b = rgb.b;
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h;
  if(r == g && g == b) h = 0;
  else if(max == r){
      h = 60 * ((g - b) / (max - min));
  }else if(max == g){
      h = 60 * ((b - r) / (max - min)) + 120;
  }else{
      h = 60 * ((r - g) / (max - min)) + 240;
  }
  if(h < 0) h += 360;
  return {
    h: h / 360 * 255,
    s: (max - min) / max * 255,
    v: max
  }
};
exports.hsvToRgb = function(hsv){
  let h = hsv.h / 255 * 360;
  let s = hsv.s;
  let v = hsv.v;
  let max = v;
  let min = max - ((s / 255) * max);
  let r, g, b;
  if(h <= 60){
    r = max;
    g = (h / 60) * (max - min) + min;
    b = min;
  }else if(h <= 120){
    r = ((120 - h) / 60) * (max - min) + min;
    g = max;
    b = min;
  }else if(h <= 180){
    r = min;
    g = max;
    b = ((h - 120) / 60) * (max - min) + min;
  }else if(h <= 240){
    r = min;
    g = ((240 - h) / 60) * (max - min) + min;
    b = max;
  }else if(h <= 300){
    r = ((h - 240) / 60) * (max - min) + min;
    g = min;
    b = max;
  }else{
    r = max;
    g = min;
    b = ((360 - h) / 60) * (max - min) + min;
  }
  return {
    r,
    g,
    b
  };
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

function colorSetter(canvas) {
    this.ctx = canvas.getContext("2d");
    this.idt = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
    this.data = this.idt.data;
    this.width = this.idt.width;
    this.height = this.idt.height;
};
colorSetter.prototype.setColor = function(prop) {
    let idx = (prop.y * this.height + prop.x) * 4;
    this.data[idx] = prop.r || 0;
    this.data[idx + 1] = prop.g || 0;
    this.data[idx + 2] = prop.b || 0;
    this.data[idx + 3] = prop.a || 255;
};
colorSetter.prototype.render = function() {
    this.ctx.putImageData(this.idt, 0, 0);
}
module.exports = colorSetter;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = {
    el: (key, ...args) => {
        key = (key || "").toString();
        let res = [[], [], []],
            begin = 0, mode = 0, c = 0;
        for (c = 0; c < key.length; c += 1) {
            if (key[c] == "#" || key[c] == ".") {
                res[mode].push(key.substring(begin, c));
                begin = c + 1;
                mode = key[c] == "#" ? 1 : 2;
            }
        }
        res[mode].push(key.substring(begin, c));
        let e = document.createElement(res[0][0] || "div");
        if (res[1].length > 0) e.id = res[1][0];
        if (res[2].length > 0) e.className = res[2].join(" ");
        Array.from(args).forEach(item => {
            if (typeof item == "object") {
                if (item instanceof Node) {
                    e.appendChild(item);
                } else {
                    for (var p in item) {
                        if (p === "style") {
                            if (typeof item[p] == "string") {
                                e.style = item[p];
                            } else if (typeof item[p] == "object") {
                                var rule = "";
                                for (var r in item[p]) {
                                    rule += r + ":" + item[p][r] + ";";
                                }
                                e.style = rule;
                            }
                        } else if (p === "on" && typeof item[p] == "object") {
                            for (var o in item[p]) {
                                e.addEventListener(o, item[p][o]);
                            }
                        } else {
                            e.setAttribute(p, item[p]);
                        }
                    }
                }
            } else if (typeof item == "string") {
                e.innerHTML += item;
            } else if (typeof item == "function") {
                item(e);
            }
        });
        return e;
    },
    html: str => {
        let temp = document.createElement("div");
        temp.innerHTML = str;
        return temp.firstChild;
    },
    text: str => document.createTextNode(str),
    on: (elm, evt, cb) => elm.addEventListener(evt, cb),
    off: (elm, evt, cb) => elm.removeEventListener(evt, cb),
    mount: (parent, child) => parent.appendChild(child),
    inmount: (parent, child) => parent.insertBefore(child, parent.firstChild),
    unmount: elm => elm.parentNode.removeChild(elm),
    getel: (key, root = document) => root.querySelector(key),
    getels: (key, root = document) => root.querySelectorAll(key)
};


/***/ })
/******/ ]);