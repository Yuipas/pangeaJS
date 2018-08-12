let network;
let tensor;
let tensor2;

function setup() {
  tensor = tf.shape([3, 12]);
  tensor2 = tf.shape([12, 3]);


  let i = 0;
  tensor.map(x => i++);

  tensor.print();
  tensor2.map((x, i) => {
    // console.log(i);
    return tensor[i[1]][i[0]]
  });
  
  tensor2.print();
}

function draw() {

}
