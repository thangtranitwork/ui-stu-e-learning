import React, { useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Alert.module.scss';

const cx = classNames.bind(styles);

export default function Alert({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={cx('alert', 'b-shadow', type)}>
      <span>{message}</span>
      <button className={cx('close-btn')} onClick={onClose}>×</button>
    </div>
  );
}
