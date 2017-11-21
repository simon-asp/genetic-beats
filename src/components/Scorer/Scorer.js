import React from 'react';
// import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import s from './Scorer.css';
// import cx from 'classnames';
// let cx = classNames.bind(s);

function Scorer({ i }) {
  return (
    <div className={s.root}>
			<div className={s.score} onClick={() => fitnessScoring(i, 1)} role="button" tabIndex={i} />
			<div className={s.score} onClick={() => fitnessScoring(i, 2)} role="button" tabIndex={i} />
			<div className={s.score} onClick={() => fitnessScoring(i, 3)} role="button" tabIndex={i} />
			<div className={s.score} onClick={() => fitnessScoring(i, 4)} role="button" tabIndex={i} />
			<div className={s.score} onClick={() => fitnessScoring(i, 5)} role="button" tabIndex={i} />
    </div>
  );
}

Scorer.propTypes = {
	i: PropTypes.string.isRequired,
};

export default withStyles(s)(Scorer);
