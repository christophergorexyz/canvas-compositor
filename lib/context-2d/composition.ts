import Component from './component';

/**
 * The Composition class is an extension of the Primitive that is
 * composed of other extensions of the Primitive. The Composition
 * is used to establish the Scene graph as the parent of all other
 * objects on screen. This is the key abstraction of the [composite
 * pattern](https://en.wikipedia.org/wiki/Composite_pattern): an
 * action taken on the parent element acts upon all of the children,
 * and transatively, all of their children.
 */
export default class Composition extends Component {

  /**
   * the an array of children that are found at (x, y)
   * @return {object} childrenAt all the children below the point
   * @param {number} x the x coordinate
   * @param {number} y the y coordinate
   */
  childrenAt(x: number, y: number) {
    return this.children.filter((c) => c.isPointInPath(this.path, x, y));
  }

  /**
   * get the top-most child at the point (x, y)
   */
  childAt(x: number, y: number) {
    //loop over the children in reverse because the last in the list is drawn on the top
    return this.children.reverse().find((c) => c.isPointInPath(this.path, x, y));
  }

  /**
   * add a child to this composition
   */
  addChild(child: Component) {
    child.parent = this;
    this.children.push(child);
    this.dirty = true;
  }

  /**
   * add multiple children to the composition
   */
  addChildren(children: Component[]) {
    children.forEach(c => c.parent = this);
    this.children = [...this.children, ...children];
    this.dirty = true;
  }

  /**
   * remove a child from this composition
   */
  removeChild(child: Component) {

    const index = this.children.indexOf(child);
    if (index >= 0) {
      return this.children.splice(index, 1);
    }
  }

  /**
   * override the render function to render the children onto this compositions prerendering canvas
   * @override
   */
  render() {
    // required to make sure that the drawing occurs within the bounds of this composition
    for (const c of this.children) {
      c.draw(this, this.offset.scale(-1));
    }

    // `destination-out` will erase things
    //this._prerenderingContext.globalCompositeOperation = 'destination-out';
    //_.each(this.masks, function (m) {
    //m.draw(renderContext, contextOffset);
    //});
    //renderContext.globalCompositeOperation = 'normal';
  }
}
