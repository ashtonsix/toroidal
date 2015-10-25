'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = torodial;
var concat = [].concat.bind([]);
var mod = function mod(value, divisor) {
  return (value % divisor + divisor) % divisor;
};

var slice = function slice(arr, s, e) {
  var start = mod(s, arr.length);
  var end = mod(e, arr.length);
  return start < end ? arr.slice(start, end) : concat(arr.slice(start), arr.slice(0, end));
};

var splice = function splice(arr, replaceFrom, newArr) {
  if (newArr.length > arr.length) {
    console.error('Cannot insert data: will not fit');
    return null;
  }

  var start = mod(replaceFrom, arr.length);
  var end = mod(replaceFrom + newArr.length, arr.length);
  return start < end ? concat(arr.slice(0, start), newArr, arr.slice(end)) : concat(newArr.slice(arr.length - start), arr.slice(end, start), newArr.slice(0, arr.length - start));
};

var unwrap = function unwrap(v) {
  return v._torrodial ? v.value() : v;
};

var chainable = function chainable(wrapper, data, f) {
  return function chained() {
    return wrapper(f.bind(null, data).apply(null, arguments));
  };
};

var subset = function subset(d, x, y, width, height) {
  var data = unwrap(d);

  return slice(data, y, y + height).map(function (row) {
    return slice(row, x, x + width);
  });
};

exports.subset = subset;
var insert = function insert(d, x, y, nd) {
  var newData = unwrap(nd);
  var data = unwrap(d);

  if (newData.length > data.length) {
    console.error('Cannot insert data: will not fit');
    return null;
  }

  return splice(data, y, slice(data, y, y + newData.length).map(function (row, yi) {
    return splice(row, x, newData[yi]);
  }));
};

exports.insert = insert;
var map = function map(d, f) {
  var data = unwrap(d);
  return data.map(function (row, y) {
    return row.map(function (value, x) {
      return f(value, x, y);
    });
  });
};

exports.map = map;
var reduce = function reduce(d, f, initialValue) {
  var data = unwrap(d);
  function step(_x, _x2, _x3) {
    var _again = true;

    _function: while (_again) {
      var pv = _x,
          x = _x2,
          y = _x3;
      newX = newY = undefined;
      _again = false;

      if (y >= data.length) return pv;
      var newX = (x + 1) % data[0].length;
      var newY = newX < x ? y + 1 : y;
      _x = f(pv, data[y][x], x, y, data);
      _x2 = newX;
      _x3 = newY;
      _again = true;
      continue _function;
    }
  }

  return step(initialValue, 0, 0);
};

exports.reduce = reduce;
var _zeroes = function _zeroes(width, height) {
  return Array.apply(null, Array(height)).map(function () {
    return Array.apply(null, Array(width)).map(function () {
      return 0;
    });
  });
};

exports.zeroes = _zeroes;

function torodial(data) {
  return {
    _torrodial: true,

    value: function value() {
      return data;
    },

    subset: chainable(torodial, data, subset),
    insert: chainable(torodial, data, insert),
    reduce: reduce.bind(null, data),
    map: chainable(torodial, data, map),

    zeroes: function zeroes() {
      return torodial(_zeroes.apply(null, arguments));
    } };
}

torodial.subset = subset;
torodial.insert = insert;
torodial.reduce = reduce;
torodial.map = map;

torodial.zeroes = _zeroes;