import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Menu.css';
import PropTypes from 'prop-types';
// import cx from 'classnames';
// let cx = classNames.bind(s);

function Menu() {
  return (
    <div className={s.root}>
			Hej!
    </div>
  );
}

Menu.propTypes = {};

export default withStyles(s)(Menu);
