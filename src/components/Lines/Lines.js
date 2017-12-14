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

	componentWillMount() {
		this.setState({
			lines: [],
		})
	}

	componentDidMount() {
		this.addLines();
	}

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
		const { beatInfo, noOfGenerations } = this.props;
		const lines = [];
		const colors = ['green', 'blue', 'red', 'yellow', 'purple', 'pink', 'orange', 'white'];
		if (beatInfo) {
			for (let i = 0; i < noOfGenerations; i++) {
				for (let j = 0; j < beatInfo.noOfBeats; j++) {
					lines.push(<line
						id={'line' + i + '' + j}
						stroke={colors[j]}
						strokeWidth="6"
						className={s.line}
						key={i + '' + j}
					/>);
				}
			}
		}
		this.setState({ lines });
	};

	renderLines() {
		const { evolutionPairs, beatInfo, noOfGenerations } = this.props;
		for (let i = 0; i < noOfGenerations; i++) {
			if (evolutionPairs.length > i) {
				for (let j = 0; j < beatInfo.noOfBeats; j++) {
					const parent1 = evolutionPairs[i][j].parent1;
					const parent2 = evolutionPairs[i][j].parent2;

					console.log('parent1', parent1, 'p2', parent2);
					const el1 = document.getElementById('beat' + parent1);
					const el2 = document.getElementById('beat' + parent2);

					console.log('el1', el1, 'el2', el2);
					const coords1 = this.getCenterCoords(el1);
					const coords2 = this.getCenterCoords(el2);

					document.getElementById('line' + i + '' + j).setAttribute('x1', coords1.x);
					document.getElementById('line' + i + '' + j).setAttribute('y1', coords1.y);
					document.getElementById('line' + i + '' + j).setAttribute('x2', coords2.x);
					document.getElementById('line' + i + '' + j).setAttribute('y2', coords2.y);
				}
			}
		}
	}

  render() {
		console.log(this.props);
    return (
			<div className={s.root}>
				<svg style={{ height: this.props.noOfGenerations + '00vh' }}>
					{ this.state.lines }
				</svg>
			</div>
    );
  }
}

export default withStyles(s)(Lines);
