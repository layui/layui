/**
 * Layui IIFE 入口
 */

// 导入核心模块
import { layui } from './core/layui.js';
import { lay } from './core/lay.js';
import { laytpl } from './core/laytpl.js';
import { i18n } from './core/i18n.js';
import { default as jquery, default as $ } from 'jquery';
import { componentBuilder } from './core/component.js';

// 导入组件模块
import { laypage } from './components/laypage.js';
import { laydate } from './components/laydate.js';
import { layer } from './components/layer.js';
import { dropdown } from './components/dropdown.js';
import { slider } from './components/slider.js';
import { colorpicker } from './components/colorpicker.js';
import { tab } from './components/tab.js';
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
import { util } from './components/util.js';
import { code } from './components/code.js';

// 兼容 v2
window.layui = layui;
window.lay = lay;
window.layer = layer;
layui.$ = jquery;

Object.assign(layui, {
  lay,
  laytpl,
  i18n,
  $,
  jquery,
  component: componentBuilder, // 兼容
  componentBuilder,
  layer,
  laydate,
  laypage,
  dropdown,
  slider,
  colorpicker,
  tab,
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
  util,
  code,
});

export default layui;
