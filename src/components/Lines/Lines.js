import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import s from './Lines.css';
// import cx from 'classnames';
// let cx = classNames.bind(s);

class Lines extends React.Component {
  static propTypes = {
		domNodes: PropTypes.array,
		beatInfo: PropTypes.object,
		evolutionPairs: PropTypes.array,
  };

	componentWillReceiveProps(nextProps) {
		console.log('lines', nextProps);
		if (nextProps.domNodes) this.renderLines(nextProps);
		if (!nextProps.evolutionPairs) this.unrenderLines(nextProps);
	}

	/* Get the center coordinates for a DOM element */
	getCenterCoords = (el) => {
		const coords = {};
		coords.x = el.offsetLeft + (el.offsetWidth / 2);
		coords.y = el.offsetTop + (el.offsetHeight / 2);
		return coords;
	};

	addLines = (props) => {
		const { beatInfo, timeLineIndex } = props;
		const lines = [];
		const colors = ['#DFE0E2', '#75ABBC', '#090C9B', '#F1FFFA', '#993955', '#F5CB5C', '#F786AA', '#EDE580'];
		if (beatInfo) {
			for (let j = 0; j < beatInfo.noOfBeats; j++) {
				lines.push(<line
					id={'line' + timeLineIndex + '' + j}
					stroke={colors[j]}
					strokeWidth="7"
					className={s.line}
					key={'line' + timeLineIndex + '' + j}
				/>);
			}
		}
		return lines;
	};

	/* Reset all lines */
	unrenderLines(props) {
		const { beatInfo, timeLineIndex } = props;
		for (let i = 0; i < beatInfo.noOfBeats; i++) {
			document.getElementById('line' + timeLineIndex + '' + i).setAttribute('x1', 0);
			document.getElementById('line' + timeLineIndex + '' + i).setAttribute('y1', 0);
			document.getElementById('line' + timeLineIndex + '' + i).setAttribute('x2', 0);
			document.getElementById('line' + timeLineIndex + '' + i).setAttribute('y2', 0);
		}
	}
	/* Calculate the x, y-coordinates for the lines and draw them out */
	renderLines(props) {
		const { evolutionPairs, beatInfo, domNodes, timeLineIndex } = props;

		if (evolutionPairs) {
			for (let i = 0; i < beatInfo.noOfBeats; i++) {
				const parent1 = evolutionPairs[i].parent1;
				const parent2 = evolutionPairs[i].parent2;

				const el1 = domNodes[parent1];
				const el2 = domNodes[parent2];

				const coords1 = this.getCenterCoords(el1);
				const coords2 = this.getCenterCoords(el2);

				document.getElementById('line' + timeLineIndex + '' + i).setAttribute('x1', coords1.x);
				document.getElementById('line' + timeLineIndex + '' + i).setAttribute('y1', coords1.y);
				document.getElementById('line' + timeLineIndex + '' + i).setAttribute('x2', coords2.x);
				document.getElementById('line' + timeLineIndex + '' + i).setAttribute('y2', coords2.y);
			}
		}
	}

  render() {
    return (
			<div className={s.root}>
				<svg>
					{ this.addLines(this.props) }
				</svg>
			</div>
    );
  }
}

export default withStyles(s)(Lines);
