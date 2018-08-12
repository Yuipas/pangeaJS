const tf = {

  tensor: function(arr) {
    return new Tensor(arr);
  },

  shape(shape) {
    return Tensor.empty(shape);
  },



}

class Tensor {

  constructor(arr, sp) {
    for (let i = 0; i < arr.length; i++) {
      this[i] = arr[i];
    }

    if (sp == undefined) {
      this.getShape();
    }
    else {
      this.shape = sp;
    }
  }


  getShape() {
    this.shape = [];
    let arr = this.toArray();
    while (Array.isArray(arr)) {
      this.shape.push(arr.length);
      arr = arr[0];
    }
  }

  static empty(shape) {

    // OPTIMIZE:

    let string = "";
    let empty = "[";

    for (let i = 0; i < shape[shape.length - 1]; i++) {
      empty += "0,";
    }

    empty += "]";
    string = empty;
    empty += ",";

    for (let i = shape.length - 2; i >= 0; i--) {
      string = "[";
      for (let j = 0; j < shape[i]; j++) {
        string += empty;
      }
      string += "]";
      empty = string;
    }

    while (string.includes(',]')) {
      string = string.replace(",]", "]");
    }

    while (string.includes('][')) {
      string = string.replace("][", "],[");
    }

    // console.log(string);
    return new Tensor(JSON.parse(string), shape);
  }


  toArray() {
    let arr = [];

    for (let i = 0; i < this.shape[0]; i++) {
      arr.push(this[i]);
    }

    return arr;
  }

  fill(t) {
    this.map(() => t);
    return this;
  }

  get(index) {

    if (Array.isArray(index)) {
      let n = this;
      for (let j = 0; j < index.length; j++) {
        n = n[index[j]];
      }

      return n;
    }
    else if (typeof index == 'number') {
      let nindex = new Array(this.shape.length).fill(0)
        .map((x, i) => (index / (this.shape[i] ** i)) % this.shape[i]);
      console.log(nindex);
      // return this.get(nindex);
    }
  }

  toString() {
    let string = 'Tensor ' + this.shape.length + 'd:\n[';
    for (let i = 0; i < this.shape.length; i++) {
      for (let j = 0; j < this.shape[i]; j++) {
        string += this.get([i, j])
          .toString();
      }
    }
    string += ']';
    return string;
  }


  size() {
    let res = 1;
    this.shape.forEach(x => res *= x);
    return res;
  }

  map(fnc) {

    let timer = millis();
    let index = [];
    let size = this.size() / this.shape[this.shape.length - 1];

    for (let i = 0; i < this.shape.length - 1; i++) {
      index.push(0);
    }

    let last = index.length - 1;

    for (let i = 0; i < size; i++) {

      let n = this;
      for (let j = 0; j < index.length; j++) {
        n = n[index[j]];
      }

      for (let j = 0; j < n.length; j++) {
        n[j] = fnc(n[j], index.concat([j]));
      }

      index[last]++;
      for (let j = index.length - 1; j > 0; j--) {

        if (index[j] < this.shape[j]) {}
        else {
          if (j - 1 != -1) {
            index[j - 1]++;
            index[j] = 0;
          }
        }
      }

      // index.map((x, i) => x % this.shape[i]);
    }
    // console.log(millis() - timer);
    return this;
  }

  forEach(fnc) {

    let timer = millis();

    let index = [];
    let size = this.size() / this.shape[this.shape.length - 1];

    for (let i = 0; i < this.shape.length - 1; i++) {
      index.push(0);
    }

    let last = index.length - 1;

    for (let i = 0; i < size; i++) {

      let n = this;
      for (let j = 0; j < index.length; j++) {
        n = n[index[j]];
      }

      for (let j = 0; j < n.length; j++) {
        fnc(n[j], index.concat([j]));
      }

      index[last]++;
      for (let j = index.length - 1; j > 0; j--) {

        if (index[j] < this.shape[j]) {}
        else {
          if (j - 1 != -1) {
            index[j - 1]++;
            index[j] = 0;
          }
        }
      }
    }

    // console.log(millis() - timer);
    return this;
  }


  sum(tensor) {
    // to sum numbers, use the map function (.map(x => x + n);)
    if (!ArrayEquals(this.shape, tensor.shape)) {
      console.error('Shapes ' + this.shape + ' and ' + tensor.shape + ' cannot be operated.');
    }

    this.map((x, i) => x + tensor.get(i));
    return this;
  }

  rest(tensor) {
    // to rest numbers, use the map function (.map(x => x - n);)
    if (!ArrayEquals(this.shape, tensor.shape)) {
      console.error('Shapes ' + this.shape + ' and ' + tensor.shape + ' cannot be operated.');
    }

    this.map((x, i) => x - tensor.get(i));
    return this;
  }

  mult(tensor) {
    // to mult numbers, use the map function (.map(x => x * n);)
    if (!ArrayEquals(this.shape, tensor.shape)) {
      console.error('Shapes ' + this.shape + ' and ' + tensor.shape + ' cannot be operated.');
    }

    this.map((x, i) => x * tensor.get(i));
    return this;
  }

  div(tensor) {
    // to div numbers, use the map function (.map(x => x / n);)
    if (!ArrayEquals(this.shape, tensor.shape)) {
      console.error('Shapes ' + this.shape + ' and ' + tensor.shape + ' cannot be operated.');
    }

    this.map((x, i) => x / tensor.get(i));
    return this;
  }



  print() {
    console.log(tensorToTree(this));
  }

  pprint() {
    console.log(this);
  }

}


function tensorToTree(tensor) {
  let r = 'Tensor ' + tensor.shape.length + 'd [' + tensor.shape.toString() + ']:\n';
  return r + generateTree(tensor.toArray());
}


function generateTree(array, g = false) {
  const s = ['├', '─', '┬', '└', '│'];
  const t = ' ';

  function vecToString(vec) {
    let tree = '';
    for (let line of vec) {
      tree += t + line + '\n';
    }
    return tree;
  }

  let tree = [];
  let len = array.length;

  for (let i = 0; i < len; i++) {

    let l = '';
    let c = array[i];
    let k = i < (len - 1);

    l = k ? s[0] : s[3];
    l += s[1];

    if (Array.isArray(c)) {
      let m = generateTree(c, true);

      let p = (k ? s[0] : s[3]) + s[1] + s[2] + ' Array(' + c.length + '):';
      tree.push(s[4]);
      tree.push(p);

      for(let line of m) {
        line = t + line;
        if(k) {
          line = s[4] + line;
        } else {
          line = t + line;
        }
        tree.push(line);
      }

      continue;
    }
    else {
      l += ' ' + c;
    }


    tree.push(l);
  }

  if (g) {
    return tree;
  }
  else {
    return vecToString(tree);
  }
}
