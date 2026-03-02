import { default as Compositor } from './compositor';
import * as Components2d from './context-2d/index';
import { DebugOverlay, InteractionController } from './interaction';
import * as SceneSerialization from './scene-serialization';

export { default as Compositor } from './compositor';
export * as Components2d from './context-2d/index';
export { DebugOverlay, InteractionController } from './interaction';
export * as SceneSerialization from './scene-serialization';

// This is the best way to make something available on the window object
declare global {
  var CanvasCompositor: {
    Compositor: typeof Compositor,
    Components2d: typeof Components2d;
    InteractionController: typeof InteractionController;
    DebugOverlay: typeof DebugOverlay;
    SceneSerialization: typeof SceneSerialization;
  };
}

globalThis.CanvasCompositor = {
  Compositor,
  Components2d,
  InteractionController,
  DebugOverlay,
  SceneSerialization,
};
