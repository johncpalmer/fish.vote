import styles from "@styles/components/Card.module.scss"; // Component styles

export default function Card({
  // Card title
  title,
  // Optional card button action
  action: { name, handler } = {},
  // Child content to inject
  children,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.card__top}>
        {/* Card title */}
        <div className={styles.card__top_title}>
          <h3>{title}</h3>
        </div>

        {/* Optional card button action */}
        <div className={styles.card__top_action}>
          {name && handler ? <button onClick={handler}>{name}</button> : null}
        </div>
      </div>
      <div className={styles.card__content}>{children}</div>
    </div>
  );
}
