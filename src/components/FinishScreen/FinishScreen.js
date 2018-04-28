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
        <h2>Please go to the questionnaire and fill it in 💜</h2>
        <a target="_blank" href="https://goo.gl/forms/VF5zzHJE5TMyLHt22">https://goo.gl/forms/VF5zzHJE5TMyLHt22</a>
      </div>
    </div>
  );
}

FinishScreen.propTypes = {};

export default withStyles(s)(FinishScreen);