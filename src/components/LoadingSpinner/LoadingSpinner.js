import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LoadingSpinner.css';
import PropTypes from 'prop-types';
// const cx = classNames.bind(s);

function LoadingSpinner() {
  return (
    <div className={s.root}>
      <div className={s.container}>
        <div className={s.spinner} />
      </div>
    </div>
  );
}

LoadingSpinner.propTypes = {};

export default withStyles(s)(LoadingSpinner);
