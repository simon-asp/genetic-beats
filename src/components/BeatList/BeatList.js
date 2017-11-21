import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBeats } from '../../actions/beats';
import Scorer from '../Scorer';
import s from './BeatList.css';

// import cx from 'classnames';
// let cx = classNames.bind(s);
const beatList = [];

/* Fitness part of the genetic algorithm. The user votes on a beat.
 *
 */
const fitnessScoring = (i, score) => {
	beatList[i].props.beat.score = 1
	console.log(beatList[i].props.beat);
};

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
const Box = ({ beat, i }) => {
	return (
		<div className={s.box}>
			<h3>Beat {i + 1}</h3>
			<button onClick={() => playBeat(i)} role="button" tabIndex={i}>Play</button>
			<p>K: {beat.kick}</p>
			<p>C: {beat.closedhat}</p>
			<p>O: {beat.openhat}</p>
			<p>S: {beat.clap}</p><br />
			<Scorer i={i} />
		</div>
	);
};

/* Bealist component. Displays a list of beats that can be votable.
*/
function BeatList({ beats }) {
	beats.forEach((beat, i) => {
		beatList.push(<Box beat={beat} i={i} key={i} />);
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
});

export default connect(mapState, mapDispatch)(withStyles(s)(BeatList));
