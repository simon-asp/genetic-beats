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
		const { evolutionPairs, domNodesTimeline, timelineIndex } = nextProps;
		
		// Add the lines to the dom, then render them.
		this.addLines(nextProps).then((props) => {
			// Only render lines if the domNodes of the boxes and the evolution pairs exists.
			if (domNodesTimeline && evolutionPairs.length > 0) this.renderLines(props);
		})
		
    // Only unrender lines for the first generation, when we click the reset beats.
		if (!evolutionPairs && timelineIndex === 1) this.unrenderLines(nextProps);
	}

	/* Add lines to the DOM, for each beatlist in the beatTimeline*/
	addLines = (props) => {
		return new Promise(resolve => {
			
			// Purple, light blue, dark blue, 
			const colors = ['#5C429B', '#81DFEF', '#1D2DBF', '#6D0F3A', '#FFFFFF', '#8FDD76', '#F286B1', '#EDDA54'];
			const { beatInfo, timelineIndex, beatlist, evolutionPairs, domNodesTimeline } = props;
			const linesTimeline = [];
			const lines = [];
			
			if (beatInfo) {
				domNodesTimeline.forEach((domNodes, index) => {
					let beatlist = beatInfo[index];
					for (let j = 0; j < beatInfo.noOfBeats; j++) {
						let score = 0;
						if(beatlist && evolutionPairs) {
							const score1 = beatlist[evolutionPairs[index][j].parent1].props.beat.score;
							const score2 = beatlist[evolutionPairs[index][j].parent2].props.beat.score;
							score = (score1 + score2) / 2;
						}
						const strokeWidth = mapRange(score, 1.5, 5, 1, 8);
						console.log('score', score)
						
						lines.push(<path
							id={'line' + index + '' + j}
							stroke={colors[j]}
							strokeWidth={strokeWidth}
							className={s.line}
							key={'line' + index + '' + j}
							fill="transparent"
						/>);
					}
				})
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
		const { beatInfo, timelineIndex } = props;
    for (let index = 0; index < timelineIndex-1; index++) {	
			for (let i = 0; i < beatInfo.noOfBeats; i++) {
				document.getElementById('line' + index + '' + i).setAttribute('d', 'M0 0 C 0 0, 0 0, 0 0');
			}
		}
  }

	/* Calculate the x, y-coordinates for the lines and draw them out */
	renderLines(props) {
		const { evolutionPairs, beatInfo, domNodesTimeline, timelineIndex } = props;
		console.log('render_lines', props)
		for(let index = 0; index < timelineIndex-1; index++) {
			for (let i = 0; i < beatInfo.noOfBeats; i++) {
				const parent1 = evolutionPairs[index][i].parent1;
				const parent2 = evolutionPairs[index][i].parent2;
				const child = evolutionPairs[index][i].offspringIndex;

				const el1 = domNodesTimeline[index][parent1];
				const el2 = domNodesTimeline[index][parent2];
				const el3 = domNodesTimeline[index+1][parent2];

				const coords1 = getCenterCoords(el1);
				const coords2 = getCenterCoords(el2);
				const coords3 = getCenterCoords(el3);
				
				const sx1 = coords1.x + 300;
				const sy1 = coords1.y + 150;
				const sx2 = coords2.x - 200;
				const sy2 = coords2.y - 150;

				// TODO: RENDER 3 LINES PER THING
				
				// Bezier curve coords
				const d = 'M' + coords1.x + ' ' + coords1.y + ' C ' + sx1 + ' ' + sy1 + ', ' + sx2 + ' ' + sy2 + ', ' + coords2.x + ' ' + coords2.y;
				let lineDom = document.getElementById('line' + index + '' + i);
				if(lineDom) lineDom.setAttribute('d', d);
			}
		}
	}

  render() {
		// 40vh per beatlist
		const height = (this.props.timelineIndex*40) + 'vh';
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
