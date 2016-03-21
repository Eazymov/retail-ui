import events from 'add-event-listener';
import React, {PropTypes} from 'react';

import addClass from '../../lib/dom/addClass';
import Center from '../Center';
import LayoutEvents from '../../lib/LayoutEvents';
import removeClass from '../../lib/dom/removeClass';
import RenderContainer from '../RenderContainer';
import stopPropagation from '../../lib/events/stopPropagation';

import styles from './Modal.less';

let mountedModalsCount = 0;

/**
 * Модальное окно.
 */
class Modal extends React.Component {
  static propTypes = {
    /**
     * Не показывать крестик для закрытия окна.
     */
    noClose: PropTypes.bool,

    width: PropTypes.number,

    /**
     * Вызывается, когда пользователь запросил закрытие окна (нажал на фон, на
     * Escape или на крестик).
     */
    onClose: PropTypes.func,
  };

  static childContextTypes = {
    rt_inModal: PropTypes.bool,
  };

  getChildContext() {
    return {rt_inModal: true};
  }

  constructor(props, context) {
    super(props, context);
  }

  render() {
    var close = null;
    if (!this.props.noClose) {
      close = (
        <a href="javascript:" className={styles.close}
          onClick={this._handleClose}
        >
          &times;
        </a>
      );
    }

    const style = {};
    if (this.props.width) {
      style.width = this.props.width;
    }

    return (
      <RenderContainer>
        <div className={styles.root}>
          <div className={styles.bg} />
          <Center className={styles.container}
            onClick={this._handleCotanierClick}
          >
            <div className={styles.window} style={style}>
              {close}
              {this.props.children}
            </div>
          </Center>
        </div>
      </RenderContainer>
    );
  }

  componentDidMount() {
    events.addEventListener(document, 'keydown', this._handleNativeKey);

    if (mountedModalsCount === 0) {
      addClass(document.body, styles.bodyClass);
      LayoutEvents.emit();
    }
    mountedModalsCount++;
  }

  componentWillUnmount() {
    events.removeEventListener(document, 'keydown', this._handleNativeKey);

    if (--mountedModalsCount === 0) {
      removeClass(document.body, styles.bodyClass);
      LayoutEvents.emit();
    }
  }

  _handleCotanierClick = (event) => {
    if (event.target === event.currentTarget) {
      this._handleClose();
    }
  };

  _handleClose = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  _handleNativeKey = (nativeEvent) => {
    if (nativeEvent.keyCode === 27 && this.props.onClose) {
      stopPropagation(nativeEvent);
      this.props.onClose();
    }
  };
}

class Header extends React.Component {
  render() {
    return <div className={styles.header}>{this.props.children}</div>;
  }
}

class Body extends React.Component {
  render() {
    return <div className={styles.body}>{this.props.children}</div>;
  }
}

class Footer extends React.Component {
  render() {
    return <div className={styles.footer}>{this.props.children}</div>;
  }
}

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;

module.exports = Modal;