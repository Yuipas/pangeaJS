function Layer(type, shape, squash = activation.SIGMOID, trained = false) {
  this.type = type;
  this.prepareTraining = !trained;
  this.shape = shape;
  this.squash = type === 'input' ? activation.NONE : squash;

  this.nodes = createTensor(shape);

  if (type !== 'output') {
    this.weights = null;
  }

  if (type !== 'input') {
    this.bias = createTensor(shape);

    if (this.prepareTraining) {
      // accumulated deltas
      this.acbiasDeltas = createTensor(shape);
    }
  }

}

Layer.prototype = {


  connect: function(lay) {
    this.weights = createTensor(lay.shape, this.shape);
    if (this.prepareTraining) {
      this.acweightsDeltas = createTensor(lay.shape, this.shape).map(() =>
        0);
    }
  },

  randomize: function(min, max) {
    min = min || -1;
    max = max || +1;

    if (typeof this.weights !== 'undefined') {
      this.weights.map(x => Math.random(max - min) + min);
      this.weights.map(x => Math.round(x * 100) / 100);
    }

    if (typeof this.bias !== 'undefined') {
      this.bias.map(x => Math.random(max - min) + min);
      this.bias.map(x => Math.round(x * 100) / 100);
    }
  },

  forward: function(arr) {

    this.nodes = arr;

    if (!(this.nodes instanceof Tensor1d)) {
      this.nodes = createTensor(this.nodes);
    }

    if (this.type !== 'input') {
      this.nodes.add(this.bias);
    }

    this.nodes.map(x => this.squash(x));


    if (this.type === 'output') {
      return this.nodes;
    } else {
      let outputs = Tensor1d.prod(this.weights, this.nodes);
      return outputs;
    }
  },

  backward: function(errors) {
    let gradients = this.nodes.toTensor2d();
    gradients.map(x => this.squash(x));
    gradients.mult(errors);

    this.gradients = gradients;
  }


}
