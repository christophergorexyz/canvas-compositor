const ALL_CHARS = '1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm.,`~;:\'"!?@#$%^&*()_+={}[]|<>/';

export interface TextHeightMetrics {
  height: number;
  ascent: number;
  descent: number;
}

export function getTextHeight(font: string): TextHeightMetrics {
  if (typeof document === 'undefined' || !document.body) {
    const matchedSize = Number.parseFloat(font);
    const height = Number.isFinite(matchedSize) ? matchedSize : 16;
    return {
      height,
      ascent: height * 0.8,
      descent: height * 0.2,
    };
  }

  const fontHolder = document.createElement('span');
  fontHolder.innerText = ALL_CHARS;
  fontHolder.style.font = font;

  const baselineRuler = document.createElement('div');
  baselineRuler.style.display = 'inline-block';
  baselineRuler.style.width = '1px';
  baselineRuler.style.height = '0';
  baselineRuler.style.verticalAlign = 'baseline';

  const wrapper = document.createElement('div');
  wrapper.appendChild(fontHolder);
  wrapper.appendChild(baselineRuler);
  wrapper.style.whiteSpace = 'nowrap';
  document.body.appendChild(wrapper);

  const fontRect = fontHolder.getBoundingClientRect();
  const baselineRect = baselineRuler.getBoundingClientRect();

  const scrollTop = document.body.scrollTop;
  const fontTop = fontRect.top + scrollTop;
  const fontBottom = fontTop + fontRect.height;
  const baseline = baselineRect.top + scrollTop;

  document.body.removeChild(wrapper);

  const ascent = baseline - fontTop;
  const descent = fontBottom - baseline;

  return {
    height: fontRect.height,
    ascent,
    descent,
  };
}

export function formatFontString(
  fontStyle: string,
  fontVariant: string,
  fontWeight: string,
  fontSize: string,
  lineHeight: string,
  fontFamily: string,
) {
  return `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize}/${lineHeight} ${fontFamily}`;
}

export type TextStyle = Partial<Pick<CanvasRenderingContext2D, 'font' | 'textAlign' | 'textBaseline'>>;

export function measureText(text: string, context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, style?: TextStyle) {
  if (style) {
    Object.assign(context, style);
  }
  return context.measureText(text);
}
