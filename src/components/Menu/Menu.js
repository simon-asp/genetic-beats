import React from 'react';
import classNames from 'classnames/bind';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Menu.css';
import PropTypes from 'prop-types';

let cx = classNames.bind(s);

class Menu extends React.Component {
  static propTypes = {
  };

	componentWillMount() {
		this.setState({ clickedMenu: false, clickedReset: false });
	}

	menuOnClick() {
		const clickedMenu = this.state.clickedMenu;
		this.setState({ clickedMenu: !clickedMenu, clickedReset: false });
	}

	resetButtonOnClick() {
		const clickedReset = this.state.clickedReset;
		this.setState({ clickedReset: !clickedReset });
	}

	/* When user has confirmed the resetting of beats */
	confirmationOnClick() {
		this.props.resetBeats();
		this.props.resetSelectedPairs();
		this.setState({ clickedMenu: false, clickedReset: false })
	}

	hideConfirmation() {
		this.setState({ clickedReset: false });
	}

  render() {
		const menuContainerClass = cx('menuContainer', { active: this.state.clickedMenu });
		const menuIconClass = cx('menuIcon', { dark: this.state.clickedMenu });
		const confirmationClass = cx('confirmationContainer', { active: this.state.clickedReset });

    return (
			<div className={s.root}>
				<div className={menuIconClass} role="button" tabIndex="-1" onClick={() => this.menuOnClick()} />
				<div className={menuContainerClass}>
					<div
						className={s.resetButton}
						onClick={() => { this.resetButtonOnClick(); }}
						role="button"
						tabIndex="-2"
					>
						RESET BEATS
					</div>

					<div className={confirmationClass}>
					<div className={s.triangle} />
						Are you sure you want to reset your beats?<br /><br />
						<div
							className={s.resetButton}
							onClick={() => { this.confirmationOnClick(); }}
							role="button"
							tabIndex="-3"
						>
							YES
						</div>
						<div className={s.divider} />
						<div
							className={s.resetButton}
							onClick={() => { this.hideConfirmation(); }}
							role="button"
							tabIndex="-3"
						>
							NO
						</div>
					</div>

					<div className={s.description}>
						Created by <b>Simon Asp</b><br />
						+ Hanyang University, Seoul 2017 ~<br /><br />
						simon.vilhelm.asp [at] gmail.com
					</div>
				</div>
			</div>
    );
  }
}

export default withStyles(s)(Menu);
