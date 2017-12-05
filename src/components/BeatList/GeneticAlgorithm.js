import getRandomIntInclusive from '../../utils/utils';

/* Selection part of the algorithm. Works with Roulette Wheel Selection
 */
export const selection = (beats, indexToSkip) => {
	let totalSum = 0;
	let partialSum = 0;

	// Sum all fitnesses
	beats.forEach((beat) => {
		totalSum += beat.score;
	});

	const rand = getRandomIntInclusive(0, totalSum);

	// Compute the sum again, but stop if it's larger than the random number
	for (let i = 0; i < beats.length; i++) {
		partialSum += beats[i].score;
		if (partialSum >= rand && i !== indexToSkip) return i;
	}
};

/* Crossover part of the algorithm. Uses a Parameterized Uniform Crossover.
 * Returns a new beat which is the offspring from parent1, parent2.
 * Parent1, Parent2 = indices from the beat array.
 */
export const crossover = (beats, parent1Index, parent2Index) => {
	let noInstruments = 0;
	let noTicks = 0;
	const offspring = {};
  const instrumentNames = [];

	/* Go through all values of a some beat object. Count instruments and the
	 * number of ticks each beat has.
	 * Puts the instrument keys in the instumentNames array. */
	Object.entries(beats[0]).forEach((item) => {
		// Filter out the pieces that are not beats.
		if (Array.isArray(item[1])) {
			noInstruments++;
			noTicks = item[1].length;
			instrumentNames.push(item[0]);
		}
	});

	// Go through every instrument and crossover bits from the parents
	for (let i = 0; i < noInstruments; i++) {
		const parent1Copy = beats[parent1Index][`${instrumentNames[i]}`];
		const parent2Copy = beats[parent2Index][`${instrumentNames[i]}`];
		const instrNew = new Array(noTicks);
		const copiedIndices = [];

		// Get a random number of how many bits should be copied from parent 1.
		const noTicksToCopy = getRandomIntInclusive(0, noTicks - 1);

		/* Copy bits from parent 1 to the new instrument array. Can get the same
		 * bit twice, but had no time implementing it better. */
		for (let j = 0; j < noTicksToCopy; j++) {
			const randomIndex = getRandomIntInclusive(0, parent1Copy.length - 1);
			copiedIndices.push(randomIndex);
			instrNew[randomIndex] = parent1Copy[randomIndex];
		}
		// Copy bits from parent 2 that are not in the copied indices array.
		for (let j = 0; j < instrNew.length; j++) {
			if (!copiedIndices.includes(j)) {
				instrNew[j] = parent2Copy[j];
			}
		}

		// Put together a child object
		offspring[`${instrumentNames[i]}`] = instrNew;
		offspring.score = 0;
	}

	return offspring;
};

/* Mutation part of the algorithm. Uses a bit flip mutation of 1% mutation rate.
 * Flips one random bit in the incoming beat array.
 */
export const mutation = (beat) => {
	const noTicks = Object.values(beat)[0].length;
	const copiedBeat = Object.assign({}, beat);

	// if (Math.random() <= 0.01) {
		// Object.values(beat).forEach((instrument) => {
		// 	const rand = getRandomIntInclusive(0, noTicks - 1);
		// 	console.log('rand', rand);
		// 	console.log(instrument[rand]);
		// 	instrument[rand] = 1 - instrument[rand];
		// 	console.log(instrument[rand]);
    //
		// });
    //
		// console.log('beatcopy', beat);
	// }
};
