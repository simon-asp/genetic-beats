import { getInstrumentKeys } from '../../utils/utils';

/* Creates an array with ticks */
const createTickArray = (noTicks) => {
	const tickArray = [];
	for (let i = 0; i < noTicks; i++) tickArray.push(i);
	return tickArray;
};

/* Function to play beats */
export function initializeBeat(Tone, beats, beatInfo, index) {
	const instrumentKeys = getInstrumentKeys(beats);
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
		volume: 10,
	}).toMaster();

	Tone.Transport.bpm.value = 106;

	const sequence = new Tone.Sequence((time, tick) => {
		instrumentKeys.forEach((key) => {
			if (beats[index][key][tick] === 1) instruments.get(key).start();
		});
	}, tickArray, '16n');
	sequence.loop = 4;
	// sequence.start();
	Tone.Transport.start('+0.1');
	return sequence;
}

// Stop the beat
export function stopBeat(Tone, loop) {
	// Tone.Transport.cancel();
	loop.stop();
	// Tone.Transport.stop();
}

// Start the beat
export function startBeat(Tone, loop) {
	loop.start();
	// Tone.Transport.start('+0.1');
}

// document.getElementById('playToggle').addEventListener("click", function(){
// 	Tone.Transport.start('+0.1');
// });
