// import _ from "lodash";
// import { colors } from "Common/stylesheets/styleConstants.json";

/**
 * Utility functions for manipulating color values
 */
/** @enum {Symbol} */

export const COLOR_FORMATS = {
  rgb: Symbol("RGB"),
  decimal: Symbol("DECIMAL"),
  hex: Symbol("HEX"),
  css: Symbol("CSS"),
  hsl: Symbol("HSL"),
};

function getComponent(p, q, t) {
  let ret = p;
  if (t < 1 / 6) {
    ret = p + (q - p) * 6 * t;
  } else if (t >= 1 / 6 && t < 0.5) {
    ret = q;
  } else if (t >= 0.5 && t < 2 / 3) {
    ret = p + (q - p) * 6 * (2 / 3 - t);
  }
  return ret;
}

export function RGBtoHSL(rgb24) {
  let h;
  let s;
  const r = (rgb24 >> 16) / 255;
  const g = ((rgb24 >> 8) & 0xff) / 255;
  const b = (rgb24 & 0xff) / 255;
  let delta;
  const cmax = Math.max(r, Math.max(g, b));
  const cmin = Math.min(r, Math.min(g, b));
  const l = (cmax + cmin) / 2.0;
  if (cmax === cmin) {
    s = 0;
    h = 0;
  } else {
    if (l < 0.5) {
      s = (cmax - cmin) / (cmax + cmin);
    } else {
      s = (cmax - cmin) / (2.0 - cmax - cmin);
    }
    delta = cmax - cmin;
    if (r === cmax) {
      h = (g - b) / delta;
    } else if (g === cmax) {
      h = 2.0 + (b - r) / delta;
    } else {
      h = 4.0 + (r - g) / delta;
    }
    h = h / 6.0;
    if (h < 0.0) {
      h = h + 1;
    }
    h = 360 * h;
  }
  return { h: h, s: s, l: l };
}

export function HSLtoRGB(h = 0, s = 0, l = 0) {
  function wrap(num, lower = 0, upper = 1) {
    if (num < lower) {
      return num + (upper - lower);
    }
    if (num > upper) {
      return num - (upper - lower);
    }
    return num;
  }

  if (l === 1) {
    return { r: 255, g: 255, b: 255 };
  }
  let q = 0;
  if (l >= 0.5) {
    q = l + (s - l * s);
  }
  if (l < 0.5) {
    q = l * (1 + s);
  }
  const p = 2 * l - q;
  const hk = h / 360;
  let tr = hk + 1 / 3;
  let tg = hk;
  let tb = hk - 1 / 3;
  tr = wrap(tr);
  tg = wrap(tg);
  tb = wrap(tb);
  const r = getComponent(p, q, tr) * 255;
  const g = getComponent(p, q, tg) * 255;
  const b = getComponent(p, q, tb) * 255;
  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b),
  };
}

/**
 * Color conversion functions below adhere to the following convention
 * RGB: return format is an object of the shape { r: [red], g: [green], b: [blue] }
 * hex: A 6-digit hexadecimal number with valid characters 012345679ABCDEF
 * css: A hex number with a # prepended
 * decimal: a base 10 number
 * zeroXString: the truer representation of a hexadecimal number where the 6 digit value is prepended with 0x
 */

/**
 * Helper method to ensure hex values are padded to length 6
 * @param {string} hex hexadecimal representation of number
 * @return {string} hex number of length 6
 */
function padHex(hex) {
  return _.padStart(hex, 6, "0");
}

export function hexToCss(hex = "000000") {
  return "#" + hex;
}

export function cssToHex(css = "#000000") {
  return css.toString().replace("#", "");
}

export function cssToZeroXString(css = "#000000") {
  return css.replace(/^#/, "0x");
}

export function zeroXStringToCss(hex = "0x000000") {
  return hex.toString(16).replace(/^0x/, "#");
}

export function cssToHexInt(css) {
  return parseInt(css.replace(/^#/, ""), 16);
}

export function rgbToHex(r = 0, g = 0, b = 0) {
  return ((1 << 24) + (~~r << 16) + (~~g << 8) + ~~b).toString(16).slice(1);
}

export function hexToRgb(hex = "000000") {
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return { r, g, b };
}

export function hexToDecimal(hex = "000000") {
  return parseInt(hex, 16);
}

export function decimalToHex(decimal = 0) {
  const hex = decimal.toString(16);
  return padHex(hex);
}

export function rgbToCss(r = 0, g = 0, b = 0) {
  const hex = rgbToHex(r, g, b);
  return hexToCss(hex);
}

export function cssToRgb(css = "#000000") {
  const hex = cssToHex(css);
  return hexToRgb(hex);
}

export function rgbToDecimal(r = 0, g = 0, b = 0) {
  const hex = rgbToHex(r, g, b);
  return hexToDecimal(hex);
}

export function decimalToRgb(decimal = 0) {
  const hex = decimalToHex(decimal);
  return hexToRgb(hex);
}

export function cssToDecimal(css = "#000000") {
  const hex = cssToHex(css);
  return hexToDecimal(hex);
}

export function decimalToCss(decimal = 0) {
  const hex = decimalToHex(decimal);
  return hexToCss(hex);
}

/**
 * Converts rgb or rgba color value to hex value
 * @param {string} rgb - rgb or rgba string. When given an rgb string, e.g.
 * 'rgb(255, 0, 0)', the method will produce a hex string for the given rgb
 * values. When given an rgba string, e.g. 'rgba(255, 0, 0, 0.5)', the method
 * will not preserve the opacity of the rgba value (in this case 0.5) and will
 * produce a hex string only for the base rgb values (255, 0, and 0).
 * @param {boolean} uppercase - whether or not to return hex value uppercase
 * @return {string|null} the hex color value or null
 */
export function rgbStringToHexString(rgb = "rgb(0, 0, 0)", uppercase = false) {
  const rgbValues = rgb.match(
    /^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i
  );
  if (!rgbValues || rgbValues.length !== 4) {
    return null;
  }
  // Remove initial match string included in results
  rgbValues.shift();
  // Get hex code from rgb values array
  const hex = rgbToCss.apply(null, rgbValues);
  if (!uppercase) {
    return hex;
  }
  return hex.toUpperCase();
}

export function isValidHexColor(possibleHex) {
  // I don't care about your fancy 3-char hex color
  if (!possibleHex || possibleHex.length !== 6) {
    return false;
  }
  const a = parseInt(possibleHex, 16);
  return a.toString(16) === possibleHex.toLowerCase();
}

export function isValidCssColor(possibleCss) {
  return isValidHexColor(cssToHex(possibleCss));
}

/**
 * Method designed to take an rgb object and return that color in the
 * specified format
 * @param  {object} rgb of format { r: [value], g: [value], b: [value] }
 * @param  {Symbol} colorFormat A value from COLOR_FORMATS
 * @return {object|number|string} color representation depending on color format
 */
export function formatFromRgb(rgb, colorFormat) {
  let color;
  switch (colorFormat) {
    case COLOR_FORMATS.rgb:
      color = rgb;
      break;
    case COLOR_FORMATS.decimal:
      color = rgbToDecimal(rgb.r, rgb.g, rgb.b);
      break;
    case COLOR_FORMATS.hex:
      color = rgbToHex(rgb.r, rgb.g, rgb.b);
      break;
    case COLOR_FORMATS.css:
      color = rgbToCss(rgb.r, rgb.g, rgb.b);
      break;
    case COLOR_FORMATS.hsl:
      color = RGBtoHSL(rgbToDecimal(rgb.r, rgb.g, rgb.b));
      break;
    default:
      color = rgb;
  }

  return color;
}

/**
 * [formatFromDecimal description]
 * @param  {number} decimalColor numeric representation of a color
 * @param  {Symbol} colorFormat  A value from COLOR_FORMATS
 * @return {object|number|string} color representation depending on color format
 */
export function formatFromDecimal(decimalColor, colorFormat) {
  let color;
  switch (colorFormat) {
    case COLOR_FORMATS.rgb:
      color = decimalToRgb(decimalColor);
      break;
    case COLOR_FORMATS.decimal:
      color = decimalColor;
      break;
    case COLOR_FORMATS.hex:
      color = decimalToHex(decimalColor);
      break;
    case COLOR_FORMATS.css:
      color = decimalToCss(decimalColor);
      break;
    case COLOR_FORMATS.hsl:
      color = RGBtoHSL(decimalColor);
      break;
    default:
      color = decimalColor;
  }

  return color;
}

export function interpolateRGB(
  fromRGB = { r: 0, g: 0, b: 0 },
  toRGB = { r: 0, g: 0, b: 0 },
  percentInteger = 0
) {
  const percent = percentInteger / 100.0;
  const redValue = Math.round(fromRGB.r + (toRGB.r - fromRGB.r) * percent);
  const greenValue = Math.round(fromRGB.g + (toRGB.g - fromRGB.g) * percent);
  const blueValue = Math.round(fromRGB.b + (toRGB.b - fromRGB.b) * percent);

  return { r: redValue, g: greenValue, b: blueValue };
}
/**
 *  Interpolate between two colors using linear interpolation on H, S, and L
 *  'percent' is between 0 and 1.
 * [formatFromDecimal description]
 * @param  {number} fromColor hexadecimal representation of start color
 * @param  {number} toColor hexadecimal representation of end color
 * @param  {number} percent between 0 and 1 representing color value between
 *                          fromColor and toColor
 * @return {number} rgb color
 */
export function interpolateHSL(fromColor, toColor, percent) {
  const hslFrom = RGBtoHSL(fromColor);
  const hslTo = RGBtoHSL(toColor);

  const h = hslFrom.h + (hslTo.h - hslFrom.h) * percent;
  const s = hslFrom.s + (hslTo.s - hslFrom.s) * percent;
  const l = hslFrom.l + (hslTo.l - hslFrom.l) * percent;

  return HSLtoRGB(h, s, l);
}

/**
 * Function to find the color associated with a particular value for a provided
 * color curve (often used with our "fixed" color schemes)
 * @param {number} value number to find on color curve
 * @param {array} colorCurve array of colorCurveInterval objects that provide
 *                           lower and upper bounds for each color in the scheme.
 * @param {Symbol} colorFormat a value from the exported COLOR_FORMATS object.
 *                             Default to COLOR_FORMATS.rgb
 * @return {number} color
 */
export function getColorFromColorCurve(
  value,
  colorCurve,
  colorFormat = COLOR_FORMATS.rgb
) {
  let decimalColor = 0;
  for (const curveInterval of colorCurve) {
    if (value >= curveInterval.min && value < curveInterval.max) {
      decimalColor = curveInterval.color;
      break;
    }
  }

  const color = formatFromDecimal(decimalColor, colorFormat);
  return color;
}

/**
 * Quick utility that may be used by fixed color schemes to create color curve
 * intervals defined by a lower and upper boundary and an associated color.
 * @param {number} min The minimum value in the defined interval range
 * @param {number} max The maximum value in the defined interval range
 * @param {number} color A numeric representation of a color value,
 *                       typically a decimal or hexadecimal.
 * @return {object} object representation of a color curve interval, formatted as
 *                         { min: [value], max: [value], color: [value]}
 */
export function colorCurveInterval(min, max, color) {
  return { min, max, color };
}

/**
 * [getColorFromFixedColorScheme description]
 * @param  {object} colorScheme A fixed color scheme
 * @return {function} getColor function with a standard signature:
 *   getColor(value, {min = null, max = null, reverse = false, colorFormat})
 *   @param  {number} value variable number to be colored according to curve
 *   @param  {Symbol} colorFormat a value from ColorUtil.COLOR_FORMATS denoting
 *                                the color format (rgb, hex, css, hsl, decimal)
 *   @param  {number} min Minimum value in range for dynamic (non-fixed)
 *                        color schemes
 *   @param  {number} max Maximum value in range for dynamic (non-fixed)
 *                        color schemes
 *   @param  {boolean} reverse TRUE to flip the color scale direction for
 *                             dynamic (non-fixed) color schemes
 */
export function getColorFromFixedColorScheme(colorScheme) {
  return (
    value,
    {
      min = null, // eslint-disable-line no-unused-vars
      max = null, // eslint-disable-line no-unused-vars
      reverse = false, // eslint-disable-line no-unused-vars
      colorFormat = COLOR_FORMATS.rgb,
    } = {
      min: null,
      max: null,
      reverse: false,
      colorFormat: COLOR_FORMATS.rgb,
    }
  ) => {
    return getColorFromColorCurve(value, colorScheme, colorFormat);
  };
}

/**
 * Create a list of colorCurveInterval stops, divided between minValue and maxValue.
 * This purposely leaves the color as null for filling in later, e.g. dynamic color schemes
 * @param {number} minValue - Smallest value in the data you want to color.
 * @param {number} maxValue - Largest value in the data you want to color.
 * @param {number} numStops - How many distinct color stops to create.
 *                          More stops = closer approximation with eventual color scheme.
 * @return {array} An array of numStops stops sampled at equal intervals.
 */
export function getSampledIntervals(minValue, maxValue, numStops = 64) {
  const color = null;
  const stops = [];
  const range = maxValue - minValue;
  let prevFloor = -Infinity;
  for (let i = 0; i < numStops; i++) {
    const rangePercent = i / numStops;
    const stopValue = minValue + range * rangePercent;

    //Load it up with no colors
    stops.push(colorCurveInterval(prevFloor, stopValue, color));
    prevFloor = stopValue;
  }
  //Last two to catch max
  stops.push(colorCurveInterval(prevFloor, maxValue, color));
  stops.push(colorCurveInterval(maxValue, Infinity, color));

  return stops;
}

/**
 * Create a list of Mapbox GL JS color stops that faithfully represent a ColorScheme.
 * @param {Object} colorScheme - Color scheme to reproduce. Must expose a 'getColor' method that returns [R, G, B].
 * @param {number} minValue - Smallest value in the data you want to color.
 * @param {number} maxValue - Largest value in the data you want to color.
 * @param {number} numStops - How many distinct color stops to create. More stops = closer approximation to the ColorScheme.
 * @param {number} reverseColors - Make the colors go in the other direction.
 * @return {array} An array of numStops stops sampled at equal intervals from the ColorScheme.
 */
function getSampledStops(
  colorScheme,
  minValue,
  maxValue,
  numStops = 64,
  reverseColors = false
) {
  const stops = [];
  const range = maxValue - minValue;
  for (let i = 0; i < numStops; i++) {
    const rangePercent = (i + 0.5) / numStops;
    const stopValue = minValue + range * rangePercent;
    let stopFloor = stopValue;
    if (i === 0) {
      stopFloor = -Infinity;
    }
    const { r, g, b } = colorScheme.getColor(stopValue, {
      min: minValue,
      max: maxValue,
      reverse: reverseColors,
    });
    stops.push([stopFloor, `rgb(${r}, ${g}, ${b})`]);
  }
  return stops;
}

/**
 * Create a list of Mapbox GL JS color stops that faithfully represent a
 * ColorScheme for fixed color schemes.
 * @param {Object} colorScheme Color scheme to reproduce. Must expose a
 *                             'getColor' method.
 * @return {array} An array of stops from the ColorScheme.
 */
function getFixedStops(colorScheme) {
  const sortedScheme = _.sortBy(colorScheme.FIXED_SCHEME, "min");
  return sortedScheme.map((interval) => {
    // color intervals apply to min <= value < max
    const { r, g, b } = colorScheme.getColor(interval.min);
    return [interval.min, `rgb(${r}, ${g}, ${b})`];
  });
}

/**
 * Create a list of Mapbox GL JS color stops that faithfully represent a
 * ColorScheme. Will use sampling for continuous color scales, but will simply
 * convert a fixed (discrete) color scale to the appropriate MapBox stops format.
 * @param {Object} colorScheme Color scheme to reproduce. Must expose a
 *                             'getColor' method that returns [R, G, B].
 * @param {number} minValue Smallest value in the data you want to color.
 *                          Used only for continuous color schemes.
 * @param {number} maxValue Largest value in the data you want to color.
 *                          Used only for continuous color schemes.
 * @param {number} numStops Default 64. How many distinct color stops to create.
 *                          More stops = closer approximation to the ColorScheme.
 *                          Used only for continuous color schemes.
 * @param {number} reverseColors Make the colors go in the other direction.
 *                               Used only for continous color schemes.
 * @return {array} An array of stops from the ColorScheme.
 */
export function getMapboxGlStops(
  colorScheme,
  minValue,
  maxValue,
  numStops = 64,
  reverseColors = false
) {
  if (colorScheme.hasOwnProperty("FIXED_SCHEME")) {
    return getFixedStops(colorScheme);
  }
  return getSampledStops(
    colorScheme,
    minValue,
    maxValue,
    numStops,
    reverseColors
  );
}

/**
 * Helper function to normalize the component of the color's gamma value
 * @param {number} val the value to be adjusted
 * @returns {number} the adjusted value
 */
function adjustGamma(val) {
  return Math.pow((val + 0.055) / 1.055, 2.4);
}

/**
 * Calculates the RL value of the supplied color. The win calculating "lightness" this way is thought that
 * green light contrinbutes the most to intensity perceived by humans. This is why saftey vests are slightly green.
 * You can read more on RL here: https://en.wikipedia.org/wiki/Relative_luminance. This is mostly a rip off from this github
 * https://github.com/tmcw/relative-luminance/blob/master/index.js. I read somewhere this is what .net's library uses for contrasting
 * colors it seems to work well in our app.
 * @param {string} cssColor the color to calculate the relative luminance
 * @returns {number} the relative luminance of the supplied color
 */
function calculateRelativeLuminance(cssColor) {
  const rgb = cssToRgb(cssColor);
  const rsrgb = rgb.r / 255;
  const gsrgb = rgb.g / 255;
  const bsrgb = rgb.b / 255;
  // low-gamma adjust coefficient
  const lowc = 1 / 12.92;

  const r = rsrgb <= 0.03928 ? rsrgb * lowc : adjustGamma(rsrgb);
  const g = gsrgb <= 0.03928 ? gsrgb * lowc : adjustGamma(gsrgb);
  const b = bsrgb <= 0.03928 ? bsrgb * lowc : adjustGamma(bsrgb);

  return r * 0.2126 + g * 0.7152 + b * 0.0722;
}

/**
 * Helper function that does a Relative Luminance calculation on the background color and creates two ratios for lighter gray text
 * on the background and the darker gray text on the background
 * @param {string} background the background color that you are overlaying the text
 * @returns {string} the color that has the greater contrast with the supplied background
 */
export function chooseGrayTextColor(background) {
  const lightGrayRL = calculateRelativeLuminance(colors.lightGray) + 0.05;
  const darkerGrayRL = calculateRelativeLuminance(colors.darkerGray) + 0.05;
  const colorRL = calculateRelativeLuminance(background) + 0.05;
  const grayOnBackgroundRatio =
    colorRL > lightGrayRL ? colorRL / lightGrayRL : lightGrayRL / colorRL;
  const blackOnBackgroundRatio =
    colorRL > darkerGrayRL ? colorRL / darkerGrayRL : darkerGrayRL / colorRL;
  if (grayOnBackgroundRatio > blackOnBackgroundRatio) {
    return colors.lightGray;
  }
  return colors.darkerGray;
}

const S = 0.8;

export function getColor(
  value,
  {
    min = null,
    max = null,
    reverse = false,
    colorFormat = COLOR_FORMATS.rgb,
  } = {
    min: null,
    max: null,
    reverse: false,
    colorFormat: COLOR_FORMATS.rgb,
  }
) {
  if (isNaN(min) && isNaN(max)) {
    return 0;
  }
  let H = 0;
  let L = 0;
  if (value >= 0 || reverse === true) {
    H = 0;
    if (max === 0) {
      L = 1;
    } else {
      L = 1 - Math.abs(value / max);
    }
  } else {
    H = 230;
    L = 1 - Math.abs(value / min);
  }
  const rgb = HSLtoRGB(H, S, L * 0.5 + 0.5);
  return formatFromRgb(rgb, colorFormat);
}
