const cp = require("./colorParser");
const cs = require("./colorSetter");
const {el, mount, on, getel} = require("./DOMUtl");

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