import { LOCALE_METADATA, type SupportedLocale } from './locales';
import { buildLocaleUrl } from './urls';

export type SiteChromeLocale = 'root' | SupportedLocale;

export type SiteChromeMeta = {
  readonly labels: {
    readonly home: string;
    readonly download: string;
    readonly docs: string;
    readonly login: string;
    readonly getStarted: string;
  };
  readonly homeHref: string;
  readonly downloadHref: string;
  readonly docsHref: string;
  readonly loginHref: string;
  readonly registerHref: string;
};

const SITE_BASE_URL = 'https://fileuni.com';

const SITE_CHROME_LABELS: Record<SiteChromeLocale, SiteChromeMeta['labels']> = {
  root: {
    home: 'Home',
    download: 'Download',
    docs: 'Docs',
    login: 'Login',
    getStarted: 'Get Started',
  },
  en: {
    home: 'Home',
    download: 'Download',
    docs: 'Docs',
    login: 'Login',
    getStarted: 'Get Started',
  },
  'zh-CN': {
    home: '首页',
    download: '下载',
    docs: '文档',
    login: '登录',
    getStarted: '立即开始',
  },
  'zh-Hant': {
    home: '首頁',
    download: '下載',
    docs: '文件',
    login: '登入',
    getStarted: '立即開始',
  },
  es: {
    home: 'Inicio',
    download: 'Descargar',
    docs: 'Docs',
    login: 'Entrar',
    getStarted: 'Empezar',
  },
  de: {
    home: 'Home',
    download: 'Download',
    docs: 'Docs',
    login: 'Login',
    getStarted: 'Get Started',
  },
  fr: {
    home: 'Home',
    download: 'Download',
    docs: 'Docs',
    login: 'Login',
    getStarted: 'Get Started',
  },
  ru: {
    home: 'Home',
    download: 'Download',
    docs: 'Docs',
    login: 'Login',
    getStarted: 'Get Started',
  },
  ja: {
    home: 'Home',
    download: 'Download',
    docs: 'Docs',
    login: 'Login',
    getStarted: 'Get Started',
  },
};

export function getSiteChromeMeta(locale: SiteChromeLocale): SiteChromeMeta {
  if (locale === 'root') {
    return {
      labels: SITE_CHROME_LABELS.root,
      homeHref: `${SITE_BASE_URL}/`,
      downloadHref: `${SITE_BASE_URL}/download`,
      docsHref: '/',
      loginHref: `${SITE_BASE_URL}/user/login`,
      registerHref: `${SITE_BASE_URL}/user/register`,
    };
  }

  return {
    labels: SITE_CHROME_LABELS[locale],
    homeHref: buildLocaleUrl(SITE_BASE_URL, locale, '/'),
    downloadHref: buildLocaleUrl(SITE_BASE_URL, locale, '/download'),
    docsHref: `${LOCALE_METADATA[locale].pathPrefix}/`,
    loginHref: `${SITE_BASE_URL}/user/login#${locale}`,
    registerHref: `${SITE_BASE_URL}/user/register#${locale}`,
  };
}
