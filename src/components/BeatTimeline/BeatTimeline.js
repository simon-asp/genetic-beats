import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './BeatTimeline.css';
import PropTypes from 'prop-types';
import { addNewPopulation, scoreBeat, resetBeats, likeBeatToggle } from '../../actions/beats';
import { addNewSelectedPairs, resetSelectedPairs } from '../../actions/evolutionPairs';
import { hideWelcomeInfo } from '../../actions/beatInfo';
import BeatList from '../BeatList';
import Timeline from '../Timeline';
import Menu from '../Menu';
import WelcomeInfo from '../WelcomeInfo';
import * as firebase from 'firebase';

const cx = classNames.bind(s);
/* Populate the beatlist with Box components. Used when updating from redux. */

class BeatTimeline extends React.Component {
  static propTypes = {
  };

	componentWillMount() {
		this.setState({
			domNodesTimeline: [],
			linesTimeline: [],
			currentUser: firebase.auth().currentUser
		});
		this.storeDomNodes = this.storeDomNodes.bind(this);
		this.database = firebase.database().ref().child('users');
		
	}

	/* Determine if we want to show the welcome info, also subscribe to the database */
  componentDidMount() {
		this.showHideWelcomeInfo(this.props.beatInfo.welcomeInfoVisible);
		this.database.on('value', snap => console.log(snap.val()));
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
				/>,
			);
		});
		return beatTimelineArray;
	}


  render() {
    return (
			<div className={s.root}>
        <WelcomeInfo hideWelcomeInfo={this.props.hideWelcomeInfo} />
				<Menu resetSelectedPairs={this.props.resetSelectedPairs} resetBeats={this.props.resetBeats} currentUser={this.state.currentUser}/>
				{ this.populateTimelineArray() }
				<Timeline noOfGenerations={this.props.beatTimeline.length} />
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
	addNewPopulation: newBeats => dispatch(addNewPopulation(newBeats)),
	resetBeats: () => {dispatch(resetBeats())},
	addNewSelectedPairs: (selectedPairs, timelineIndex) => dispatch(addNewSelectedPairs(selectedPairs, timelineIndex)),
	resetSelectedPairs: () => dispatch(resetSelectedPairs()),
	hideWelcomeInfo: () => dispatch(hideWelcomeInfo()),
	likeBeatToggle: (timelineIndex, index) => dispatch(likeBeatToggle(timelineIndex, index))
});
export default connect(mapState, mapDispatch)(withStyles(s)(BeatTimeline));
