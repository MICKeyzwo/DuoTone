//const cp = require("./color-parser");
const PT = require("./pixel-touch");
const {el, text, mount, on, getel} = require("./DOMUtl");

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