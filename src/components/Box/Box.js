import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Box.css';
import PropTypes from 'prop-types';
import Scorer from '../Scorer';
import { getNoOfInstruments, getInstrumentKeys } from '../../utils/utils';

const cx = classNames.bind(s);

class Box extends React.Component {
  static propTypes = {
  };

	componentWillMount() {
		this.setState({ infoVisible: false });
	}

	componentDidMount() {
		const boxDomNodes = [];
		if (this.boxDiv) {
			this.props.storeDomNodes(this.boxDiv, this.props.timelineIndex);
    }
    this.props.onRef(this);
	}
  componentWillUnmount() {
    this.props.onRef(undefined);
  }

	onClickInfo() {
		const infoVisible = this.state.infoVisible;
		this.setState({ infoVisible: !infoVisible });
	}

	populateBeatTicks() {
		const noOfInstruments = getNoOfInstruments(this.props.beat);
		const instrumentKeys = getInstrumentKeys(this.props.beat);
		const beatTicks = [];

		for (let i = 0; i < noOfInstruments; i++) {
			beatTicks.push(<div className={s.instrumentText} key={'instrument' + i}>{instrumentKeys[i].toUpperCase()}</div>);

			for (let j = 0; j < this.props.beat.kick.length; j++) {
				const filled = this.props.beat[instrumentKeys[i]][j] === 1;
				const tickClass = cx('beatTick', { filled });

				if (j % 4 === 0 && j !== 0) beatTicks.push(<div key={'divider' + i + '' + j}className={s.divider} />);
				beatTicks.push(<div key={'beatTick' + i + '' + j} className={tickClass} />);
			}
		}

		return beatTicks;
	}

  render() {
		const { beat, index, scoreBeat, onPlayClick, id, timelineIndex } = this.props;
		const colors = ['#DFE0E2', '#75ABBC', '#090C9B', '#B79477', '#993955', '#84C18F', '#F786AA', '#EDE6A4'];
		const infoOverlayClass = cx('infoOverlay', { active: this.state.infoVisible });
		const descriptionClass = cx('description', { hidden: this.props.timelineIndex === 0 });
    return (
			<div className={s.root}>
				<div className={s.box} id={id} ref={(ref) => { this.boxDiv = ref; }}>

					<div className={infoOverlayClass}>
						<div className={s.beatTicks}>
							{ this.populateBeatTicks() }
						</div>
						<div className={descriptionClass}>
							<div>
								The previous generation made <br />
								this beat with this connection:
							</div>
							<div className={s.colorLine} style={{ background: colors[index] }} />
						</div>
					</div>

					<div className={s.playContainer}>
						<div className={s.playButton} onClick={() => onPlayClick(index)} role="button" tabIndex={index} />
					</div>
					<Scorer {...this.props} />
				</div>
			</div>
    );
  }
}

// <div className={s.textContainer}>
// 	<p>K: {beat.kick}</p>
// 	<p>C: {beat.closedhat}</p>
// 	<p>O: {beat.openhat}</p>
// 	<p>S: {beat.clap}</p>
// </div>

export default withStyles(s)(Box);
