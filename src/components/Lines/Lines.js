import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import s from './Lines.css';
import { mapRange, getCenterCoords } from '../../utils';
// import cx from 'classnames';
// let cx = classNames.bind(s);

class Lines extends React.Component {
  static propTypes = {
		domNodesTimeline: PropTypes.array,
		beatInfo: PropTypes.object,
		evolutionPairs: PropTypes.array,
	};
	componentWillMount() {
		this.setState({
			linesTimeline: [],
		})
	}

  // Render or unrender the lines depending on Redux props
	componentWillReceiveProps(nextProps) {
		const { evolutionPairs, domNodesTimeline, timelineLength } = nextProps;
		// Add the lines to the dom, on the second iteration and more, then render them.
		if(domNodesTimeline.length > 1 && timelineLength > 1 && evolutionPairs.length > 0) {
			this.addLines(nextProps).then((props) => {
				this.renderLines(props);
			});
		}
		
    // Only unrender lines for the first generation, when we click the reset beats.
		if (evolutionPairs.length === 0 && timelineLength === 1) this.unrenderLines(nextProps);
	}

	/* Add lines to the DOM, for every beatlist after the first generation. Every new generation gets
	 * two lines, that are connected to the previous generation. */
	addLines = (props) => {
		console.log("add lines")
		return new Promise(resolve => {
			
			// Purple, light blue, dark blue, 
			const colors = ['#5C429B', '#81DFEF', '#1D2DBF', '#6D0F3A', '#FFFFFF', '#8FDD76', '#F286B1', '#EDDA54'];
			const { beatInfo, timelineLength, beatlist, evolutionPairs, domNodesTimeline } = props;
			const linesTimeline = [];
			const lines = [];

			if (beatInfo) {
				// Add lines for -1 generation, so the first generation doesn't get lines.
				for(let index = 0; index < domNodesTimeline.length-1; index++) {
					let beatlist = beatInfo[index];
					for (let j = 0; j < beatInfo.noOfBeats; j++) {
						// Todo: fix score
						let score = 0;
						if(beatlist && evolutionPairs) {
							const score1 = beatlist[evolutionPairs[index][j].parent1].props.beat.score;
							const score2 = beatlist[evolutionPairs[index][j].parent2].props.beat.score;
							score = (score1 + score2) / 2;
						}
						const strokeWidth = mapRange(score, 1.5, 5, 1, 8);
						
						// Add two lines per domNode
						for(let lineIndex = 0; lineIndex < 2; lineIndex++) {
							lines.push(<path
								id={'line' + index + j + lineIndex}
								stroke={colors[j]}
								strokeWidth={strokeWidth}
								className={s.line}
								key={'line' + index + j + lineIndex}
								fill="transparent"
							/>);
						}
					}
				}
				linesTimeline.push(lines);			
			}
			// Set the lines to state, and resolve the promise
			this.setState({linesTimeline}, () => {
				resolve(props);
			});
		})
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
		const { beatInfo, timelineLength } = props;
    for (let index = 0; index < timelineLength-1; index++) {	
			for (let i = 0; i < beatInfo.noOfBeats; i++) {
				document.getElementById('line' + index + '' + i).setAttribute('d', 'M0 0 C 0 0, 0 0, 0 0');
			}
		}
  }

	/* Calculate the x, y-coordinates for the lines and draw them out */
	renderLines(props) {
		const { evolutionPairs, beatInfo, domNodesTimeline, timelineLength } = props;
		for(let index = 0; index < timelineLength-1; index++) {
			for (let i = 0; i < beatInfo.noOfBeats; i++) {
				const parent1 = evolutionPairs[index][i].parent1;
				const parent2 = evolutionPairs[index][i].parent2;
				const child = evolutionPairs[index][i].offspringIndex;
				
				const el1 = domNodesTimeline[index][parent1];
				const el2 = domNodesTimeline[index][parent2];
				const el3 = domNodesTimeline[index+1][child];

				const coords1 = getCenterCoords(el1);
				const coords2 = getCenterCoords(el2);
				const coords3 = getCenterCoords(el3);
				
				console.log("coords: ", coords1, coords2, coords3);
				const sx1 = coords1.x + 300;
				const sy1 = coords1.y + 150;
				const sx2 = coords2.x - 200;
				const sy2 = coords2.y - 150;

				// TODO: RENDER 3 LINES PER THING
				
				// Bezier curve coords
				//const d = 'M' + coords1.x +' '+coords1.y + ' C ' + sx1 +' '+ sy1 + ', ' + sx2 +' '+ sy2 + ', ' + coords2.x +' '+ coords2.y;
				const d = 'M' + coords1.x +' '+coords1.y + ' C ' + sx1 +' '+ sy1 + ', ' + sx2 +' '+ sy2 + ', ' + coords3.x +' '+ coords3.y;
				const e = 'M' + coords2.x +' '+coords2.y + ' C ' + sx1 +' '+ sy1 + ', ' + sx2 +' '+ sy2 + ', ' + coords3.x +' '+ coords3.y;
				let lineDom1 = document.getElementById('line' + index + i + 0);
				let lineDom2 = document.getElementById('line' + index + i + 1);
				if(lineDom1 && lineDom2) {
					lineDom1.setAttribute('d', d);
					lineDom2.setAttribute('d', d);
				}
			}
		}
	}

  render() {
		// 40vh per beatlist
		const height = (this.props.timelineLength*40) + 'vh';
    return (
			<div className={s.root}>
				<svg id="svg" style={{ height: 'calc('+height+' + 106px)'}}>
					{ this.state.linesTimeline }
				</svg>
			</div>
    );
  }
}

export default withStyles(s)(Lines);
