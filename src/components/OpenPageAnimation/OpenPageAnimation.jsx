import { useEffect, useState } from "react";
import "./PullDown.css";
import loadingSpinner from "../../images/laoding-spinner.png";

export default function OpenPageAnimation() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2000); // panel stays for 2 second

    return () => clearTimeout(timer);
  },[]);

  return (
    
    <>
      {/* Pull-down intro container */}
      <div className={`intro-panel ${showIntro ? "open" : "close"}`}>
        <p><span><img src={loadingSpinner} alt="image-spinner"/></span>Loading your experience...</p>
      </div>

    </>
  );
}

// import { useEffect, useState } from "react";
// import "./PullDown.css";
// import loadingSpinner from "../../images/laoding-spinner.png";

// export default function OpenPageAnimation() {
//   const [showIntro, setShowIntro] = useState(false);

//   useEffect(() => {
//     const alreadyShown = sessionStorage.getItem("intro_shown");

//     if (!alreadyShown) {
//       document.body.classList.add("no-scroll");
//       requestAnimationFrame(() => {
//         setShowIntro(true);

//         sessionStorage.setItem("intro_shown", "true");

//         const timer = setTimeout(() => {
//           setShowIntro(false);
//         }, 2000);

//         return () => clearTimeout(timer);
//       });
//     }
//   }, []);

//   return (
//     <>
//       {showIntro && (
//         <div
//           className={`intro-panel ${showIntro ? "open" : "close"}`}
//           onAnimationEnd={(e) => {
//             if (e.animationName === "introSlideOut") {
//               document.body.classList.remove("no-scroll");
//             }
//           }}
//         >
//           <p>
//             <span>
//               <img src={loadingSpinner} alt="image-spinner" />
//             </span>
//             Loading your experience...
//           </p>
//         </div>
//       )}
//     </>
//   );
// }
