<div align="center">

<a href="https://layui.dev">
  <img src="https://unpkg.com/outeres@0.1.0/img/layui/logo-icon.png" width="81" alt="Layui">
</a>

<h1>Layui</h1>

Classic modular front-end UI library

<p>
  <a href="https://www.npmjs.com/package/layui">
    <img src="https://img.shields.io/npm/v/layui" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/layui">
    <img src="https://img.shields.io/github/license/layui/layui" alt="License">
  </a>
  <a href="https://github.com/layui/layui/blob/2.x/dist/css/layui.css">
    <img src="https://img.badgesize.io/layui/layui/2.x/dist/css/layui.css?compression=brotli&label=CSS%20Brotli%20size" alt="CSS Brotli size">
  </a>
  <a href="https://github.com/layui/layui/blob/2.x/dist/layui.js">
    <img src="https://img.badgesize.io/layui/layui/2.x/dist/layui.js?compression=brotli&label=JS%20Brotli%20size" alt="JS Brotli size">
  </a>
</p>

[中文](./README.md) · English

</div>

---

Layui is a set of open source and free Web UI component libraries. It adopts its own lightweight modular specifications and follows the original HTML/CSS/JavaScript development model. It is very easy to get started and can be used out of the box. Its style is simple and light, but its inner elegance is rich. Every detail, including documents, has been carefully crafted, making it very suitable for the rapid construction of web interfaces. Layui is different from many mainstream front-end frameworks, but it does not go against the trend, but believes in returning to nature. To be precise, it is more aimed at pragmatists who pursue simplicity. That is, there is no need to get involved in various construction tools. Just face the browser itself, and you can get the elements and interactions that the page needs to present at your fingertips.

## Get started quickly

To use Layui, you only need to introduce core files into the page:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Quick Start - Layui</title>
    <link href="./layui/css/layui.css" rel="stylesheet" />
  </head>
  <body>
    <!-- HTML Content -->
    <script src="./layui/layui.js"></script>
    <script>
      // Usage
      layui.use(function () {
        var layer = layui.layer;
        // Welcome
        layer.msg("Hello World", { icon: 6 });
      });
    </script>
  </body>
</html>
```

## Use documentation

[**Current Version Documentation**](https://layui.dev/docs/2/)

## Project participation

[project participants](https://github.com/layui/layui/graphs/contributors)

## Break the old and create the new 🌱

On October 14, 2016, Layui released the first version of `1.0.0`, which has been widely used in many web platforms for many years.

On October 13, 2021, Layui issued an announcement that the original official website was offline (<a href="https://unpkg.com/outeres@0.0.7/img/layui/notice-2021.png" target="_blank ">Introduction</a>), and the documentation site was switched to Gitee Pages. The community and daily maintenance were also fully transferred to Gitee and Github platforms. This called on everyone to embrace other better mainstream frameworks, leading everyone to mistakenly think that Layui has stopped updating. . In fact, since then, Layui has still remained active on Github and Gitee, and there is no so-called cessation of updates. It has been continuously iterated from `2.6.8` at that time to the latest version today.

On April 24, 2023, Layui released the official version of `2.8.0` and launched [new documentation site] (https://layui.dev). This is a simple return and a continuation of feelings. But we still adhere to the point of view in the announcement two years ago, that is, we still recommend that everyone embrace the mainstream and always maintain an infinite love for cutting-edge technology, which is a thinking attribute that developers should possess. **What Layui does is to fill those slightly narrow gaps outside the mainstream**. Although Layui is not the front-end mainstream, it is no longer the author's personal Layui, but the Layui of all those who still insist on using it. It still supports many projects and represents the work of many people. As an open source creator, you should watch for these persisters.

In the future, Layui will continue to accompany all those who love it to jointly demonstrate the feasibility of the Layui development model.

## Open Source License

Layui is released under the [MIT](https://opensource.org/licenses/MIT) license. For other relevant agreements, please refer to "[Disclaimer](https://gitee.com/layui/layui/blob/main/DISCLAIMER.md)".
