import { default as Compositor } from './compositor';
import * as Components2d from './context-2d/index';

export { default as Compositor } from './compositor';
export * as Components2d from './context-2d/index';

// This is the best way to make something available on the window object
declare global {
  var CanvasCompositor: {
    Compositor: typeof Compositor,
    Components2d: typeof Components2d;
  };
}

globalThis.CanvasCompositor = { Compositor, Components2d };