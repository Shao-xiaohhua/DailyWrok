function animate1(e, t, v) {
  clearInterval(e.timeId);
  var v = v || 20;
  var c = 0;
  e.timeId = setInterval(function () {
    c += 10;
    if (Math.abs(t - c) < 10) {
      t = c;
      clearInterval(e.timeId);
    }
    e.style.left = c + 'px';
  }, v)
}

function animate2(e, t) {
  var c = 0;
  clearInterval(e.timer)
  e.timer = setInterval(function () {
    var step = (t - c) / 10;
    step = step > 0 ? Math.ceil(step) : Math.floor(step);
    c += step;
    e.style.left = c + "px";
    if (Math.abs(t - c) <= Math.abs(step)) {
      e.style.left = t + "px";
      clearInterval(e.timer);
    }
  }, 40);
}

function animate3(e, obj) {
  clearInterval(e.timer);
  e.timer = setInterval(function () {
    let flag = false;
    for (let k in obj) {
      let reg = new RegExp("px", "g");
      let cv = getStyle(e, k);
      let c = +cv.replace(reg, '');
      let t = +obj[k].replace(reg, '');
      
      let step = (t - c) / 10;
      step = step > 0 ? Math.ceil(step) : Math.floor(step);
      c += step;
      e.style[k] = c + "px";
      console.log(c, t);
      if (c !== t) {
        flag = true;
      }
    }
    if (flag===false) {
      clearInterval(e.timer);
    }
  }, 40);
}

function getStyle(element, attr) {
  if (element.currentStyle) {
    return element.currentStyle[attr];
  } else {
    return getComputedStyle(element, false)[attr];
  }
}