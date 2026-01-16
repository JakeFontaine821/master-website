export const inputMap = {
    w: false,
    a: false,
    s: false,
    d: false,
    f: false,
    v: false,
    arrowup: false,
    arrowdown: false,
    arrowleft: false,
    arrowright: false,
};

document.addEventListener('keydown', e => inputMap[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => inputMap[e.key.toLowerCase()] = false);