import { useEffect } from "react";

const LiveChat = () => {
  useEffect(() => {
    if (document.getElementById("la_x2s6df8d")) return;

    (function (d, src, c) {
      const t = d.scripts[d.scripts.length - 1];
      const s = d.createElement("script");
      s.id = "la_x2s6df8d";
      s.defer = true;
      s.src = src;
      s.onload = s.onreadystatechange = function () {
        const rs = this.readyState;
        if (rs && rs !== "complete" && rs !== "loaded") return;
        c(this);
      };
      t.parentElement.insertBefore(s, t.nextSibling);
    })(document, "https://757x.ladesk.com/scripts/track.js", function (e) {});
  }, []);

  return null; 
};

export default LiveChat;
