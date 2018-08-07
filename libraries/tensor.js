class Tensor1d {

  constructor(arg1) {
    if (!Array.isArray(arg1)) console.log("tensor1d constructor: " + arg1);

    this.data = arg1;
  }

  len() {
    return this.data.length;
  }

  print() {
    console.table(this.data);
    return this;
  }

  toTensor2d() {
    let tensor2d = createTensor([this.toArray()]);
    return tensor2d;
  }

  toArray() {
    let temp = [];
    arrayCopy(this.data, temp);
    return temp;
  }

  copy() {
    let temp = this.toArray();
    return createTensor(temp);
  }

  push(obj) {
    this.data.push(obj);
    return this;
  }

  concat(obj, first = false) {
    if (first) {
      this.data = concat(obj, this.data);
    } else {
      this.data = concat(this.data, obj);
    }
    return this;
  }

  splice(start, value) {
    this.data.splice(start, value);
    return this;
  }

  shift() {
    return this.data.shift();
  }

  pop() {
    return this.data.pop();
    return this;
  }

  map(func) {
    for (let i = 0; i < this.data.length; i++) {
      this.data[i] = func(this.data[i], i);
    }
    // this.data.map(func);
    return this;
  }

  forEach(func) {
    this.data.forEach(func);
    return this;
  }

  filter(funct) {
    return this.data.filter(funct);
  }

  indexof(val) {
    return this.data.indexOf(val);
  }

  argMax() {
    return this.indexof(this.max());
  }

  max() {
    return max(this.data);
  }

  add(tensor) {
    if (tensor instanceof Tensor1d) {
      if (this.len() != tensor.len()) {
        console.log('sum problem');
        return;
      }

      this.map(function(x, i) {
        let sum = x + tensor.data[i];
        return sum;
      });
    } else if (typeof tensor === 'number') {
      this.map(x => x + tensor);
    } else {
      console.log('nothing added');
      console.log(tensor);
    }
    return this;
  }

  static add(tensor1, tensor2) {
    let result = createTensor(tensor1.toArray());
    result.add(tensor2);

    return result;
  }

  sub(tensor) {
    if (tensor instanceof Tensor1d) {
      if (this.len() != tensor.len()) {
        console.log('sub problem');
        return;
      }

      this.map(function(x, i) {
        let sum = x - tensor.data[i];
        return sum;
      });
    } else if (typeof tensor === 'number') {
      this.map(x => x - tensor);
    } else {
      console.log('nothing subtracted');
    }
    return this;
  }

  static sub(tensor1, tensor2) {
    let result = createTensor(tensor1.toArray());
    result.sub(tensor2);

    return result;
  }

  mult(tensor) {
    if (tensor instanceof Tensor1d) {
      if (this.len() != tensor.len()) {
        console.log('mult problem');
        return;
      }

      this.map(function(x, i) {
        let sum = x * tensor.data[i];
        return sum;
      });
    } else if (typeof tensor === 'number') {
      this.map(x => x * tensor);
    } else {
      console.log('nothing mult');
    }
    return this;
  }

  static mult(tensor1, tensor2) {
    let result = createTensor(tensor1.toArray());
    result.mult(tensor2);

    return result;
  }

  div(tensor) {
    if (tensor instanceof Tensor1d) {
      if (this.len() != tensor.len()) {
        console.log('div problem');
        return;
      }

      this.map(function(x, i) {
        let sum = x / tensor.data[i];
        return sum;
      });
    } else if (typeof tensor === 'number') {
      this.map(x => x / tensor);
    } else {
      console.log('nothing div');
    }
    return this;
  }

  static div(tensor1, tensor2) {
    let result = createTensor(tensor1.toArray());
    result.div(tensor2);

    return result;
  }

  pow(potency) {
    this.map(x => pow(x, potency));

    return this;
  }

  static oneHot(index, depth) {
    let Tensor = createTensor(depth);
    Tensor.data[index] = 1;
    return Tensor;
  }

  static prod(a, b) {
    // a is instanceof tensor2d,
    // b is instanceof tensor1d

    if (a.data[0].length !== b.data.length) {
      console.log('Product error: product' + a + b);
      return;
    }

    let product = createTensor(a.data.length);
    product.map((e, i, j) => {

      let sum = 0;
      for (let k = 0; k < b.data.length; k++) {
        sum += a.data[i][k] * b.data[k];
      }

      return sum;
    });

    return product;
  }
}



/*-----------------------------------------------------------------------*/



class Tensor2d {

  constructor(array) {
    this.data = [];

    for (let i = 0; i < array.length; i++) {
      let ar = array[i];
      this.data.push(ar);
    }
  }

  static copy(tens) {
    return createTensor(tens.data);
  }

  toArray() {
    let arr = [];

    for (let i = 0; i < this.data.length; i++) {
      let temp = new Array(this.data[i].length);
      arrayCopy(this.data[i], 0, temp, 0, temp.length);
      arr.push(temp);
    }

    return arr;
  }

  toTensor1d() {
    let arr = this.toArray();
    let newarr = [];

    for (let i = 0; i < this.data.length; i++) {
      for (let j = 0; j < this.data[i].length; j++) {
        newarr.push(this.data[i][j]);
      }
    }

    return createTensor(newarr);
  }

  push(obj) {
    this.data.push(obj);

    return this;
  }

  concat(obj, first = false) {
    if (first) {
      this.data = concat(obj, this.data);
    } else {
      this.data = concat(this.data, obj);
    }

    return this;
  }

  splice(start, value) {
    this.data.splice(start, value);
  }

  shift() {
    return this.data.shift();
  }

  pop() {
    return this.data.pop();
  }

  map(func) {
    for (let i = 0; i < this.data.length; i++) {
      for (let j = 0; j < this.data[i].length; j++) {
        this.data[i][j] = func(this.data[i][j], i, j);
      }
    }

    return this;
  }

  filter(test) {
    let indexes = [];

    for (let i = 0; i < this.data.length; i++) {
      for (let j = 0; j < this.data[i].length; j++) {

        if (test(this.data[i][j]) == true) {
          let index = {
            i, j
          };

          indexes.push(index);
        }
      }
    }

    return indexes;
  }

  add(tensor) {
    if (tensor instanceof Tensor2d) {
      this.map((e, i, j) => e + tensor.data[i][j]);
    } else {
      this.map(x => x + tensor);
    }

    return this;
  }

  static add(tens1, tens2) {
    let result = Tensor2d.copy(tens1);
    result.add(tens2);

    return result;
  }

  sub(tensor) {
    if (tensor instanceof Tensor2d) {
      this.map((e, i, j) => e - tensor.data[i][j]);
    } else {
      this.map(x => x - tensor);
    }

    return this;
  }

  static sub(tens1, tens2) {
    let result = Tensor2d.copy(tens1);
    result.sub(tens2);

    return result;
  }

  mult(tensor) {
    if (tensor instanceof Tensor2d) {
      this.map((e, i, j) => e * tensor.data[i][j]);
    } else if (tensor instanceof Tensor1d) {
      this.map((e, i) => e * tensor.data[i]);
    } else {
      this.map(x => x * tensor);
    }

    return this;
  }

  static mult(tens1, tens2) {
    let result = Tensor2d.copy(tens1);
    result.mult(tens2);

    return result;
  }

  static prod(a, b) {
    if (a.data[0].length !== b.data.length) {
      console.log('Product error: product: (' + a.data.length + ', ' + a.data[
          0].length +
        '), (' + b.data
        .length + ', ' + b.data[0].length + ')');
      a.print();
      b.print();
      throw new IllegalArgumentException('');
      return;
    }

    if (b instanceof Tensor1d) {
      b = b.toTensor2d();
    }

    let product = createTensor(a.data.length, b.data[0].length);
    product.map((e, i, j) => {

      let sum = 0;
      for (let k = 0; k < b.data.length; k++) {
        sum += a.data[i][k] * b.data[k][j];
      }

      return sum;
    });


    return product;
  }

  div(tensor) {
    if (tensor instanceof Tensor2d) {
      this.map((e, i, j) => e / tensor.data[i][j]);
    } else {
      this.map(x => x / tensor);
    }

    return this;
  }

  static div(tens1, tens2) {
    let result = Tensor2d.copy(tens1);
    result.div(tens2);

    return result;
  }

  pow(potency) {
    this.map(x => pow(x, potency));
    return this;
  }

  // JSON FUNCTIONS

  static transpose(tensor) {
    let temp = Tensor2d.copy(tensor);
    let transposed = createTensor(tensor.data[0].length, tensor.data.length);
    transposed.map((x, i, j) => tensor.data[j][i]);

    return transposed;
  }

  print() {
    console.table(this.data);
    return this;
  }
}



function createTensor(arg1, arg2) {
  if (typeof arg2 === 'undefined') {
    if (typeof arg1 == 'number') {
      let temp = [];

      for (let i = 0; i < arg1; i++) {
        temp.push(0);
      }

      return new Tensor1d(temp);
    }

    if (Array.isArray(arg1)) {
      if (arg1.length != 0 && Array.isArray(arg1[0])) {
        return new Tensor2d(arg1);
      }
      return new Tensor1d(arg1);
    }
  } else if (typeof arg1 == 'number' && typeof arg2 == 'number') {
    let temp = new Array(arg1);
    for (let i = 0; i < arg1; i++) {
      temp[i] = new Array(arg2);
    }

    return new Tensor2d(temp);
  }
}
