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
import s from './Home.css';
import Login from '../../components/Login';
import { auth } from 'firebase';

class Home extends React.Component {

  componentWillMount() {
    this.setState({
      loggedIn: false,
    });
  }

  componentDidMount() {
    auth().onAuthStateChanged(firebaseUser => {
      if(firebaseUser) {
        this.setState({loggedIn:true})
        console.log('logged in')
      }
      else {
        this.setState({loggedIn:false})
        console.log('not logged in')
      }
    });
  }

  render() {
    console.log(this.state.loggedIn)
    return (
      <div className={s.root}>
        {this.state.loggedIn ? <BeatTimeline /> : <Login />}
      </div>
    );
  }
}

export default withStyles(s)(Home);
