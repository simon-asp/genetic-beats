import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './BeatTimeline.css';
import PropTypes from 'prop-types';
import BeatList from '../BeatList';
// import cx from 'classnames';
// let cx = classNames.bind(s);

function BeatTimeline() {
  return (
    <div className={s.root}>
			<BeatList />
    </div>
  );
}

BeatTimeline.propTypes = {};

const mapState = state => ({
  beatTimeline: state.beatTimeline,
	beatInfo: state.beatInfo,
});

const mapDispatch = dispatch => ({
	scoreBeatComponent: (index, score) => dispatch(scoreBeat(index, score)),
	addNewPopulation: newBeats => dispatch(addNewPopulation(newBeats)),
	resetBeats: () => dispatch(resetBeats()),
});

export default connect(mapState, mapDispatch)(withStyles(s)(BeatTimeline));
