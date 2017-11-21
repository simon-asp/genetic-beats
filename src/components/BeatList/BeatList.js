import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBeats, scoreBeat } from '../../actions/beats';
import Scorer from '../Scorer';
import s from './BeatList.css';

// import cx from 'classnames';
// let cx = classNames.bind(s);
const beatList = [];

/* Selection part of the algorithm. Works with Rank Selection
 */
const selection = () => {
	console.log("mating");
}

/* crossover part of the algorithm.
 */
const crossover = () => {
	console.log("crossover");
}

/* Mutation part of the algorithm.
 */
const mutation = () => {
	console.log("mutation");
}

/* Generates a new population based on what is voted on.
*/
const newPopulation = () => {
	console.log("GA");
}

/* Plays a beat with index i
 */
const playBeat = (i) => {
	console.log("playbeat", i);
}

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
function BeatList(props) {
	const { beats, scoreBeat } = props;

	beats.forEach((beat, index) => {
		beatList.push(<Box beat={beat} index={index} scoreBeat={scoreBeat} key={beat.id} />);
	});

  return (
    <div className={s.root}>
			{ beatList }
			<button className={s.newPopulation} onClick={() => newPopulation()}>Run Algorithm</button>
    </div>
  );
}

BeatList.propTypes = {};

const mapState = state => ({
  beats: state.beats,
});

const mapDispatch = dispatch => ({
  getBeats: () => dispatch(getBeats()),
	scoreBeat: (index, score) => dispatch(scoreBeat(index, score)),
});

export default connect(mapState, mapDispatch)(withStyles(s)(BeatList));
