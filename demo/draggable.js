let { Application, Circle, Ellipse, Rectangle, Bezier, Image, VectorPath, Text } = CanvasCompositor;
let fpsDebug = document.getElementById('fps');
let mousexDebug = document.getElementById('mousex');
let mouseyDebug = document.getElementById('mousey');

let canvas = document.getElementById('test-canvas');

class DraggableDemo extends Application {
  constructor() {
    super(canvas);

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
    })

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

    var _text = new Text({
      x: 100,
      y: 400,
      text: 'The quick red fox jumps over the lazy brown dog.',
      fontSize: '28px',
      style: {
        fillStyle: 'green'
      }
    });

    var _bezi = new Bezier({
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
        y: 200
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
    i.onload = (e) => {
      _image = new Image({
        image: i,
        x: 100,
        y: 100,
        style: {
          strokeStyle: 'orange',
          lineWidth: 10.0
        }
      });
      this.scene.addChild(_image);
      _image.addEventListener('mousedown', dragStart);
    }

    let sceneObjects = [_circ, _elip, _rect, _path, _bezi, _text];

    this.scene.addChildren(sceneObjects);

    this.addEventListener('mousemove', () => {
      mousexDebug.innerHTML = this.mouseX;
      mouseyDebug.innerHTML = this.mouseY;
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
    })

    function _updateFPS() {
      fpsDebug.innerHTML = this.framerate;
    }

    setInterval(_updateFPS, 250);

  }
}
new DraggableDemo();
