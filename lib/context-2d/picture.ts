import Component, { ComponentOptions } from './component';

type SizedCanvasImageSource = CanvasImageSource & { width: number; height: number };

/**
 * A drawable image component.
 */
export default class Picture extends Component {
  readonly image: SizedCanvasImageSource;

  constructor(image: SizedCanvasImageSource, options?: ComponentOptions) {
    const width = Math.max(1, Math.ceil(image.width));
    const height = Math.max(1, Math.ceil(image.height));
    super(width, height, options);
    this.image = image;
  }

  render() {
    if (this.image.width > 0 && this.image.height > 0) {
      this.context.drawImage(this.image, 0, 0, this.width, this.height);
    }
  }
}
