let network;
let trainer;

let y;

let binaryDepth = 7;
let maxBinary;

function setup() {
	createCanvas(600, 600);

	maxBinary = pow(2, binaryDepth) - 1;

	network = new models.FFNN(binaryDepth * 2, maxBinary, binaryDepth + 1);
	network.randomize();

	trainer = new Trainer(network, {
		costFunction: losses.absoluteDifference,
		StartlearningRate: 1,
		learningCurve: learningCurves.static,
		update: true,
		costMemory: 1
	});

	frameRate(1);
}

function draw() {
	(train(100));
}

function train(epochs = 1000) {
	let time = millis();
	for (let i = 0; i < epochs; i++) {

		let rand1 = round(random(maxBinary));
		let rand2 = round(random(maxBinary));

		let b1 = binary(rand1);
		let b2 = binary(rand2);
		let br = binary(rand1 + rand2);

		b1.shift();
		b2.shift();

		let I = b1.concat(b2);
		let T = br;

		// console.log(I)
		// console.log(T)

		// let I = [round(random(1)), round(random(1))];
		// let T = [abs(I[0] - I[1])];
		trainer.train(I, T);

		// trainer.updateNetwork();
	}

	// console.log(network);
	// console.log(trainer);

	return millis() - time;
}

function sum(a, b) {
	a = binary(a)
	b = binary(b)

	a.shift()
	b.shift()

	let I = a.concat(b);
	// console.log(I);
	let result = network.forward(I);

	result.map(x => x > 0.6 ? 1 : 0)
	result = result.toArray();
	// console.table(result)

	return unbinary(result);
}

function binary(number) {
	let b = [];
	let i = binaryDepth;
	while (number >= 0 && i >= 0) {
		let p = pow(2, i);
		if (p <= number) {
			number -= p;
			b.push(1);
		} else {
			b.push(0);
		}
		i--;
	}
	return b;
}


function unbinary(b) {
	let number = 0;
	b.reverse();
	let i = 0;
	for (let p of b) {
		number += p * pow(2, i);
		i++;
	}
	return number;
}
