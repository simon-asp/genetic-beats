import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Login.css';
import PropTypes from 'prop-types';
// import cx from 'classnames';
// let cx = classNames.bind(s);

function Login() {
  return (
    <div className={s.root}>
      <div className={s.container}> 
        <div className={s.textContainer}>
          <h2>Welcome to Genetic Beats</h2>
          <p>Please log in or sign up</p>
        </div>
        <div className={s.loginContainer}>
          <input className={s.email} type="email" placeholder="Email" />
          <input className={s.password} type="password" placeholder="Password" />

          <button className={s.loginButton}>Log in</button>
          <button className={s.signupButton}>Sign up</button>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {};

export default withStyles(s)(Login);
