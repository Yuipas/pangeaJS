let models = {


  /**
   *  Feedforward Neural Network (see https://en.wikipedia.org/wiki/Feedforward_neural_network).
   */

  FFNN: function() {
    let layers = Array.prototype.slice.call(arguments);
    let net = new Network(layers);
    net.construct();

    return net;
  },

  /**
   * TODO: Recurrent Neural Network (see https://en.wikipedia.org/wiki/Recurrent_neural_network).
   */

  RNN: function() {

  }

}

function Network(layersDef) {
  this.layers = layersDef;
  this.network = [];
}


Network.prototype = {

  construct: function(options) {

    if (!options) {
      options = [];

      for (let i = 0; i < this.layers.length; i++) {
        let type = i == 0 ? 'input' : (i == (this.layers.length - 1) ?
          'output' : 'hidden');

        let inf = {
          type: type,
          squash: activation.SIGMOID,
          // fullyConnected: true
        };

        options.push(inf);
      }
    }

    this.network = new Array(this.layers.length);

    for (let i = 0; i < this.layers.length; i++) {
      let layer = new Layer(options[i].type, this.layers[i], options[i].squash);
      this.network[i] = (layer);

      if (i > 0) {
        this.network[i - 1].connect(this.network[i]);
      }
    }

  },

  randomize: function() {
    // randomize every parameter in this network
    for (let layer of this.network) {
      layer.randomize();
    }
  },

  clear: function() {
    for (let layer of this.network) {
      if (layer.type !== 'output') layer.weights.map(() => 1);
      if (layer.type !== 'input') layer.bias.map(() => 1);
    }
  },

  forward: function(inputs) {
    // predict function
    for (let layer of this.network) {
      let outputs = layer.forward(inputs);
      inputs = outputs;
    }

    return inputs;
  },

  backward: function(I, T, LR, O) {
    // calculate gradients

    if (O === 'undefined') {
      O = forward(I);
    }

    // for(let i = this.layers.length - 1; i >= 0; --i) {
    //   errors.mult(LR);
    //   this.network[i].backward(errors);
    //
    //   if(i > 0) {
    //     errors = Tensor1d.prod(Tensor2d.transpose(this.network[i-1].weights), errors);
    //   }
    // }

    let out_errors = Tensor1d.sub(T, O);
    let gradients = O.copy();

    gradients.map(x => activation.SIGMOID(x, true));
    gradients.mult(out_errors);
    gradients.mult(LR);

    gradients = Tensor2d.transpose(gradients.toTensor2d());

    let lasterrors = Tensor2d.transpose(out_errors.toTensor2d());
    // i = 1
    for (let i = this.network.length - 2; i >= 0; i--) {
      let layer = this.network[i];
      // console.log(layer.type + ': ');

      let hidden = layer.nodes.toTensor2d();
      let deltas = Tensor2d.prod((gradients), hidden);
      let who_t = Tensor2d.transpose(layer.weights);

      this.network[i + 1].acbiasDeltas.add(gradients.toTensor1d());
      this.network[i].acweightsDeltas.add(deltas);

      let errors = Tensor2d.prod(who_t, (lasterrors));
      lasterrors = errors;

      gradients = Tensor2d.transpose(hidden);
      gradients.map(x => layer.squash(x, true));
      gradients.mult(errors);
      gradients.mult(LR);
    }

  }

}
