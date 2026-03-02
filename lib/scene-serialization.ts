import {
  Bezier,
  Circle,
  Component,
  Composition,
  Ellipse,
  Path,
  Picture,
  Polygon,
  Rectangle,
  Text,
} from './context-2d';
import { Vector } from './linear-algebra/vector';

type Vec2 = [number, number];
type RotationOriginValue = 'origin' | 'center' | Vec2;

interface SerializedStyles {
  fillStyle?: string;
  strokeStyle?: string;
  lineWidth?: number;
  lineCap?: CanvasLineCap;
  lineJoin?: CanvasLineJoin;
  miterLimit?: number;
  lineDash?: number[];
  lineDashOffset?: number;
  globalAlpha?: number;
  globalCompositeOperation?: GlobalCompositeOperation;
  font?: string;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
}

interface SerializedTransform {
  name: string;
  displacement: Vec2;
  rotation: number;
  rotationOrigin: RotationOriginValue;
  scale: Vec2;
  shear: Vec2;
  perspective: Vec2;
  reflect: Vec2;
  rasterPadding: number;
}

interface SerializedBaseNode {
  type: string;
  transform: SerializedTransform;
  styles?: SerializedStyles;
}

interface SerializedCompositionNode extends SerializedBaseNode {
  type: 'Composition';
  width: number;
  height: number;
  boundsMode: 'fixed' | 'auto-expand';
  autoResizeTargetCanvas: boolean;
  children: SerializedNode[];
}

interface SerializedRectangleNode extends SerializedBaseNode {
  type: 'Rectangle';
  contentWidth: number;
  contentHeight: number;
}

interface SerializedCircleNode extends SerializedBaseNode {
  type: 'Circle';
  radius: number;
}

interface SerializedEllipseNode extends SerializedBaseNode {
  type: 'Ellipse';
  radiusX: number;
  radiusY: number;
}

interface SerializedPolygonNode extends SerializedBaseNode {
  type: 'Polygon';
  points: Vec2[];
}

interface SerializedPathNode extends SerializedBaseNode {
  type: 'Path';
  points: Vec2[];
  closed: boolean;
}

interface SerializedBezierNode extends SerializedBaseNode {
  type: 'Bezier';
  start: Vec2;
  control1: Vec2;
  control2: Vec2;
  end: Vec2;
}

interface SerializedTextNode extends SerializedBaseNode {
  type: 'Text';
  text: string;
  fontSize?: string;
  fontFamily?: string;
  fontStyle?: string;
  fontVariant?: string;
  fontWeight?: string;
  lineHeight?: string;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
}

interface SerializedPictureNode extends SerializedBaseNode {
  type: 'Picture';
  imageSrc: string;
}

export type SerializedNode =
  | SerializedCompositionNode
  | SerializedRectangleNode
  | SerializedCircleNode
  | SerializedEllipseNode
  | SerializedPolygonNode
  | SerializedPathNode
  | SerializedBezierNode
  | SerializedTextNode
  | SerializedPictureNode;

export interface SerializedScene {
  version: 1;
  scene: SerializedCompositionNode;
}

function toVec2(value: Vector): Vec2 {
  return [value[0], value[1]];
}

function makeVector(source: Vector, value: Vec2): Vector {
  const VectorCtor = source.constructor as new (entries: number[]) => Vector;
  return new VectorCtor([value[0], value[1]]);
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function getTransform(component: Component): SerializedTransform {
  return {
    name: component.name,
    displacement: toVec2(component.displacement),
    rotation: component.rotation,
    rotationOrigin: Array.isArray(component.rotationOrigin)
      ? [component.rotationOrigin[0], component.rotationOrigin[1]]
      : component.rotationOrigin,
    scale: toVec2(component.scale),
    shear: toVec2(component.shear),
    perspective: toVec2(component.perspective),
    reflect: toVec2(component.reflect),
    rasterPadding: component.rasterPadding,
  };
}

function getStyles(component: Component): SerializedStyles {
  return {
    fillStyle: asString(component.context.fillStyle),
    strokeStyle: asString(component.context.strokeStyle),
    lineWidth: component.context.lineWidth,
    lineCap: component.context.lineCap,
    lineJoin: component.context.lineJoin,
    miterLimit: component.context.miterLimit,
    lineDash: component.context.getLineDash(),
    lineDashOffset: component.context.lineDashOffset,
    globalAlpha: component.context.globalAlpha,
    globalCompositeOperation: component.context.globalCompositeOperation,
    font: component.context.font,
    textAlign: component.context.textAlign,
    textBaseline: component.context.textBaseline,
  };
}

function applyTransform(component: Component, transform: SerializedTransform) {
  component.name = transform.name;
  component.displacement = makeVector(component.displacement, transform.displacement);
  component.rotation = transform.rotation;
  component.rotationOrigin = transform.rotationOrigin;
  component.scale = makeVector(component.scale, transform.scale);
  component.shear = makeVector(component.shear, transform.shear);
  component.perspective = makeVector(component.perspective, transform.perspective);
  component.reflect = makeVector(component.reflect, transform.reflect);
}

function applyStyles(component: Component, styles?: SerializedStyles) {
  if (!styles) {
    component.invalidate();
    return;
  }

  if (styles.fillStyle !== undefined) component.context.fillStyle = styles.fillStyle;
  if (styles.strokeStyle !== undefined) component.context.strokeStyle = styles.strokeStyle;
  if (styles.lineWidth !== undefined) component.context.lineWidth = styles.lineWidth;
  if (styles.lineCap !== undefined) component.context.lineCap = styles.lineCap;
  if (styles.lineJoin !== undefined) component.context.lineJoin = styles.lineJoin;
  if (styles.miterLimit !== undefined) component.context.miterLimit = styles.miterLimit;
  if (styles.lineDash !== undefined) component.context.setLineDash(styles.lineDash);
  if (styles.lineDashOffset !== undefined) component.context.lineDashOffset = styles.lineDashOffset;
  if (styles.globalAlpha !== undefined) component.context.globalAlpha = styles.globalAlpha;
  if (styles.globalCompositeOperation !== undefined) component.context.globalCompositeOperation = styles.globalCompositeOperation;
  if (styles.font !== undefined) component.context.font = styles.font;
  if (styles.textAlign !== undefined) component.context.textAlign = styles.textAlign;
  if (styles.textBaseline !== undefined) component.context.textBaseline = styles.textBaseline;

  component.invalidate();
}

function serializeNode(component: Component): SerializedNode {
  const transform = getTransform(component);
  const styles = getStyles(component);

  if (component instanceof Composition) {
    return {
      type: 'Composition',
      width: component.width,
      height: component.height,
      boundsMode: component.boundsMode,
      autoResizeTargetCanvas: component.autoResizeTargetCanvas,
      transform,
      styles,
      children: component.children.map((child) => serializeNode(child)),
    };
  }

  if (component instanceof Rectangle) {
    return {
      type: 'Rectangle',
      contentWidth: component.width - (2 * component.effectiveRasterPadding),
      contentHeight: component.height - (2 * component.effectiveRasterPadding),
      transform,
      styles,
    };
  }

  if (component instanceof Circle) {
    return {
      type: 'Circle',
      radius: component.radius,
      transform,
      styles,
    };
  }

  if (component instanceof Ellipse) {
    return {
      type: 'Ellipse',
      radiusX: component.radiusX,
      radiusY: component.radiusY,
      transform,
      styles,
    };
  }

  if (component instanceof Polygon) {
    return {
      type: 'Polygon',
      points: component.points.map((point) => [point[0], point[1]]),
      transform,
      styles,
    };
  }

  if (component instanceof Path) {
    return {
      type: 'Path',
      points: component.points.map((point) => [point[0], point[1]]),
      closed: component.closed,
      transform,
      styles,
    };
  }

  if (component instanceof Bezier) {
    const bezier = component as unknown as {
      start: Vector;
      control1: Vector;
      control2: Vector;
      end: Vector;
    };

    return {
      type: 'Bezier',
      start: toVec2(bezier.start),
      control1: toVec2(bezier.control1),
      control2: toVec2(bezier.control2),
      end: toVec2(bezier.end),
      transform,
      styles,
    };
  }

  if (component instanceof Text) {
    return {
      type: 'Text',
      text: component.text,
      fontSize: component.fontSize,
      fontFamily: component.fontFamily,
      fontStyle: component.fontStyle,
      fontVariant: component.fontVariant,
      fontWeight: component.fontWeight,
      lineHeight: component.lineHeight,
      textAlign: component.textAlign,
      textBaseline: component.textBaseline,
      transform,
      styles,
    };
  }

  if (component instanceof Picture) {
    const picture = component as Picture & { imageSrc?: string };
    const image = component.image as Partial<HTMLImageElement>;
    const imageSrc = picture.imageSrc ?? image.currentSrc ?? image.src;

    if (!imageSrc) {
      throw new Error(`Picture "${component.name}" cannot be serialized without imageSrc`);
    }

    return {
      type: 'Picture',
      imageSrc,
      transform,
      styles,
    };
  }

  throw new Error(`Unsupported component type for serialization: ${component.constructor.name}`);
}

function ensureScene(source: SerializedScene | string): SerializedScene {
  const parsed = typeof source === 'string'
    ? JSON.parse(source) as SerializedScene
    : source;

  if (!parsed || parsed.version !== 1 || !parsed.scene || parsed.scene.type !== 'Composition') {
    throw new Error('Invalid serialized scene payload');
  }

  return parsed;
}

function componentOptionsFor(node: SerializedBaseNode) {
  return {
    x: node.transform.displacement[0],
    y: node.transform.displacement[1],
    rotation: node.transform.rotation,
    rotationOrigin: node.transform.rotationOrigin,
    scale: node.transform.scale,
    shear: node.transform.shear,
    perspective: node.transform.perspective,
    reflect: node.transform.reflect,
    rasterPadding: node.transform.rasterPadding,
  };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image "${src}"`));
    image.src = src;
  });
}

async function deserializeNode(node: SerializedNode): Promise<Component> {
  const options = componentOptionsFor(node);

  switch (node.type) {
    case 'Composition': {
      const composition = new Composition(node.width, node.height, {
        ...options,
        boundsMode: node.boundsMode,
      });
      composition.autoResizeTargetCanvas = Boolean(node.autoResizeTargetCanvas);
      applyTransform(composition, node.transform);
      applyStyles(composition, node.styles);

      for (const child of node.children) {
        composition.addChild(await deserializeNode(child));
      }

      return composition;
    }

    case 'Rectangle': {
      const rectangle = new Rectangle(node.contentWidth, node.contentHeight, options);
      applyTransform(rectangle, node.transform);
      applyStyles(rectangle, node.styles);
      return rectangle;
    }

    case 'Circle': {
      const circle = new Circle(node.radius, options);
      applyTransform(circle, node.transform);
      applyStyles(circle, node.styles);
      return circle;
    }

    case 'Ellipse': {
      const ellipse = new Ellipse(node.radiusX, node.radiusY, options);
      applyTransform(ellipse, node.transform);
      applyStyles(ellipse, node.styles);
      return ellipse;
    }

    case 'Polygon': {
      const polygon = new Polygon(node.points, options);
      applyTransform(polygon, node.transform);
      applyStyles(polygon, node.styles);
      return polygon;
    }

    case 'Path': {
      const path = new Path(node.points, {
        ...options,
        closed: node.closed,
      });
      applyTransform(path, node.transform);
      applyStyles(path, node.styles);
      return path;
    }

    case 'Bezier': {
      const bezier = new Bezier({
        ...options,
        start: node.start,
        control1: node.control1,
        control2: node.control2,
        end: node.end,
      });
      applyTransform(bezier, node.transform);
      applyStyles(bezier, node.styles);
      return bezier;
    }

    case 'Text': {
      const text = new Text({
        ...options,
        text: node.text,
        fontSize: node.fontSize,
        fontFamily: node.fontFamily,
        fontStyle: node.fontStyle,
        fontVariant: node.fontVariant,
        fontWeight: node.fontWeight,
        lineHeight: node.lineHeight,
        textAlign: node.textAlign,
        textBaseline: node.textBaseline,
      });
      applyTransform(text, node.transform);
      applyStyles(text, node.styles);
      return text;
    }

    case 'Picture': {
      const image = await loadImage(node.imageSrc);
      const picture = new Picture(image, options) as Picture & { imageSrc?: string };
      picture.imageSrc = node.imageSrc;
      applyTransform(picture, node.transform);
      applyStyles(picture, node.styles);
      return picture;
    }

    default:
      throw new Error(`Unsupported serialized node type: ${(node as SerializedNode).type}`);
  }
}

export function serializeScene(scene: Composition): SerializedScene {
  return {
    version: 1,
    scene: serializeNode(scene) as SerializedCompositionNode,
  };
}

export function serializeSceneToString(scene: Composition): string {
  return JSON.stringify(serializeScene(scene));
}

export async function deserializeScene(source: SerializedScene | string): Promise<Composition> {
  const parsed = ensureScene(source);
  const restoredRoot = await deserializeNode(parsed.scene);

  if (!(restoredRoot instanceof Composition)) {
    throw new Error('Deserialized root is not a Composition');
  }

  return restoredRoot;
}

export async function restoreScene(targetScene: Composition, source: SerializedScene | string): Promise<void> {
  const restoredRoot = await deserializeScene(source);

  targetScene.children.slice().forEach((child) => targetScene.removeChild(child));
  const restoredChildren = restoredRoot.children.slice();
  restoredChildren.forEach((child) => targetScene.addChild(child));

  targetScene.name = restoredRoot.name;
  targetScene.displacement = makeVector(targetScene.displacement, toVec2(restoredRoot.displacement));
  targetScene.rotation = restoredRoot.rotation;
  targetScene.rotationOrigin = restoredRoot.rotationOrigin;
  targetScene.scale = makeVector(targetScene.scale, toVec2(restoredRoot.scale));
  targetScene.shear = makeVector(targetScene.shear, toVec2(restoredRoot.shear));
  targetScene.perspective = makeVector(targetScene.perspective, toVec2(restoredRoot.perspective));
  targetScene.reflect = makeVector(targetScene.reflect, toVec2(restoredRoot.reflect));
  targetScene.boundsMode = restoredRoot.boundsMode;
  targetScene.autoResizeTargetCanvas = restoredRoot.autoResizeTargetCanvas;

  targetScene.width = restoredRoot.width;
  targetScene.height = restoredRoot.height;
  targetScene.invalidate();
}
