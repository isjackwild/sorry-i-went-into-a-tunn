import styles from "./SorryIJustWentIntoATunnNetwork.module.scss";

const SorryIJustWentIntoATunnNetwork = ({ signal }: { signal: number }) => {
  return (
    <span className={styles.root}>
      <span className={styles.type}>
        {signal > 0.166 * 5
          ? "5G"
          : signal > 0.166 * 4
          ? "4G"
          : signal > 0.166 * 3
          ? "3G"
          : signal > 0.166 * 1
          ? "E"
          : "!"}
      </span>
    </span>
  );
};
export default SorryIJustWentIntoATunnNetwork;
