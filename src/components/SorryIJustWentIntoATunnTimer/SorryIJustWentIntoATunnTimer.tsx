import styles from "./SorryIJustWentIntoATunnTimer.module.scss";
import { useEffect, useMemo, useState } from "react";

const SorryIJustWentIntoATunnTimer = () => {
  const mountedTime = useMemo(() => Date.now(), []);
  const [elapsedTime, setElapsedTime] = useState(0);
  useEffect(() => {
    const tick = () => {
      setElapsedTime(Date.now() - mountedTime);
    };

    const interval = setInterval(tick, 500);

    return () => {
      clearInterval(interval);
    };
  }, [mountedTime]);

  return (
    <div className={styles.root}>
      {new Date(elapsedTime).toISOString().slice(14, 19)}
    </div>
  );
};

export default SorryIJustWentIntoATunnTimer;
