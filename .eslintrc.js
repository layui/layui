module.exports = {
  "extends": "airbnb/legacy",
  "plugins": [
    "mocha",
    "jsdoc",
  ],
  "rules": {
    // 关闭方法的参数赋值检测
    "no-param-reassign": "off",

    // 关闭方法必须有名称
    "func-names": "off",

    // 关闭表达式
    "no-unused-expressions": "off",

    // JSDoc
    "jsdoc/check-param-names": 1,
    "jsdoc/check-tag-names": 1,
    "jsdoc/check-types": 1,
    "jsdoc/newline-after-description": 1,
    "jsdoc/no-undefined-types": 1,
    "jsdoc/require-description-complete-sentence": 0,
    "jsdoc/require-example": 0,
    "jsdoc/require-hyphen-before-param-description": 0,
    "jsdoc/require-param": 1,
    "jsdoc/require-param-description": 1,
    "jsdoc/require-param-name": 1,
    "jsdoc/require-param-type": 1,
    "jsdoc/require-returns-description": 0,
    "jsdoc/require-returns-type": 1,
    "jsdoc/valid-types": 1,
  },
  "env": {
    "mocha": true,
    "browser": true,
  },
  "globals": {
    "expect": true,
    "layui": true,
  },
  "settings": {
    "jsdoc": {
      "tagNamePreference": {
        "returns": "return"
      }
    }
  },
};
