import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBeats } from '../../actions/beats';
import s from './BeatList.css';

// import cx from 'classnames';
// let cx = classNames.bind(s);

function BeatList(props) {
	//console.log(props);
  return (
    <div className={s.root}>
				<div>{props.beat}</div>
    </div>
  );
}

BeatList.propTypes = {};

const mapState = state => ({
  beat: state.beats.payload,
});

const mapDispatch = dispatch => ({
  getBeats: () => dispatch(getBeats()),
});

export default connect(mapState, mapDispatch)(withStyles(s)(BeatList));
