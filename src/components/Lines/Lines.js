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

		// Initial render of lines
		this.addAllLinesOnce(this.props).then((props) => {
			this.renderAllLines(props);
		});
	}

		// Render or unrender the lines depending on Redux props
	componentWillReceiveProps(nextProps) {
		const { evolutionPairs, domNodesTimeline, timelineLength } = nextProps;
		/* Add the lines to the dom, on the second iteration and more, then render them.
		 * Only add if we have a new generation of beats */
		if(this.isTimelineLengthLarger(nextProps)) {
			this.addLines(nextProps).then((props) => {
				this.renderLines(props, timelineLength-2);
			});
		}
		
		// Only unrender lines for the first generation, when we click the reset beats.
		if (evolutionPairs.length === 0 && timelineLength === 1) this.unrenderLines(nextProps);
	}

	// Check to see if we have a new generation
	isTimelineLengthLarger(nextProps) {
		return nextProps.timelineLength > this.props.timelineLength;
	}

	/* Add lines to the DOM, for every beatlist after the first generation. Every new generation gets
	 * two lines, that are connected to the previous generation. */
	addAllLinesOnce(props) {
		const { beatInfo, timelineLength, beatTimeline, evolutionPairs, domNodesTimeline } = props;
		return new Promise(resolve => {
			const linesTimeline = [];
			let lines = [];
			// Return if we only have one generation
			if(timelineLength === 1) return;
			
			for(let i = 0; i < timelineLength - 1; i++) {
				lines = this.createLines(props, i);	
				linesTimeline.push(lines);
			}

			// Set the lines to state, and resolve the promise
			this.setState({linesTimeline}, () => {
				resolve(props);
			});
		})
	};
	
	// Add lines only for the newly created generation.
	addLines(props) {
		const { beatInfo, timelineLength, beatTimeline, evolutionPairs, domNodesTimeline } = props;
		return new Promise(resolve => {
			let linesTimeline = [];
			let lines = [];
			this.state ? linesTimeline = this.state.linesTimeline : [];
			
			// Since evolution pairs are only created on the second generation
			const index = timelineLength - 2;
			lines = this.createLines(props, index);	
			
			linesTimeline.push(lines);
			console.log("addlines one", lines)
			// Set the lines to state, and resolve the promise
			this.setState({linesTimeline}, () => {
				resolve(props);
			});
		})
	}

	// Create lines for every beatlist and return an array of lines
	createLines(props, index) {
		const { beatInfo, timelineLength, beatTimeline, evolutionPairs, domNodesTimeline } = props;
		const colors = ['#5C429B', '#81DFEF', '#1D2DBF', '#6D0F3A', '#FFFFFF', '#8FDD76', '#F286B1', '#EDDA54'];
		const lines = [];

		// Add lines for generation - 1, so the first generation doesn't get lines.
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
		return lines;
	}

	/* Reset all lines */
	unrenderLines = (props) => {
		this.setState({linesTimeline: []});
	}

	// Render all the lines upon mounting
	renderAllLines(props) {
		for(let index = 0; index < props.timelineLength-1; index++) {
			console.log(index)
			this.renderLines(props, index);
		}
	}
	/* Calculate the x, y-coordinates for the lines and draw them out */
	renderLines(props, index) {
		console.log("Render lines", index)
		const { evolutionPairs, beatInfo, domNodesTimeline, timelineLength } = props;
		
		for (let i = 0; i < beatInfo.noOfBeats; i++) {
			let coords = this.getCoords(props, index, i);
			let bezVal = this.getBezierValues(coords);
			
			// Start the lines from the child nodes
			const d = 'M' + coords.startCoord.x +' '+coords.startCoord.y + ' C ' + bezVal.cS2x +' '+ bezVal.cSy + ', ' + bezVal.cP1x +' '+ bezVal.cP1y + ', ' + coords.parent1Coord.x +' '+ coords.parent1Coord.y;
			const e = 'M' + coords.startCoord.x +' '+coords.startCoord.y + ' C ' + bezVal.cSx +' '+ bezVal.cSy + ', ' + bezVal.cP2x +' '+ bezVal.cP2y + ', ' + coords.parent2Coord.x +' '+ coords.parent2Coord.y;
			
			let lineDom1 = document.getElementById('line' + index + i + 0);
			let lineDom2 = document.getElementById('line' + index + i + 1);
			
			if(lineDom1) {
				lineDom1.setAttribute('d', d);
				lineDom2.setAttribute('d', e);
			}

			const colors = ['#5C429B', '#81DFEF', '#1D2DBF', '#6D0F3A', '#FFFFFF', '#8FDD76', '#F286B1', '#EDDA54'];
		}
	}
	// Get coordinates for the child and parent domnodes
	getCoords(props, index, beatIndex) {
		const { evolutionPairs, domNodesTimeline } = props;
		let coords = {};

		const parent1 = evolutionPairs[index][beatIndex].parent1;
		const parent2 = evolutionPairs[index][beatIndex].parent2;

		const el1 = domNodesTimeline[index][parent1];
		const el2 = domNodesTimeline[index][parent2];
		const el3 = domNodesTimeline[index+1][beatIndex];
		
		coords.parent1Coord = getCenterCoords(el1);
		coords.parent2Coord = getCenterCoords(el2);
		coords.startCoord = getCenterCoords(el3);
		
		return coords;
	}
	// Add bezier values for curvature to the coords
	getBezierValues(coords) {
		let bezierValues = {};
		bezierValues.cSx = coords.startCoord.x + 50;
		bezierValues.cSy = coords.startCoord.y - 250;
		bezierValues.cS2x = coords.startCoord.x - 50;
		bezierValues.cP1x = coords.parent1Coord.x + 50;
		bezierValues.cP1y = coords.parent1Coord.y + 250;
		bezierValues.cP2x = coords.parent2Coord.x - 50;
		bezierValues.cP2y = coords.parent2Coord.y + 250;
		return bezierValues;
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
