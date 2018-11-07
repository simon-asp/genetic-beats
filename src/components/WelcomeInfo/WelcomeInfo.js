import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './WelcomeInfo.css';
import PropTypes from 'prop-types';

const cx = classNames.bind(s);

const WelcomeInfo = (props) => {
  return (
    <div className={s.root} id="welcomeInfo">
      <div className={s.container}>
  			<div className={s.top}>
  				<div className={s.logo} />
  			</div>

        <div>
          <div className={s.beats}/>
          <div className={s.middle}>
            <div className={s.item}>
              <h2>1. LISTEN TO BEATS AND SCORE THEM</h2>
            </div>

            <div className={s.item}>
              <h2>2. NEW BEATS WILL BE GENERATED FROM THE BEST ONES</h2>
            </div>

            <div className={s.item}>
              <h2>3. REPEAT STEP 1 AND 2, UNTIL YOU FIND SOMETHING YOU LIKE</h2>
            </div>
          </div>
          <p style={{fontSize: "10px", width: "400px"}}>Oh, we're saving the beats in your browser so you can continue where you left off. By continuing you agree to the usage of cookies.</p>
        </div>

  			<div className={s.bottom}>
  				<div className={s.goButton} onClick={() => props.hideWelcomeInfo()} role="button" tabIndex="-10">
  					GO!
  				</div>
  			</div>
      </div>
    </div>
  );
}
//
// <p>This is a tool for creatives to discover new types of musical beats
// created with AI.</p>
//
// <p>What you will be using is a <span>genetic algorithm</span> that takes inspiration
// from evolutionary biology to make new generations of beats, the next better
// than the previous one.</p>
//
// <p>By scoring the beats which are given, the algorithm can figure out which
// ones that are the best, and create new beats based on their scoring.</p>
WelcomeInfo.propTypes = {};

export default withStyles(s)(WelcomeInfo);
