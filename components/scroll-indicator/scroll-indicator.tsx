import styles from "./scroll-indicator.module.css";

export function ScrollIndicator() {
  return (
    <p
      className={`relative -top-[68px] w-full text-center text-gray-800 dark:text-gray-200 ${styles.scrollIndicator}`}
    >
      Scroll ↓ Scroll
    </p>
  );
}
