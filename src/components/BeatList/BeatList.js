import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNewPopulation, scoreBeat, resetBeats } from '../../actions/beats';
import { newPopulation } from './GeneticAlgorithm';
import s from './BeatList.css';
import { initializeBeat, startBeat, stopBeat } from './playBeat';
import Lines from '../Lines';
import Box from '../Box';

/* Bealist component. Displays a list of beats that can be votable.
*/
class BeatList extends React.Component {
	static propTypes = {
    beats: PropTypes.array.isRequired,
		beatInfo: PropTypes.object.isRequired,
  };

	/* Populate the array at init */
	componentWillMount() {
		this.setState({
			clickedPlay: [],
			sequences: [],
			domNodes: [],
		});
	}

	/* Require the Tone.js lib and set it to the state. Can only be loaded once
	 * the component did mount, so we set the state here. */
	componentDidMount() {
		const Tone = require('tone');
		this.populateBeatArray(this.props);
		this.setState({ Tone }, () => this.populateSequenceArray(this.props.beats));
	}

	/* Populate the beat array and the sequence array on new props from redux
	 * Don't update the sequence array when the score is changed. */
	componentWillReceiveProps(nextProps) {
		const nextBeats = nextProps.beats;
		const beats = this.props.beats;

		// Reset the clickedPlay array
		this.setState({ clickedPlay: [] });
		this.populateBeatArray(nextProps);
		let scoreIsSame = true;
		let allScoreZero = true;

		// Check if the score has changed
		for (let i = 0; i < nextBeats.length; i++) {
			if (!Object.is(nextBeats[i].score, beats[i].score)) scoreIsSame = false;
			if (nextBeats[i].score !== 0) allScoreZero = false;
		}

		/* Only update the sequence array if the score has changed, or when we
		 * have a new population with zero score */
		if (scoreIsSame || allScoreZero) {
			this.populateSequenceArray(nextProps.beats);
		}
	}

	/* When clicking the beat to play */
	onPlayClick(index) {
		const { Tone, sequences } = this.state;

		// Update the state with the clicked state of the beat
		const clickedPlay = this.state.clickedPlay.slice();
		clickedPlay[index] = !clickedPlay[index];
		this.setState({ clickedPlay });

		// Stop all beats first, then play.
		sequences.forEach((seq, i) => stopBeat(Tone, sequences[i]));
		if (clickedPlay[index]) startBeat(Tone, sequences[index]);
	}

	/* When clicking the button that runs the genetic algorithm. Check for score
	 * of the beat first. */
	onGenesisClick() {
		// TODO: make a modal thing for the error message
		const scoreZero = this.props.beats.map(beat => beat.score).includes(0);
		if (scoreZero) console.log('Please score all the beats');
		else newPopulation(this.props);
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

	/* Store DOM-nodes of the boxes in the beatlist */
	storeDomNodes(domNode) {
		const domNodes = this.state.domNodes;
		domNodes.push(domNode);
		this.setState({ domNodes });
	}

	/* Populate the beatlist with Box components. Used when updating from redux. */
	populateBeatArray(props) {
		const { beats, scoreBeatComponent } = props;
		this.beatList = [];
		beats.forEach((beat, index) => {
			this.beatList.push(
				<Box
					id={beat.id}
				  beat={beat}
				  index={index}
				  scoreBeat={scoreBeatComponent}
				  key={beat.id}
				  onPlayClick={this.onPlayClick.bind(this)}
					storeDomNodes={(domNode) => this.storeDomNodes(domNode)}
				/>);
		});
	}

	render() {
		return (
			<div className={s.root} id="beatList">
				{ this.beatList }

				<div
				  className={s.runButton}
				  onClick={() => this.onGenesisClick()}
				  role="button"
				  tabIndex="-1"
				>BEAT GENESIS</div>

				<div
				  className={s.runButton}
				  onClick={() => this.props.resetBeats()}
				  role="button"
				  tabIndex="-2"
				>RESET BEATS</div>

				<Lines domNodes={this.state.domNodes} />
			</div>
		);
	}
}

const mapState = state => ({
  beats: state.beats,
	beatInfo: state.beatInfo,
});

const mapDispatch = dispatch => ({
	scoreBeatComponent: (index, score) => dispatch(scoreBeat(index, score)),
	addNewPopulation: newBeats => dispatch(addNewPopulation(newBeats)),
	resetBeats: () => dispatch(resetBeats()),
});

export default connect(mapState, mapDispatch)(withStyles(s)(BeatList));
