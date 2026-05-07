/**
 * Layui UMD 入口
 */

// 导入核心模块
import { lay, use, version } from './core/lay.js';
import { loader } from './core/loader.js';
import { laytpl } from './core/laytpl.js';
import { i18n } from './core/i18n.js';
import { router } from './core/router.js';
import { default as jquery, default as $ } from 'jquery';
import { component, componentBuilder } from './core/component.js';

// 导入工具模块
import * as utils from './utils/index.js';

// 导入组件模块
import { layer } from './components/layer.js';
import { laydate } from './components/laydate.js';
import { laypage } from './components/laypage.js';
import { dropdown } from './components/dropdown.js';
import { slider } from './components/slider.js';
import { colorpicker } from './components/colorpicker.js';
import { nav } from './components/nav.js';
import { breadcrumb } from './components/breadcrumb.js';
import { progress } from './components/progress.js';
import { collapse } from './components/collapse.js';
import { element } from './components/element.js';
import { upload } from './components/upload.js';
import { form } from './components/form.js';
import { table } from './components/table.js';
import { treeTable } from './components/treeTable.js';
import { tabs } from './components/tabs.js';
import { tree } from './components/tree.js';
import { transfer } from './components/transfer.js';
import { carousel } from './components/carousel.js';
import { rate } from './components/rate.js';
import { flow } from './components/flow.js';
import { floatbar } from './components/floatbar.js';
import { code } from './components/code.js';

const layui = {
  lay,
  use,
  version,
  loader,
  laytpl,
  i18n,
  router,
  $,
  jquery,
  component,
  componentBuilder,
  utils,
  layer,
  laydate,
  laypage,
  dropdown,
  slider,
  colorpicker,
  nav,
  breadcrumb,
  progress,
  collapse,
  element,
  upload,
  form,
  table,
  treeTable,
  tabs,
  tree,
  transfer,
  carousel,
  rate,
  flow,
  floatbar,
  code,
};

export default layui;
