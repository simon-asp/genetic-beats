/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import BeatTimeline from '../../components/BeatTimeline';
import Login from '../../components/Login';
import LoadingSpinner from '../../components/LoadingSpinner';

import s from './Home.css';
import { auth } from 'firebase';

class Home extends React.Component {

  componentWillMount() {
    this.setState({
      loggedIn: false,
      loading: true,
    });
  }
  
  componentDidMount() {
    auth().onAuthStateChanged(firebaseUser => {
      if(firebaseUser) {
        this.setState({loggedIn:true, loading:false})
        console.log('logged in')
      }
      else {
        this.setState({loggedIn:false, loading:false})
        console.log('not logged in')
      }
    });
  }

  showLogin() {
    if(this.state.loggedIn) return <BeatTimeline />
    return <Login />
  }

  render() {
    console.log(this.state.loggedIn)
    return (
      <div className={s.root}>
        {this.state.loading ? <LoadingSpinner /> : this.showLogin() }
      </div>
    );
  }
}

export default withStyles(s)(Home);
