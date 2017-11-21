import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBeats } from '../../actions/beats';
import s from './BeatList.css';

// import cx from 'classnames';
// let cx = classNames.bind(s);

function BeatList({ beats }) {
	let beatList = [];

	beats.forEach((beat, i) => {
		beatList.push(<Box beat={beat} i={i} key={i} />);
	});

  return (
    <div className={s.root}>
			{ beatList }
    </div>
  );
}

const vote = (i) => {
	console.log("hej" + i);
};

/* Box component, rendering a single box of a beat
*/
const Box = ({ beat, i }) => {
	return (
		<div className={s.box}>
			<h3>Beat {i + 1}</h3>
			<p>K: {beat.kick}</p>
			<p>C: {beat.closedhat}</p>
			<p>O: {beat.openhat}</p>
			<p>S: {beat.clap}</p><br />
			<button onClick={() => vote(i)}>Vote</button>
		</div>
	);
};

BeatList.propTypes = {};

const mapState = state => ({
  beats: state.beats,
});

const mapDispatch = dispatch => ({
  getBeats: () => dispatch(getBeats()),
});

export default connect(mapState, mapDispatch)(withStyles(s)(BeatList));
