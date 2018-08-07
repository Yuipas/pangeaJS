/*
 * Squashing or activation functions
 */

let activation = {

  SIGMOID: function(x, derivative = false) {
    if (derivative == false) {
      return 1 / (1 + exp(-x));
    } else {
      return x * (1 - x);
    }
  },

  TANH: function(x, derivative = false) {
    if (derivative == false) {
      return Math.tanh(x);
    } else {
      return 1 - sq(x);
    }
  },

  RELU: function(x, derivative = false) {
    if (derivative == false) {
      return Math.max(x, 0);
    } else {
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
    } else {
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
    } else {
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
    } else {
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
