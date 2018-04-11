import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Button.css';
import PropTypes from 'prop-types';
const cx = classNames.bind(s);

function Button(props) {
  const buttonClass = cx('root', {filled:props.filled, hidden:props.hidden});
  if (props.unRender) return null;
  return (
    <div className={buttonClass} onClick={() => props.onClick()}>
      {props.text}
    </div>
  );
}

Button.propTypes = {};

export default withStyles(s)(Button);
