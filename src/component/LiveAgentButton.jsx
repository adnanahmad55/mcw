// LiveAgentButton.jsx
import { useEffect } from "react";

const LiveAgentButton = () => {
  useEffect(() => {
    if (document.getElementById("la_x2s6df8d")) return;

    (function(d, src, c) { 
      var t = d.scripts[d.scripts.length - 1],
          s = d.createElement('script');
      s.id = 'la_x2s6df8d';
      s.defer = true;
      s.src = src;
      s.onload = s.onreadystatechange = function() {
        var rs = this.readyState;
        if (rs && (rs !== 'complete') && (rs !== 'loaded')) {
          return;
        }
        c(this);
      };
      t.parentElement.insertBefore(s, t.nextSibling); 
    })(document, 'https://lotusbook.ladesk.com/scripts/track.js', function(e) { 
      if (window.LiveAgent) {
        window.LiveAgent.createButton('0sbfbnu3', e); 
      }
    });
  }, []);

  return null;
};

export default LiveAgentButton;