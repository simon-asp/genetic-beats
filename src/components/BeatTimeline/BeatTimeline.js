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

function BeatTimeline(props) {
	const { beatTimeline, beatInfo, scoreBeatProp, addNewPopulation, resetBeats } = props;
  return (
    <div className={s.root}>
			<BeatList
				beats={beatTimeline[0]}
				beatInfo={beatInfo}
				scoreBeat={scoreBeatProp}
				addNewPopulation={addNewPopulation}
				resetBeats={resetBeats}
				timeLineIndex={0}
			/>
    </div>
  );
}

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
