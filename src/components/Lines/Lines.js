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

	componentWillReceiveProps() {
		if (this.props.domNodes) {
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
		const { beatInfo, timeLineIndex } = this.props;
		const lines = [];
		const colors = ['#FFAC81', '#FF928B', '#FEC3A6', '#EFE9AE', '#CDEAC0', '#DAD2D8', '#F06449', '#EDE580'];
		if (beatInfo) {
			for (let j = 0; j < beatInfo.noOfBeats; j++) {
				lines.push(<line
					id={'line' + timeLineIndex + '' + j}
					stroke={colors[j]}
					strokeWidth="6"
					className={s.line}
					key={'line' + timeLineIndex + '' + j}
				/>);
			}
		}
		return lines;
	};

	renderLines() {
		const { evolutionPairs, beatInfo, domNodes, timeLineIndex } = this.props;

		if (evolutionPairs) {
			for (let j = 0; j < beatInfo.noOfBeats; j++) {
				const parent1 = evolutionPairs[j].parent1;
				const parent2 = evolutionPairs[j].parent2;

				const el1 = domNodes[parent1];
				const el2 = domNodes[parent2];

				const coords1 = this.getCenterCoords(el1);
				const coords2 = this.getCenterCoords(el2);

				document.getElementById('line' + timeLineIndex + '' + j).setAttribute('x1', coords1.x);
				document.getElementById('line' + timeLineIndex + '' + j).setAttribute('y1', coords1.y);
				document.getElementById('line' + timeLineIndex + '' + j).setAttribute('x2', coords2.x);
				document.getElementById('line' + timeLineIndex + '' + j).setAttribute('y2', coords2.y);
			}
		}
	}

  render() {
    return (
			<div className={s.root}>
				<svg>
					{ this.addLines() }
				</svg>
			</div>
    );
  }
}

export default withStyles(s)(Lines);
