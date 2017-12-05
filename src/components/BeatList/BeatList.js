import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNewPopulation, scoreBeat } from '../../actions/beats';
import Scorer from '../Scorer';
import s from './BeatList.css';
import { selection, crossover, mutation } from './GeneticAlgorithm';

// import cx from 'classnames';
// let cx = classNames.bind(s);

/* Generates a new population based on what is voted on.
*/
const newPopulation = (props) => {
	// TODO: check if beats are scored yet
	const { beats, addNewPopulation } = props;
	const newBeatArray = [];

	// Create new offspring 8 times.
	for (let i = 0; i < 8; i++) {
		const parent1Index = selection(beats);
		const parent2Index = selection(beats, parent1Index);

		const offspring = crossover(beats, parent1Index, parent2Index);
		// mutation(offspring);

		offspring.id = 'beat' + i;
		newBeatArray.push(offspring);
	}
	console.log(newBeatArray);
	addNewPopulation(newBeatArray);
};

/* Plays a beat with index i
 */
const playBeat = (i) => {
	console.log("playbeat", i);
};

/* Box component, rendering a single box of a beat
*/
const Box = (props) => {
	const { beat, index, scoreBeat } = props;
	return (
		<div className={s.box}>
			<h3>Beat {index + 1}</h3>
			<button onClick={() => playBeat(index)} role="button" tabIndex={index}>Play</button>
			<p>K: {beat.kick}</p>
			<p>C: {beat.closedhat}</p>
			<p>O: {beat.openhat}</p>
			<p>S: {beat.clap}</p><br />
			<Scorer {...props} />
		</div>
	);
};

/* Bealist component. Displays a list of beats that can be votable.
*/
const BeatList = (props) => {
	const { beats, scoreBeat, addNewPopulation } = props;
	const beatList = [];

	beats.forEach((beat, index) => {
		beatList.push(<Box beat={beat} index={index} scoreBeat={scoreBeat} key={beat.id} />);
	});

  return (
    <div className={s.root}>
			{ beatList }
			<button
				className={s.newPopulation}
				onClick={() => newPopulation(props)}>
				Run Algorithm</button>
    </div>
  );
}

BeatList.propTypes = {};

const mapState = state => ({
  beats: state.beats,
});

const mapDispatch = dispatch => ({
	scoreBeat: (index, score) => dispatch(scoreBeat(index, score)),
	addNewPopulation: (newBeats) => dispatch(addNewPopulation(newBeats)),
});

export default connect(mapState, mapDispatch)(withStyles(s)(BeatList));
