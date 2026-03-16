const { Compositor, Components2d, InteractionController, DebugOverlay, Rendering, SceneSerialization } = CanvasCompositor;
const { WebGLCompositorBackend } = Rendering;

const { Composition, TransformUtils } = Components2d;
const { serializeSceneToString, restoreScene } = SceneSerialization;

let fpsDebug = document.getElementById('fps');
let mousexDebug = document.getElementById('mousex');
let mouseyDebug = document.getElementById('mousey');
let canvasSizeDebug = document.getElementById('canvas-size');
let selectedDebug = document.getElementById('selected');

let bringFrontButton = document.getElementById('bring-front');
let bringForwardButton = document.getElementById('bring-forward');
let sendBackwardButton = document.getElementById('send-backward');
let sendBackButton = document.getElementById('send-back');
let toggleParentButton = document.getElementById('toggle-parent');
let groupAutoExpandCheckbox = document.getElementById('group-auto-expand');
let sceneAutoResizeCheckbox = document.getElementById('scene-auto-resize');
let drawLogicalBoundsCheckbox = document.getElementById('draw-logical-bounds');
let drawRasterBoundsCheckbox = document.getElementById('draw-raster-bounds');
let sceneNameInput = document.getElementById('scene-name');
let saveSceneButton = document.getElementById('save-scene');
let savedScenesSelect = document.getElementById('saved-scenes');
let deleteSceneButton = document.getElementById('delete-scene');

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
let _myCC = new Compositor(canvas, {
  backend: new WebGLCompositorBackend(canvas),
});
let interactions = new InteractionController(_myCC, {
  hitTest: (x, y) => TransformUtils.hitTestComposition(_myCC.scene, x, y),
});
let debugOverlay = new DebugOverlay(debugCanvas, _myCC.scene, {
  getSelectedComponent: () => interactions.selectedComponent,
});
const { group, webglTriangle } = CanvasCompositorDemo.createDemoScene(_myCC.scene, {
  imageSrc: '../demo.png',
});
let primaryGroup = group;

const SAVED_SCENES_STORAGE_KEY = 'canvas-compositor.demo.saved-scenes.v1';

function findPrimaryGroup() {
  const namedGroup = _myCC.scene.children.find((child) => child instanceof Composition && child.name === 'Primary Group');
  if (namedGroup) {
    return namedGroup;
  }

  return _myCC.scene.children.find((child) => child instanceof Composition) ?? null;
}

function updatePrimaryGroupReference() {
  primaryGroup = findPrimaryGroup();
}

function readSavedScenes() {
  try {
    const raw = localStorage.getItem(SAVED_SCENES_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSavedScenes(entries) {
  localStorage.setItem(SAVED_SCENES_STORAGE_KEY, JSON.stringify(entries));
}

function refreshSavedScenesSelect(selectedId = '') {
  if (!savedScenesSelect) {
    return;
  }

  const entries = readSavedScenes();
  savedScenesSelect.innerHTML = '';

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = '(select)';
  savedScenesSelect.appendChild(placeholder);

  for (const entry of entries) {
    const option = document.createElement('option');
    option.value = entry.id;
    option.textContent = entry.name;
    savedScenesSelect.appendChild(option);
  }

  savedScenesSelect.value = selectedId;
}

function saveCurrentScene() {
  const entries = readSavedScenes();
  const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const sceneName = sceneNameInput?.value?.trim() || `Scene ${new Date().toLocaleString()}`;

  entries.unshift({
    id,
    name: sceneName,
    savedAt: new Date().toISOString(),
    payload: serializeSceneToString(_myCC.scene),
  });

  writeSavedScenes(entries);
  refreshSavedScenesSelect(id);
}

async function loadSavedSceneById(id) {
  if (!id) {
    return;
  }

  const entries = readSavedScenes();
  const selected = entries.find((entry) => entry.id === id);
  if (!selected || typeof selected.payload !== 'string') {
    return;
  }

  await restoreScene(_myCC.scene, selected.payload);
  interactions.clearSelection();
  updatePrimaryGroupReference();

  if (groupAutoExpandCheckbox) {
    groupAutoExpandCheckbox.checked = Boolean(primaryGroup?.boundsMode === 'auto-expand');
  }

  if (sceneAutoResizeCheckbox) {
    sceneAutoResizeCheckbox.checked = Boolean(_myCC.scene.autoResizeTargetCanvas);
  }

  updateSelectedLabel();
  _myCC.scene.invalidate();
}

function deleteSavedSceneById(id) {
  if (!id) {
    return;
  }

  const entries = readSavedScenes();
  const remainingEntries = entries.filter((entry) => entry.id !== id);

  writeSavedScenes(remainingEntries);
  refreshSavedScenesSelect('');
}

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

function toggleSelectedParent() {
  const selectedComponent = interactions.selectedComponent;
  if (!selectedComponent || !primaryGroup || selectedComponent === primaryGroup) return;

  if (selectedComponent.parent === primaryGroup) {
    selectedComponent.reparentTo(_myCC.scene);
  } else {
    selectedComponent.reparentTo(primaryGroup);
  }

  updateSelectionAfterStackChange();
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

toggleParentButton?.addEventListener('click', () => {
  toggleSelectedParent();
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
  if (!primaryGroup) {
    return;
  }

  primaryGroup.boundsMode = isAutoExpand ? 'auto-expand' : 'fixed';
  primaryGroup.invalidate();
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

saveSceneButton?.addEventListener('click', () => {
  saveCurrentScene();
});

savedScenesSelect?.addEventListener('change', async (event) => {
  const selectedId = event.target.value;
  try {
    await loadSavedSceneById(selectedId);
  } catch (error) {
    console.error('Failed to load saved scene', error);
  }
});

deleteSceneButton?.addEventListener('click', () => {
  const selectedId = savedScenesSelect?.value ?? '';
  deleteSavedSceneById(selectedId);
});

applyGroupBoundsSetting(Boolean(groupAutoExpandCheckbox?.checked));
applySceneResizeSetting(Boolean(sceneAutoResizeCheckbox?.checked));
refreshSavedScenesSelect();

updateSelectedLabel();

function _updateFPS() {
  fpsDebug.innerHTML = _myCC.framerate;
  canvasSizeDebug.innerHTML = `${canvas.width}×${canvas.height}`;
  renderDebugOverlay();
}

setInterval(_updateFPS, 250);

function animateWebGLTriangle() {
  const now = performance.now() / 1000;
  const color = [
    0.55 + (0.35 * Math.sin(now)),
    0.45 + (0.35 * Math.sin(now * 1.7 + 1.2)),
    0.35 + (0.3 * Math.sin(now * 1.3 + 2.1)),
    1,
  ];

  webglTriangle.rerender({
    clearColor: [0.02, 0.02, 0.08, 1],
    triangleColor: color,
  });

  requestAnimationFrame(animateWebGLTriangle);
}

animateWebGLTriangle();
