<div align="center">

<a href="https://layui.dev">
  <img src="https://unpkg.com/outeres@0.1.0/img/layui/logo-icon.png" width="81" alt="Layui">
</a>

</div>

# Layui

[中文](./README.md) · English

Classic modular front-end UI library

<p>
  <a href="https://github.com/layui/layui/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/layui/layui" alt="License">
  </a>
  <a href="https://github.com/layui/layui/releases">
    <img src="https://badgen.net/github/release/layui/layui" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/layui">
    <img src="https://img.shields.io/badge/npm-package-red" alt="NPM">
  </a>
</p>

> Layui constitutes an open-source, freely available Web UI component library implementing its distinct lightweight modular specification. It adheres rigorously to the vanilla `HTML/CSS/JavaScript` development paradigm, thereby affording unparalleled ease of adoption and immediate usability. Characterized by a minimalist, lightweight aesthetic, the framework's core exudes elegance and richness, with each and every detail, inclusive of documentation, meticulously curated to facilitate swift assembly of web interfaces. Distinguishing itself from prevailing mainstream front-end frameworks, Layui does not contravene established principles but rather espouses a philosophy of reverting to fundamental simplicity. Specifically, it caters to pragmatic individuals with a penchant for simplicity, obviating the need for engagement with diverse build tools. it empowers users to intuitively harness and orchestrate the requisite page elements and interactive behaviors directly within the browser environment.

## Usage

To use Layui, simply include the core files in your page, such as:

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

## Documentation

[**Current version**](https://layui.dev/docs/2/)

## Contributors

[Project contributors](https://github.com/layui/layui/graphs/contributors)

## Break with the old and establish the new 🌱

On October 14, 2016, Layui released its first version `1.0.0`, after which it was widely adopted across web platforms.

On October 13, 2021, Layui announced the decommissioning of its original official website (<a href="https://unpkg.com/outeres@0.0.7/img/layui/notice-2021.png" target="_blank">details</a>) and migrated its documentation site to Gitee Pages. Concurrently, community management and daily maintenance activities were fully transitioned to both Gitee and Github platforms, encouraging users to embrace other superior mainstream frameworks. This move inadvertently led some to believe that Layui had ceased updates. In reality, since then, Layui has remained active on Github and Gitee, never halting updates, progressing from version `2.6.8` at the time to its current latest release.

On April 24, 2023, Layui released version `2.8.0` officially and launched a [new documentation site](https://layui.dev). This marked a sincere comeback and a continuation of its commitment to open-source ideals. We still uphold the perspective expressed in the announcement two years ago, advocating that developers embrace mainstream technologies and nurture an unwavering passion for cutting-edge advancements. **What Layui does is to fill those narrow gaps outside the mainstream**. Although not a mainstream frontend framework, Layui has long transcended being a personal creation of its author, becoming a collective work of all who persist in using it. It continues to underpin numerous projects and represents the efforts of many individuals. As open-source creators, we should walk alongside these dedicated Layui developers.

In the future, Layui will steadfastly accompany all those who hold it dear, jointly substantiating the feasibility of the Layui development model.

## License

Layui is released under the [MIT](https://opensource.org/licenses/MIT) license. Other relevant agreements may also refer to the [Disclaimer](https://gitee.com/layui/layui/blob/main/DISCLAIMER.md).
