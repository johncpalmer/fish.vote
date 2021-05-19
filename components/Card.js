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
  // Optional force short top margin for card
  shortMargin,
}) {
  return (
    <div
      className={`${styles.card} ${
        // Apply short top margin style if optional bool
        shortMargin ? styles.card__shortMargin : ""
      }`}
    >
      {title ? (
        // Render top card section if title provided (if not, render like info card)
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
      ) : null}
      <div className={styles.card__content}>{children}</div>
    </div>
  );
}
