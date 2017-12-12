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
