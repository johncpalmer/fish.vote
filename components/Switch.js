import Link from "next/link"; // Routing
import styles from "@styles/components/Switch.module.scss"; // Component styles

// Switch slider
export default function Switch({
  // Currently selected route
  activePath = 0,
  // First route details
  firstPath: { name: fLabel, path: fPath },
  // Second route details
  secondPath: { name: sLabel, path: sPath },
}) {
  return (
    <div
      // Switch wrapper class
      className={`${styles.switch} ${
        // Apply appropriate background color based on selected route
        activePath === 0 ? styles.switch__left : styles.switch__right
      }`}
    >
      {/* First path (render white if selected) */}
      <Link href={fPath}>
        <a className={activePath === 0 ? styles.switch__active : ""}>
          {fLabel}
        </a>
      </Link>

      {/* Second path (render white if selected) */}
      <Link href={sPath}>
        <a className={activePath === 1 ? styles.switch__active : ""}>
          {sLabel}
        </a>
      </Link>
    </div>
  );
}
