import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Login.css';
import PropTypes from 'prop-types';
import { auth } from 'firebase';
const cx = classNames.bind(s);
import { database, setUserUniqueKey, dbVer } from '../../database';

class Login extends React.Component {
  componentWillMount() {
    this.setState({
      email:'',
      password:'',
      error: false,
      errorMessage:'',
      errorGreen: false
    })
  }

  // Set email and password in state
  onChangeInput(e, type) {
    e.preventDefault();
    this.setState({
      [`${type}`]: e.target.value
    });
  }


  logIn(e) {
    e.preventDefault();
    const { email, password } = this.state;
    if(email !== '' || password !== '') {
      auth().signInWithEmailAndPassword(email, password)
      .catch(e => {
        this.setState({error: true, errorMessage: e.message})
      })
      .then(() => {
        setUserUniqueKey();
        this.startTimer();
      })
    }
    else {
      this.setState({error:true, errorMessage:'Please fill in the input fields'})
    }
  }

  // Sets a date to local storage
  startTimer() {
    localStorage.setItem('timer', new Date().getTime());
  }

  signUp(e) {
    e.preventDefault();
    const { email, password } = this.state;
    if(email !== '' || password !== '') {
      // Sign user up
      auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        // Add user to database
        database.ref('/'+dbVer+'/').push({
          userId: email
        })
        .catch(e => {
          // If database error
          this.setState({error: true, errorMessage: 'Something went wrong, try again'})
        })
        .then(() => {
          setUserUniqueKey();
          this.startTimer();
        })
      })
      .catch(e => {
        this.setState({error: true, errorMessage: e.message})
      });
    }
    else {
      this.setState({error:true, errorMessage:'Please fill in the input fields'})
    }
  }
  render () {
    const errorClass = cx('errorMessage', { visible: this.state.error, green: this.state.errorColor });
    return (
    <div className={s.root}>
      <div className={s.container}> 
        <div className={s.textContainer}>
          <h2>Welcome to Genetic Beats</h2>
          <p>Please log in or sign up</p>
        </div>
        <div className={s.loginContainer}>
          <div className={errorClass}>{this.state.errorMessage}</div>
          <input className={s.email} type="email" placeholder="Email" onChange={(e) => this.onChangeInput(e, 'email')} />
          <input className={s.password} type="password" placeholder="Password" onChange={(e) => this.onChangeInput(e, 'password')} />

          <button className={s.loginButton} onClick={this.logIn.bind(this)}>Log in</button>
          <button className={s.signupButton} onClick={this.signUp.bind(this)}>Sign up</button>
        </div>
      </div>
    </div>
    )
  }
}

export default withStyles(s)(Login);