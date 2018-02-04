import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './WelcomeInfo.css';
import PropTypes from 'prop-types';

const cx = classNames.bind(s);

const WelcomeInfo = (props) => {
  return (
    <div className={s.root} id="welcomeInfo">
			<div className={s.top}>
				<h1>WELCOME TO </h1>
				<div className={s.logo} />
			</div>

			<div className={s.boxImage} />
			<div>
				<p>This is a tool for creatives to discover new types of musical beats
				created with AI.</p>

				<p>What you will be using is a <span>genetic algorithm</span> that takes inspiration
				from evolutionary biology to make new generations of beats, the next better
				than the previous one.</p>

				<p>By scoring the beats which are given, the algorithm can figure out which
				ones that are the best, and create new beats based on their scoring.</p>
			</div>

			<div className={s.bottom}>
				<div className={s.goButton} onClick={() => props.hideWelcomeInfo()} role="button" tabIndex="-10">
					GO!
				</div>
			</div>
    </div>
  );
}

WelcomeInfo.propTypes = {};

export default withStyles(s)(WelcomeInfo);
