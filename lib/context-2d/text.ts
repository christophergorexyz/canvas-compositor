import Component, { ComponentOptions } from './component';
import * as TextDefaults from './text-defaults';
import { formatFontString, getTextHeight, measureText } from './text-utilities';

type TextContext = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

export interface TextOptions extends ComponentOptions {
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

function getMeasureContext(): CanvasRenderingContext2D {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('CanvasRenderingContext2D could not be created for text measurement');
  }
  return context;
}

/**
 * A text component.
 */
export default class Text extends Component {
  text: string;
  fontSize: string;
  fontFamily: string;
  fontStyle: string;
  fontVariant: string;
  fontWeight: string;
  lineHeight: string;
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;

  constructor(options: TextOptions) {
    const fontString = formatFontString(
      options.fontStyle ?? TextDefaults.FONT_STYLE,
      options.fontVariant ?? TextDefaults.FONT_VARIANT,
      options.fontWeight ?? TextDefaults.FONT_WEIGHT,
      options.fontSize ?? TextDefaults.FONT_SIZE,
      options.lineHeight ?? TextDefaults.LINE_HEIGHT,
      options.fontFamily ?? TextDefaults.FONT_FAMILY,
    );

    const context = getMeasureContext();
    const metrics = measureText(options.text, context, { font: fontString });
    const textHeight = getTextHeight(fontString);

    const width = Math.max(1, Math.ceil(metrics.width));
    const height = Math.max(1, Math.ceil(textHeight.height));

    super(width, height, options);

    this.text = options.text;
    this.fontSize = options.fontSize ?? TextDefaults.FONT_SIZE;
    this.fontFamily = options.fontFamily ?? TextDefaults.FONT_FAMILY;
    this.fontStyle = options.fontStyle ?? TextDefaults.FONT_STYLE;
    this.fontVariant = options.fontVariant ?? TextDefaults.FONT_VARIANT;
    this.fontWeight = options.fontWeight ?? TextDefaults.FONT_WEIGHT;
    this.lineHeight = options.lineHeight ?? TextDefaults.LINE_HEIGHT;
    this.textAlign = options.textAlign ?? TextDefaults.TEXT_ALIGN;
    this.textBaseline = options.textBaseline ?? TextDefaults.TEXT_BASELINE;

    this.updateBoundsPath();
  }

  get fontString() {
    return formatFontString(this.fontStyle, this.fontVariant, this.fontWeight, this.fontSize, this.lineHeight, this.fontFamily);
  }

  private updateTextStyle(context: TextContext = this.context) {
    context.font = this.fontString;
    context.textAlign = this.textAlign;
    context.textBaseline = this.textBaseline;
  }

  private updateBoundsPath() {
    this.path.rect(0, 0, this.width, this.height);
  }

  render() {
    this.updateTextStyle();
    const textHeight = getTextHeight(this.fontString);
    this.context.fillText(this.text, 0, textHeight.ascent);
  }
}
