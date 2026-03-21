const { Components2d, DebugOverlay, Rendering } = CanvasCompositor;
const { Composition, TransformUtils } = Components2d;
const { SVGCompositorBackend } = Rendering;

const svgSurface = document.getElementById('test-svg');
const debugCanvas = document.getElementById('debug-canvas');
const drawLogicalBoundsCheckbox = document.getElementById('draw-logical-bounds');
const drawRasterBoundsCheckbox = document.getElementById('draw-raster-bounds');
const selectedLabel = document.getElementById('selected');
const fpsDebug = document.getElementById('fps');
const mousexDebug = document.getElementById('mousex');
const mouseyDebug = document.getElementById('mousey');
const surfaceSizeDebug = document.getElementById('surface-size');
const scene = new Composition(800, 600);
const { webglTriangle } = CanvasCompositorDemo.createDemoScene(scene, {
  imageSrc: '../demo.png',
});
const svgBackend = new SVGCompositorBackend(svgSurface);
const debugReferenceCanvas = document.createElement('canvas');
const debugOverlay = new DebugOverlay(debugCanvas, scene, {
  getSelectedComponent: () => selectedComponent,
});
let selectedComponent = null;
let dragging = false;
let dragStartPoint = null;
let dragStartDisplacement = null;
let lastFrameTimestamp = performance.now();
let frameCount = 0;
let lastMeasuredFPS = 0;
let lastMousePoint = { x: 0, y: 0 };

debugReferenceCanvas.width = scene.width;
debugReferenceCanvas.height = scene.height;

function renderSVGScene() {
  svgBackend.present(scene.getRenderOutput());
}

function renderDebugOverlay() {
  debugReferenceCanvas.width = scene.width;
  debugReferenceCanvas.height = scene.height;
  debugOverlay.render(debugReferenceCanvas, {
    drawLogicalBounds: Boolean(drawLogicalBoundsCheckbox?.checked),
    drawRasterBounds: Boolean(drawRasterBoundsCheckbox?.checked),
    drawSelectedBounds: true,
  });
}

function updateSelectedLabel() {
  selectedLabel.textContent = selectedComponent?.name ?? '(none)';
}

function scenePointFromEvent(event) {
  const rect = svgSurface.getBoundingClientRect();
  const viewBox = svgSurface.viewBox.baseVal;
  const width = viewBox?.width || svgSurface.clientWidth || 1;
  const height = viewBox?.height || svgSurface.clientHeight || 1;

  return {
    x: (event.clientX - rect.left) * (width / rect.width),
    y: (event.clientY - rect.top) * (height / rect.height),
  };
}

function updateDebugReadout() {
  if (fpsDebug) {
    fpsDebug.textContent = `${lastMeasuredFPS}`;
  }

  if (mousexDebug) {
    mousexDebug.textContent = `${Math.round(lastMousePoint.x)}`;
  }

  if (mouseyDebug) {
    mouseyDebug.textContent = `${Math.round(lastMousePoint.y)}`;
  }

  if (surfaceSizeDebug) {
    const viewBox = svgSurface.viewBox.baseVal;
    const width = viewBox?.width || svgSurface.clientWidth || scene.width;
    const height = viewBox?.height || svgSurface.clientHeight || scene.height;
    surfaceSizeDebug.textContent = `${width}x${height}`;
  }
}

function setSelectedComponent(component) {
  selectedComponent = component;
  updateSelectedLabel();
  renderDebugOverlay();
}

function setDisplacement(component, x, y) {
  const VectorCtor = component.displacement.constructor;
  component.displacement = new VectorCtor([x, y]);
}

function updateCursor(point) {
  if (dragging) {
    svgSurface.style.cursor = 'grabbing';
    return;
  }

  const hovered = TransformUtils.hitTestComposition(scene, point.x, point.y);
  svgSurface.style.cursor = hovered ? 'grab' : 'default';
}

function renderLoop() {
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

  if (scene.dirty) {
    renderSVGScene();
    renderDebugOverlay();
  } else if (drawLogicalBoundsCheckbox?.checked || drawRasterBoundsCheckbox?.checked || selectedComponent) {
    renderDebugOverlay();
  }

  frameCount += 1;
  const frameNow = performance.now();
  const elapsed = frameNow - lastFrameTimestamp;
  if (elapsed >= 250) {
    lastMeasuredFPS = Math.round((frameCount * 1000) / elapsed);
    frameCount = 0;
    lastFrameTimestamp = frameNow;
    updateDebugReadout();
  }

  requestAnimationFrame(renderLoop);
}

svgSurface.addEventListener('mousedown', (event) => {
  const point = scenePointFromEvent(event);
  lastMousePoint = point;
  updateDebugReadout();
  const hit = TransformUtils.hitTestComposition(scene, point.x, point.y);
  setSelectedComponent(hit);

  if (!hit) {
    dragging = false;
    updateCursor(point);
    return;
  }

  dragging = true;
  dragStartPoint = point;
  dragStartDisplacement = [hit.displacement[0], hit.displacement[1]];
  svgSurface.style.cursor = 'grabbing';
});

svgSurface.addEventListener('mousemove', (event) => {
  const point = scenePointFromEvent(event);
  lastMousePoint = point;
  updateDebugReadout();

  if (dragging && selectedComponent && dragStartPoint && dragStartDisplacement) {
    const dx = point.x - dragStartPoint.x;
    const dy = point.y - dragStartPoint.y;
    setDisplacement(selectedComponent, dragStartDisplacement[0] + dx, dragStartDisplacement[1] + dy);
    svgSurface.style.cursor = 'grabbing';
    return;
  }

  updateCursor(point);
});

window.addEventListener('mouseup', () => {
  dragging = false;
  dragStartPoint = null;
  dragStartDisplacement = null;
  svgSurface.style.cursor = selectedComponent ? 'grab' : 'default';
});

drawLogicalBoundsCheckbox?.addEventListener('change', renderDebugOverlay);
drawRasterBoundsCheckbox?.addEventListener('change', renderDebugOverlay);

renderSVGScene();
renderDebugOverlay();
updateSelectedLabel();
updateDebugReadout();
renderLoop();
