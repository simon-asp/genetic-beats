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
import { auth } from 'firebase';

import s from './Home.css';

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
      }
      else {
        this.setState({loggedIn:false, loading:false})
      }
    });
  }

  showLogin() {
    if(this.state.loggedIn) return <BeatTimeline />
    return <Login />
  }

  render() {
    return (
      <div className={s.root}>
        {this.state.loading ? <LoadingSpinner /> : this.showLogin() }
      </div>
    );
  }
}

export default withStyles(s)(Home);
