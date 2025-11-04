/**
 * PostCSS Config
 */

import postcssImport from 'postcss-import'; // 导出 CSS @import
import postcssNested from 'postcss-nested'; // CSS Nesting 原生嵌套兼容解析
import autoprefixer from 'autoprefixer'; // 自动为 CSS 添加浏览器前缀 -ms / -moz
import postcssUrl from 'postcss-url'; // url() 处理
import cssnano from 'cssnano'; // CSS 压缩

const isDevMode = process.env.MODE === 'dev';

const mapConfig = {
  inline: false,
};

export default {
  map: mapConfig,
  plugins: [
    postcssImport(),
    postcssNested(),
    autoprefixer(),
    postcssUrl({
      url: 'inline', // 内联为 base64
      maxSize: 100, // 限制文件大小 (kb)
      fallback: 'copy', // 超过大小限制时的回退策略
    }),
    isDevMode ? null : cssnano(),
  ],
};
