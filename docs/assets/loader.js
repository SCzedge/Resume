// docs/assets/loader.js

const inserts = {
  links: [
    // 선택: 커스텀 CSS가 있으면 유지
    { rel: 'stylesheet', href: './assets/styles.css' },
  ],
  scripts: [
    // (선택) tailwind.config.js를 먼저 로드 — 반드시 CDN보다 앞!
    { src: './assets/tailwind.config.js' },

    // Tailwind CDN — 반드시 config 다음
    { src: 'https://cdn.tailwindcss.com' },

    // 페이지 전용 스크립트 — 마지막
    { src: './assets/main.js' },
  ],
};

function injectLinks() {
  inserts.links?.forEach(def => {
    const el = document.createElement('link');
    Object.entries(def).forEach(([k, v]) => (el[k] = v));
    document.head.appendChild(el);
  });
}

// 동기(순차) 로딩 보장: 각 스크립트가 onload될 때 다음 걸 로드
function loadScriptsSequentially(list, idx = 0) {
  if (!list || idx >= list.length) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const def = list[idx];
    const s = document.createElement('script');
    s.src = def.src;

    // 동적 스크립트는 기본이 async=true 처럼 동작하므로 명시적으로 끔
    // (일부 브라우저는 무시하지만 onload 체이닝으로 순서를 보장)
    s.async = false;

    // 필요한 경우 타입/무결성/코어스 지정 가능
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
  // head 최상단에서 loader.js가 실행되게 하고,
  // 그 다음 config -> tailwindcdn -> main.js 순으로 로딩
  loadScriptsSequentially(inserts.scripts).catch(console.error);
})();
