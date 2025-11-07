const inserts = {
  links: [{ rel: "stylesheet", href: "./assets/styles.css" }],
  scripts: [
    { src: "./assets/tailwind.config.js" },
    { src: "https://cdn.tailwindcss.com" },
    { src: "./assets/main.js" },
  ],
};

function injectLinks() {
  inserts.links?.forEach((def) => {
    const el = document.createElement("link");
    Object.entries(def).forEach(([k, v]) => (el[k] = v));
    document.head.appendChild(el);
  });
}

function loadScriptsSequentially(list, idx = 0) {
  if (!list || idx >= list.length) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const def = list[idx];
    const s = document.createElement("script");
    s.src = def.src;
    s.async = false;

    if (def.type) s.type = def.type;
    if (def.integrity) s.integrity = def.integrity;
    if (def.crossOrigin) s.crossOrigin = def.crossOrigin;

    s.onload = () => resolve(loadScriptsSequentially(list, idx + 1));
    s.onerror = () => reject(new Error(`Failed to load: ${def.src}`));
    document.head.appendChild(s);
  });
}

(function bootstrap() {
  injectLinks();
  loadScriptsSequentially(inserts.scripts).catch(console.error);
})();
