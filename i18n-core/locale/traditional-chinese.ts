import { ConverterFactory, Locale } from '../opencc-cn2t.js';

import type { LocaleMessageValue } from './dictionary';

const TRADITIONAL_CHINESE_OVERRIDE_DICT = [
  ['登录', '登入'],
  ['注销', '登出'],
  ['注册', '註冊'],
  ['设置', '設定'],
  ['保存设置', '儲存設定'],
  ['默认设置', '預設設定'],
  ['密码', '密碼'],
  ['邮件', '郵件'],
  ['邮箱', '郵箱'],
  ['用户', '使用者'],
  ['用户名', '使用者名稱'],
  ['加载中', '載入中'],
  ['配置', '設定'],
  ['视频', '影片'],
  ['音频', '音訊'],
  ['日志', '日誌'],
  ['点击', '點擊'],
  ['下载', '下載'],
  ['上传', '上傳'],
] as const;

const converter = ConverterFactory(
  Locale.from.cn,
  Locale.to.twp,
  [TRADITIONAL_CHINESE_OVERRIDE_DICT],
);

const objectCache = new WeakMap<object, unknown>();

export function toTraditionalChineseString(value: string): string {
  return converter(value);
}

export function toTraditionalChineseDeep<T extends LocaleMessageValue | Record<string, unknown>>(
  value: T,
): T {
  if (typeof value === 'string') {
    return toTraditionalChineseString(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => toTraditionalChineseDeep(entry)) as unknown as T;
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  const cached = objectCache.get(value as object);
  if (cached) {
    return cached as T;
  }

  const converted = Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [key, toTraditionalChineseDeep(entry as LocaleMessageValue)]),
  ) as T;

  objectCache.set(value as object, converted);
  return converted;
}
