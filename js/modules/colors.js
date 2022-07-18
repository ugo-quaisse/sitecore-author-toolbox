/* eslint-disable no-useless-concat */
/* eslint-disable array-element-newline */
/* eslint-disable newline-before-return */
/* eslint-disable object-property-newline */
/* eslint-disable no-nested-ternary */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-param-reassign */
/* eslint-disable nonblock-statement-body-position */
/* eslint-disable no-invalid-this */
/* eslint-disable no-extend-native */
/* eslint-disable max-params */
/* eslint-disable func-style */
/* eslint-disable space-before-function-paren */
/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
/* eslint-disable no-mixed-operators */
/* eslint-disable radix */
/* eslint-disable no-bitwise */
/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

export { getFiltersCss };

var tolerance = 1;
var invertRange = [0, 1];
var invertStep = 0.1;
var sepiaRange = [0, 1];
var sepiaStep = 0.1;
var saturateRange = [5, 100];
var saturateStep = 5;
var hueRotateRange = [0, 360];
var hueRotateStep = 5;
var possibleColors;

// matrices taken from https://www.w3.org/TR/filter-effects/#feColorMatrixElement
function sepiaMatrix(s) {
  return [0.393 + 0.607 * (1 - s), 0.769 - 0.769 * (1 - s), 0.189 - 0.189 * (1 - s), 0.349 - 0.349 * (1 - s), 0.686 + 0.314 * (1 - s), 0.168 - 0.168 * (1 - s), 0.272 - 0.272 * (1 - s), 0.534 - 0.534 * (1 - s), 0.131 + 0.869 * (1 - s)];
}

function saturateMatrix(s) {
  return [0.213 + 0.787 * s, 0.715 - 0.715 * s, 0.072 - 0.072 * s, 0.213 - 0.213 * s, 0.715 + 0.285 * s, 0.072 - 0.072 * s, 0.213 - 0.213 * s, 0.715 - 0.715 * s, 0.072 + 0.928 * s];
}

function hueRotateMatrix(d) {
  var cos = Math.cos((d * Math.PI) / 180);
  var sin = Math.sin((d * Math.PI) / 180);
  var a00 = 0.213 + cos * 0.787 - sin * 0.213;
  var a01 = 0.715 - cos * 0.715 - sin * 0.715;
  var a02 = 0.072 - cos * 0.072 + sin * 0.928;

  var a10 = 0.213 - cos * 0.213 + sin * 0.143;
  var a11 = 0.715 + cos * 0.285 + sin * 0.14;
  var a12 = 0.072 - cos * 0.072 - sin * 0.283;

  var a20 = 0.213 - cos * 0.213 - sin * 0.787;
  var a21 = 0.715 - cos * 0.715 + sin * 0.715;
  var a22 = 0.072 + cos * 0.928 + sin * 0.072;

  return [a00, a01, a02, a10, a11, a12, a20, a21, a22];
}

function clamp(value) {
  return value > 255 ? 255 : value < 0 ? 0 : value;
}

function filter(m, c) {
  return [clamp(m[0] * c[0] + m[1] * c[1] + m[2] * c[2]), clamp(m[3] * c[0] + m[4] * c[1] + m[5] * c[2]), clamp(m[6] * c[0] + m[7] * c[1] + m[8] * c[2])];
}

function invertBlack(i) {
  return [i * 255, i * 255, i * 255];
}

function generateColors() {
  let possibleColors = [];

  let invert = invertRange[0];
  for (invert; invert <= invertRange[1]; invert += invertStep) {
    let sepia = sepiaRange[0];
    for (sepia; sepia <= sepiaRange[1]; sepia += sepiaStep) {
      let saturate = saturateRange[0];
      for (saturate; saturate <= saturateRange[1]; saturate += saturateStep) {
        let hueRotate = hueRotateRange[0];
        for (hueRotate; hueRotate <= hueRotateRange[1]; hueRotate += hueRotateStep) {
          let invertColor = invertBlack(invert);
          let sepiaColor = filter(sepiaMatrix(sepia), invertColor);
          let saturateColor = filter(saturateMatrix(saturate), sepiaColor);
          let hueRotateColor = filter(hueRotateMatrix(hueRotate), saturateColor);

          let colorObject = {
            filters: { invert, sepia, saturate, hueRotate },
            color: hueRotateColor,
          };

          possibleColors.push(colorObject);
        }
      }
    }
  }

  return possibleColors;
}

function getFilters(targetColor, localTolerance) {
  possibleColors = possibleColors || generateColors();
  var filters;
  for (var i = 0; i < possibleColors.length; i++) {
    var color = possibleColors[i].color;
    if (Math.abs(color[0] - targetColor[0]) < localTolerance && Math.abs(color[1] - targetColor[1]) < localTolerance && Math.abs(color[2] - targetColor[2]) < localTolerance) {
      return (filters = possibleColors[i].filters);
    }
  }

  localTolerance += tolerance;
  return getFilters(targetColor, localTolerance);
}

/**
 * Convert hex to rgb
 */
const hexToRgb = (hex) => {
  var bigint = parseInt(hex.replace("#", ""), 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;

  return r + "," + g + "," + b;
};

/**
 * Convert color to filters
 */
const getFiltersCss = (hex) => {
  var color = hexToRgb(hex);
  var targetColor = color.split(",");
  targetColor = [
    parseInt(targetColor[0]), // [R]
    parseInt(targetColor[1]), // [G]
    parseInt(targetColor[2]), // [B]
  ];
  var filters = getFilters(targetColor, tolerance);
  var filtersCSS =
    "invert(" + Math.floor(filters.invert * 100) + "%) " + "sepia(" + Math.floor(filters.sepia * 100) + "%) " + "saturate(" + Math.floor(filters.saturate * 100) + "%) " + "hue-rotate(" + Math.floor(filters.hueRotate) + "deg);";
  return filtersCSS;
};
