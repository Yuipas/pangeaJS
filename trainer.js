function Trainer(net, options) {
  this.net = net;

  this.iterations = 0;

  options = options || {};

  this.lastCost = 0;
  this.costHistory = [];
  this.loss = options.costFunction || losses.meanSquaredError;

  this.learningRate = options.StartlearningRate || 0.05;
  this.learningCurve = options.learningCurve || learningCurves.static;

  this.update = options.update || false;

  this.costMemory = options.costMemory || 200;
}


Trainer.prototype = {

  getLR: function() {
    return this.learningRate = this.learningCurve(this.learningRate, this.iterations,
      this.costHistory);
  },

  train: function(I, T) {
    // I: inputs
    // T: targets

    let TOTime = millis();

    if(Array.isArray(I)) {
      I = createTensor(I);
    }

    if(Array.isArray(T)) {
      T = createTensor(T);
    }


    let FWRDTime = millis();
    let O = this.net.forward(I);
    FWRDTime = millis() - FWRDTime;
    let act_loss = this.loss(T, O);

    this.lastCost = act_loss;
    this.costHistory.push(this.lastCost);

    if(this.costHistory.length >= this.costMemory) {
      this.costHistory.shift();
    }

    let BCKTime = millis();

    this.net.backward(I, T, this.learningRate, O);

    BCKTime = millis() - BCKTime;

    this.iterations++;

    if (this.update) {
      this.updateNetwork();
    }
    
    return {
      iterations: this.iterations,
      ForwardTime: FWRDTime,
      BackpropagationTime: BCKTime,
      // lossDiff:     // Should be always positive
    }

  },

  updateNetwork: function() {

    this.getLR();

    for(let i = 0; i < this.net.network.length; i++) {
      let layer = this.net.network[i];

      if(layer.type !== 'output') {
        let deltas = this.net.network[i].acweightsDeltas;
        this.net.network[i].weights.add(deltas);
        this.net.network[i].acweightsDeltas.map(() => 0);
      }

      if(layer.type !== 'input') {
        let deltas = this.net.network[i].acbiasDeltas;
        this.net.network[i].bias.add(deltas);
        this.net.network[i].acbiasDeltas.map(() => 0);
      }

    }
  }

}
