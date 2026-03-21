import Component from '../context-2d/component';
import Composition from '../context-2d/composition';
import Canvas2DRenderTarget from './canvas-2d-render-target';
import Canvas2DRenderer, { IRenderOutput } from './canvas-2d-renderer';
import CompositorBackend from './compositor-backend';
import Renderer from './renderer';

export default class Canvas2DCompositorBackend extends CompositorBackend {
  readonly canvas: HTMLCanvasElement;
  readonly context: ImageBitmapRenderingContext;
  private readonly presentationTarget: Canvas2DRenderTarget;

  constructor(canvas: HTMLCanvasElement, componentRenderer: Renderer = new Canvas2DRenderer()) {
    super(componentRenderer);
    this.canvas = canvas;
    this.presentationTarget = new Canvas2DRenderTarget(canvas.width, canvas.height);

    const context = this.canvas.getContext('bitmaprenderer', { alpha: false, desynchronized: true });
    if (!context) {
      throw new Error('The root rendering context could not be created.');
    }

    this.context = context as ImageBitmapRenderingContext;
  }

  private _applyComponentTransform(component: Component, context: OffscreenCanvasRenderingContext2D) {
    const rotation = component.rotation;
    const reflectX = component.reflect[0] < 0 ? -1 : 1;
    const reflectY = component.reflect[1] < 0 ? -1 : 1;

    if (rotation === 0 && reflectX === 1 && reflectY === 1) {
      return;
    }

    const pivot = component.rotationPivot;
    context.translate(pivot[0], pivot[1]);
    context.rotate(rotation);
    context.scale(reflectX, reflectY);
    context.translate(-pivot[0], -pivot[1]);
  }

  private _drawComponent(component: Component, context: OffscreenCanvasRenderingContext2D) {
    context.save();
    this._applyComponentTransform(component, context);

    if (component instanceof Composition) {
      context.translate(-component.contentOffset[0], -component.contentOffset[1]);
      this._drawCompositionChildren(component, context);
    } else {
      const output = component.getRenderOutput();
      this.componentRenderer.drawRenderOutput(output, context, {
        x: -component.effectiveRasterPadding,
        y: -component.effectiveRasterPadding,
        width: component.width,
        height: component.height,
      });
    }

    context.restore();
  }

  private _drawCompositionChildren(composition: Composition, context: OffscreenCanvasRenderingContext2D) {
    for (const child of composition.children) {
      context.save();
      context.translate(child.displacement[0], child.displacement[1]);
      this._drawComponent(child, context);
      context.restore();
    }
  }

  override getPresentationOutput(scene: Composition): IRenderOutput {
    scene.prepareForComposition();

    if (this.presentationTarget.width !== scene.width || this.presentationTarget.height !== scene.height) {
      this.presentationTarget.resize(scene.width, scene.height);
    } else {
      this.presentationTarget.clear();
    }

    this._drawCompositionChildren(scene, this.presentationTarget.context);

    return {
      kind: 'bitmap',
      source: this.presentationTarget.getImageSource(),
      width: this.presentationTarget.width,
      height: this.presentationTarget.height,
    };
  }

  present(output: IRenderOutput) {
    this.componentRenderer.presentRenderOutput(output, this.context);
  }
}
