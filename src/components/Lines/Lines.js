import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Lines.css';
import PropTypes from 'prop-types';
// import cx from 'classnames';
// let cx = classNames.bind(s);

class Lines extends React.Component {
  static propTypes = {
  };

	componentWillReceiveProps() {
		const { domNodesTimeline } = this.props;
		if (this.props.domNodesTimeline[0].length === 8) {
			this.renderLines();
		}
	}

	/* Get the center coordinates for a DOM element */
	getCenterCoords = (el) => {
		const coords = {};
		coords.x = el.offsetLeft + (el.offsetWidth / 2);
		coords.y = el.offsetTop + (el.offsetHeight / 2);
		return coords;
	};

	addLines = () => {
		const beatInfo = this.props.beatInfo;
		const lines = [];

		if (beatInfo) {
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < beatInfo.noOfBeats; j++) {
					lines.push(<line
						id={'line' + i + '' + j}
						stroke="rgba(255,255,255,0.4)"
						strokeWidth="8"
						className={s.line}
						key={i + '' + j}
					/>);
				}
			}
		}
		return lines;
	};

	renderLines() {
		const el1 = document.getElementById('beat0');
		const el2 = document.getElementById('beat4');
		const coords1 = this.getCenterCoords(el1);
		const coords2 = this.getCenterCoords(el2);

		// document.getElementById('line1').setAttribute('x1', coords1.x);
		// document.getElementById('line1').setAttribute('y1', coords1.y);
		// document.getElementById('line1').setAttribute('x2', coords2.x);
		// document.getElementById('line1').setAttribute('y2', coords2.y);
	}

  render() {
    return (
			<div className={s.root}>
				<svg style={{ height: this.props.noOfGenerations + '00vh' }}>
					{ this.addLines() }
				</svg>
			</div>
    );
  }
}

export default withStyles(s)(Lines);
