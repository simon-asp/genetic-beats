import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './BeatTimeline.css';
import PropTypes from 'prop-types';
import { addNewPopulation, scoreBeat, resetBeats } from '../../actions/beats';
import { addNewSelectedPairs, resetSelectedPairs } from '../../actions/evolutionPairs';
import BeatList from '../BeatList';
import Lines from '../Lines';
// import cx from 'classnames';
// let cx = classNames.bind(s);
/* Populate the beatlist with Box components. Used when updating from redux. */

class BeatTimeline extends React.Component {
  static propTypes = {
  };

	componentWillMount() {
		this.setState({
			domNodesTimeline: [],
			linesTimeline: [],
		});
		this.storeDomNodes = this.storeDomNodes.bind(this);
	}

	/* Store DOM-nodes of the boxes in the beatlist */
	storeDomNodes(domNode, timelineIndex) {
		const domNodesTimeline = this.state.domNodesTimeline;

		if (!domNodesTimeline[timelineIndex]) {
			const domNodes = [];
			domNodes.push(domNode);
			domNodesTimeline.push(domNodes);
			this.setState({ domNodesTimeline });
		}
		else {
			domNodesTimeline[timelineIndex].push(domNode);
			this.setState({ domNodesTimeline });
		}
	}

	storeLines(lines, timelineIndex) {
		this.setState({ lines });
	}

	/* Populate the beat timeline array with beatlist components */
	populateTimelineArray() {
		const { beatTimeline } = this.props;
		const beatTimelineArray = [];
		beatTimeline.forEach((generation, index) => {
			beatTimelineArray.push(
				<BeatList
					{...this.props}
					beats={beatTimeline[index]}
					timelineIndex={index}
					key={'generation' + index}
					storeDomNodes={(domNode, timelineIndex) => this.storeDomNodes(domNode, timelineIndex)}
				/>,
			);
		});
		return beatTimelineArray;
	}

  render() {
    return (
			<div className={s.root}>
				{ this.populateTimelineArray() }
				<Lines
					domNodesTimeline={this.state.domNodesTimeline}
					beatInfo={this.props.beatInfo}
					noOfGenerations={this.props.beatTimeline.length}
					evolutionPairs={this.props.evolutionPairs}
				/>
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
	resetBeats: () => dispatch(resetBeats()),
	addNewSelectedPairs: (selectedPairs, timelineIndex) => dispatch(addNewSelectedPairs(selectedPairs, timelineIndex)),
	resetSelectedPairs: () => dispatch(resetSelectedPairs()),
});

export default connect(mapState, mapDispatch)(withStyles(s)(BeatTimeline));
