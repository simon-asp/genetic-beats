import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Tooltip.css';
import PropTypes from 'prop-types';
const cx = classNames.bind(s);

function Tooltip(props) {
  const tooltipClass = cx('root', { active: props.active, 
      error: (props.type === 'error'), 
      warning: (props.type === 'warning'),
      info: (props.type === 'info')});  
  return (
    <div className={tooltipClass}>
      { props.text }
      <div className={s.triangle} />
      { props.children }
    </div>
  );
}

Tooltip.propTypes = {};

export default withStyles(s)(Tooltip);
