/*
 * Squashing or activation functions
 */

let activation = {

  SIGMOID: function(x, derivative = false) {
    if (derivative == false) {
      return 1 / (1 + exp(-x));
    }
    else {
      return x * (1 - x);
    }
  },

  TANH: function(x, derivative = false) {
    if (derivative == false) {
      return Math.tanh(x);
    }
    else {
      return 1 - sq(x);
    }
  },

  RELU: function(x, derivative = false) {
    if (derivative == false) {
      return Math.max(x, 0);
    }
    else {
      return x > 0 ? 1 : 0;
    }
  },

  NONE: function(x) {
    return x;
  }

}

// calculates cost function
let losses = {

  absoluteDifference: function(a, b) {
    // for a & b instances of tensor
    if (a instanceof Tensor1d && b instanceof Tensor1d) {
      let c = Tensor1d.sub(a, b);
      let errors = c.toArray();
      c.map(x => Math.abs(x));
      let cost = 0;

      c.map(x => {
        cost += x;
        return x;
      });

      return {
        cost: cost / a.data.length,
        errors: errors,
      };
    }
    else {
      console.log('a & b must be tensors (1d)');
    }
  },

  meanSquaredError: function(a, b) {
    // for a & b instances of tensor
    if (a instanceof Tensor1d && b instanceof Tensor1d) {

      a = a.copy();
      b = b.copy();

      let c = Tensor1d.sub(a, b);
      let errors = c.toArray();
      c.pow(2);

      let cost = 0;

      c.map(x => {
        cost += x;
        return x;
      });

      return {
        cost: cost / a.data.length,
        errors: errors,
      };
    }
    else {
      console.log('a & b must be tensors (1d)');
    }
  },

  euclideanDistance: function(a, b) {
    // for a & b instances of tensor
    if (a instanceof Tensor1d && b instanceof Tensor1d) {

      a = a.copy();
      b = b.copy();

      let c = Tensor1d.sub(a, b);
      let errors = c.toArray();
      c.pow(2);
      c.div(2);

      let cost = 0;

      c.map(x => {
        cost += x;
        return x;
      });

      return {
        cost: cost / a.data.length,
        errors: errors,
      };
    }
    else {
      console.log('a & b must be tensors (1d)');
    }
  }

  // cross entropy??

}

// how learning rate changes over iterations
let learningCurves = {

  // do not change over time
  static: function(lastlr) {
    return lastlr;
  },

  // change depending on the error
  costDependent: function(lr, iterations, costHistory) {
    let e = exp(lr);
    lr = (e + exp(costHistory[costHistory.length - 1].cost /
        costHistory.length)) /
      e;
    // console.log(lr);

    return lr;
  },

  // change depending on the iterations
  itDependent: function(lr, it) {
    let x = it / 10.0;
    return lr = exp(x) / pow(2.8, x);
  }

}

function ArrayEquals(value, other) {

  let type = Object.prototype.toString.call(value);

  if (type !== Object.prototype.toString.call(other)) return false;

  if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

  let valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
  let otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) return false;

  let compare = function(item1, item2) {

    let itemType = Object.prototype.toString.call(item1);

    if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
      if (!ArrayEquals(item1, item2)) return false;
    }

    else {

      if (itemType !== Object.prototype.toString.call(item2)) return false;

      if (itemType === '[object Function]') {
        if (item1.toString() !== item2.toString()) return false;
      }
      else {
        if (item1 !== item2) return false;
      }

    }
  }

  if (type === '[object Array]') {
    for (let i = 0; i < valueLen; i++) {
      if (compare(value[i], other[i]) === false) return false;
    }
  }
  else {
    for (let key in value) {
      if (value.hasOwnProperty(key)) {
        if (compare(value[key], other[key]) === false) return false;
      }
    }
  }

  return true;
}
