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

//const cp = require("./color-parser");
const PT = __webpack_require__(1);
const {el, text, mount, on, getel} = __webpack_require__(2);

on(window, "load", () => {

    console.log("page loaded!");


    let backColor = {
        r: 255,
        g: 255,
        b: 255
    };
    let surfColor = {
        r: 0,
        g: 0,
        b: 0
    };
    const canvas = el("canvas#canvas", {width: 400, height: 400});
    const ctx = canvas.getContext("2d");
    let img = el("img", {on: {
        load: e => {
            console.log(img.width, img.height);
            canvas.width = img.width;
            canvas.height = img.height;
            drawDuoTone();
        }
    }});
    const input = el("input", {type: "file", on: {
        change: e => {
            let fr = new FileReader();
            on(fr, "load", e => {
                img.src = fr.result;
            });
            fr.readAsDataURL(e.target.files[0]);
        }
    }});
    const backColorEl = el("input", {type: "color", on: {
        input: e => {
            let c = e.target.value.slice(-6);
            backColor.r = parseInt(c.substr(0, 2), 16);
            backColor.g = parseInt(c.substr(2, 2), 16);
            backColor.b = parseInt(c.substr(4, 2), 16);
            drawDuoTone();
        }
    }});
    const surfColorEl = el("input", {type: "color", on: {
        input: e => {
            let c = e.target.value.slice(-6);
            surfColor.r = parseInt(c.substr(0, 2), 16);
            surfColor.g = parseInt(c.substr(2, 2), 16);
            surfColor.b = parseInt(c.substr(4, 2), 16);
            drawDuoTone();
        }
    }});
    mount(getel("#app"), canvas);
    mount(getel("#app"), input);
    mount(getel("#app"), el("br"));
    mount(getel("#app"), text("背景色："));
    mount(getel("#app"), backColorEl);
    mount(getel("#app"), text("印刷色："));
    mount(getel("#app"), surfColorEl);
    mount(getel("#app"), el("br"));
    mount(getel("#app"), el("input", {
        type: "button",
        value: "背景色と印刷職を反転",
        on: {
            click: e => {
                [backColor, surfColor] = [surfColor, backColor];
                [backColorEl.value, surfColorEl.value] = [surfColorEl.value, backColorEl.value];
                drawDuoTone();
            }
        }
    }));
    function drawDuoTone() {
        ctx.drawImage(img, 0, 0);
        let pt = new PT(canvas), co, cn;
        for(let y = 0; y < canvas.height; y++) {
            for(let x = 0; x < canvas.width; x++) {
                co = pt.getColor({x, y});
                cn = ((co.r + co.g + co.b) / 3) / 255;
                pt.setColor({
                    x, y, 
                    r: cn * backColor.r + (1 - cn) * surfColor.r,
                    g: cn * backColor.g + (1 - cn) * surfColor.g,
                    b: cn * backColor.b + (1 - cn) * surfColor.b,
                    a: 255
                });
            }
        }
        console.log(pt);
        pt.render();
    }

});

/***/ }),
/* 1 */
/***/ (function(module, exports) {

function PixelTouch(canvas) {
    this.ctx = canvas.getContext("2d");
    this.idt = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
    this.data = this.idt.data;
    this.width = this.idt.width;
    this.height = this.idt.height;
};
PixelTouch.prototype.getColor = function(prop) {
    let idx = ((prop.y || 0) * this.width + (prop.x || 0)) * 4;
    return {
        r: this.data[idx],
        g: this.data[idx + 1],
        b: this.data[idx + 2],
        a: this.data[idx + 3]
    };
}
PixelTouch.prototype.setColor = function(prop) {
    let idx = ((prop.y || 0) * this.width + (prop.x || 0)) * 4;
    this.data[idx] = prop.r || 0;
    this.data[idx + 1] = prop.g || 0;
    this.data[idx + 2] = prop.b || 0;
    this.data[idx + 3] = prop.a || 255;
};
PixelTouch.prototype.render = function() {
    this.ctx.putImageData(this.idt, 0, 0);
}
module.exports = PixelTouch;

/***/ }),
/* 2 */
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