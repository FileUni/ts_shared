export function observeDocumentAttribute(
  documentRef: Document,
  attributeName: string,
  onChange: () => void,
): () => void {
  const observer = new MutationObserver(() => {
    onChange();
  });

  observer.observe(documentRef.documentElement, {
    attributes: true,
    attributeFilter: [attributeName],
  });

  return () => observer.disconnect();
}

export function observeColorSchemePreference(onChange: () => void): () => void {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', onChange);
  return () => mediaQuery.removeEventListener('change', onChange);
}
