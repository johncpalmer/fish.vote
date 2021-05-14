import styles from "@styles/components/Card.module.scss"; // Component styles

export default function Card({
  // Card title
  title,
  // Optional subtext
  subtext,
  // Optional card button action
  action: {
    name,
    handler,
    disabled = false,
    loading = false,
    loadingText = "",
  } = {},
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

        {/* Optional subtext or card button action */}
        <div className={styles.card__top_action}>
          {subtext ? <h3>{subtext}</h3> : null}
          {name && handler ? (
            <button onClick={handler} disabled={disabled || loading}>
              {!loading ? name : loadingText}
            </button>
          ) : null}
        </div>
      </div>
      <div className={styles.card__content}>{children}</div>
    </div>
  );
}
