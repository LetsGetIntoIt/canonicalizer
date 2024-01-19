
export const getCanonicalFromDocument = (document: Document): string | undefined =>
    document.querySelector('link[rel="canonical"]')?.getAttribute('href') || undefined;
