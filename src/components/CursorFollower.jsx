import { useEffect } from "react";

export default function CursorFollower() {
  useEffect(() => {
    const circle = document.createElement("div");
    circle.style.position = "fixed";
    circle.style.top = "0";
    circle.style.left = "0";
    circle.style.width = "120px";        // size of the circle
    circle.style.height = "120px";
    circle.style.borderRadius = "50%";
    circle.style.background = "black";   // color of the follower
    circle.style.pointerEvents = "none";
    circle.style.mixBlendMode = "multiply"; 
    circle.style.zIndex = "9999";
    circle.style.transform = "translate(-50%, -50%)";
    circle.style.transition = "transform 0.12s linear";
    
    document.body.appendChild(circle);

    const move = (e) => {
      circle.style.transform = `translate(${e.clientX - 60}px, ${e.clientY - 60}px)`; 
    };

    window.addEventListener("mousemove", move);

    return () => {
      window.removeEventListener("mousemove", move);
      document.body.removeChild(circle);
    };
  }, []);

  return null; // no visible JSX needed
}
