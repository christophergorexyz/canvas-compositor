import Composition from '../context-2d/composition';
import { IRenderOutput } from './canvas-2d-renderer';
import Renderer from './renderer';

export default abstract class CompositorBackend {
  readonly componentRenderer: Renderer;

  constructor(componentRenderer: Renderer) {
    this.componentRenderer = componentRenderer;
  }

  getPresentationOutput(scene: Composition): IRenderOutput {
    return scene.getRenderOutput();
  }

  abstract present(output: IRenderOutput): void;
}
