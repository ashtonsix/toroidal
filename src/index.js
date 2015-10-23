const concat = [].concat.bind([]);
const mod = (value, divisor) => ((value % divisor) + divisor) % divisor;

const slice = (arr, s, e) => {
  const start = mod(s, arr.length);
  const end = mod(e, arr.length);
  return start < end ? (
    arr.slice(start, end)
  ) : concat(
    arr.slice(start),
    arr.slice(0, end)
  );
};

const splice = (arr, replaceFrom, newArr) => {
  if (newArr.length > arr.length) {
    console.error('Cannot insert data: will not fit');
    return null;
  }

  const start = mod(replaceFrom, arr.length);
  const end = mod(replaceFrom + newArr.length, arr.length);
  return start < end ? concat(
    arr.slice(0, start),
    newArr,
    arr.slice(end)
  ) : concat(
    newArr.slice(arr.length - start),
    arr.slice(end, start),
    newArr.slice(0, arr.length - start)
  );
};

export default function torodial(data) {
  return {
    _torrodial: true,

    value() {
      return data;
    },

    subset(x, y, width, height) {
      return torodial(
        slice(data, y, y + height).map(
          row => slice(row, x, x + width)
        )
      );
    },

    insert(x, y, nd) {
      const newData = nd._torrodial ? nd.value() : nd;

      if (newData.length > data.length) {
        console.error('Cannot insert data: will not fit');
        return null;
      }

      return torodial(
        splice(data, y, slice(data, y, y + newData.length).map(
          (row, yi) => splice(row, x, newData[yi])
        ))
      );
    },

    map(f) {
      return torodial(
        data.map((row, y) => row.map((value, x) => f(value, x, y)))
      );
    },

    reduce(f, initialValue) {
      function reduce(pv, x, y) {
        if (y >= data.length) return pv;
        const newX = (x + 1) % data[0].length;
        const newY = newX < x ? y + 1 : y;
        return reduce(f(pv, data[y][x], x, y, data), newX, newY);
      }

      return reduce(initialValue, 0, 0);
    },
  };
}
