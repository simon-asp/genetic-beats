import { beatInfoObj } from './beatInfo';
import { experimentBeatTimeline } from './experimentBeatTimeline.js';

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
 * instruments. Returns a timeline array, which contains a beat array.
 */
export default function getInitialPopulation() {
	const fs = require("fs");
	
	const beatList = [];
	let timeline = [];

	// for (let i = 0; i < beatInfoObj.noOfBeats; i++) {
	// 	const beat = {};

	// 	beat.kick = getRandomBeatArray(beatInfoObj.noOfTicks, 0.25);
	// 	beat.closedhat = getRandomBeatArray(beatInfoObj.noOfTicks, 0.4);
	// 	beat.openhat = getRandomBeatArray(beatInfoObj.noOfTicks, 0.2);
	// 	beat.clap = getRandomBeatArray(beatInfoObj.noOfTicks, 0.125);

	// 	beat.score = 0;
	// 	beat.id = 'beat0' + i;
	// 	beat.liked = false;

	// 	beatList.push(beat);
	// }

	// timeline.push(beatList);
	
	timeline = experimentBeatTimeline;
	console.log(timeline)
	return timeline;
}
