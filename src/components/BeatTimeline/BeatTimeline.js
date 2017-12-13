import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './BeatTimeline.css';
import PropTypes from 'prop-types';
import { addNewPopulation, scoreBeat, resetBeats } from '../../actions/beats';
import BeatList from '../BeatList';
// import cx from 'classnames';
// let cx = classNames.bind(s);
/* Populate the beatlist with Box components. Used when updating from redux. */

/* Populate the beat timeline array with beatlist components */
const populateTimelineArray = (props) => {
	const beatTimelineArray = [];
	props.beatTimeline.forEach((generation, index) => {
		beatTimelineArray.push(
			<BeatList
				{...props}
				beats={props.beatTimeline[index]}
				timeLineIndex={index}
				key={'generation' + index}
			/>,
		);
	});
	return beatTimelineArray;
};

const BeatTimeline = (props) => {
  return (
    <div className={s.root}>
			{ populateTimelineArray(props) }
    </div>
  );
};

BeatTimeline.propTypes = {};

const mapState = state => ({
  beatTimeline: state.beatTimeline,
	beatInfo: state.beatInfo,
});

const mapDispatch = dispatch => ({
	scoreBeatProp: (timelineIndex, index, score) => dispatch(scoreBeat(timelineIndex, index, score)),
	addNewPopulation: newBeats => dispatch(addNewPopulation(newBeats)),
	resetBeats: () => dispatch(resetBeats()),
});

export default connect(mapState, mapDispatch)(withStyles(s)(BeatTimeline));
