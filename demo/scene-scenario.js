(function (global) {
  const { Components2d } = global.CanvasCompositor;
  const { Rectangle, Circle, Ellipse, Polygon, Composition, Bezier, Picture, Text, Line, Path } = Components2d;

  function setDisplacement(component, x, y) {
    const VectorCtor = component.displacement.constructor;
    component.displacement = new VectorCtor([x, y]);
  }

  function configureRectangle(rect, options) {
    setDisplacement(rect, options.x, options.y);
    rect.context.fillStyle = options.fill;
    rect.context.strokeStyle = options.stroke;
    rect.context.lineWidth = options.lineWidth ?? 2;
    rect.invalidate();
    return rect;
  }

  function createDemoScene(scene, options = {}) {
    const imageSrc = options.imageSrc ?? '../demo.png';

    const bgCard = configureRectangle(new Rectangle(260, 130), {
      x: 40,
      y: 70,
      fill: '#111827',
      stroke: '#60a5fa',
      lineWidth: 3,
    });

    const circ = new Circle(50, { x: 130, y: 340 });
    circ.context.fillStyle = '#38bdf8';
    circ.context.strokeStyle = '#0f172a';
    circ.context.lineWidth = 3;
    circ.rotationOrigin = 'center';
    circ.rotation = Math.PI / 18;
    circ.invalidate();

    const ell = new Ellipse(70, 35, { x: 360, y: 300 });
    ell.context.fillStyle = '#a78bfa';
    ell.context.strokeStyle = '#312e81';
    ell.context.lineWidth = 3;
    ell.rotationOrigin = 'center';
    ell.rotation = -Math.PI / 9;
    ell.invalidate();

    const poly = new Polygon([
      [610, 120],
      [760, 170],
      [710, 260],
      [580, 230],
    ], { x: 0, y: 0 });
    poly.context.fillStyle = '#34d399';
    poly.context.strokeStyle = '#064e3b';
    poly.context.lineWidth = 3;
    poly.rotationOrigin = 'center';
    poly.rotation = Math.PI / 14;
    poly.invalidate();

    const guideA = new Line([120, 410], [1, 0.16]);
    const guideB = new Line([780, 410], [-1, 0.22]);
    const guideIntersection = Line.intersection(guideA, guideB);

    const curve = new Bezier({
      start: [0, 80],
      control1: [120, 220],
      control2: [260, -80],
      end: [380, 120],
      x: 120,
      y: 380,
    });
    curve.name = 'Bezier Curve';
    curve.context.strokeStyle = '#ec4899';
    curve.context.lineWidth = 6;
    curve.rotationOrigin = 'center';
    curve.rotation = -Math.PI / 30;
    curve.invalidate();

    const openPath = new Path([
      [590, 420],
      [650, 380],
      [710, 410],
      [760, 360],
      [790, 420],
    ], {
      x: 0,
      y: 0,
      closed: false,
    });
    openPath.name = 'Path';
    openPath.context.strokeStyle = '#be185d';
    openPath.context.lineWidth = 5;
    openPath.rotationOrigin = 'center';
    openPath.rotation = Math.PI / 20;
    openPath.invalidate();

    const text = new Text({
      text: 'Canvas Compositor Demo',
      x: 50,
      y: 24,
      fontSize: '22px',
      fontWeight: '700',
      fontFamily: 'sans-serif',
    });
    text.name = 'Text';
    text.context.fillStyle = '#0f172a';
    if (guideIntersection) {
      setDisplacement(text, Math.max(20, guideIntersection[0] - 120), Math.max(20, guideIntersection[1] - 260));
    }
    text.rotationOrigin = 'center';
    text.rotation = -Math.PI / 36;
    text.invalidate();

    const group = new Composition(260, 180, { x: 520, y: 320 });
    group.name = 'Primary Group';
    group.boundsMode = 'fixed';

    const groupCircle = new Circle(30, { x: 58, y: 62 });
    groupCircle.context.fillStyle = '#fb7185';
    groupCircle.context.strokeStyle = '#881337';
    groupCircle.context.lineWidth = 3;
    groupCircle.rotationOrigin = 'center';
    groupCircle.rotation = Math.PI / 10;
    groupCircle.invalidate();

    const groupEllipse = new Ellipse(44, 22, { x: 150, y: 64 });
    groupEllipse.context.fillStyle = '#fcd34d';
    groupEllipse.context.strokeStyle = '#78350f';
    groupEllipse.context.lineWidth = 3;
    groupEllipse.rotationOrigin = 'center';
    groupEllipse.rotation = -Math.PI / 8;
    groupEllipse.invalidate();

    const groupPath = new Path([
      [14, 132],
      [70, 102],
      [122, 146],
      [176, 110],
      [228, 144],
    ], {
      x: 0,
      y: 0,
      closed: false,
    });
    groupPath.name = 'Group Path';
    groupPath.context.strokeStyle = '#2563eb';
    groupPath.context.lineWidth = 4;
    groupPath.rotationOrigin = 'center';
    groupPath.rotation = Math.PI / 24;
    groupPath.invalidate();

    group.addChildren([groupCircle, groupEllipse, groupPath]);

    scene.addChildren([bgCard, circ, ell, poly, curve, openPath, text, group]);
    scene.boundsMode = 'fixed';

    const demoImage = new Image();
    demoImage.src = imageSrc;
    demoImage.addEventListener('load', () => {
      const picture = new Picture(demoImage, {
        x: 640,
        y: 320,
        rotationOrigin: 'center',
      });
      picture.imageSrc = imageSrc;
      picture.name = 'Picture';
      picture.context.strokeStyle = '#0f172a';
      picture.context.lineWidth = 2;
      picture.path.rect(0, 0, picture.width, picture.height);
      picture.rotation = -Math.PI / 16;
      picture.reflect = new picture.reflect.constructor([-1, 1]);
      picture.invalidate();
      scene.addChild(picture);
    });

    return { group };
  }

  global.CanvasCompositorDemo = {
    createDemoScene,
  };
})(globalThis);
