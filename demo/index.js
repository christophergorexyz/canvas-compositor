const { Compositor, Components2d, InteractionController, DebugOverlay } = CanvasCompositor;

const { TransformUtils } = Components2d;

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
let _myCC = new Compositor(canvas);
let interactions = new InteractionController(_myCC, {
  hitTest: (x, y) => TransformUtils.hitTestComposition(_myCC.scene, x, y),
});
let debugOverlay = new DebugOverlay(debugCanvas, _myCC.scene, {
  getSelectedComponent: () => interactions.selectedComponent,
});
const { group } = CanvasCompositorDemo.createDemoScene(_myCC.scene, {
  imageSrc: '../demo.png',
});

function updateSelectedLabel() {
  selectedDebug.textContent = interactions.selectedComponent?.name ?? '(none)';
}

function nudgeSelected(dx, dy) {
  interactions.nudgeSelected(dx, dy);
}

function toggleSelectedReflect(axis) {
  interactions.reflectSelected(axis);
}

function rotateSelectedSelf(deltaRadians) {
  const nextOrigin = rotateOriginSelect?.value === 'origin' ? 'origin' : 'center';
  interactions.rotateSelected(deltaRadians, nextOrigin);
}

function scaleSelected(factor) {
  interactions.scaleSelected(factor);
}

_myCC.addEventListener('mousemove', () => {
  mousexDebug.innerHTML = _myCC.mouseX;
  mouseyDebug.innerHTML = _myCC.mouseY;
});

interactions.addEventListener('selectionchange', () => {
  updateSelectedLabel();
});

function updateSelectionAfterStackChange() {
  const selectedComponent = interactions.selectedComponent;
  if (!selectedComponent) return;
  selectedComponent.invalidate();
  updateSelectedLabel();
}

bringFrontButton?.addEventListener('click', () => {
  interactions.moveSelectedToFront();
  updateSelectionAfterStackChange();
});

bringForwardButton?.addEventListener('click', () => {
  interactions.moveSelectedForward();
  updateSelectionAfterStackChange();
});

sendBackwardButton?.addEventListener('click', () => {
  interactions.moveSelectedBackward();
  updateSelectionAfterStackChange();
});

sendBackButton?.addEventListener('click', () => {
  interactions.moveSelectedToBack();
  updateSelectionAfterStackChange();
});

moveLeftButton?.addEventListener('click', () => nudgeSelected(-10, 0));
moveRightButton?.addEventListener('click', () => nudgeSelected(10, 0));
moveUpButton?.addEventListener('click', () => nudgeSelected(0, -10));
moveDownButton?.addEventListener('click', () => nudgeSelected(0, 10));

snapGridButton?.addEventListener('click', () => {
  interactions.snapSelected(10);
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

function renderDebugOverlay() {
  debugOverlay.render(canvas, {
    drawLogicalBounds: Boolean(drawLogicalBoundsCheckbox?.checked),
    drawRasterBounds: Boolean(drawRasterBoundsCheckbox?.checked),
    drawSelectedBounds: true,
  });
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
