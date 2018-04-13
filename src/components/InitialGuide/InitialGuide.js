import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './InitialGuide.css';
import PropTypes from 'prop-types';
import Tooltip from '../Tooltip';
import { getCenterCoords } from '../../utils';
const cx = classNames.bind(s);

// Initial guide that helps the user with the app. Not sure if it's gonna be used yet. Not finished either
class InitialGuide extends React.Component {

  componentWillMount() {
    this.setState({
      tooltipText: 'The colors of the lines represent ',
      tooltipDirection: 'left',
      boxDomNode: '',
      playButtonStyle: {},
      starStyle: {},
      lineStyle: {},
      tooltipIndex: 0,
    });
  }
  componentWillReceiveProps(nextProps) {
    // Get dom nodes from boxes
    if(nextProps.domNodesTimeline) {
      const domNodeCoords1 = getCenterCoords(nextProps.domNodesTimeline[0][0]);
      const domNodeCoords2 = getCenterCoords(nextProps.domNodesTimeline[0][4]);
      const coords = {x: domNodeCoords2.x, y: domNodeCoords2.y - domNodeCoords1.y};
      // Set the play buttons coordinates in state
      this.setState({playButtonStyle:{top:coords.y+18, left:coords.x-280, bottom:'auto'}});
    }
  }
  onTooltipClick() {
    this.setState({tooltipIndex:this.state.tooltipIndex+1});
  }
  render() {
    if(!this.props.active) {
      return null;
    }
    return (
      <div className={s.root}>
        { <Tooltip 
            text={this.state.tooltipText}
            type="blue" 
            active={true} 
            direction={this.state.tooltipDirection}
            style={Object.assign({position:'absolute', width:260}, this.state.playButtonStyle)}
          >
      </Tooltip> }
      </div>
    );
  }
}


InitialGuide.propTypes = {};

export default withStyles(s)(InitialGuide);
