import { useEffect, useState } from "react";
import { generateUniqueId } from "../hooks/generateUniqueId";

// IndexedDB helper
const getFromIndexedDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("UniqueDB", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("ids")) {
        db.createObjectStore("ids");
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const tx = db.transaction("ids", "readonly");
      const store = tx.objectStore("ids");
      const getReq = store.get("uniqueId");

      getReq.onsuccess = () => resolve(getReq.result || null);
      getReq.onerror = () => reject(null);
    };

    request.onerror = () => reject(null);
  });
};

const saveToIndexedDB = (id) => {
  const request = indexedDB.open("UniqueDB", 1);
  request.onsuccess = (event) => {
    const db = event.target.result;
    const tx = db.transaction("ids", "readwrite");
    const store = tx.objectStore("ids");
    store.put(id, "uniqueId");
  };
};

// Cookie helper
const setCookie = (name, value, days = 365) => {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
};

const getCookie = (name) => {
  const cname = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let c of ca) {
    while (c.charAt(0) === " ") c = c.substring(1);
    if (c.indexOf(cname) === 0) return c.substring(cname.length, c.length);
  }
  return null;
};

export const useUniqueId = () => {
  const [uniqueId, setUniqueId] = useState(null);

  useEffect(() => {
    const loadId = async () => {
      // 1. Check IndexedDB
      let id = await getFromIndexedDB();

      // 2. Check LocalStorage
      if (!id) id = localStorage.getItem("uniqueId");

      // 3. Check Cookie
      if (!id) id = getCookie("uniqueId");

      // 4. Agar kahin bhi nahi mila → generate new
      if (!id) {
        id = generateUniqueId();
        saveToIndexedDB(id);
        localStorage.setItem("uniqueId", id);
        setCookie("uniqueId", id);
      }

      setUniqueId(id);
    };

    loadId();
  }, []);

  return uniqueId;
};
