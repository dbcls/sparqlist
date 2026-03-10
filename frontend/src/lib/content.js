export function formatJson(value) {
  return JSON.stringify(value, null, 2);
}

export function isHtmlContentType(contentType) {
  return typeof contentType === 'string' && contentType.includes('text/html');
}

export function isJsonContentType(contentType) {
  return (
    typeof contentType === 'string' &&
    (contentType.includes('/json') || contentType.includes('+json'))
  );
}
