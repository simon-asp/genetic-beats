import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import s from './Scorer.css';

const cx = classNames.bind(s);

const scoreBeatCheck = (props, i) => {
	const { index, scoreBeat, timelineIndex, noOfGenerations } = props;
	if(timelineIndex === noOfGenerations-1) {
		scoreBeat(timelineIndex, index, i + 1);
	}
}
/* Scorer function, renders stars that can be clickable */
function Scorer(props) {
	const { index, beat, scoreBeat, timelineIndex, noOfGenerations } = props;
	const stars = [];

	for (let i = 0; i < 5; i++) {
		const starClass = cx('score', {
			filled: beat.score >= i + 1,
			dark: timelineIndex !== noOfGenerations-1,
		});
		stars.push(
			<div
				className={starClass}
				onClick={() => scoreBeatCheck(props, i)}
				role="button"
				tabIndex={0}
				key={i}
			/>);
	}

  return (
    <div className={s.root}>
			{ stars }
    </div>
  );
}

Scorer.propTypes = {
	index: PropTypes.number.isRequired,
};

export default withStyles(s)(Scorer);
