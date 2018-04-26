import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import s from './Lines.css';
import { mapRange, getCenterCoords } from '../../utils';
let cx = classNames.bind(s);

class Lines extends React.Component {
	static propTypes = {
		domNodesTimeline: PropTypes.array,
		beatInfo: PropTypes.object,
		evolutionPairs: PropTypes.array,
	};
	componentWillMount() {
		this.setState({
			linesTimeline: [],
		});

		this.addLines(this.props).then((props) => {
			this.renderLines(props);
		});
	}

		// Render or unrender the lines depending on Redux props
	componentWillReceiveProps(nextProps) {
		const { evolutionPairs, domNodesTimeline, timelineLength } = nextProps;
		const scoreOrLikedChanged = this.scoreOrLikedChanged(nextProps);
		/* Add the lines to the dom, on the second iteration and more, then render them.
			* Only add if the score or liked state of all beats did not change.
			*/
		if(this.isTimelineLengthLarger(nextProps)) {
			this.addLines(nextProps).then((props) => {
				this.renderLines(props);
			});
		}
		
		// Only unrender lines for the first generation, when we click the reset beats.
		if (evolutionPairs.length === 0 && timelineLength === 1) this.unrenderLines(nextProps);
	}

	isTimelineLengthLarger(nextProps) {
		return nextProps.timelineLength > this.props.timelineLength;
	}
	// Compares the nextProps to this.props to see if the score or liked changed of the beats
	scoreOrLikedChanged(nextProps) {
		const { beatTimeline } = nextProps;

		if(beatTimeline.length > this.props.beatTimeline.length) return false;
		for(let i = 0; i < beatTimeline.length; i++) {
			for(let j = 0; j < beatTimeline[0].length; j++) {				
				const oldBeat = this.props.beatTimeline[i][j];
				const newBeat = nextProps.beatTimeline[i][j];
				
				if(oldBeat.score !== newBeat.score || oldBeat.liked !== newBeat.liked) {
					console.log("changed")
					return true;
				}
			}
		}
		return false;
	}

	/* Add lines to the DOM, for every beatlist after the first generation. Every new generation gets
		* two lines, that are connected to the previous generation. */
	addLines = (props) => {
		console.log("AddLines: ", props)
		return new Promise(resolve => {
			
			// Purple, light blue, dark blue, 
			const colors = ['#5C429B', '#81DFEF', '#1D2DBF', '#6D0F3A', '#FFFFFF', '#8FDD76', '#F286B1', '#EDDA54'];
			const { beatInfo, timelineLength, beatTimeline, evolutionPairs, domNodesTimeline } = props;
			const linesTimeline = [];
			const lines = [];
			if (beatInfo) {
				// Add lines for generation - 1, so the first generation doesn't get lines.
				for(let index = 0; index < timelineLength-1; index++) {
					let beatlist = beatTimeline[index];
					for (let j = 0; j < beatInfo.noOfBeats; j++) {
						const p1Index = evolutionPairs[index][j].parent1;
						const p2Index = evolutionPairs[index][j].parent2;
						const parentIndices = [p1Index, p2Index];
						const score1 = beatlist[p1Index].score;
						const score2 = beatlist[p2Index].score;

						const strokeWidth = [mapRange(score1, 1, 5, 1, 5), mapRange(score2, 1, 5, 1, 5)];
						// Add weak and strong classname to intensify the opacity
						const lineClass = cx('line', {weak: (score1 + score2) <= 5, strong: (score1 + score2) >= 9});						
						
						// Add two lines per domNode
						for(let lineIndex = 0; lineIndex < 2; lineIndex++) {
							lines.push(<path
								id={'line' + index + j + lineIndex}
								stroke={colors[parentIndices[lineIndex]]}
								strokeWidth={strokeWidth[lineIndex]}
								className={lineClass}
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
	const index = timelineLength-1;
	for (let i = 0; i < beatInfo.noOfBeats; i++) {
		const line1 = document.getElementById('line' + index + '' + i + 0);
		const line2 = document.getElementById('line' + index + '' + i + 1);
		
		if(!line1) return;
		else {
			line1.setAttribute('d', 'M0 0 C 0 0, 0 0, 0 0');
			line2.setAttribute('d', 'M0 0 C 0 0, 0 0, 0 0');
		}
	}
  }

	/* Calculate the x, y-coordinates for the lines and draw them out */
	renderLines(props) {
		console.log("Render lines")
		const { evolutionPairs, beatInfo, domNodesTimeline, timelineLength } = props;
		for(let index = 0; index < timelineLength-1; index++) {
			for (let i = 0; i < beatInfo.noOfBeats; i++) {
				const parent1 = evolutionPairs[index][i].parent1;
				const parent2 = evolutionPairs[index][i].parent2;
				const child = evolutionPairs[index][i].offspringIndex;
				
				const el1 = domNodesTimeline[index][parent1];
				const el2 = domNodesTimeline[index][parent2];
				const el3 = domNodesTimeline[index+1][child];

				// Start the bezier curves from the child nodes
				const parent1Coord = getCenterCoords(el1);
				const parent2Coord = getCenterCoords(el2);
				const startCoord = getCenterCoords(el3);
				
				// Control points. c = control, S = start, P1,P2 = parent 1, 2.
				const cSx = startCoord.x + 50;
				const cSy = startCoord.y - 250;
				const cS2x = startCoord.x - 50;
				const cP1x = parent1Coord.x + 50;
				const cP1y = parent1Coord.y + 250;
				const cP2x = parent2Coord.x - 50;
				const cP2y = parent2Coord.y + 250;
				//const sx1 = 1; const sx2 = 1; const sy1 = 1; const sy2 = 1;
				
				// Bezier curve coords
				const d = 'M' + startCoord.x +' '+startCoord.y + ' C ' + cS2x +' '+ cSy + ', ' + cP1x +' '+ cP1y + ', ' + parent1Coord.x +' '+ parent1Coord.y;
				const e = 'M' + startCoord.x +' '+startCoord.y + ' C ' + cSx +' '+ cSy + ', ' + cP2x +' '+ cP2y + ', ' + parent2Coord.x +' '+ parent2Coord.y;
				
				let lineDom1 = document.getElementById('line' + index + i + 0);
				let lineDom2 = document.getElementById('line' + index + i + 1);
				
				if(lineDom1) {
					lineDom1.setAttribute('d', d);
					lineDom2.setAttribute('d', e);
				}

				const colors = ['#5C429B', '#81DFEF', '#1D2DBF', '#6D0F3A', '#FFFFFF', '#8FDD76', '#F286B1', '#EDDA54'];
			}
		}
	}

  render() {
	// The height of the whole svg. 40vh per beatlist. Should cover all beatlists.
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
