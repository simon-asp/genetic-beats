import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNewPopulation, scoreBeat } from '../../actions/beats';
import Scorer from '../Scorer';
import s from './BeatList.css';
import { selection, crossover, mutation } from './GeneticAlgorithm';
import playBeat from './playBeat';

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

/* Box component, rendering a single box of a beat
*/
const Box = (props) => {
	const { beat, index, scoreBeat } = props;
	return (
		<div className={s.box}>
			<div className={s.playButton} onClick={() => console.log('hej')} role="button" tabIndex={index} />
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
class BeatList extends React.Component {
	componentWillMount() {
		this.populateArray(this.props);
	}

	componentDidMount() {
		const { beats, index } = this.props;
		const Tone = require('tone');

		playBeat(Tone, beats, 0);
	}
	componentWillUpdate(nextProps) {
		this.populateArray(nextProps);
	}

	// Populate the beatlist with Box components. Used when updating from redux.
	populateArray(props) {
		const { beats, scoreBeat, addNewPopulation } = props;
		this.beatList = [];
		beats.forEach((beat, index) => {
			this.beatList.push(<Box beat={beat} index={index} scoreBeat={scoreBeat} key={beat.id} />);
		});
	}

	render() {
		return (
			<div className={s.root}>
				{ this.beatList }
				<div
					className={s.runButton}
					onClick={() => newPopulation(this.props)}
					role="button"
					tabIndex="-1">
					Run
				</div>
			</div>
		);
	}
}

BeatList.propTypes = {};

const mapState = state => ({
  beats: state.beats,
});

const mapDispatch = dispatch => ({
	scoreBeat: (index, score) => dispatch(scoreBeat(index, score)),
	addNewPopulation: newBeats => dispatch(addNewPopulation(newBeats)),
});

export default connect(mapState, mapDispatch)(withStyles(s)(BeatList));
