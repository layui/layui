/**
 * browser utils
 */

/**
 * 打开新窗口
 * @param {Object} options
 */
export function openWindow(options = {}) {
  const win =
    options.window ||
    window.open(options.url || '', options.target, options.specs);
  if (options.url) return;

  win.document.open('text/html', 'replace');
  win.document.write(options.content || '');
  win.document.close();
}
