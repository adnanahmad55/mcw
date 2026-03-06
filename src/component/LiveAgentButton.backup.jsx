// LiveAgentButton.jsx
import { useEffect } from "react";

const LiveAgentButton = () => {
  useEffect(() => {
    if (document.getElementById("la_x2s6df8d")) return;

    const script = document.createElement("script");
    script.id = "la_x2s6df8d";
    script.defer = true;
    script.src = "https://lotusbook.ladesk.com/scripts/track.js";

    script.onload = () => {
      try {
        if (window.LiveAgent) {
          window.LiveAgent.createButton("0sbfbnu3", script);
        }
      } catch (err) {
        console.error("LiveAgent failed to initialize:", err);
      }
    };

    document.body.appendChild(script);
  }, []);

  return null;
};

export default LiveAgentButton;