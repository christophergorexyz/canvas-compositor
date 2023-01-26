import { default as CanvasCompositor } from './Compositor.mjs';


// this appears to be the only export method that
// assigns the class directly to the standalone module
// bundled by browserify
module.exports = CanvasCompositor;

