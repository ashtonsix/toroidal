const concat = [].concat.bind([]);
const mod = (value, divisor) => (value % divisor + divisor) % divisor;

const slice = (arr, s, e) => {
  const start = mod(s, arr.length);
  const end = mod(e, arr.length);
  return start < end ? arr.slice(start, end) : concat(arr.slice(start), arr.slice(0, end));
};

const splice = (arr, replaceFrom, newArr) => {
  if (newArr.length > arr.length) {
    console.error('Cannot insert data: will not fit');
    return null;
  }

  const start = mod(replaceFrom, arr.length);
  const end = mod(replaceFrom + newArr.length, arr.length);
  return start < end ? concat(arr.slice(0, start), newArr, arr.slice(end)) : concat(newArr.slice(arr.length - start), arr.slice(end, start), newArr.slice(0, arr.length - start));
};

const unwrap = v => v._torrodial ? v.value() : v;

const chainable = (container, data, f) => function chained() {
  return container(f.bind(null, data).apply(null, arguments));
};

export const subset = (d, x, y, width, height) => {
  const data = unwrap(d);

  return slice(data, y, y + height).map(row => slice(row, x, x + width));
};

export const insert = (d, x, y, nd, f) => {
  let newData = unwrap(nd);
  const data = unwrap(d);

  if (newData.length > data.length) {
    console.error('Cannot insert data: will not fit');
    return null;
  }

  newData = newData.map((row, yi) => row.map((nv, xi) => f(nv, data[yi][xi], xi, yi, data)));

  return splice(data, y, slice(data, y, y + newData.length).map((row, yi) => splice(row, x, newData[yi])));
};

export const map = (d, f) => {
  const data = unwrap(d);
  return data.map((row, y) => row.map((value, x) => f(value, x, y, data)));
};

export const reduce = (d, f, initialValue) => {
  const data = unwrap(d);
  function step(pv, x, y) {
    if (y >= data.length) return pv;
    const newX = (x + 1) % data[0].length;
    const newY = newX < x ? y + 1 : y;
    return step(f(pv, data[y][x], x, y, data), newX, newY);
  }

  return step(initialValue, 0, 0);
};

export const zeroes = (width, height, f = () => 0) => {
  const data = Array.apply(null, Array(height)).map(() => Array.apply(null, Array(width)).map(() => 0));
  return data.map((row, y) => row.map((_, x) => f(x, y)));
};

export default function torodial(data) {
  return {
    _torrodial: true,

    value() {
      return data;
    },

    subset: chainable(torodial, data, subset),
    insert: chainable(torodial, data, insert),
    reduce: reduce.bind(null, data),
    map: chainable(torodial, data, map),

    zeroes() {
      return torodial(zeroes.apply(null, arguments));
    }
  };
}

torodial.subset = subset;
torodial.insert = insert;
torodial.reduce = reduce;
torodial.map = map;

torodial.zeroes = zeroes;