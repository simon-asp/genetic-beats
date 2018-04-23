import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './FinishScreen.css';
import PropTypes from 'prop-types';
// const cx = classNames.bind(s);

function FinishScreen() {
  return (
    <div className={s.root}>
      <div>
        <h1>Thank you! 🎉</h1>
        <h2>Your participation has helped us with our research 💜</h2>
      </div>
    </div>
  );
}

FinishScreen.propTypes = {};

export default withStyles(s)(FinishScreen);
