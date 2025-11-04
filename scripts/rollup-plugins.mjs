/**
 * Rollup Custom Plugins
 */

// 压缩后添加头部注释
export function banner(options = {}) {
  const bannerComment = options.comment || '';
  return {
    name: 'banner',
    generateBundle(_, bundle) {
      // chunk 生成后
      for (const file of Object.values(bundle)) {
        if (file.type === 'chunk') {
          file.code = bannerComment + file.code;
        }
      }
    },
  };
}
