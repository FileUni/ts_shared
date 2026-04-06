type ThemeBootstrapStorage =
  | {
      type: 'cookie';
      key: string;
      autoValues?: readonly string[];
    }
  | {
      type: 'zustand-local-storage';
      key: string;
      path?: readonly string[];
      autoValues?: readonly string[];
    };

type ThemeBootstrapMode =
  | {
      type: 'class-dark';
      darkClass: string;
    }
  | {
      type: 'class-pair';
      darkClass: string;
      lightClass: string;
    }
  | {
      type: 'data-theme';
      attribute: string;
    };

export type ThemeHeadBootstrap = {
  readonly script: string;
  readonly style: string;
};

export type ThemeHeadBootstrapOptions = {
  readonly storage: ThemeBootstrapStorage;
  readonly mode: ThemeBootstrapMode;
  readonly lightBackground: string;
  readonly darkBackground: string;
  readonly lightText: string;
  readonly darkText: string;
};

export function buildThemeHeadBootstrap(options: ThemeHeadBootstrapOptions): ThemeHeadBootstrap {
  const scriptConfig = JSON.stringify({
    storage: {
      ...options.storage,
      autoValues: [...(options.storage.autoValues ?? ['auto'])],
      path:
        options.storage.type === 'zustand-local-storage'
          ? [...(options.storage.path ?? ['state', 'theme'])]
          : undefined,
    },
    mode: options.mode,
  });

  return {
    script: `(()=>{const config=${scriptConfig};const root=document.documentElement;root.setAttribute('data-fileuni-theme-preload','true');const normalizePreference=(value)=>{if(value==='light'||value==='dark')return value;if(typeof value==='string'&&config.storage.autoValues.includes(value))return'auto';return'auto';};const readCookie=(name)=>{const prefix=name+'=';for(const rawPart of document.cookie.split(';')){const part=rawPart.trim();if(part.startsWith(prefix))return decodeURIComponent(part.slice(prefix.length));}return null;};const readStoredTheme=()=>{if(config.storage.type==='cookie')return readCookie(config.storage.key);try{const raw=window.localStorage.getItem(config.storage.key);if(!raw)return null;const parsed=JSON.parse(raw);let current=parsed;for(const segment of config.storage.path){if(current&&typeof current==='object'&&segment in current){current=current[segment];}else{return null;}}return typeof current==='string'?current:null;}catch{return null;}};const preference=normalizePreference(readStoredTheme());const prefersDark=typeof window.matchMedia==='function'&&window.matchMedia('(prefers-color-scheme: dark)').matches;const resolved=preference==='auto'?(prefersDark?'dark':'light'):preference;root.setAttribute('data-fileuni-resolved-theme',resolved);root.style.colorScheme=resolved;if(config.mode.type==='data-theme'){root.setAttribute(config.mode.attribute,resolved);}else if(config.mode.type==='class-pair'){root.classList.remove(config.mode.darkClass,config.mode.lightClass);root.classList.add(resolved==='dark'?config.mode.darkClass:config.mode.lightClass);}else{root.classList.toggle(config.mode.darkClass,resolved==='dark');}const cleanup=()=>root.removeAttribute('data-fileuni-theme-preload');if(typeof requestAnimationFrame==='function'){requestAnimationFrame(()=>requestAnimationFrame(cleanup));}else{setTimeout(cleanup,0);}})();`,
    style: `html{background-color:${options.lightBackground};color:${options.lightText};color-scheme:light;}body{background-color:inherit;color:inherit;}@media (prefers-color-scheme: dark){html{background-color:${options.darkBackground};color:${options.darkText};color-scheme:dark;}}html[data-fileuni-resolved-theme="light"]{background-color:${options.lightBackground};color:${options.lightText};color-scheme:light;}html[data-fileuni-resolved-theme="dark"]{background-color:${options.darkBackground};color:${options.darkText};color-scheme:dark;}html[data-fileuni-resolved-theme="light"] body,html[data-fileuni-resolved-theme="dark"] body{background-color:inherit;color:inherit;}html[data-fileuni-theme-preload="true"] *,html[data-fileuni-theme-preload="true"] *::before,html[data-fileuni-theme-preload="true"] *::after{transition:none!important;}`,
  };
}
