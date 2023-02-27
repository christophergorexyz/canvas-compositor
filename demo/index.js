import { CanvasCompositor, Components2d } from '../src/index.mjs';

let { Bezier, Circle, Ellipse, Line, Picture, Rectangle, Text, VectorPath } = Components2d;

let fpsDebug = document.getElementById('fps');
let mousexDebug = document.getElementById('mousex');
let mouseyDebug = document.getElementById('mousey');


let _myCC = new CanvasCompositor(document.getElementById('test-canvas'));

let _circ = new Circle({
  radius: 50,
  x: 100,
  y: 100,
  style: {
    fillStyle: '#ccccff',
    lineDash: [1, 5]
  }
});

let _elip = new Ellipse({
  x: 200,
  y: 200,
  radius: 50,
  minorRadius: 30,
  style: {
    strokeStyle: '#000000',
    fillStyle: 'blue',
    lineWidth: 10,
    lineDash: [1, 31]
  }
});

let _rect = new Rectangle({
  width: 100,
  height: 50,
  x: 300,
  y: 300,
  style: {
    fillStyle: '#ccffcc',
    lineWidth: 1.0,
  }
});

let _path = new VectorPath({
  vertices: [{
    x: 200,
    y: 100
  }, {
    x: 100,
    y: 400
  }, {
    x: 400,
    y: 200
  }, {
    x: 800,
    y: 200
  }],
  style: {
    strokeStyle: 'orange',
    lineWidth: 5.0,
  }
});

let _text = new Text({
  x: 100,
  y: 400,
  text: 'The quick red fox jumps over the lazy brown dog.',
  fontSize: '28px',
  style: {
    fillStyle: 'green'
  }
});

let _bezi = new Bezier({
  start: {
    x: 50,
    y: 50
  },
  end: {
    x: 300,
    y: 50
  },
  control1: {
    x: 50,
    y: 201
  },
  control2: {
    x: 300,
    y: 199
  },
  style: {
    strokeStyle: 'red'
  }
  //debug: true
});

let _image = null;
let i = new window.Image();
i.src = '../demo.png';
i.onload = function (e) {
  _image = new Picture({
    image: i,
    x: 100,
    y: 100,
    style: {
      strokeStyle: 'orange',
      lineWidth: 10.0
    }
  });
  _myCC.scene.addChild(_image);
  _image.addEventListener('mousedown', dragStart);
}

let sceneObjects = [_circ, _elip, _rect, _path, _bezi, _text];

_myCC.scene.addChildren(sceneObjects);

_myCC.addEventListener('mousemove', () => {
  mousexDebug.innerHTML = _myCC.mouseX;
  mouseyDebug.innerHTML = _myCC.mouseY;
});

for (let c of sceneObjects) {
  c.addEventListener('mousedown', dragStart);
}

let mouseOffset = null;

/**
 * when dragging starts, update events
 * @param {object} e the event object
 */
function dragStart(e) {
  mouseOffset = new Vector([e.offsetX, e.offsetY]).subtract(this.offset);
  //this.removeEventListener('mousedown', dragStart);
  this.addEventListener('mousemove', drag);
  this.addEventListener('mouseup', dragEnd);

  //TODO: not sure how to handle mouse out with the new event system
  //this.onmouseout = this.dragEnd;
}

/**
 * update d as the object is moved around
 * @param {object} e the event object
 */
function drag(e) {
  this.d = new Vector([e.offsetX, e.offsetY]).subtract(mouseOffset);
  this.needsDraw = true;
}

/**
 * when dragging ends, update events
 * @param {object} e the event object
 */
function dragEnd(e) {
  //this.onmousedown = this.dragStart;
  this.removeEventListener('mousemove', drag);
  this.removeEventListener('mouseup', dragEnd);
  this.needsDraw = true;
}

_rect.addEventListener('click', (e) => {
  _rect.style.fillStyle = 'purple'
  _rect.needsRender = true;
  _rect.needsDraw = true;
});

_elip.addEventListener('click', (e) => {
  _myCC.scene.removeChild(_elip);
  delete _elip._prerenderingCanvas;
  delete _elip._prerenderingContext;
  // "'delete' cannot be called on an identifier in strict mode"
  // how to ensure _elip doesn't hold onto any extra data?
  //delete _elip;
});

function _updateFPS() {
  fpsDebug.innerHTML = _myCC.framerate;
}

setInterval(_updateFPS, 250);
