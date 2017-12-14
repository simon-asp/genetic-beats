/* eslint-disable import/prefer-default-export */

import * as utils from '../../utils/utils';

/* Selection part of the algorithm. Works with Roulette Wheel Selection
 */
const selection = (beats) => {
	let totalSum = 0;
	let partialSum = 0;

	// Sum all fitnesses
	beats.forEach((beat) => {
		totalSum += beat.score;
	});

	const rand = utils.getRandomIntInclusive(0, totalSum);

	// Compute the sum again, but stop if it's larger than the random number
	for (let i = 0; i < beats.length; i++) {
		partialSum += beats[i].score;
		if (partialSum >= rand) return i;
	}
};

/* Crossover part of the algorithm. Uses a Parameterized Uniform Crossover.
 * Returns a new beat which is the offspring from parent1, parent2.
 * Parent1, Parent2 = indices from the beat array.
 */
const crossover = (beats, beatInfo, parent1Index, parent2Index) => {
	const noInstruments = utils.getNoOfInstruments(beats);
	const noTicks = beatInfo.noOfTicks;
	const instrumentNames = utils.getInstrumentKeys(beats);
	const offspring = {};

	// Go through every instrument and crossover bits from the parents
	for (let i = 0; i < noInstruments; i++) {
		const parent1Copy = beats[parent1Index][`${instrumentNames[i]}`];
		const parent2Copy = beats[parent2Index][`${instrumentNames[i]}`];
		const instrNew = new Array(noTicks);
		const copiedIndices = [];

		// Get a random number of how many bits should be copied from parent 1.
		const noTicksToCopy = utils.getRandomIntInclusive(0, noTicks - 1);

		/* Copy bits from parent 1 to the new instrument array. Can get the same
		 * bit twice, but had no time implementing it better. */
		for (let j = 0; j < noTicksToCopy; j++) {
			const randomIndex = utils.getRandomIntInclusive(0, parent1Copy.length - 1);
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
const mutation = (beat, beatInfo) => {
	const copiedBeat = Object.assign({}, beat);

	if (Math.random() <= 0.03) {
		const instrKeys = Object.keys(beat).filter(key => key !== 'id' && key !== 'score');
		const randomKey = instrKeys[utils.getRandomIntInclusive(0, instrKeys.length - 1)];
		const randomIndex = utils.getRandomIntInclusive(0, beatInfo.noOfTicks - 1);

		const mutatedArr = copiedBeat[randomKey].map((tick, i) => {
			if (i === randomIndex) return 1 - tick;
			return tick;
		});
		copiedBeat[randomKey] = mutatedArr;
		console.log(beat.id, 'mutated at', randomKey, 'index', randomIndex, '!');
	}

	return copiedBeat;
};

/* Generates a new population based on what is voted on.
*/
export const newPopulation = (props) => {
	const { beats, beatInfo, addNewPopulation, addNewSelectedPairs, timelineIndex } = props;
	const newBeatArray = [];
	const selectedPairs = [];

	// Create new offspring 8 times.
	for (let i = 0; i < 8; i++) {
		const parent1Index = selection(beats);
		const parent2Index = selection(beats);
		const offspring = crossover(beats, beatInfo, parent1Index, parent2Index);

		selectedPairs.push({ parent1: parent1Index, parent2: parent2Index });
		offspring.id = 'beat' + i;
		const mutatedOffspring = mutation(offspring, beatInfo);

		newBeatArray.push(mutatedOffspring);
	}
	addNewSelectedPairs(selectedPairs, timelineIndex);
	addNewPopulation(newBeatArray);
};
