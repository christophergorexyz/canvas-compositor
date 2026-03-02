import Compositor from '../compositor';
import Component from '../context-2d/component';
import { hitTestComposition } from '../context-2d/transform-utils';
import { Vector } from '../linear-algebra/vector';

type HitTestFn = (x: number, y: number) => Component | null;

export interface InteractionControllerOptions {
  hitTest?: HitTestFn;
}

export default class InteractionController extends EventTarget {
  private readonly compositor: Compositor;
  private readonly hitTest: HitTestFn;

  private _selectedComponent: Component | null = null;
  private dragging: boolean = false;
  private dragStartMouseX: number = 0;
  private dragStartMouseY: number = 0;
  private dragStartDisplacementX: number = 0;
  private dragStartDisplacementY: number = 0;

  constructor(compositor: Compositor, options?: InteractionControllerOptions) {
    super();
    this.compositor = compositor;
    this.hitTest = options?.hitTest ?? ((x, y) => hitTestComposition(this.compositor.scene, x, y));

    this.compositor.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.compositor.canvas.addEventListener('mouseup', this.handleMouseUp);
    this.compositor.canvas.addEventListener('mouseleave', this.handleMouseLeave);
    this.compositor.canvas.addEventListener('mousemove', this.handleMouseMove);

    window.addEventListener('mouseup', this.handleWindowMouseUp);
    window.addEventListener('mousemove', this.handleWindowMouseMove);
  }

  get selectedComponent() {
    return this._selectedComponent;
  }

  dispose() {
    this.compositor.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.compositor.canvas.removeEventListener('mouseup', this.handleMouseUp);
    this.compositor.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
    this.compositor.canvas.removeEventListener('mousemove', this.handleMouseMove);

    window.removeEventListener('mouseup', this.handleWindowMouseUp);
    window.removeEventListener('mousemove', this.handleWindowMouseMove);
  }

  setSelectedComponent(component: Component | null) {
    if (this._selectedComponent === component) {
      return;
    }

    this._selectedComponent = component;
    this.dispatchEvent(new CustomEvent<Component | null>('selectionchange', { detail: component }));
  }

  selectAt(x: number, y: number) {
    const nextComponent = this.hitTest(x, y);
    this.setSelectedComponent(nextComponent);
    return nextComponent;
  }

  clearSelection() {
    this.setSelectedComponent(null);
    this.dragging = false;
  }

  nudgeSelected(dx: number, dy: number) {
    if (!this._selectedComponent) {
      return;
    }

    this.setDisplacement(
      this._selectedComponent,
      this._selectedComponent.displacement[0] + dx,
      this._selectedComponent.displacement[1] + dy,
    );
  }

  snapSelected(step = 10) {
    if (!this._selectedComponent) {
      return;
    }

    this.setDisplacement(
      this._selectedComponent,
      Math.round(this._selectedComponent.displacement[0] / step) * step,
      Math.round(this._selectedComponent.displacement[1] / step) * step,
    );
  }

  rotateSelected(deltaRadians: number, origin: 'origin' | 'center' = 'center') {
    if (!this._selectedComponent) {
      return;
    }

    this._selectedComponent.rotationOrigin = origin;
    this._selectedComponent.rotation = this._selectedComponent.rotation + deltaRadians;
  }

  scaleSelected(factor: number, minScale = 0.05) {
    if (!this._selectedComponent) {
      return;
    }

    const nextScaleX = Math.max(minScale, this._selectedComponent.scale[0] * factor);
    const nextScaleY = Math.max(minScale, this._selectedComponent.scale[1] * factor);
    this._selectedComponent.scale = this.withVectorType(this._selectedComponent.scale, [nextScaleX, nextScaleY]);
  }

  reflectSelected(axis: 'x' | 'y') {
    if (!this._selectedComponent) {
      return;
    }

    const nextReflectX = axis === 'x' ? -this._selectedComponent.reflect[0] : this._selectedComponent.reflect[0];
    const nextReflectY = axis === 'y' ? -this._selectedComponent.reflect[1] : this._selectedComponent.reflect[1];
    this._selectedComponent.reflect = this.withVectorType(this._selectedComponent.reflect, [nextReflectX, nextReflectY]);
  }

  moveSelectedToFront() {
    this._selectedComponent?.moveToFront();
  }

  moveSelectedForward() {
    this._selectedComponent?.moveForward();
  }

  moveSelectedBackward() {
    this._selectedComponent?.moveBackward();
  }

  moveSelectedToBack() {
    this._selectedComponent?.moveToBack();
  }

  private setDisplacement(component: Component, x: number, y: number) {
    component.displacement = this.withVectorType(component.displacement, [x, y]);
  }

  private withVectorType(source: Vector, values: [number, number]) {
    const VectorCtor = source.constructor as new (data: number[]) => Vector;
    return new VectorCtor(values);
  }

  private dragTo(mouseX: number, mouseY: number) {
    if (!this.dragging || !this._selectedComponent) {
      return;
    }

    const dx = mouseX - this.dragStartMouseX;
    const dy = mouseY - this.dragStartMouseY;
    this.setDisplacement(this._selectedComponent, this.dragStartDisplacementX + dx, this.dragStartDisplacementY + dy);
  }

  private handleMouseDown = (event: MouseEvent) => {
    const x = event.offsetX;
    const y = event.offsetY;
    const selected = this.selectAt(x, y);

    if (!selected) {
      this.dragging = false;
      return;
    }

    this.dragging = true;
    this.dragStartMouseX = x;
    this.dragStartMouseY = y;
    this.dragStartDisplacementX = selected.displacement[0];
    this.dragStartDisplacementY = selected.displacement[1];
  };

  private handleMouseUp = () => {
    this.dragging = false;
  };

  private handleMouseLeave = () => {
    if (this.dragging && this.compositor.scene.autoResizeTargetCanvas) {
      return;
    }

    this.dragging = false;
  };

  private handleMouseMove = (event: MouseEvent) => {
    this.dragTo(event.offsetX, event.offsetY);
  };

  private handleWindowMouseUp = () => {
    this.dragging = false;
  };

  private handleWindowMouseMove = (event: MouseEvent) => {
    if (!this.dragging || !this.compositor.scene.autoResizeTargetCanvas) {
      return;
    }

    const rect = this.compositor.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.dragTo(x, y);
  };
}
