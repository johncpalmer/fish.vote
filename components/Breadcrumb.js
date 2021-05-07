import dayjs from "dayjs"; // Date rendering
import Link from "next/link"; // Routing
import styles from "@styles/components/Breadcrumb.module.scss"; // Component styles

export default function Breadcrumb({
  // Page title
  title,
  // Last navigation
  lastRoute: { path, name } = {},
  // Propsal details
  status,
  created,
  proposer,
}) {
  return (
    <div className={styles.breadcrumb}>
      {/* Render last route if exists */}
      {path && name ? (
        <Link href={path}>
          <a className={styles.breadcrumb__last}>{`<- ${name}`}</a>
        </Link>
      ) : null}

      {/* Render status if one is provided */}
      {status ? (
        <span className={styles.breadcrumb__status}>{status}</span>
      ) : null}

      {/* Render title */}
      <h1>{title}</h1>

      {/* Render proposal details */}
      {created && proposer ? (
        <div className={styles.breadcrumb__details}>
          <span>Created {dayjs(created).format("MMMM D, YYYY")}</span>
          <div />
          <span>
            Proposed by{" "}
            <a
              href={`https://etherscan.io/address/${proposer}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {proposer}
            </a>
          </span>
        </div>
      ) : null}
    </div>
  );
}
