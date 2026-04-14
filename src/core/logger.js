/**
 * logger
 */

let warned = Object.create(null);

/**
 * 控制台日志消息提示
 * @param {string} message - 消息内容
 * @param {'warn'|'error'} [level='warn'] - 消息级别
 */
export function log(message, level = 'warn') {
  // 限定消息级别
  if (!/^(warn|error)$/.test(level.trim())) {
    level = 'warn';
  }
  message = `[Layui ${level}]: ${message}`;
  window.console[level](message);
}

/**
 * 一次性「日志提示」
 * @param {...Parameters<typeof log>} args
 */
export function logOnce(...args) {
  const [message] = args;

  if (warned._size > 100) {
    warned = Object.create(null);
    warned._size = 0;
  }
  if (!warned[message]) {
    warned[message] = true;
    warned._size = (warned._size || 0) + 1;
    log(...args);
  }
}
