import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
// import cx from 'classnames/bind';
import s from './Scorer.css';

// let cx = classNames.bind(s);

function Scorer(props) {
	const { index, beat, scoreBeat } = props;
	const starClass = classNames({
		star: true,
		filled: beat.score !== 0,
	});

  return (
    <div className={s.root}>
			<div className={s.score} onClick={() => scoreBeat(index, 1)} role="button" tabIndex={0} />
			<div className={s.score} onClick={() => scoreBeat(index, 2)} role="button" tabIndex={0} />
			<div className={s.score} onClick={() => scoreBeat(index, 3)} role="button" tabIndex={0} />
			<div className={s.score} onClick={() => scoreBeat(index, 4)} role="button" tabIndex={0} />
			<div className={s.score} onClick={() => scoreBeat(index, 5)} role="button" tabIndex={0} />
    </div>
  );
}

Scorer.propTypes = {
	index: PropTypes.number.isRequired,
};

export default withStyles(s)(Scorer);
