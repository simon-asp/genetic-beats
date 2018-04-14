import { getInstrumentKeys } from '../../utils/utils';

/* Creates an array with ticks */
const createTickArray = (noTicks) => {
	const tickArray = [];
	for (let i = 0; i < noTicks; i++) tickArray.push(i);
	return tickArray;
};

/* Function to play beats */
export function initializeBeat(Tone, beats, beatInfo, index, timelineIndex) {
	const instrumentKeys = getInstrumentKeys(beats[0]);
	const noTicks = beatInfo.noOfTicks;
	const tickArray = createTickArray(noTicks);

	// console.log(Tone.Transport);
	Tone.Transport.cancel();

	const instruments = new Tone.Players({
		kick: require('./sounds/kick.wav'),
		clap: require('./sounds/clap.wav'),
		closedhat: require('./sounds/closedhat.wav'),
		openhat: require('./sounds/openhat.wav'),
	}, {
		volume: 0,
	}).toMaster();

	Tone.Transport.bpm.value = 106;
	const colors = ['deeppink', 'blue', 'gold', 'aqua'];
	let counter = 0;
	let sumTicks = 0;
	const sequence = new Tone.Sequence((time, tick) => {
		sumTicks++;
		instrumentKeys.forEach((key) => {
			if (beats[index][key][tick] === 1) instruments.get(key).start();
		});
		// Make the boxes glow at certain ticks
		counter = Math.ceil(tick / 4) - 1;
		if (tick === 3 || tick === 7 || tick === 11 || tick === 15) {
			addColorShadow(timelineIndex, index, colors[counter]);
		}
		// Remove the glow at certain ticks
		else if (tick === 1 || tick === 5 || tick === 9 || tick === 13) {
			removeColorShadow(timelineIndex, index);
		}
		if(sumTicks === 64) removeColorShadow(timelineIndex, index);
		
	}, tickArray, '16n');

	sequence.loop = 4;
	Tone.Transport.start('+0.1');
	return sequence;
}

// Stop the beat
export function stopBeat(loop) {
	loop.stop();
}

// Start the beat
export function startBeat(loop) {
	loop.start();
}

export function removeColorShadow(timelineIndex, index) {
	document.getElementById('beat' + timelineIndex + '' + index).style.boxShadow = '0px 5px 5px 1px rgba(0,0,0,0.15)';
}
export function addColorShadow(timelineIndex, index, color) {
	document.getElementById('beat' + timelineIndex + '' + index).style.boxShadow = '0px 0px 26px 1px ' + color;
}

// document.getElementById('playToggle').addEventListener("click", function(){
// 	Tone.Transport.start('+0.1');
// });
