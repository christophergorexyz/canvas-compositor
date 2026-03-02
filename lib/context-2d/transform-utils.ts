import Component from './component';
import { Vector } from '../linear-algebra/vector';

export interface Point2D {
  x: number;
  y: number;
}

interface WithContentOffset {
  contentOffset?: Vector;
}

function childRenderOffset(child: Component): Vector {
  const maybeComposition = child as Component & WithContentOffset;
  return maybeComposition.contentOffset ?? new Vector([0, 0]);
}

export function inverseTransformPoint(component: Component, x: number, y: number): Point2D {
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

export function forwardTransformPoint(component: Component, x: number, y: number): Point2D {
  const pivot = component.rotationPivot;
  const tx = x - pivot[0];
  const ty = y - pivot[1];

  const sx = component.reflect[0] < 0 ? -tx : tx;
  const sy = component.reflect[1] < 0 ? -ty : ty;

  const c = Math.cos(component.rotation);
  const s = Math.sin(component.rotation);

  return {
    x: (sx * c - sy * s) + pivot[0],
    y: (sx * s + sy * c) + pivot[1],
  };
}

export function localPointForChild(parent: Component & WithContentOffset, child: Component, x: number, y: number): Point2D {
  const parentOffset = parent.contentOffset ?? new Vector([0, 0]);
  const renderOffset = childRenderOffset(child);

  return {
    x: x - child.displacement[0] + parentOffset[0] - renderOffset[0],
    y: y - child.displacement[1] + parentOffset[1] - renderOffset[1],
  };
}

export function hitTestComponent(component: Component, localX: number, localY: number, includeStroke = true) {
  return component.isPointInPath(component.path, localX, localY)
    || (includeStroke && component.isPointInStroke(component.path, localX, localY));
}

export function hitTestComposition(root: Component & WithContentOffset, x: number, y: number): Component | null {
  for (const child of [...root.children].reverse()) {
    const localPoint = localPointForChild(root, child, x, y);
    const untransformed = inverseTransformPoint(child, localPoint.x, localPoint.y);

    if (child.children.length > 0) {
      const nested = hitTestComposition(child as Component & WithContentOffset, untransformed.x, untransformed.y);
      if (nested) {
        return nested;
      }
    }

    if (hitTestComponent(child, untransformed.x, untransformed.y, true)) {
      return child;
    }
  }

  return null;
}
