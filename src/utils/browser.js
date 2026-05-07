/**
 * browser utils
 */

/**
 * 打开新窗口
 * @param {Object} options
 * @param {string} [options.url] - 目标 URL 地址
 * @param {string} [options.target] - 目标窗口名称
 * @param {string} [options.specs] - 目标窗口特征字符串
 * @param {string} [options.content] - 目标窗口内容
 * @param {Window} [options.window] - 目标窗口对象
 * @return {Window|null}
 */
export function openWindow(options = {}) {
  const win =
    options.window ||
    window.open(options.url || '', options.target, options.specs);

  if (!win) return null;
  if (options.url) return win;

  win.document.open('text/html', 'replace');
  win.document.write(options.content || '');
  win.document.close();

  return win;
}
