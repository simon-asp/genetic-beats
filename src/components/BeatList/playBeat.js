/* Function to play beats */
export default function playBeat(Tone, beats, index) {
	const instruments = new Tone.Players({
		kick: require('./sounds/kick.wav'),
		clap: require('./sounds/clap.wav'),
		closedhat: require('./sounds/closedhat.wav'),
		openhat: require('./sounds/openhat.wav'),
	}, {
		volume: -10,
	}).toMaster();

	Tone.Transport.bpm.value = 128;
	Tone.Transport.cancel();

	console.log(beats);
	const loop = new Tone.Sequence((time, tick) => {
		if (beats[index][0][tick] === 1) instruments.get('kick').start();
	// 	else if (beats[index][1][tick] === 1) instruments.get('closedhat').start();
	// 	else if (beats[index][2][tick] === 1) instruments.get('openhat').start();
	// 	else if (beats[index][3][tick] === 1) instruments.get('clap').start();
	}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], '16n');

	loop.start();
	Tone.Transport.start('+0.1');
}

// document.getElementById('playToggle').addEventListener("click", function(){
// 	Tone.Transport.start('+0.1');
// });
//
// document.getElementById('stop').addEventListener("click", function() {
// 	Tone.Transport.stop();
// });
