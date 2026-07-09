const path = require('path');
const fs = require('fs');
const { Transform } = require('stream');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const header = require('gulp-header');
const sourcemaps = require('gulp-sourcemaps');
const { SourceMapConsumer } = require('source-map');
const zip = require('gulp-zip');
const del = require('del');
const minimist = require('minimist');
const pkg = require('./package.json');
const laytpl = require('./src/modules/laytpl.js');

// 基础配置
const config = {
  // 头部注释
  comment: `/** v${pkg.version} | ${pkg.license} Licensed */;`,

  // 全部模块
  modules:
    'layui.all,lay,i18n,laytpl,laypage,laydate,jquery,component,layer,util,dropdown,slider,colorpicker,tab,nav,breadcrumb,progress,collapse,element,upload,form,table,treeTable,tabs,tree,transfer,carousel,rate,flow,code',
  // CSP 编译期特性标识
  cspFlagPattern: /__LAYUI_CSP__/g,
  // 源码 DEBUG 辅助变量，不会进入构建产物
  debugPattern: /\bvar\s+__LAYUI_CSP__\b\s*;/g,
  // JS 压缩参数
  uglifyOptions: {
    compress: false,
    output: {
      ascii_only: true // escape Unicode characters in strings and regexps
    },
    ie: true
  }
};

config.jsEntry = [
  './src/layui.js',
  ...config.modules.split(',').map((mod) => `./src/modules/${mod}.js`)
];

// 获取参数
const argv = minimist(process.argv.slice(2), {
  default: {
    vs: pkg.version
  }
});

const rlsFileName = `${pkg.name}-v${argv.vs}`; // 发行文件名
const rlsDest = `./release/zip/${rlsFileName}/${pkg.name}`; // 发行目标路径
const rlsDirname = path.dirname(rlsDest); // 发行目录名

// 复制目标路径
const copyDest = argv.dest
  ? path.join(argv.dest, argv.vs ? '/' + argv.vs : '')
  : rlsDest;

// 打包目标路径
const dest = './dist';

// js
const js = () => {
  let src = config.jsEntry;
  return gulp
    .src(src)
    .pipe(sourcemaps.init())
    .pipe(replace(config.debugPattern, ''))
    .pipe(replace(config.cspFlagPattern, 'false'))
    .pipe(uglify(config.uglifyOptions))
    .pipe(concat('layui.js', { newLine: '' }))
    .pipe(header(config.comment))
    .pipe(validateBundle('js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dest));
};

// csp js
const csp = () => {
  let src = config.jsEntry;
  return gulp
    .src(src)
    .pipe(sourcemaps.init())
    .pipe(replace(config.debugPattern, ''))
    .pipe(replace(/^[\s\S]*$/g, precompileLaytplBlocks))
    .pipe(replace(config.cspFlagPattern, 'true'))
    .pipe(uglify(config.uglifyOptions))
    .pipe(concat('layui.csp.js', { newLine: '' }))
    .pipe(header(config.comment))
    .pipe(validateBundle('csp'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dest));
};

// css
const css = () => {
  let src = ['./src/css/**/{layui,*}.css'];
  return gulp
    .src(src)
    .pipe(sourcemaps.init())
    .pipe(
      cleanCSS({
        compatibility: 'ie8'
      })
    )
    .pipe(concat('layui.css', { newLine: '' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dest + '/css'));
};

// files
const files = () => {
  let src = ['./src/**/*.{eot,svg,ttf,woff,woff2,html,json,png,jpg,gif}'];
  return gulp.src(src).pipe(gulp.dest(dest));
};

// clean
const clean = () => {
  return del([dest]);
};

// 默认任务
exports.default = gulp.series(clean, gulp.parallel(js, csp, css, files));
exports.csp = csp;

// 复制 dist 目录到指定路径
exports.cp = gulp.series(
  () => del(copyDest),
  () => {
    const src = `${dest}/**/*`;

    // 复制 css js
    gulp
      .src(`${src}.{css,js}`)
      .pipe(replace(/\n\/(\*|\/)#[\s\S]+$/, '')) // 过滤 css,js 的 map 特定注释
      .pipe(gulp.dest(copyDest));

    // 复制其他文件
    return gulp
      .src([
        src,
        `!${src}.{css,js,map}` // 过滤 map 文件
      ])
      .pipe(replace(/\n\/(\*|\/)#[\s\S]+$/, '')) // 过滤 css,js 的 map 特定注释
      .pipe(gulp.dest(copyDest));
  }
);

// 发行
exports.release = gulp.series(
  () => del([rlsDirname]), // 清理发行目录
  () => {
    // 生成说明
    return gulp.src('./examples/introduce/**/*').pipe(gulp.dest(rlsDirname)); // 用于本地
  },
  exports.cp, // 复制 dist 目录文件
  () => {
    // 生成 ZIP 压缩包
    const base = path.dirname(rlsDirname);
    return gulp
      .src(rlsDirname + '/**/*', {
        base: base
      })
      .pipe(zip(`${rlsFileName}.zip`))
      .pipe(gulp.dest(base));
  }
);

/**
 * 显示 gulp tasks 命令行帮助
 * 由于 gulp-cli 依赖了 yargs，此处直接使用
 * @returns
 */
exports.helper = () => {
  let usage = '\nUsage: gulp [options] tasks\n';
  let parser = require('yargs').options({
    dest: {
      type: 'string',
      desc: '自定义输出路径'
    },
    vs: {
      type: 'boolean',
      desc: '生成一个带版本号的文件夹'
    }
  });
  console.log(usage);
  parser.showHelp(console.log);
  console.log(
    [
      '\nTasks:',
      '  default  默认任务',
      '  release  发行任务',
      '  cp       将 dist 目录复制一份到参数 --dest 指向的目录'
    ].join('\n'),
    '\n\nExamples:\n  gulp cp --dest ./v',
    '\n'
  );
  return gulp.src('./');
};

// 预编译 laytpl 模板
// 将标记块内的 laytpl 静态模板预编译为渲染函数，仅用于 CSP 构建。
// 标记 ID 必须与块内被赋值的模板变量同名，例如：
//   // laytpl-precompile:start TPL_MAIN modern
//   var TPL_MAIN = [...].join('\n');
//   // laytpl-precompile:end TPL_MAIN
function precompileLaytplBlock(match, indent, name, tagStyle, block) {
  tagStyle = tagStyle || 'legacy';
  if (!/^[A-Za-z_$][\w$]*$/.test(name)) {
    throw new Error(`invalid laytpl precompile name: ${name}`);
  }
  if (!/^(legacy|modern)$/.test(tagStyle)) {
    throw new Error(`invalid laytpl precompile tagStyle: ${tagStyle}`);
  }

  // 构建期执行标记块，取得同名模板变量的字符串值；不会进入构建产物。
  const template = new Function(`${block}\nreturn ${name};`)();

  // 复用 laytpl 内部 builder 生成函数源码
  const renderer = laytpl
    .build(template, {
      open: '{{',
      close: '}}',
      tagStyle: tagStyle
    })
    .replace(/;\s*$/, '');

  // 预编译函数需要闭包绑定运行时 laytpl，供函数体内的 laytpl.escape 等内部变量使用。
  return [
    `${indent}// laytpl-precompile:start ${name}${tagStyle === 'legacy' ? '' : ' ' + tagStyle}`,
    `${indent}var ${name} = (function (laytpl) {`,
    `${indent}  return ${renderer};`,
    `${indent}})(laytpl);`,
    `${indent}// laytpl-precompile:end ${name}`
  ].join('\n');
}

function precompileLaytplBlocks(source) {
  // 正则分组说明：
  // 1. `(^[ \t]*)` 捕获起始标记缩进，确保结束标记位于同一缩进层级。
  // 2. `([A-Za-z_$][\w$]*)` 捕获模板变量名，并要求是合法 JS 标识符。
  // 3. `(legacy|modern)?` 捕获可选标签风格，未写时默认 legacy。
  // 4. `([\s\S]*?)` 非贪婪捕获标记块内容，支持跨行模板定义。
  // 5. `\1` / `\2` 要求结束标记缩进和变量名与起始标记一致，避免误配嵌套块。
  return source.replace(
    /(^[ \t]*)\/\/ laytpl-precompile:start ([A-Za-z_$][\w$]*)(?: (legacy|modern))?\n([\s\S]*?)\n\1\/\/ laytpl-precompile:end \2/gm,
    precompileLaytplBlock
  );
}

const bundleValidationRules = {
  js: [
    {
      name: 'compile flag removed',
      pattern: /__LAYUI_CSP__/,
      expect: 'absent'
    }
  ],
  csp: [
    {
      name: 'compile flag removed',
      pattern: /__LAYUI_CSP__/,
      expect: 'absent'
    },
    {
      name: 'dynamic Function constructor removed',
      pattern: /(^|[^\w$.])(?:new\s+)?Function\s*\(/,
      expect: 'absent'
    },
    {
      name: 'javascript URI removed',
      pattern: /javascript\s*:/i,
      expect: 'absent'
    }
  ]
};

/**
 * 创建构建产物校验流
 * 该流应放在 concat/header 之后、sourcemaps.write 之前，确保校验的是最终 JS 产物内容
 * @param {'js' | 'csp'} type 构建产物类型
 * @returns {Transform}
 */
function validateBundle(type) {
  const rules = bundleValidationRules[type];
  if (!rules) {
    throw new Error(`unknown bundle validation type: ${type}`);
  }

  return new Transform({
    objectMode: true,
    transform(file, encoding, callback) {
      try {
        if (file.isNull()) {
          callback(null, file);
          return;
        }
        if (file.isStream()) {
          throw new Error('bundle validation does not support streams');
        }

        validateBundleContent(
          type,
          file.relative,
          file.contents.toString(),
          file.sourceMap
        );
        callback(null, file);
      } catch (err) {
        this.emit('error', err);
        callback();
      }
    }
  });
}

/**
 * 按产物类型执行规则校验，任一规则失败都会中断 gulp 构建
 * @param {'js' | 'csp'} type 构建产物类型
 * @param {string} filename 当前校验的产物文件名
 * @param {string} source 产物源码内容
 * @param {object|null} sourceMap 产物对应的 v3 sourcemap（来自 gulp-sourcemaps），可能为 null
 */
function validateBundleContent(type, filename, source, sourceMap) {
  const errors = [];
  const rules = bundleValidationRules[type];

  // 0.6.1 的 SourceMapConsumer 构造是同步的；无 sourcemap 时降级为纯产物片段定位
  let consumer = null;
  try {
    consumer = sourceMap ? new SourceMapConsumer(sourceMap) : null;
  } catch {
    consumer = null;
  }

  rules.forEach((rule) => {
    const matched = rule.pattern.test(source);
    const isValid =
      rule.expect === 'present'
        ? matched
        : rule.expect === 'absent' && !matched;

    if (!isValid) {
      errors.push(formatBundleValidationError(rule, source, consumer));
    }
  });

  if (consumer && consumer.destroy) {
    consumer.destroy();
  }

  if (errors.length) {
    throw new Error(
      [`${filename} failed ${type} bundle validation:`]
        .concat(errors.map((error) => `- ${error}`))
        .join('\n')
    );
  }
}

/**
 * 生成单条规则失败信息
 * - present 期望：仅提示缺失
 * - absent 期望：逐处列出命中点在原始源码中的位置（依赖 sourcemap），无 sourcemap 时回退到产物片段
 * @param {{name: string, pattern: RegExp, expect: 'present' | 'absent'}} rule 校验规则
 * @param {string} source 产物源码内容
 * @param {object|null} consumer 已构造的 SourceMapConsumer（可能为 null）
 * @returns {string}
 */
function formatBundleValidationError(rule, source, consumer) {
  if (rule.expect === 'present') {
    return `${rule.name}: missing required pattern ${rule.pattern}`;
  }

  const locations = locatePattern(rule, source, consumer);
  const detail = locations.length
    ? `; hit ${locations.length} unique source location(s):\n    ` +
      locations.map((loc) => `at ${loc}`).join('\n    ')
    : `; snippet: ${getPatternSnippet(rule, source)}`;
  return `${rule.name}: forbidden pattern ${rule.pattern}${detail}`;
}

/**
 * 在产物中找出规则的全部命中点，借助 sourcemap 把命中偏移映射回原始源码位置
 * @param {{pattern: RegExp}} rule 校验规则
 * @param {string} source 产物源码内容
 * @param {object|null} consumer 已构造的 SourceMapConsumer（可能为 null）
 * @returns {string[]} 形如 `源文件:行号:列号  源码行摘要` 的定位串；映射不到则返回空数组
 */
function locatePattern(rule, source, consumer) {
  if (!consumer) return [];

  // 必须用全局 flag，exec 才会随 lastIndex 前进，逐处覆盖全部命中点；
  // 否则非全局 exec 每次从 0 搜索，只会重复命中同一处而漏掉其余位置。
  const flags = rule.pattern.flags.includes('g')
    ? rule.pattern.flags
    : rule.pattern.flags + 'g';
  const pattern = new RegExp(rule.pattern.source, flags);
  const targets = [];
  let match;
  let guard = 0;
  while ((match = pattern.exec(source)) !== null) {
    if (guard++ > 5000) break; // 防御性上限，避免极端产物里无限循环
    targets.push(match.index);
    // 空匹配兜底：强制前进一位，避免 lastIndex 卡住导致死循环
    if (match.index === pattern.lastIndex) pattern.lastIndex++;
  }

  const sourcesContent = consumer.sourcesContent || [];

  const seen = new Set();
  const results = [];
  for (const offset of targets) {
    const { line, column } = offsetToLineCol(source, offset);
    const orig = consumer.originalPositionFor({ line, column });
    if (!orig || !orig.source) continue;

    const sources = consumer.sources || [];
    const idx = sources.indexOf(orig.source);
    const content = idx >= 0 ? sourcesContent[idx] : null;
    const codeLine = pickLine(content, orig.line);

    // sourcemap 的 source 多为 bare 名（如 lay.js），无法被 IDE 终端从工作区根解析；
    // 解析成仓库相对路径（如 src/modules/lay.js），拼成 `path:line:col`，
    // VS Code 等终端会识别为可点击链接，Ctrl/Cmd+点击直接跳转到对应行列。
    const sourcePath = resolveSourcePath(orig.source);
    const label = `${sourcePath}:${orig.line}:${(orig.column || 0) + 1}`;
    // 链接放最前，摘要置于链接之后并以空格分隔，避免摘要中的字符污染链接识别
    const entry = codeLine ? `${label}  ${codeLine.trim()}` : label;
    // 压缩产物里同一源码位置常对应多个 generated 列，按定位串去重，避免刷屏
    if (seen.has(entry)) continue;
    seen.add(entry);
    results.push(entry);
  }
  return results;
}

/**
 * 将字符偏移转换为 sourcemap v3 所需的 1-based 行号、0-based 列号
 * @param {string} text 产物全文
 * @param {number} offset 字符偏移
 * @returns {{line: number, column: number}}
 */
function offsetToLineCol(text, offset) {
  let line = 1;
  let column = 0;
  const end = Math.min(offset, text.length);
  for (let i = 0; i < end; i++) {
    if (text.charCodeAt(i) === 10) {
      // '\n'
      line++;
      column = 0;
    } else {
      column++;
    }
  }
  return { line, column };
}

/**
 * 从源码原文中取指定行（1-based）的内容，压缩为单行摘要，便于在错误信息中辨识
 * @param {string|null} content 源码原文（可能为 null）
 * @param {number} lineNo 1-based 行号
 * @returns {string}
 */
function pickLine(content, lineNo) {
  if (!content) return '';
  const line = content.split(/\r?\n/)[lineNo - 1];
  return line ? line.trim() : '';
}

/**
 * 将 sourcemap 中的 bare 源文件名（如 `lay.js`）解析为仓库相对路径（如 `src/modules/lay.js`）。
 * 优先匹配 `src/<name>`（入口文件），再匹配 `src/modules/<name>`（各模块）；
 * 两者均不存在时回退为原始名称，绝不抛错——只是失去 IDE 终端的可点击性。
 * @param {string} name sourcemap 的 source 字段
 * @returns {string}
 */
function resolveSourcePath(name) {
  if (!name) return name;
  const candidates = [`src/${name}`, `src/modules/${name}`];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return name;
}

/**
 * 无 sourcemap 时的回退：截取产物中首个命中位置附近的单行片段，避免输出整份压缩产物
 * @param {{pattern: RegExp}} rule 校验规则
 * @param {string} source 产物源码内容
 * @returns {string}
 */
function getPatternSnippet(rule, source) {
  const pattern = new RegExp(
    rule.pattern.source,
    rule.pattern.flags.replace('g', '')
  );
  const match = pattern.exec(source);
  if (!match) return '';

  const start = Math.max(match.index - 60, 0);
  const end = Math.min(match.index + match[0].length + 60, source.length);
  return source.slice(start, end).replace(/\s+/g, ' ');
}
