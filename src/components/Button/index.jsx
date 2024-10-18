import classNames from "classnames/bind";
import styles from "./Button.module.scss";
import { Link } from "react-router-dom";

export default function Button({
  to,
  href,
  primary = false,
  secondary = false,
  outline = false,
  nav = false,
  noBackground = false,
  disable = false,
  rounded = false,
  small = false,
  large = false,
  danger = false,
  noHoverAnimation = false,
  scaleHoverAnimation = false,
  children,
  leftIcon,
  rightIcon,
  onClick,
  className,
  ...other
}) {
  const cx = classNames.bind(styles);
  let Component = "button";
  const props = { ...other };

  if (!disable) {
    if (onClick) props.onClick = onClick;
    if (to) {
      Component = Link;
      props.to = to;
    } else if (href) {
      Component = "a";
      props.href = href;
    }
  }

  const classes = cx("wrapper", className, {
    primary,
    secondary,
    outline,
    nav,
    "no-bg" : noBackground,
    danger,
    disable,
    rounded,
    small,
    large,
    noHoverAnimation,
    scaleHoverAnimation
  });

  return (
    <Component className={classes} {...props}>
      {leftIcon && <span className={cx('icon')}>{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className={cx('icon')}>{rightIcon}</span>}
    </Component>
  );
}
