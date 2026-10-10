/** Strip queries/fragments before an application-controlled analytics event. */
export function analyticsUrl(value: string): string {
  if (!value) return '';
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.origin + url.pathname : '';
  } catch {
    return '';
  }
}
