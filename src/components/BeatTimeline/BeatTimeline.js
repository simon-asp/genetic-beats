import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './BeatTimeline.css';
import PropTypes from 'prop-types';
import { pressGenerateButton, scoreBeat, resetBeats, likeBeatFirebaseAction, showBeatInfoAction, showLineInfoAction, loginTimeAction } from '../../actions/beats';
import { addNewSelectedPairs, resetSelectedPairs } from '../../actions/evolutionPairs';
import { hideWelcomeInfo, hideLineTooltip } from '../../actions/beatInfo';
import BeatList from '../BeatList';
import Timeline from '../Timeline';
import Menu from '../Menu';
import WelcomeInfo from '../WelcomeInfo';
import FinishScreen from '../FinishScreen';
import InitialGuide from '../../components/InitialGuide';
import { auth } from 'firebase';
import { calculateLoginTime } from '../../utils';
const cx = classNames.bind(s);
/* Populate the beatlist with Box components. Used when updating from redux. */

class BeatTimeline extends React.Component {
  static propTypes = {
  };

	componentWillMount() {
		this.setState({
			domNodesTimeline: [],
			linesTimeline: [],
			currentUser: auth().currentUser,
			showInitialGuide: false,
		});
		this.storeDomNodes = this.storeDomNodes.bind(this);
		// Not used yet
		this.finishExperiment = this.finishExperiment.bind(this);
	}

	componentWillUnmount() {
		// Set the active time the user has been logged in
		this.props.loginTimeAction(calculateLoginTime());
	}
	/* Determine if we want to show the welcome info */
  componentDidMount() {
		this.showHideWelcomeInfo(this.props.beatInfo.welcomeInfoVisible);
  }
  componentWillReceiveProps(nextProps) {
    this.showHideWelcomeInfo(nextProps.beatInfo.welcomeInfoVisible);
  }

	/* Shows and hides the welcome info */
  showHideWelcomeInfo = (welcomeInfoVisible) => {
    const welcomeInfoDiv = document.getElementById('welcomeInfo');
    if (welcomeInfoVisible) welcomeInfoDiv.style.visibility = 'visible';
    else welcomeInfoDiv.style.visibility = 'hidden';
  }

	/* Store DOM-nodes of the boxes in the beatlist */
	storeDomNodes(domNode, timelineIndex) {
		const domNodesTimeline = this.state.domNodesTimeline;

		if (!domNodesTimeline[timelineIndex]) {
			const domNodes = [];
			domNodes.push(domNode);
			domNodesTimeline.push(domNodes);
			this.setState({ domNodesTimeline });
		} else {
			domNodesTimeline[timelineIndex].push(domNode);
			this.setState({ domNodesTimeline });
		}
	}

	storeLines(lines) {
		this.setState({ lines });
	}

	// Terminate the experiment from the user
	finishExperiment() {
		console.log('finished')
		
		this.props.loginTimeAction(calculateLoginTime());
	}

	/* Populate the beat timeline array with beatlist components */
	populateTimelineArray() {
		const { beatTimeline, evolutionPairs } = this.props;
		const beatTimelineArray = [];
		beatTimeline.forEach((generation, index) => {
			beatTimelineArray.push(
				<BeatList
					{...this.props}
					beats={beatTimeline[index]}
					timelineIndex={index}
					storeDomNodes={(domNode, timelineIndex) => this.storeDomNodes(domNode, timelineIndex)}
					domNodes={this.state.domNodesTimeline[index]}
					noOfGenerations={beatTimeline.length}
					key={'generation' + index}
					evolutionPairs={evolutionPairs[index]}
					finishExperiment={this.finishExperiment}
				/>,
			);
		});
		return beatTimelineArray;
	}


  render() {
    return (
			<div className={s.root}>
        <WelcomeInfo hideWelcomeInfo={this.props.hideWelcomeInfo} />
				<FinishScreen />
				{/* <InitialGuide active={this.state.showInitialGuide} domNodesTimeline={this.state.domNodesTimeline}/>
				
				<Menu resetSelectedPairs={this.props.resetSelectedPairs} resetBeats={this.props.resetBeats} currentUser={this.state.currentUser}/>
				{ this.populateTimelineArray() }
				<Timeline noOfGenerations={this.props.beatTimeline.length} /> */}
			</div>
    );
  }
}

BeatTimeline.propTypes = {};

const mapState = state => ({
  beatTimeline: state.beatTimeline,
	beatInfo: state.beatInfo,
	evolutionPairs: state.evolutionPairs,
});

const mapDispatch = dispatch => ({
	scoreBeat: (timelineIndex, index, score) => dispatch(scoreBeat(timelineIndex, index, score)),
	pressGenerateButton: (newBeats, timelineIndex) => dispatch(pressGenerateButton(newBeats, timelineIndex)),
	resetBeats: () => {dispatch(resetBeats())},
	addNewSelectedPairs: (selectedPairs, timelineIndex) => dispatch(addNewSelectedPairs(selectedPairs, timelineIndex)),
	resetSelectedPairs: () => dispatch(resetSelectedPairs()),
	hideWelcomeInfo: () => dispatch(hideWelcomeInfo()),
	likeBeatFirebaseAction: (timelineIndex, index, beat) => dispatch(likeBeatFirebaseAction(timelineIndex, index, beat)),
	showBeatInfoAction: () => dispatch(showBeatInfoAction()),
	showLineInfoAction: () => dispatch(showLineInfoAction()),
	loginTimeAction: (minutes) => dispatch(loginTimeAction(minutes)),
	hideLineTooltip: () => dispatch(hideLineTooltip()),
});
export default connect(mapState, mapDispatch)(withStyles(s)(BeatTimeline));
