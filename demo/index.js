const { Compositor, Components2d } = CanvasCompositor;

const { Rectangle, Circle, Ellipse, Polygon, Composition, Bezier, Picture, Text, Line, Path } = Components2d;

let fpsDebug = document.getElementById('fps');
let mousexDebug = document.getElementById('mousex');
let mouseyDebug = document.getElementById('mousey');
let canvasSizeDebug = document.getElementById('canvas-size');
let selectedDebug = document.getElementById('selected');

let bringFrontButton = document.getElementById('bring-front');
let bringForwardButton = document.getElementById('bring-forward');
let sendBackwardButton = document.getElementById('send-backward');
let sendBackButton = document.getElementById('send-back');
let groupAutoExpandCheckbox = document.getElementById('group-auto-expand');
let sceneAutoResizeCheckbox = document.getElementById('scene-auto-resize');
let drawLogicalBoundsCheckbox = document.getElementById('draw-logical-bounds');
let drawRasterBoundsCheckbox = document.getElementById('draw-raster-bounds');

let moveLeftButton = document.getElementById('move-left');
let moveUpButton = document.getElementById('move-up');
let moveDownButton = document.getElementById('move-down');
let moveRightButton = document.getElementById('move-right');
let snapGridButton = document.getElementById('snap-grid');
let rotateCcwButton = document.getElementById('rotate-ccw');
let rotateCwButton = document.getElementById('rotate-cw');
let rotateOriginSelect = document.getElementById('rotate-origin');
let scaleInButton = document.getElementById('scale-in');
let scaleOutButton = document.getElementById('scale-out');
let mirrorXButton = document.getElementById('mirror-x');
let mirrorYButton = document.getElementById('mirror-y');

let canvas = document.getElementById('test-canvas');
let debugCanvas = document.getElementById('debug-canvas');
let debugContext = debugCanvas.getContext('2d');
let _myCC = new Compositor(canvas);

function setDisplacement(component, x, y) {
  const VectorCtor = component.displacement.constructor;
  component.displacement = new VectorCtor([x, y]);
}

function configureRectangle(rect, options) {
  setDisplacement(rect, options.x, options.y);
  rect.context.fillStyle = options.fill;
  rect.context.strokeStyle = options.stroke;
  rect.context.lineWidth = options.lineWidth ?? 2;
  rect.invalidate();
  return rect;
}

const bgCard = configureRectangle(new Rectangle(260, 130), {
  x: 40,
  y: 70,
  fill: '#111827',
  stroke: '#60a5fa',
  lineWidth: 3,
});

const circ = new Circle(50, { x: 130, y: 340 });
circ.context.fillStyle = '#38bdf8';
circ.context.strokeStyle = '#0f172a';
circ.context.lineWidth = 3;
circ.rotationOrigin = 'center';
circ.rotation = Math.PI / 18;
circ.invalidate();

const ell = new Ellipse(70, 35, { x: 360, y: 300 });
ell.context.fillStyle = '#a78bfa';
ell.context.strokeStyle = '#312e81';
ell.context.lineWidth = 3;
ell.rotationOrigin = 'center';
ell.rotation = -Math.PI / 9;
ell.invalidate();

const poly = new Polygon([
  [610, 120],
  [760, 170],
  [710, 260],
  [580, 230],
], { x: 0, y: 0 });
poly.context.fillStyle = '#34d399';
poly.context.strokeStyle = '#064e3b';
poly.context.lineWidth = 3;
poly.rotationOrigin = 'center';
poly.rotation = Math.PI / 14;
poly.invalidate();

const guideA = new Line([120, 410], [1, 0.16]);
const guideB = new Line([780, 410], [-1, 0.22]);
const guideIntersection = Line.intersection(guideA, guideB);

const curve = new Bezier({
  start: [0, 80],
  control1: [120, 220],
  control2: [260, -80],
  end: [380, 120],
  x: 120,
  y: 380,
});
curve.name = 'Bezier Curve';
curve.context.strokeStyle = '#ec4899';
curve.context.lineWidth = 6;
curve.rotationOrigin = 'center';
curve.rotation = -Math.PI / 30;
curve.invalidate();

const openPath = new Path([
  [590, 420],
  [650, 380],
  [710, 410],
  [760, 360],
  [790, 420],
], {
  x: 0,
  y: 0,
  closed: false,
});
openPath.name = 'Path';
openPath.context.strokeStyle = '#be185d';
openPath.context.lineWidth = 5;
openPath.rotationOrigin = 'center';
openPath.rotation = Math.PI / 20;
openPath.invalidate();

const demoImage = new Image();
demoImage.src = '../demo.png';

demoImage.addEventListener('load', () => {
  const picture = new Picture(demoImage, {
    x: 640,
    y: 320,
    rotationOrigin: 'center',
  });
  picture.name = 'Picture';
  picture.context.strokeStyle = '#0f172a';
  picture.context.lineWidth = 2;
  picture.path.rect(0, 0, picture.width, picture.height);
  picture.rotation = -Math.PI / 16;
  picture.reflect = new picture.reflect.constructor([-1, 1]);
  picture.invalidate();
  _myCC.scene.addChild(picture);
});

const text = new Text({
  text: 'Canvas Compositor Demo',
  x: 50,
  y: 24,
  fontSize: '22px',
  fontWeight: '700',
  fontFamily: 'sans-serif',
});
text.name = 'Text';
text.context.fillStyle = '#0f172a';
if (guideIntersection) {
  setDisplacement(text, Math.max(20, guideIntersection[0] - 120), Math.max(20, guideIntersection[1] - 260));
}
text.rotationOrigin = 'center';
text.rotation = -Math.PI / 36;
text.invalidate();

const group = new Composition(260, 180, { x: 520, y: 320 });
group.boundsMode = 'fixed';
const groupCircle = new Circle(30, { x: 58, y: 62 });
groupCircle.context.fillStyle = '#fb7185';
groupCircle.context.strokeStyle = '#881337';
groupCircle.context.lineWidth = 3;
groupCircle.rotationOrigin = 'center';
groupCircle.rotation = Math.PI / 10;
groupCircle.invalidate();

const groupEllipse = new Ellipse(44, 22, { x: 150, y: 64 });
groupEllipse.context.fillStyle = '#fcd34d';
groupEllipse.context.strokeStyle = '#78350f';
groupEllipse.context.lineWidth = 3;
groupEllipse.rotationOrigin = 'center';
groupEllipse.rotation = -Math.PI / 8;
groupEllipse.invalidate();

const groupPath = new Path([
  [14, 132],
  [70, 102],
  [122, 146],
  [176, 110],
  [228, 144],
], {
  x: 0,
  y: 0,
  closed: false,
});
groupPath.name = 'Group Path';
groupPath.context.strokeStyle = '#2563eb';
groupPath.context.lineWidth = 4;
groupPath.rotationOrigin = 'center';
groupPath.rotation = Math.PI / 24;
groupPath.invalidate();

group.addChildren([groupCircle, groupEllipse, groupPath]);

_myCC.scene.addChildren([bgCard, circ, ell, poly, curve, openPath, text, group]);
_myCC.scene.boundsMode = 'fixed';

let selectedComponent = null;
let dragging = false;
let dragStartMouseX = 0;
let dragStartMouseY = 0;
let dragStartDisplacementX = 0;
let dragStartDisplacementY = 0;

function dragTo(mouseX, mouseY) {
  if (!dragging || !selectedComponent) return;

  const dx = mouseX - dragStartMouseX;
  const dy = mouseY - dragStartMouseY;
  setDisplacement(selectedComponent, dragStartDisplacementX + dx, dragStartDisplacementY + dy);
}

function inverseComponentTransform(component, x, y) {
  const pivot = component.rotationPivot;
  const tx = x - pivot[0];
  const ty = y - pivot[1];

  const c = Math.cos(component.rotation);
  const s = Math.sin(component.rotation);

  let ux = tx * c + ty * s;
  let uy = -tx * s + ty * c;

  if (component.reflect[0] < 0) {
    ux = -ux;
  }

  if (component.reflect[1] < 0) {
    uy = -uy;
  }

  return {
    x: ux + pivot[0],
    y: uy + pivot[1],
  };
}

function forwardComponentTransform(component, x, y) {
  const pivot = component.rotationPivot;
  const tx = x - pivot[0];
  const ty = y - pivot[1];

  const sx = (component.reflect[0] < 0 ? -tx : tx);
  const sy = (component.reflect[1] < 0 ? -ty : ty);

  const c = Math.cos(component.rotation);
  const s = Math.sin(component.rotation);

  return {
    x: (sx * c - sy * s) + pivot[0],
    y: (sx * s + sy * c) + pivot[1],
  };
}

function hitTestComposition(composition, x, y) {
  for (const child of [...composition.children].reverse()) {
    const childContentOffsetX = child.contentOffset?.[0] ?? 0;
    const childContentOffsetY = child.contentOffset?.[1] ?? 0;
    const localX = x - child.displacement[0] + (composition.contentOffset?.[0] ?? 0) - childContentOffsetX;
    const localY = y - child.displacement[1] + (composition.contentOffset?.[1] ?? 0) - childContentOffsetY;
    const untransformed = inverseComponentTransform(child, localX, localY);

    if (child.children && child.children.length > 0) {
      const nested = hitTestComposition(child, untransformed.x, untransformed.y);
      if (nested) return nested;
    }

    if (
      child.isPointInPath(child.path, untransformed.x, untransformed.y)
      || child.isPointInStroke(child.path, untransformed.x, untransformed.y)
    ) {
      return child;
    }
  }

  return null;
}

function updateSelectedLabel() {
  selectedDebug.textContent = selectedComponent?.name ?? '(none)';
}

function nudgeSelected(dx, dy) {
  if (!selectedComponent) return;
  setDisplacement(
    selectedComponent,
    selectedComponent.displacement[0] + dx,
    selectedComponent.displacement[1] + dy,
  );
}

function toggleSelectedReflect(axis) {
  if (!selectedComponent) return;

  const VectorCtor = selectedComponent.reflect.constructor;
  const nextReflectX = axis === 'x' ? -selectedComponent.reflect[0] : selectedComponent.reflect[0];
  const nextReflectY = axis === 'y' ? -selectedComponent.reflect[1] : selectedComponent.reflect[1];
  selectedComponent.reflect = new VectorCtor([nextReflectX, nextReflectY]);
}

function rotateSelectedSelf(deltaRadians) {
  if (!selectedComponent) return;
  const nextOrigin = rotateOriginSelect?.value === 'origin' ? 'origin' : 'center';
  selectedComponent.rotationOrigin = nextOrigin;
  selectedComponent.rotation = selectedComponent.rotation + deltaRadians;
}

function scaleSelected(factor) {
  if (!selectedComponent) return;
  const VectorCtor = selectedComponent.scale.constructor;
  const nextScaleX = Math.max(0.05, selectedComponent.scale[0] * factor);
  const nextScaleY = Math.max(0.05, selectedComponent.scale[1] * factor);
  selectedComponent.scale = new VectorCtor([nextScaleX, nextScaleY]);
}

_myCC.addEventListener('mousemove', () => {
  mousexDebug.innerHTML = _myCC.mouseX;
  mouseyDebug.innerHTML = _myCC.mouseY;

  dragTo(_myCC.mouseX, _myCC.mouseY);
});

canvas.addEventListener('mousedown', (event) => {
  const x = event.offsetX;
  const y = event.offsetY;
  selectedComponent = hitTestComposition(_myCC.scene, x, y);
  updateSelectedLabel();

  if (!selectedComponent) return;

  dragging = true;
  dragStartMouseX = x;
  dragStartMouseY = y;
  dragStartDisplacementX = selectedComponent.displacement[0];
  dragStartDisplacementY = selectedComponent.displacement[1];
});

canvas.addEventListener('mouseup', () => {
  dragging = false;
});

canvas.addEventListener('mouseleave', () => {
  if (dragging && _myCC.scene.autoResizeTargetCanvas) {
    return;
  }

  dragging = false;
});

window.addEventListener('mouseup', () => {
  dragging = false;
});

window.addEventListener('mousemove', (event) => {
  if (!dragging || !_myCC.scene.autoResizeTargetCanvas) return;

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  dragTo(x, y);
});

function updateSelectionAfterStackChange() {
  if (!selectedComponent) return;
  selectedComponent.invalidate();
  updateSelectedLabel();
}

bringFrontButton?.addEventListener('click', () => {
  selectedComponent?.moveToFront();
  updateSelectionAfterStackChange();
});

bringForwardButton?.addEventListener('click', () => {
  selectedComponent?.moveForward();
  updateSelectionAfterStackChange();
});

sendBackwardButton?.addEventListener('click', () => {
  selectedComponent?.moveBackward();
  updateSelectionAfterStackChange();
});

sendBackButton?.addEventListener('click', () => {
  selectedComponent?.moveToBack();
  updateSelectionAfterStackChange();
});

moveLeftButton?.addEventListener('click', () => nudgeSelected(-10, 0));
moveRightButton?.addEventListener('click', () => nudgeSelected(10, 0));
moveUpButton?.addEventListener('click', () => nudgeSelected(0, -10));
moveDownButton?.addEventListener('click', () => nudgeSelected(0, 10));

snapGridButton?.addEventListener('click', () => {
  if (!selectedComponent) return;
  setDisplacement(
    selectedComponent,
    Math.round(selectedComponent.displacement[0] / 10) * 10,
    Math.round(selectedComponent.displacement[1] / 10) * 10,
  );
});

rotateCwButton?.addEventListener('click', () => {
  rotateSelectedSelf(Math.PI / 12);
});

rotateCcwButton?.addEventListener('click', () => {
  rotateSelectedSelf(-Math.PI / 12);
});

scaleInButton?.addEventListener('click', () => {
  scaleSelected(0.9);
});

scaleOutButton?.addEventListener('click', () => {
  scaleSelected(1.1);
});

mirrorXButton?.addEventListener('click', () => {
  toggleSelectedReflect('x');
});

mirrorYButton?.addEventListener('click', () => {
  toggleSelectedReflect('y');
});

function applyGroupBoundsSetting(isAutoExpand) {
  group.boundsMode = isAutoExpand ? 'auto-expand' : 'fixed';
  group.invalidate();
}

function applySceneResizeSetting(isAutoResize) {
  _myCC.scene.autoResizeTargetCanvas = isAutoResize;
  _myCC.scene.boundsMode = isAutoResize ? 'auto-expand' : 'fixed';
  _myCC.scene.invalidate();
}

function getBoundsQuad(component, boxX = 0, boxY = 0, mode = 'logical') {
  const padding = component.effectiveRasterPadding ?? 0;
  const originX = boxX - padding;
  const originY = boxY - padding;
  const left = mode === 'logical' ? padding : 0;
  const top = mode === 'logical' ? padding : 0;
  const right = mode === 'logical' ? component.width - padding : component.width;
  const bottom = mode === 'logical' ? component.height - padding : component.height;

  const topLeft = forwardComponentTransform(component, left, top);
  const topRight = forwardComponentTransform(component, right, top);
  const bottomRight = forwardComponentTransform(component, right, bottom);
  const bottomLeft = forwardComponentTransform(component, left, bottom);

  return [
    { x: originX + topLeft.x, y: originY + topLeft.y },
    { x: originX + topRight.x, y: originY + topRight.y },
    { x: originX + bottomRight.x, y: originY + bottomRight.y },
    { x: originX + bottomLeft.x, y: originY + bottomLeft.y },
  ];
}

function drawQuad(quad) {
  debugContext.beginPath();
  debugContext.moveTo(quad[0].x, quad[0].y);
  debugContext.lineTo(quad[1].x, quad[1].y);
  debugContext.lineTo(quad[2].x, quad[2].y);
  debugContext.lineTo(quad[3].x, quad[3].y);
  debugContext.closePath();
  debugContext.stroke();
}

function drawComponentBounds(component, boxX = 0, boxY = 0, drawFn = null, mode = 'logical') {
  const quad = getBoundsQuad(component, boxX, boxY, mode);

  drawFn?.(component, quad);

  if (!component.children?.length) {
    return;
  }

  const parentContentOffsetX = component.contentOffset?.[0] ?? 0;
  const parentContentOffsetY = component.contentOffset?.[1] ?? 0;

  for (const child of component.children) {
    const childContentOffsetX = child.contentOffset?.[0] ?? 0;
    const childContentOffsetY = child.contentOffset?.[1] ?? 0;
    const childBoxX = boxX + child.displacement[0] - parentContentOffsetX + childContentOffsetX;
    const childBoxY = boxY + child.displacement[1] - parentContentOffsetY + childContentOffsetY;
    drawComponentBounds(child, childBoxX, childBoxY, drawFn, mode);
  }
}

function renderDebugOverlay() {
  if (!debugContext) return;

  if (debugCanvas.width !== canvas.width) debugCanvas.width = canvas.width;
  if (debugCanvas.height !== canvas.height) debugCanvas.height = canvas.height;

  debugContext.clearRect(0, 0, debugCanvas.width, debugCanvas.height);

  if (drawRasterBoundsCheckbox?.checked) {
    debugContext.save();
    debugContext.strokeStyle = '#f59e0b';
    debugContext.lineWidth = 1;
    drawComponentBounds(_myCC.scene, 0, 0, (_component, quad) => drawQuad(quad), 'raster');
    debugContext.restore();
  }

  if (drawLogicalBoundsCheckbox?.checked) {
    debugContext.save();
    debugContext.strokeStyle = '#ef4444';
    debugContext.lineWidth = 1;
    drawComponentBounds(_myCC.scene, 0, 0, (_component, quad) => drawQuad(quad), 'logical');
    debugContext.restore();
  }

  if (selectedComponent) {
    debugContext.save();
    debugContext.strokeStyle = '#22c55e';
    debugContext.lineWidth = 2;
    drawComponentBounds(_myCC.scene, 0, 0, (component, quad) => {
      if (component === selectedComponent) {
        drawQuad(quad);
      }
    }, 'logical');
    debugContext.restore();
  }
}

groupAutoExpandCheckbox?.addEventListener('change', (event) => {
  applyGroupBoundsSetting(event.target.checked);
});

sceneAutoResizeCheckbox?.addEventListener('change', (event) => {
  applySceneResizeSetting(event.target.checked);
});

applyGroupBoundsSetting(Boolean(groupAutoExpandCheckbox?.checked));
applySceneResizeSetting(Boolean(sceneAutoResizeCheckbox?.checked));

updateSelectedLabel();

function _updateFPS() {
  fpsDebug.innerHTML = _myCC.framerate;
  canvasSizeDebug.innerHTML = `${canvas.width}×${canvas.height}`;
  renderDebugOverlay();
}

setInterval(_updateFPS, 250);
