import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNewPopulation, scoreBeat } from '../../actions/beats';
import { newPopulation } from './GeneticAlgorithm';
import Scorer from '../Scorer';
import s from './BeatList.css';
import { initializeBeat, startBeat, stopBeat } from './playBeat';

// import cx from 'classnames';
// let cx = classNames.bind(s);

/* Box component, rendering a single box of a beat
*/
const Box = (props) => {
	const { beat, index, scoreBeat, onPlayClick } = props;
	return (
		<div className={s.box}>
			<div className={s.playButton} onClick={() => onPlayClick(index)} role="button" tabIndex={index} />

			<div className={s.textContainer}>
				<p>K: {beat.kick}</p>
				<p>C: {beat.closedhat}</p>
				<p>O: {beat.openhat}</p>
				<p>S: {beat.clap}</p>
			</div>

			<Scorer {...props} />
		</div>
	);
};

/* Bealist component. Displays a list of beats that can be votable.
*/
class BeatList extends React.Component {
	/* Populate the array at init */
	componentWillMount() {
		this.populateBeatArray(this.props);
		this.setState({
			clickedPlay: [],
			sequences: [],
		});
	}

	/* Require the Tone.js lib and set it to the state. Can only be loaded once
	 * the component did mount */
	componentDidMount() {
		const Tone = require('tone');
		this.setState({ Tone }, () => this.populateSequenceArray(this.props.beats));
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ sequences: [] });
		this.populateSequenceArray(nextProps.beats);
	}
	/* Populate the beat array whenever we receive props from redux */
	componentWillUpdate(nextProps) {
		this.populateBeatArray(nextProps);
	}

	/* When clicking the beat to play */
	onPlayClick(index) {
		const { beats } = this.props;
		const { Tone, sequences } = this.state;

		// Update redux with the clicked state of the beat
		const clickedPlay = this.state.clickedPlay.slice();
		clickedPlay[index] = !clickedPlay[index];
		this.setState({ clickedPlay });

		// Stop all beats first, then play.
		sequences.forEach((seq, i) => stopBeat(Tone, sequences[i]));
		if (clickedPlay[index]) startBeat(Tone, sequences[index]);
	}

	/* Initialize sequences and put in the state to be able to play them. */
	populateSequenceArray(newBeats) {
		// TODO: Doesn't work. same sequences are played every time.
		const sequences = this.state.sequences;
		for (let i = 0; i < this.props.beatInfo.noOfBeats; i++) {
			sequences[i] = (initializeBeat(this.state.Tone, newBeats, this.props.beatInfo, i));
		}
		this.setState({ sequences });
	}

	/* Populate the beatlist with Box components. Used when updating from redux. */
	populateBeatArray(props) {
		const { beats, scoreBeat, addNewPopulation } = props;
		this.beatList = [];
		beats.forEach((beat, index) => {
			this.beatList.push(
				<Box
  beat={beat}
  index={index}
  scoreBeat={scoreBeat}
  key={beat.id}
  onPlayClick={this.onPlayClick.bind(this)}
				/>);
		});
	}

	render() {
		console.log(this.state);
		return (
			<div className={s.root}>
				{ this.beatList }
				<div
  className={s.runButton}
  onClick={() => newPopulation(this.props)}
  role="button"
  tabIndex="-1"
				>
					BEAT GENESIS
				</div>
			</div>
		);
	}
}

BeatList.propTypes = {};

const mapState = state => ({
  beats: state.beats,
	beatInfo: state.beatInfo,
});

const mapDispatch = dispatch => ({
	scoreBeat: (index, score) => dispatch(scoreBeat(index, score)),
	addNewPopulation: newBeats => dispatch(addNewPopulation(newBeats)),
});

export default connect(mapState, mapDispatch)(withStyles(s)(BeatList));
