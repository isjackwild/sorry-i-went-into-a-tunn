import styles from "./SorryIJustWentIntoATunnTimer.module.scss";
import { useEffect, useMemo, useState } from "react";

const SorryIJustWentIntoATunnTimer = ({
  connected,
}: {
  connected: boolean;
}) => {
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
      {connected
        ? new Date(elapsedTime).toISOString().slice(14, 19)
        : "connecting"}
    </div>
  );
};

export default SorryIJustWentIntoATunnTimer;
