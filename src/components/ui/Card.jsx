import styles from './Card.module.css';

const Card = ({
  children,
  variant = 'default',
  hover = false,
  glow = false,
  gradient,
  className = '',
  onClick,
  ...props
}) => {
  const cardClasses = [
    styles.card,
    styles[variant],
    hover ? styles.hover : '',
    glow ? styles.glow : '',
    onClick ? styles.clickable : '',
    className
  ].filter(Boolean).join(' ');

  const style = gradient ? { '--gradient': gradient } : {};

  return (
    <div
      className={cardClasses}
      style={style}
      onClick={onClick}
      {...props}
    >
      {gradient && <div className={styles.gradientBorder}></div>}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Card;
