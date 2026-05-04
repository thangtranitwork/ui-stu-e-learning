import { Link } from "react-router-dom";

export default function Button({
  to,
  href,
  primary = false,
  secondary = false,
  outline = false,
  disable = false,
  rounded = false,
  small = false,
  large = false,
  danger = false,
  noBackground = false,
  noHoverAnimation = false,
  scaleHoverAnimation = false,
  children,
  leftIcon,
  rightIcon,
  onClick,
  className = "",
  ...other
}) {
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

  const base =
    "inline-flex items-center justify-center gap-2 font-semibold cursor-pointer select-none transition-all duration-200 outline-none no-underline whitespace-nowrap";
  const sizes = small
    ? "px-3 py-1.5 text-xs rounded-lg"
    : large
    ? "px-6 py-3 text-base rounded-xl"
    : "px-4 py-2.5 text-sm rounded-xl";
  const roundedCls = rounded ? "!rounded-full" : "";
  const disableCls = disable
    ? "opacity-40 pointer-events-none grayscale"
    : "";

  let variant =
    "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white";
  if (primary)
    variant =
      "bg-indigo-600 text-white border-0 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30";
  if (secondary)
    variant =
      "bg-pink-600 text-white border-0 hover:bg-pink-500 shadow-lg shadow-pink-500/20";
  if (outline)
    variant =
      "bg-transparent text-indigo-400 border border-indigo-500/50 hover:bg-indigo-500/10 hover:border-indigo-400";
  if (danger)
    variant =
      "bg-red-600 text-white border-0 hover:bg-red-500 shadow-lg shadow-red-500/20";
  if (noBackground)
    variant = "bg-transparent text-slate-400 border-0 hover:text-white";

  const hoverAnim = noHoverAnimation
    ? ""
    : scaleHoverAnimation
    ? "hover:scale-110 active:scale-95"
    : "hover:-translate-y-0.5 active:translate-y-0";

  const classes =
    `${base} ${sizes} ${variant} ${roundedCls} ${disableCls} ${hoverAnim} ${className}`.trim();

  return (
    <Component className={classes} {...props}>
      {leftIcon && <span className="flex items-center">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="flex items-center">{rightIcon}</span>}
    </Component>
  );
}
