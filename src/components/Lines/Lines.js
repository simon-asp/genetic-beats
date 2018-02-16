import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import s from './Lines.css';
import { mapRange } from '../../utils';
// import cx from 'classnames';
// let cx = classNames.bind(s);

class Lines extends React.Component {
  static propTypes = {
		domNodes: PropTypes.array,
		beatInfo: PropTypes.object,
		evolutionPairs: PropTypes.array,
  };

	componentDidMount() {
		this.addFilter();
	}

  // Render or unrender the lines depending on Redux props
	componentWillReceiveProps(nextProps) {
    // Only render lines if the domNodes of the boxes and the evolution pairs exists.
		if (nextProps.domNodes && nextProps.evolutionPairs) this.renderLines(nextProps);

    // Only unrender lines for the first generation, when we click the reset beats.
		if (!nextProps.evolutionPairs && nextProps.timeLineIndex === 0) this.unrenderLines(nextProps);
	}

	/* Get the center coordinates for a DOM element */
	getCenterCoords = (el) => {
		const coords = {};
		coords.x = el.offsetLeft + (el.offsetWidth / 2);
		coords.y = el.offsetTop + (el.offsetHeight / 2);
		return coords;
	};

	/* Add lines to the DOM */
	addLines = (props) => {
		const { beatInfo, timeLineIndex } = props;
		const lines = [];
		const colors = ['#5C429B', '#81DFEF', '#090C9B', '#EF4136', '#E9E8EA', '#8FDD76', '#F286B1', '#EDDA54'];
		if (beatInfo) {
			for (let j = 0; j < beatInfo.noOfBeats; j++) {
				const strokeWidth = mapRange(j, 0, beatInfo.noOfBeats, 1, 6);
				lines.push(<path
					id={'line' + timeLineIndex + '' + j}
					stroke={colors[j]}
					strokeWidth={strokeWidth}
					className={s.line}
					key={'line' + timeLineIndex + '' + j}
					fill="transparent"
				/>);
			}
		}
		return lines;
	};

  // Doesn't work yet. Should add a glow-effect to the lines.
	addFilter = () => {
		const svg = document.getElementById('svg');
		if (svg) {
			const defs = svg.append('defs');
			// // Filter for the outside glow
			// const filter = defs.append('filter').attr('id', 'glow');
			// filter.append('feGaussianBlur').attr('stdDeviation', '3.5').attr('result', 'coloredBlur');
			//
			// const feMerge = filter.append('feMerge');
			// feMerge.append('feMergeNode').attr('in', 'coloredBlur');
			// feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
		}
	}

	applyGlow = () => {
		//d3.selectAll(".class-of-elements").style("filter", "url(#glow)");
	}

  /* Reset all lines */
  unrenderLines = (props) => {
    const { beatInfo, timeLineIndex } = props;
    for (let i = 0; i < beatInfo.noOfBeats; i++) {
      document.getElementById('line' + timeLineIndex + '' + i).setAttribute('d', 'M0 0 C 0 0, 0 0, 0 0');
    }
  }

	/* Calculate the x, y-coordinates for the lines and draw them out */
	renderLines(props) {
    const { evolutionPairs, beatInfo, domNodes, timeLineIndex } = props;
		for (let i = 0; i < beatInfo.noOfBeats; i++) {
			const parent1 = evolutionPairs[i].parent1;
			const parent2 = evolutionPairs[i].parent2;

			const el1 = domNodes[parent1];
			const el2 = domNodes[parent2];

			const coords1 = this.getCenterCoords(el1);
			const coords2 = this.getCenterCoords(el2);

			const sx1 = coords1.x + 300;
			const sy1 = coords1.y + 150;
			const sx2 = coords2.x - 200;
			const sy2 = coords2.y - 150;

			// Bezier curve coords
			const d = 'M' + coords1.x + ' ' + coords1.y + ' C ' + sx1 + ' ' + sy1 + ', ' + sx2 + ' ' + sy2 + ', ' + coords2.x + ' ' + coords2.y;
			document.getElementById('line' + timeLineIndex + '' + i).setAttribute('d', d);
    }
	}

  render() {
    return (
			<div className={s.root}>
				<svg id="svg">
					{ this.addLines(this.props) }
				</svg>
			</div>
    );
  }
}

export default withStyles(s)(Lines);
