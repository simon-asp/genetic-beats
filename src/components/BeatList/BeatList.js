import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import * as ga from './GeneticAlgorithm';
import s from './BeatList.css';
import { initializeBeat, startBeat, stopBeat } from './playBeat';
import Box from '../Box';
import Lines from '../Lines';
import Button from '../Button';
import Tooltip from '../Tooltip';

const cx = classNames.bind(s);

/* Bealist component. Displays a list of beats that can be votable.
*/
class BeatList extends React.Component {
	static propTypes = {
		beatInfo: PropTypes.object,
		scoreBeat: PropTypes.func,
		pressGenerateButton: PropTypes.func,
		resetBeats: PropTypes.func,
		timelineIndex: PropTypes.number,
		storeDomNodes: PropTypes.func,
		domNodes: PropTypes.array,
		evolutionPairs: PropTypes.array,
		likeBeatToggle: PropTypes.func,
  };

	static defaultProps = {
		beats: [],
		beatInfo: {},
		scoreBeat: () => {},
		pressGenerateButton: () => {},
		resetBeats: () => {},
		timelineIndex: 0,
		storeDomNodes: () => {},
		likeBeatToggle: () => {}		
	}

	/* Populate the array at init */
	componentWillMount() {
		this.setState({
			clickedPlay: [],
			sequences: [],
			higherGenerationExists: false,
			showTooltip: false,
			allInfoActive: false,
			showArrow: false,
			tooltipText: 'Please score all beats',
			tooltipType: 'error',
			tooltipButtons: false,
			confirmedFinish: false,
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

		let scoreIsSame = true;
		let allScoreZero = true;
		/* Since setState is asynchronus. When resetting beats, we need to know if
		higher generations exists to pass to the box component and score component */
		let higherGenerationExists = false;

		// Check if the score has changed
		for (let i = 0; i < nextBeats.length; i++) {
			if (!Object.is(nextBeats[i].score, beats[i].score)) scoreIsSame = false;
			if (nextBeats[i].score !== 0) allScoreZero = false;
		}

		/* Only update the sequence array if the score has changed, or when we
		 * have a new population with zero score */
		if (!scoreIsSame || allScoreZero) {
			this.populateSequenceArray(nextProps.beats);
		}

		// If we have a beatlist with a higher index than this, update state.
		// Used to disable the run-button and scorer
		if (nextProps.timelineIndex !== nextProps.noOfGenerations - 1) {
			this.setState({ higherGenerationExists: true });
			higherGenerationExists = true;
		} else {
			this.setState({ higherGenerationExists: false });
			higherGenerationExists = false;

		};

		this.populateBeatArray(nextProps, higherGenerationExists);
	}

	/* When clicking the beat to play */
	onPlayClick(index) {
		const { Tone, sequences } = this.state;

		// Update the state with the clicked state of the beat
		const clickedPlay = this.state.clickedPlay.slice();
		clickedPlay[index] = !clickedPlay[index];
		this.setState({ clickedPlay });

		// Stop all beats first, then play.
		this.stopAllBeats();
		if (clickedPlay[index]) startBeat(sequences[index]);
	}

	// Stop all beats in this BeatList
	stopAllBeats() {
		const { sequences } = this.state;
		sequences.forEach((seq, i) => stopBeat(sequences[i]));
	}

	/* When clicking the button that runs the genetic algorithm. Check for score
	 * of the beat first. */
	onGenesisClick() {
		const showTooltip = this.props.beats.map(beat => beat.score).includes(0);
		this.setState({ showTooltip, tooltipText: 'Please score all beats', tooltipType:'error', tooltipButtons:false });
		// Remove the tooltip after 3 seconds
		setTimeout(() => {this.setState({showTooltip: false})}, 3000);

		if (!showTooltip) ga.newPopulation(this.props, () => {
			// Reset the scorer check after new population has been made.
			this.setState({showTooltip: false});

			// Set a timer for the jumping down arrow
			if(this.props.timelineIndex === 0) {
				this.setState({showArrow: true});
				setTimeout(() => this.setState({showArrow: false}), 6000);
			}
		});
	}
	onFinishClick() {
		this.setState({showTooltip: true, 
			tooltipText: 'Are you sure you want to end the session?', 
			tooltipType: 'info',
			tooltipButtons:true});
	}
	onConfirmClick(confirm) {
		if(confirm) this.props.finishExperiment();
		this.setState({showTooltip:false});
	}

	/* Click on all box refs and display their info
	*/
	onBeatInfoClick = () => {
		let allInfoActiveState = this.state.allInfoActive;
		this.setState({ allInfoActive: !allInfoActiveState });

		allInfoActiveState = this.state.allInfoActive;
		if (allInfoActiveState) {
			for (let i = 0; i < this.props.beatInfo.noOfBeats; i++) {
				this[`box${i}`].hideInfo();
			}
		} else {
			for (let i = 0; i < this.props.beatInfo.noOfBeats; i++) {
				this[`box${i}`].showInfo();
			}
			// Update database with BeatInfoShowedCount
			this.props.showBeatInfoAction();
		}
	}

	/* Initialize sequences and put in the state to be able to play them. */
	populateSequenceArray(newBeats) {
		const sequences = this.state.sequences;
		for (let i = 0; i < this.props.beatInfo.noOfBeats; i++) {
			sequences[i] = (initializeBeat(this.state.Tone, newBeats, this.props.beatInfo, i, this.props.timelineIndex));
		}
		this.setState({ sequences });
	}

	/* Populate the beatlist with Box components. Used when updating from redux. */
	populateBeatArray(props, higherGenerationExists) {
		const { beats, scoreBeat, timelineIndex, storeDomNodes, evolutionPairs, beatInfo, noOfGenerations } = props;
		this.beatList = [];
		beats.forEach((beat, index) => {
			this.beatList.push(
				<Box
					beat={beat}
					index={index}
					id={index}
					timelineIndex={timelineIndex}
					scoreBeat={scoreBeat}
					key={beat.id}
					onPlayClick={this.onPlayClick.bind(this)}
					storeDomNodes={storeDomNodes}
					evolutionPairs={evolutionPairs}
					onRef={ref => (this[`box${index}`] = ref)}
					noOfGenerations={noOfGenerations}
					higherGenerationExists={higherGenerationExists}
					likeBeatFirebaseAction={this.props.likeBeatFirebaseAction}
					showLineInfoAction={this.props.showLineInfoAction}
				/>);
			});
		}

	render() {
		const arrowDownTooltipClass = cx('arrowDownTooltip', { active: this.state.showArrow && this.props.timelineIndex === 0 });
		return (
			<div className={s.root} id="beatList">
				{ this.beatList }
				<section className={s.buttons}>
					<div className={s.flexGrow}>
						<div
							className={s.beatInfoButton}
							onClick={this.onBeatInfoClick.bind(this)}
							tabIndex={-10}
							role="button"
						>i</div>
					</div>

					<Button text="NEW ITERATION" 
						onClick={this.onGenesisClick.bind(this)} 
						filled={false} 
						hidden={this.state.higherGenerationExists} />
					
					<Button text="I AM SATISFIED" 
						onClick={this.onFinishClick.bind(this)}
						colored={true} 
						hidden={this.state.higherGenerationExists}
						unRender={this.props.timelineIndex < 3} />
					
					<Tooltip text={this.state.tooltipText} 
						active={this.state.showTooltip}
						type={this.state.tooltipType}>
						{this.state.tooltipButtons ? (
							<div style={{display:'flex'}}>
								<Button text="YES" onClick={this.onConfirmClick.bind(this, true)} />
								<Button text="NO" onClick={this.onConfirmClick.bind(this, false)} filled={true} />
							</div>							
						) : ('')}
					</Tooltip>
					<div className={arrowDownTooltipClass} />

				</section>


				<Lines
					domNodes={this.props.domNodes}
					beatInfo={this.props.beatInfo}
					evolutionPairs={this.props.evolutionPairs}
					timeLineIndex={this.props.timelineIndex}
					beatList={this.beatList}
				/>
			</div>
		);
	}
}

export default withStyles(s)(BeatList);
