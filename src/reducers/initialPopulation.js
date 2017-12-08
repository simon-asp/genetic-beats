import { beatInfoObj } from './beatInfo';

// Get a random integer between min and max, inclusive max.
const calculateProbability = (n) => {
	if (Math.random() <= n) return 1;
	return 0;
};

/* Get a random array with 1 and 0's.
 * param(size) = the length of the returned array
 */
const getRandomBeatArray = (size, n) => {
	const arr = [];
	for (let i = 0; i < size; i++) {
		arr.push(calculateProbability(n));
	}
	return arr;
};

/* Generates an initial population with a beats array containing
 * noBeats-amount of beats. One beat is an object that contains different
 * instruments.
 */
export default function getInitialPopulation() {
	const beatList = [];

	for (let i = 0; i < beatInfoObj.noOfBeats; i++) {
		const beat = {};
		beat.kick = getRandomBeatArray(beatInfoObj.noOfTicks, 0.3);
		beat.closedhat = getRandomBeatArray(beatInfoObj.noOfTicks, 0.5);
		beat.openhat = getRandomBeatArray(beatInfoObj.noOfTicks, 0.4);
		beat.clap = getRandomBeatArray(beatInfoObj.noOfTicks, 0.2);
		beat.score = 0;
		beat.id = 'beat' + i;
		beat.clicked = false;

		beatList.push(beat);
	}

	return beatList;
}
