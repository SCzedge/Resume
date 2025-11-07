const inserts = {
  links: [
    // { rel: "stylesheet", href: "./assets/styles.css" },
  ],

  
  scripts: [
      { src: "./assets/tailwind.config.js", defer: false }, // 선택
      { src: "https://cdn.tailwindcss.com", defer: false },
    //   { src: "./assets/main.js", defer: true },
  ],
};

function injectLinks() {
  inserts.links?.forEach((linkDef) => {
    const el = document.createElement("link");
    Object.entries(linkDef).forEach(([k, v]) => (el[k] = v));
    document.head.appendChild(el);
  });
}

function injectScripts() {
  return inserts.scripts?.reduce((prev, def) => {
    return prev.then(
      () =>
        new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = def.src;
          if (def.defer) s.defer = true;
          if (def.async) s.async = true;
          if (def.type) s.type = def.type;
          if (def.integrity) s.integrity = def.integrity;
          if (def.crossOrigin) s.crossOrigin = def.crossOrigin;

          s.onload = resolve;
          s.onerror = () => reject(new Error(`Failed to load: ${def.src}`));
          document.head.appendChild(s);
        })
    );
  }, Promise.resolve());
}

(function bootstrapInserts() {
  injectLinks();
  injectScripts().catch(console.error);
})();
