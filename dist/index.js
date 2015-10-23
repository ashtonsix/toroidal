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

function torodial(data) {
  return {
    _torrodial: true,

    value: function value() {
      return data;
    },

    subset: function subset(x, y, width, height) {
      return torodial(slice(data, y, y + height).map(function (row) {
        return slice(row, x, x + width);
      }));
    },

    insert: function insert(x, y, nd) {
      var newData = nd._torrodial ? nd.value() : nd;

      if (newData.length > data.length) {
        console.error('Cannot insert data: will not fit');
        return null;
      }

      return torodial(splice(data, y, slice(data, y, y + newData.length).map(function (row, yi) {
        return splice(row, x, newData[yi]);
      })));
    },

    map: function map(f) {
      return torodial(data.map(function (row, y) {
        return row.map(function (value, x) {
          return f(value, x, y);
        });
      }));
    },

    reduce: function reduce(f, initialValue) {
      function reduce(_x, _x2, _x3) {
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

      return reduce(initialValue, 0, 0);
    } };
}

module.exports = exports['default'];