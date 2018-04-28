/* eslint-disable import/prefer-default-export */

import * as utils from '../../utils/utils';

/* Selection part of the algorithm. Works with Roulette Wheel Selection.
 * Returns 16 indices that are the picked parents 
 * Params: beats = Array
 */
const selection = (beats) => {
	let totalSum = 0;
	let partialSum = 0;
	let pickedIndex = null;
	let parentIndices = [];
	
	// Sum all fitnesses
	beats.forEach((beat) => {
		totalSum += beat.score;
	});


	// Pick 2 parents. Make sure we don't pick the same index twice, by checking pickedIndex.
	// Compute the sum again, but stop if it's larger than the random number.
	while(parentIndices.length < 2) {
		// Get a random integer to pick out a random entry in beats
		let rand = utils.getRandomIntInclusive(0, totalSum);
		
		for(let j = 0; j < beats.length; j++) {
			partialSum += beats[j].score;
			if (partialSum >= rand && pickedIndex !== j) {
				pickedIndex = j;
				parentIndices.push(j);
				break;
			}
		}
		partialSum = 0;
	}
	return parentIndices;
};

/* Crossover part of the algorithm. Uses a Parameterized Uniform Crossover.
 * Returns a new beat which is the offspring from parent1, parent2.
 * Parent1, Parent2 = indices from the beat array.
 */
const crossover = (beats, beatInfo, parent1Index, parent2Index, finishedCallback) => {
	const noInstruments = utils.getNoOfInstruments(beats[0]);
	const noTicks = beatInfo.noOfTicks;
	const instrumentNames = utils.getInstrumentKeys(beats[0]);
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

		// Uncomment for random score, testing purposes.
		//offspring.score = Math.floor(Math.random() * 5) + 1;
	}
	finishedCallback(offspring);
};

/* Mutation part of the algorithm. Uses a bit flip mutation of 1% mutation rate.
 * Flips one random bit in the incoming beat array.
 */
const mutation = (beat, beatInfo) => {
	const copiedBeat = Object.assign({}, beat);
	if (Math.random() <= 0.1) {
		const instrKeys = Object.keys(beat).filter(key => key !== 'id' && key !== 'score');
		const randomKey = instrKeys[utils.getRandomIntInclusive(0, instrKeys.length - 1)];
		const randomIndex = utils.getRandomIntInclusive(0, beatInfo.noOfTicks - 1);

		const mutatedArr = copiedBeat[randomKey].map((tick, i) => {
			if (i === randomIndex) return 1 - tick;
			return tick;
		});
		copiedBeat[randomKey] = mutatedArr;
	}

	return copiedBeat;
};

/* Generates a new population based on what is voted on.
* Parameters: beats = the beats as a list
* beatInfo = information about the beats, from redux.
* pressGenerateButton = Function to add new population to redux
* addNewSelectedPairs = Function to add selected pairs to redux.
* timelineIndex = Which index in the timeline were on.
*/
export const newPopulation = (props, callback) => {
	const { beats, beatInfo, pressGenerateButton, addNewSelectedPairs, timelineIndex } = props;
	const newBeatArray = [];
	const selectedPairs = [];

	for (let i = 0; i < beatInfo.noOfBeats; i++) {
		const parentIndices = selection(beats);
		// When offspring is finished, continue with the rest
		crossover(beats, beatInfo, parentIndices[0], parentIndices[1], (offspring) => {
			selectedPairs.push({ parent1: parentIndices[0], parent2: parentIndices[1], offspringIndex: i });
			offspring.id = 'beat' + (timelineIndex + 1) + i;
			offspring.liked = false;
			const mutatedOffspring = mutation(offspring, beatInfo);

			newBeatArray.push(mutatedOffspring);
		});
	}
	addNewSelectedPairs(selectedPairs, timelineIndex);
	pressGenerateButton(newBeatArray, timelineIndex);
	callback();
};
