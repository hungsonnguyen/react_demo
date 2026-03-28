import { useEffect, useState } from "react";

export default function LifecycleDemoHooks() {
  const [count, setCount] = useState(0);
  const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    console.log("[Hooks] useEffect (mount/unmount) - component mounted", {
      count,
      timestamp: new Date().toLocaleTimeString(),
    });

    return () => {
      console.log("[Hooks] useEffect cleanup - component unmounted", {
        count,
        finalTimestamp: new Date().toLocaleTimeString(),
      });
    };
  }, []);

  useEffect(() => {
    console.log("[Hooks] useEffect (update) - count changed", {
      count,
      timestamp: new Date().toLocaleTimeString(),
    });
  }, [count]);

  const handleIncrease = () => {
    setCount((prev) => prev + 1);
    setTimestamp(new Date().toLocaleTimeString());
  };

  return (
    <div className="lifecycle-demo hooks-demo">
      <h3> LifecycleDemo - useEffect Hooks</h3>

      <div className="demo-content">
        <p>
          Count: <strong>{count}</strong>
        </p>
        <p>
          Timestamp: <code>{timestamp}</code>
        </p>

        <button onClick={handleIncrease} className="increase-btn">
          Increase Count
        </button>
      </div>
    </div>
  );
}
