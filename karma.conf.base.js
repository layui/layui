/**
 * @file karma自动化测试配置
 * @author fe.xiaowu@gmail.com
 */

/**
 * 源文件
 *
 * @type {Array}
 */
var sourceFileMap = [
    'src/layui.js',
    'src/lay/modules/jquery.js',
    'src/lay/modules/carousel.js',
    'src/lay/modules/code.js',
    'src/lay/modules/element.js',
    'src/lay/modules/flow.js',
    'src/lay/modules/form.js',
    'src/lay/modules/laydate.js',
    'src/lay/modules/layedit.js',
    'src/lay/modules/layer.js',
    'src/lay/modules/laypage.js',
    'src/lay/modules/laytpl.js',
    'src/lay/modules/table.js',
    'src/lay/modules/tree.js',
    'src/lay/modules/upload.js',
    'src/lay/modules/util.js',
    'src/lay/modules/mobile/zepto.js',
    'src/lay/modules/mobile/layer-mobile.js',
    'src/lay/modules/mobile/upload-mobile.js'
];

/**
 * 测试覆盖率文件, 要忽略 jquery.js、zepto.js
 *
 * @type {Object}
 */
var coverageFileMap = {};
sourceFileMap.filter(function (uri) {
    return !/(jquery|zepto)\.js$/.test(uri);
}).forEach(function (uri) {
    coverageFileMap[uri] = ['coverage'];
});

module.exports = function (config) {
    return {
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // Important: 所有插件必须在此声明
        plugins: ['karma-*'],

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        // Important: 下列数组中文件将『逆序载入』
        frameworks: ['mocha', 'chai', 'chai-sinon'],


        // list of files / patterns to load in the browser
        files: sourceFileMap.concat('test/**/*.js').concat({
            pattern: 'src/css/**/*',
            included: false
        }, {
            pattern: 'src/font/**/*',
            included: false
        }, {
            pattern: 'src/images/**/*',
            included: false
        }),


        // list of files to exclude
        exclude: [],

        client: {
            mocha: {
                // mocha测试超时6秒
                timeout: 1000 * 6
            }
        },


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: coverageFileMap,


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: [
            'mocha'
            // 'coverage'
        ],

        coverageReporter: {
            // specify a common output directory
            dir: '.',
            reporters: [
                // { type: 'html', subdir: 'report-html' },
                {
                    type: 'lcov',
                    subdir: 'coverage'
                },
                {
                    type: 'text-summary'
                }
            ]
        },


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        // Note: 如果要调试Karma，请设置为DEBUG
        logLevel: config.LOG_INFO,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            'PhantomJS'
        ],


        // enable / disable watching file and executing tests whenever any file changes
        // Note: 代码改动自动运行测试，需要singleRun为false
        autoWatch: false,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        // 脚本调用请设为 true
        singleRun: true
    };
};
