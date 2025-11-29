import { useEffect, useState } from "react";
import "./PullDown.css";

export default function OpenPageAnimation() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2000); // panel stays for 2 second

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Pull-down intro container */}
      <div className={`intro-panel ${showIntro ? "open" : "close"}`}>
        <p>Loading your experience...</p>
      </div>
      
    </>
  );
}
