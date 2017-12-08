import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import s from './Scorer.css';

const cx = classNames.bind(s);

/* Scorer function, renders stars that can be clickable */
function Scorer(props) {
	const { index, beat, scoreBeat } = props;
	const stars = [];

	for (let i = 0; i < 5; i++) {
		const starClass = cx('score', {
			filled: beat.score >= i + 1,
		});
		stars.push(
			<div
  className={starClass}
  onClick={() => scoreBeat(index, i + 1)}
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
