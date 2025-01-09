import styles from "./SorryIJustWentIntoATunnSignalBar.module.scss";

const SorryIJustWentIntoATunnSignalBar = ({ signal }: { signal: number }) => {
  return (
    <div className={styles.root}>
      <div className={styles.bars}>
        <div style={{ opacity: signal > 0.166 * 1 ? 0 : 1 }}></div>
        <div style={{ opacity: signal > 0.166 * 2 ? 0 : 1 }}></div>
        <div style={{ opacity: signal > 0.166 * 3 ? 0 : 1 }}></div>
        <div style={{ opacity: signal > 0.166 * 4 ? 0 : 1 }}></div>
        <div style={{ opacity: signal > 0.166 * 5 ? 0 : 1 }}></div>
      </div>
    </div>
  );
};

export default SorryIJustWentIntoATunnSignalBar;
