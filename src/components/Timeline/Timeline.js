import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Timeline.css';
// import cx from 'classnames';
// let cx = classNames.bind(s);

const circle = (i) => {
	return (
		<div className={s.circleContainer} key={'circle' + i}>
			<div className={s.circle}>{ i + 1 }</div>
		</div>);
};

const verticalLine = (i) => {
	return (
		<div className={s.lineContainer} key={'line' + i}>
			<div className={s.verticalLine} />
		</div>);
}

const renderTimeline = (props) => {
	const { noOfGenerations } = props;
	const timelineArray = [];

	// Add circles every time and vertical lines every other time.
	for (let i = 0; i < noOfGenerations; i++) {
		timelineArray.push(circle(i));
		if (i !== noOfGenerations - 1) timelineArray.push(verticalLine(i));
	}
	return timelineArray;
};

/* Timeline function, a vertical timeline showing how many generations has been
 * generated. */
const Timeline = (props) => {
  return (
    <div className={s.root}>
		GENERATION
		{ renderTimeline(props) }
    </div>
  );
}

Timeline.propTypes = {
	noOfGenerations: PropTypes.number.isRequired,
};

export default withStyles(s)(Timeline);
