/**
 * layui.treeTable
 * 树表组件
 */

layui.define(['table'], function (exports) {
  "use strict";

  var $ = layui.$;
  var form = layui.form;
  var table = layui.table;
  var hint = layui.hint();

  // api
  var treeTable = {
    config: {},
    // 事件
    on: table.on,
    // 遍历字段
    eachCols: table.eachCols,
    index: table.index,
    set: function (options) {
      var that = this;
      that.config = $.extend({}, that.config, options);
      return that;
    },
    resize: table.resize
  };

  // 操作当前实例
  var thisTreeTable = function () {
    var that = this
      , options = that.config
      , id = options.id || options.index;

    return {
      config: options,
      reload: function (options, deep) {
        that.reload.call(that, options, deep);
      },
      reloadData: function (options, deep) {
        treeTable.reloadData(id, options, deep);
      }
    }
  }

  // 获取当前实例
  var getThisTable = function (id) {
    var that = thisTreeTable.that[id];
    if (!that) hint.error(id ? ('The treeTable instance with ID \'' + id + '\' not found') : 'ID argument required');
    return that || null;
  }

  // 获取当前实例配置项
  var getThisTableConfig = function (id) {
    return getThisTable(id).config;
  }

  // 字符
  var MOD_NAME = 'treeTable'
    , ELEMTREE = '.layui-table-tree'
    , THIS = 'layui-this'
    , SHOW = 'layui-show'
    , HIDE = 'layui-hide'
    , HIDE_V = 'layui-hide-v'
    , DISABLED = 'layui-disabled'
    , NONE = 'layui-none'

    , ELEM_VIEW = '.layui-table-view'
    , ELEM_TOOL = '.layui-table-tool'
    , ELEM_BOX = '.layui-table-box'
    , ELEM_INIT = '.layui-table-init'
    , ELEM_HEADER = '.layui-table-header'
    , ELEM_BODY = '.layui-table-body'
    , ELEM_MAIN = '.layui-table-main'
    , ELEM_FIXED = '.layui-table-fixed'
    , ELEM_FIXL = '.layui-table-fixed-l'
    , ELEM_FIXR = '.layui-table-fixed-r'
    , ELEM_TOTAL = '.layui-table-total'
    , ELEM_PAGE = '.layui-table-page'
    , ELEM_SORT = '.layui-table-sort'
    , ELEM_EDIT = 'layui-table-edit'
    , ELEM_HOVER = 'layui-table-hover'
    , ELEM_GROUP = 'laytable-cell-group'

  var LAY_DATA_INDEX = 'LAY_DATA_INDEX';
  var LAY_DATA_INDEX_HISTORY = 'LAY_DATA_INDEX_HISTORY';
  var LAY_PARENT_INDEX = 'LAY_PARENT_INDEX';
  var LAY_CHECKBOX_HALF = 'LAY_CHECKBOX_HALF';
  var LAY_EXPAND = 'LAY_EXPAND';
  var LAY_HAS_EXPANDED = 'LAY_HAS_EXPANDED';

  // 构造器
  var Class = function (options) {
    var that = this;
    that.index = ++treeTable.index;
    that.config = $.extend(true, {}, that.config, treeTable.config, options);
    // 处理一些属性
    that.init();
    that.render();
  };

  var updateCache = function (id, childrenKey, data) {
    var tableCache = table.cache[id];
    layui.each(data || tableCache, function (index, item) {
      var itemDataIndex = item[LAY_DATA_INDEX];
      if (itemDataIndex.indexOf('-') !== -1) {
        tableCache[itemDataIndex] = item
      }
      item[childrenKey] && updateCache(id, childrenKey, item[childrenKey]);
    })
  }

  Class.prototype.init = function () {
    var that = this;
    var options = that.config;

    // 先初始一个空的表格以便拿到对应的表格实例信息
    var tableIns = table.render($.extend({}, options, {
      data: [],
      url: '',
      done: null
    }))
    var id = tableIns.config.id;
    thisTreeTable.that[id] = that; // 记录当前实例对象
    that.tableIns = tableIns;

    var treeOptions = options.tree;
    var isParentKey = treeOptions.data.key.isParent;
    var childrenKey = treeOptions.data.key.children;

    // 处理属性
    var parseData = options.parseData;
    var done = options.done;

    if (options.url) {
      // 异步加载的时候需要处理parseData进行转换
      options.parseData = function () {
        var parseDataThat = this;
        var args = arguments;
        var retData = args[0];
        if (layui.type(parseData) === 'function') {
          retData = parseData.apply(parseDataThat, args) || args[0];
        }
        var dataName = parseDataThat.response.dataName;
        // 处理simpleData
        if (treeOptions.data.simpleData.enable && !treeOptions.async.enable) { // 异步加载和simpleData不应该一起使用
          retData[dataName] = that.flatToTree(retData[dataName]);
        }

        that.initData(retData[dataName]);

        return retData;
      }
    } else {
      options.data = options.data || [];
      // 处理simpleData
      if (treeOptions.data.simpleData.enable) {
        options.data = that.flatToTree(options.data);
      }
      if (options.initSort && options.initSort.type) {
        options.data = layui.sort(options.data, options.initSort.field, options.initSort.type === 'desc')
      }
      that.initData(options.data);
    }

    options.done = function () {
      var args = arguments;
      var doneThat = this;

      var tableView = this.elem.next();
      that.updateStatus(null, {
        LAY_HAS_EXPANDED: false // 去除已经打开过的状态
      });
      // 更新cache中的内容 将子节点也存到cache中
      updateCache(id, childrenKey);
      // 更新全选框的状态
      var layTableAllChooseElem = tableView.find('[name="layTableCheckbox"][lay-filter="layTableAllChoose"]');
      if (layTableAllChooseElem.length) {
        var checkStatus = treeTable.checkStatus(id);
        layTableAllChooseElem.prop({
          checked: checkStatus.isAll && checkStatus.data.length,
          indeterminate: !checkStatus.isAll && checkStatus.data.length
        })
      }

      that.renderTreeTable(tableView);

      if (layui.type(done) === 'function') {
        return done.apply(doneThat, args);
      }
    }
  }

  // 初始默认配置
  Class.prototype.config = {
    tree: {
      view: {
        indent: 14, // 层级缩进量
        flexIconClose: '<i class="layui-icon layui-icon-triangle-r"></i>', // 关闭时候的折叠图标
        flexIconOpen: '<i class="layui-icon layui-icon-triangle-d"></i>', // 打开时候的折叠图标
        showIcon: true, // 是否显示图标(节点类型图标)
        icon: '', // 节点图标，如果设置了这个属性或者数据中有这个字段信息，不管打开还是关闭都以这个图标的值为准
        iconClose: '<i class="layui-icon layui-icon-folder-open"></i>', // 打开时候的图标
        iconOpen: '<i class="layui-icon layui-icon-folder"></i>', // 关闭时候的图标
        iconLeaf: '<i class="layui-icon layui-icon-leaf"></i>', // 叶子节点的图标
        showFlexIconIfNotParent: false, // 当节点不是父节点的时候是否显示折叠图标
        dblClickExpand: true, // 双击节点时，是否自动展开父节点的标识
      },
      data: {
        key: {
          checked: 'LAY_CHECKED', // 节点数据中保存 check 状态的属性名称
          children: "children", // 节点数据中保存子节点数据的属性名称
          isParent: "isParent", // 节点数据保存节点是否为父节点的属性名称
          isHidden: "hidden", // 节点数据保存节点是否隐藏的属性名称
          name: "name", // 节点数据保存节点名称的属性名称
          title: "", // 节点数据保存节点提示信息的属性名称
          url: "url", // 节点数据保存节点链接的目标 URL 的属性名称
        },
        simpleData: {
          enable: false, // 是否简单数据模式
          idKey: "id", // 唯一标识的属性名称
          pIdKey: "parentId",
          rootPId: null
        }
      },
      async: {
        enable: false, // 是否开启异步加载模式，只有开启的时候其他参数才起作用
        url: '', // 异步加载的接口，可以根据需要设置与顶层接口不同的接口，如果相同可以不设置该参数
        type: null, // 请求的接口类型，设置可缺省同上
        contentType: null, // 提交参数的数据类型，设置可缺省同上
        headers: null, // 设置可缺省同上
        where: null, // 设置可缺省同上
        autoParam: [], // 自动参数
      },
      callback: {
        beforeExpand: null, // 展开前的回调 return false 可以阻止展开的动作
        onExpand: null, // 展开之后的回调
      }
    },
    autoSort: false
  };

  Class.prototype.getOptions = function () {
    var that = this;
    if (that.tableIns) {
      return table.getOptions(that.tableIns.config.id); // 获取表格的实时配置信息
    } else {
      return that.config;
    }
  };

  function flatToTree(flatArr, idKey, pIdKey, childrenKey, rootPId) {
    idKey = idKey || 'id';
    pIdKey = pIdKey || 'parentId';
    childrenKey = childrenKey || 'children';
    // 创建一个空的 nodes 对象，用于保存所有的节点
    var nodes = {};
    // 遍历所有节点，将其加入 nodes 对象中
    layui.each(flatArr, function (index, item) {
      nodes[item[idKey]] = $.extend({}, item);
      nodes[item[idKey]][childrenKey] = [];
    })
    // 遍历所有节点，将其父子关系加入 nodes 对象
    layui.each(nodes, function (index, item) {
      if (item[pIdKey] && nodes[item[pIdKey]]) {
        nodes[item[pIdKey]][childrenKey].push(item);
      }
    })
    // 返回顶层节点
    return Object.values(nodes).filter(function (item) {
      return rootPId ? item[pIdKey] === rootPId : !item[pIdKey];
    })
  }

  Class.prototype.flatToTree = function (tableData) {
    var that = this;
    var options = that.getOptions();
    var treeOptions = options.tree;
    var simpleDataOptions = treeOptions.data.simpleData;
    var tableId = options.id;

    tableData = tableData || table.cache[tableId];

    return flatToTree(tableData, simpleDataOptions.idKey, simpleDataOptions.pIdKey, treeOptions.data.key.children, simpleDataOptions.rootPId)
  }

  Class.prototype.treeToFlat = function (tableData, parentId, parentIndex) {
    var that = this;
    var options = that.getOptions();
    var treeOptions = options.tree;
    var childrenKey = treeOptions.data.key.children;
    var pIdKey = treeOptions.data.simpleData.pIdKey;

    var flat = [];
    layui.each(tableData, function (i1, item1) {
      var dataIndex = (parentIndex ? parentIndex + '-' : '') + i1;
      var dataNew = $.extend({}, item1);
      dataNew[childrenKey] = null;
      dataNew[pIdKey] = item1[pIdKey] || parentId;
      flat.push(dataNew);
      flat = flat.concat(that.treeToFlat(item1[childrenKey], item1[treeOptions.data.simpleData.idKey], dataIndex));
    });

    return flat;
  }

  // 通过index获取节点数据
  Class.prototype.getNodeDataByIndex = function (index, clone, newValue) {
    var that = this;
    var options = that.getOptions();
    var treeOptions = options.tree;
    var tableId = options.id;

    var dataCache = table.cache[tableId][index];
    if (newValue !== 'delete' && dataCache) {
      return clone ? $.extend({}, dataCache) : dataCache;
    }

    var tableData = that.getTableData();
    index += '';
    var indexArr = index.split('-');

    var dataRet = tableData;
    var tableCache = (options.url || indexArr.length > 1) ? null : table.cache[tableId]; // 只有在删除根节点的时候才需要处理
    for (var i = 0, childrenKey = treeOptions.data.key.children; i < indexArr.length; i++) {
      if (newValue && i === indexArr.length - 1) {
        if (newValue === 'delete') {
          // 删除
          if (tableCache) {
            // 同步cache
            // tableCache.splice(tableCache.findIndex(function (value) {
            //   return value[LAY_DATA_INDEX] === index;
            // }), 1);
            layui.each(tableCache, function (i1, item1) {
              if (item1[LAY_DATA_INDEX] === index) {
                tableCache.splice(i1, 1);
                return true;
              }
            })
          }
          return (i ? dataRet[childrenKey] : dataRet).splice(indexArr[i], 1)[0];
        } else {
          // 更新值
          $.extend((i ? dataRet[childrenKey] : dataRet)[indexArr[i]], newValue);
        }
      }
      dataRet = i ? dataRet[childrenKey][indexArr[i]] : dataRet[indexArr[i]];
    }
    return clone ? $.extend({}, dataRet) : dataRet;
  }

  treeTable.getNodeDataByIndex = function (id, index) {
    var that = getThisTable(id);
    if(!that) return;
    return that.getNodeDataByIndex(index, true);
  }

  // 判断是否是父节点
  var checkIsParent = function (data, isParentKey, childrenKey) {
    isParentKey = isParentKey || 'isParent';
    childrenKey = childrenKey || 'children';
    layui.each(data, function (i1, item1) {
      if (!(isParentKey in item1)) {
        item1[isParentKey] = !!(item1[childrenKey] && item1[childrenKey].length);
        checkIsParent(item1[childrenKey]);
      }
    })
  }

  Class.prototype.initData = function (data, parentIndex) {
    var that = this;
    var options = that.getOptions();
    var treeOptions = options.tree;
    var tableId = options.id;
    data = data || that.getTableData();
    var isParentKey = treeOptions.data.key.isParent;
    var childrenKey = treeOptions.data.key.children;

    layui.each(data, function (i1, item1) {
      if (!(isParentKey in item1)) {
        item1[isParentKey] = !!(item1[childrenKey] && item1[childrenKey].length);
      }
      item1[LAY_DATA_INDEX_HISTORY] = item1[LAY_DATA_INDEX];
      item1[LAY_PARENT_INDEX] = parentIndex = parentIndex || '';
      var dataIndex = item1[LAY_DATA_INDEX] = (parentIndex ? parentIndex + '-' : '') + i1;
      that.initData(item1[childrenKey] || [], dataIndex);
    });

    parentIndex || updateCache(tableId, childrenKey);

    return data;
  }

  var expandNode = function (treeNode, expandFlag, sonSign, focus, callbackFlag) {
    // treeNode // 需要展开的节点
    var trElem = treeNode.trElem;
    var tableViewElem = trElem.closest(ELEM_VIEW);
    var tableViewFilterId = tableViewElem.attr('lay-filter');
    var tableId = tableViewElem.attr('lay-id');
    var options = table.getOptions(tableId);
    var treeOptions = options.tree || {};
    var isParentKey = treeOptions.data.key.isParent;
    var trIndex = trElem.attr('lay-data-index'); // 可能出现多层
    var treeTableThat = getThisTable(tableId);
    var tableData = treeTableThat.getTableData();

    var trData = treeTableThat.getNodeDataByIndex(trIndex);

    var dataLevel = trElem.data('level');
    var dataLevelNew = (dataLevel || 0) + 1;

    // 后续调优：对已经展开的节点进行展开和已经关闭的节点进行关闭应该做优化减少不必要的代码执行 todo
    var isToggle = layui.type(expandFlag) !== 'boolean';
    var trExpand = isToggle ? !trData[LAY_EXPAND] : expandFlag;
    var retValue = trData[isParentKey] ? trExpand : null;

    if (callbackFlag && trExpand != trData[LAY_EXPAND] && (!trData['LAY_ASYNC_STATUS'] || trData['LAY_ASYNC_STATUS'] === 'local')) {
      var beforeExpand = treeOptions.callback.beforeExpand;
      if (layui.type(beforeExpand) === 'function') {
        if (beforeExpand(tableId, trData, expandFlag) === false) {
          return retValue;
        }
      }
    }

    var trExpanded = trData[LAY_HAS_EXPANDED]; // 展开过，包括异步加载

    // 找到表格中的同类节点（需要找到lay-data-index一致的所有行）
    var trsElem = tableViewElem.find('tr[lay-data-index="' + trIndex + '"]');
    // 处理折叠按钮图标
    var flexIconElem = trsElem.find('.layui-table-tree-flexIcon');
    flexIconElem.html(trExpand ? treeOptions.view.flexIconOpen : treeOptions.view.flexIconClose)
    trData[isParentKey] && flexIconElem.css('visibility', 'visible');
    // 处理节点图标
    if (treeOptions.view.showIcon && trData[isParentKey] && !trData.icon && !treeOptions.view.icon) {
      var nodeIconElem = trsElem.find('.layui-table-tree-nodeIcon');
      nodeIconElem.html(trExpand ? treeOptions.view.iconOpen : treeOptions.view.iconClose);
    }

    var childNodes = trData[treeOptions.data.key.children] || []; // 测试用后续需要改成子节点的字段名称
    // 处理子节点展示与否
    if (trExpand) {
      // 展开
      if (trExpanded) { // 已经展开过
        trData[LAY_EXPAND] = trExpand;
        tableViewElem.find(childNodes.map(function (value, index, array) {
          return 'tr[lay-data-index="' + value[LAY_DATA_INDEX] + '"]'
        }).join(',')).removeClass('layui-hide');
        layui.each(childNodes, function (i1, item1) {
          if (sonSign && !isToggle) { // 非状态切换的情况下
            // 级联展开子节点
            expandNode({trElem: tableViewElem.find('tr[lay-data-index="' + item1.LAY_DATA_INDEX + '"]').first()}, expandFlag, sonSign, focus, callbackFlag);
          } else if (item1[LAY_EXPAND]) {
            // 级联展开
            expandNode({trElem: tableViewElem.find('tr[lay-data-index="' + item1.LAY_DATA_INDEX + '"]').first()}, true);
          }
        })
      } else {
        var asyncSetting = treeOptions.async || {};
        var asyncUrl = asyncSetting.url || options.url;
        // 提供一个能支持用户在获取子数据转换调用的回调，这样让子节点数据获取更加灵活 todo
        if (asyncSetting.enable && asyncUrl && !trData['LAY_ASYNC_STATUS']) {
          trData['LAY_ASYNC_STATUS'] = 'loading';
          var params = {};
          // 参数
          var data = $.extend(params, asyncSetting.where || options.where);
          var asyncAutoParam = asyncSetting.autoParam;
          layui.each(asyncAutoParam, function (index, item) {
            var itemStr = item;
            var itemArr = item.split('=');
            data[itemArr[0].trim()] = trData[(itemArr[1] || itemArr[0]).trim()]
          })

          var asyncContentType = asyncSetting.contentType || options.contentType;
          if (asyncContentType && asyncContentType.indexOf("application/json") == 0) { // 提交 json 格式
            data = JSON.stringify(data);
          }
          var asyncType = asyncSetting.method || options.method;
          var asyncDataType = asyncSetting.dataType || options.dataType;
          var asyncJsonpCallback = asyncSetting.jsonpCallback || options.jsonpCallback;
          var asyncHeaders = asyncSetting.headers || options.headers;
          var asyncParseData = asyncSetting.parseData || options.parseData;
          var asyncResponse = asyncSetting.response || options.response;

          // that.loading();
          flexIconElem.html('<i class="layui-icon layui-icon-loading layui-anim layui-anim-loop layui-anim-rotate"></i>')
          $.ajax({
            type: asyncType || 'get'
            , url: asyncUrl
            , contentType: asyncContentType
            , data: data
            , dataType: asyncDataType || 'json'
            , jsonpCallback: asyncJsonpCallback
            , headers: asyncHeaders || {}
            , success: function (res) {
              trData['LAY_ASYNC_STATUS'] = 'success';
              // 若有数据解析的回调，则获得其返回的数据
              if (typeof asyncParseData === 'function') {
                res = asyncParseData.call(options, res) || res;
              }
              // 检查数据格式是否符合规范
              if (res[asyncResponse.statusName] != asyncResponse.statusCode) {
                trData['LAY_ASYNC_STATUS'] = 'error';
                // 异常处理 todo
                flexIconElem.html('<i class="layui-icon layui-icon-refresh"></i>');
                // 事件
              } else {
                trData[treeOptions.data.key.children] = res[asyncResponse.dataName];
                treeTableThat.initData(trData[treeOptions.data.key.children], trData[LAY_DATA_INDEX])
                // 正常返回
                expandNode(treeNode, true, isToggle ? false : sonSign, focus, callbackFlag);
              }
            }
            , error: function (e, msg) {
              trData['LAY_ASYNC_STATUS'] = 'error';
              // 异常处理 todo
              typeof options.error === 'function' && options.error(e, msg);
            }
          });
          return retValue;
        }
        trData[LAY_EXPAND] = trExpand;
        trExpanded = trData[LAY_HAS_EXPANDED] = true;
        if (childNodes.length) {
          // 判断是否需要排序
          if (options.initSort && !options.url) {
            var initSort = options.initSort;
            if (initSort.type) {
              childNodes = trData[treeOptions.data.key.children] = layui.sort(childNodes, initSort.field, initSort.type === 'desc');
            } else {
              // 恢复默认
              childNodes = trData[treeOptions.data.key.children] = layui.sort(childNodes, table.config.indexName);
            }
          }
          treeTableThat.initData(trData[treeOptions.data.key.children], trData[LAY_DATA_INDEX]);
          // 将数据通过模板得出节点的html代码
          var str2 = table.getTrHtml(tableId, childNodes, null, null, trIndex);

          var str2Obj = {
            trs: $(str2.trs.join('')),
            trs_fixed: $(str2.trs_fixed.join('')),
            trs_fixed_r: $(str2.trs_fixed_r.join(''))
          }
          layui.each(childNodes, function (childIndex, childItem) {
            str2Obj.trs.eq(childIndex).attr({
              'data-index': childItem[LAY_DATA_INDEX],
              'lay-data-index': childItem[LAY_DATA_INDEX],
              'data-level': dataLevelNew
            })
            str2Obj.trs_fixed.eq(childIndex).attr({
              'data-index': childItem[LAY_DATA_INDEX],
              'lay-data-index': childItem[LAY_DATA_INDEX],
              'data-level': dataLevelNew
            })
            str2Obj.trs_fixed_r.eq(childIndex).attr({
              'data-index': childItem[LAY_DATA_INDEX],
              'lay-data-index': childItem[LAY_DATA_INDEX],
              'data-level': dataLevelNew
            })
          })

          tableViewElem.find(ELEM_MAIN).find('tbody tr[lay-data-index="' + trIndex + '"]').after(str2Obj.trs);
          tableViewElem.find(ELEM_FIXL).find('tbody tr[lay-data-index="' + trIndex + '"]').after(str2Obj.trs_fixed);
          tableViewElem.find(ELEM_FIXR).find('tbody tr[lay-data-index="' + trIndex + '"]').after(str2Obj.trs_fixed_r);

          // 初始化新增的节点中的内容
          layui.each(str2Obj, function (key, item) {
            treeTableThat.renderTreeTable(item, dataLevelNew);
          })

          if (sonSign && !isToggle) { // 非状态切换的情况下
            // 级联展开/关闭子节点
            layui.each(childNodes, function (i1, item1) {
              expandNode({trElem: tableViewElem.find('tr[lay-data-index="' + item1.LAY_DATA_INDEX + '"]').first()}, expandFlag, sonSign, focus, callbackFlag);
            })
          }
        }
      }
    } else {
      trData[LAY_EXPAND] = trExpand;
      // 折叠
      if (sonSign && !isToggle) { // 非状态切换的情况下
        layui.each(childNodes, function (i1, item1) {
          expandNode({trElem: tableViewElem.find('tr[lay-data-index="' + item1.LAY_DATA_INDEX + '"]').first()}, expandFlag, sonSign, focus, callbackFlag);
        });
        tableViewElem.find(childNodes.map(function (value, index, array) { // 只隐藏直接子节点，其他由递归的处理
          return 'tr[lay-data-index="' + value[LAY_DATA_INDEX] + '"]'
        }).join(',')).addClass('layui-hide');
      } else {
        var childNodesFlat = treeTableThat.treeToFlat(childNodes, trData[treeOptions.data.simpleData.idKey], trIndex);
        tableViewElem.find(childNodesFlat.map(function (value, index, array) {
          return 'tr[lay-data-index="' + value[LAY_DATA_INDEX] + '"]'
        }).join(',')).addClass('layui-hide');
      }

    }
    table.resize(tableId);

    if (callbackFlag && trData['LAY_ASYNC_STATUS'] !== 'loading') {
      var onExpand = treeOptions.callback.onExpand;
      layui.type(onExpand) === 'function' && onExpand(tableId, trData, expandFlag);
    }

    return retValue;
  }

  treeTable.expandNode = function (id, opts) {
    var that = getThisTable(id);
    if(!that) return;

    opts = opts || {};

    var index = opts.index;
    var expandFlag = opts.expandFlag;
    var sonSign = opts.sonSign;
    var callbackFlag = opts.callbackFlag;


    var options = that.getOptions();
    var tableViewElem = options.elem.next();
    return expandNode({trElem: tableViewElem.find('tr[lay-data-index="' + index + '"]').first()}, expandFlag, sonSign, null, callbackFlag)
  };

  // 目前还有性能问题特别是在data模式需要优化暂时不能使用 todo
  treeTable.expandAll = function (id, expandFlag) {
    if (layui.type(expandFlag) !== 'boolean') {
      return hint.error('expandAll的展开状态参数只接收true/false')
    }
    
    var that = getThisTable(id);
    if(!that) return;

    var options = that.getOptions();
    var treeOptions = options.tree;
    var tableView = options.elem.next();

    if (!expandFlag) {
      // 关闭所有
      // 将所有已经打开的节点的状态设置为关闭，
      that.updateStatus(null, {LAY_EXPAND: false}); // 只处理当前页，如果需要处理全部表格，需要用treeTable.updateStatus
      // 隐藏所有非顶层的节点
      tableView.find('tbody tr[data-level!="0"]').addClass('layui-hide');
      // 处理顶层节点的图标
      var trLevel0 = tableView.find('tbody tr[data-level="0"]');
      trLevel0.find('.layui-table-tree-flexIcon').html(treeOptions.view.flexIconClose);
      trLevel0.find('.layui-table-tree-nodeIcon').html(treeOptions.view.iconClose);

      treeTable.resize();
    } else {
      return hint.error('暂不支持展开全部');
      
      // 展开所有
      if (treeOptions.async.enable) {
        // 存在异步加载

      } else {
        // 先判断是否全部打开过了
        var tableDataFlat = treeTable.getData(id, true);
        var isAllExpanded = true;
        layui.each(tableDataFlat, function (i1, item1) {
          if (!item1[LAY_HAS_EXPANDED]) {
            isAllExpanded = false;
            return true;
          }
        })
        // 如果全部节点已经都打开过，就可以简单处理跟隐藏所有节点反操作
        if (isAllExpanded) {
          that.updateStatus(null, {LAY_EXPAND: true}); // 只处理当前页，如果需要处理全部表格，需要用treeTable.updateStatus
          // 隐藏所有非顶层的节点
          tableView.find('tbody tr[data-level!="0"]').removeClass('layui-hide');
          // 处理顶层节点的图标
          // var trLevel0 = tableView.find('tbody tr[data-level="0"]');
          tableView.find('.layui-table-tree-flexIcon').html(treeOptions.view.flexIconOpen);
          tableView.find('.layui-table-tree-nodeIcon').html(treeOptions.view.iconOpen);

          treeTable.resize();
        } else {
          // 如果有未打开过的父节点，将内容全部生成
          that.updateStatus(null, {LAY_EXPAND: true, LAY_HAS_EXPANDED: true});
          var trsAll = table.getTrHtml(id, tableDataFlat);

        }

      }


      // 如果是异步加载子节点模式 如何处理
      // 如果有部分节点未打开过，也需要重新
    }

  }

  Class.prototype.renderTreeTable = function (tableView, level, sonSign) {
    var that = this;
    var options = that.getOptions();
    var tableViewElem = options.elem.next();
    tableViewElem.addClass('layui-table-tree');
    var tableId = options.id;
    var treeOptions = options.tree || {};
    var treeOptionsData = treeOptions.data || {};
    var treeOptionsView = treeOptions.view || {};
    var isParentKey = treeOptionsData.key.isParent;
    var tableFilterId = tableViewElem.attr('lay-filter');
    var treeTableThat = that;
    // var tableData = treeTableThat.getTableData();

    level = level || 0;

    if (!level) {
      // 初始化的表格里面没有level信息，可以作为顶层节点的判断
      tableViewElem.find('.layui-table-body tr:not([data-level])').attr('data-level', level);
      layui.each(table.cache[tableId], function (dataIndex, dataItem) {
        tableViewElem.find('.layui-table-main tbody tr[data-level="0"]:eq(' + dataIndex + ')').attr('lay-data-index', dataItem[LAY_DATA_INDEX]);
        tableViewElem.find('.layui-table-fixed-l tbody tr[data-level="0"]:eq(' + dataIndex + ')').attr('lay-data-index', dataItem[LAY_DATA_INDEX]);
        tableViewElem.find('.layui-table-fixed-r tbody tr[data-level="0"]:eq(' + dataIndex + ')').attr('lay-data-index', dataItem[LAY_DATA_INDEX]);
      })
    }

    var dataExpand = {}; // 记录需要展开的数据
    var nameKey = treeOptions.data.key.name;
    var indent = treeOptions.view.indent || 14;
    layui.each(tableView.find('td[data-field="' + nameKey + '"]'), function (index, item) {
      item = $(item);
      var trElem = item.closest('tr');
      var itemCell = item.children('.layui-table-cell');
      if (itemCell.hasClass('layui-table-tree-item')) {
        return;
      }
      itemCell.addClass('layui-table-tree-item');
      var trIndex = trElem.attr('lay-data-index');
      if (!trIndex) { // 排除在统计行中的节点
        return;
      }
      var trData = treeTableThat.getNodeDataByIndex(trIndex);
      if (trData[LAY_EXPAND]) {
        // 需要展开
        dataExpand[trIndex] = true;
      }

      var tableCellElem = item.find('div.layui-table-cell');
      var htmlTemp = tableCellElem.html();

      var flexIconElem = item.find('div.layui-table-cell')
        .html(['<div class="layui-inline layui-table-tree-flexIcon" ',
          'style="',
          'margin-left: ' + (indent * level) + 'px;',
          (trData[isParentKey] || treeOptionsView.showFlexIconIfNotParent) ? '' : ' visibility: hidden;',
          '">',
          treeOptions.view.flexIconClose, // 折叠图标
          '</div>',
          '<div class="layui-inline layui-table-tree-nodeIcon">',
          treeOptions.view.showIcon ? (trData.icon || treeOptions.view.icon || (trData[isParentKey] ? treeOptions.view.iconClose : treeOptions.view.iconLeaf) || '') : '',
          '</div>', // 区分父子节点
          htmlTemp].join('')) // 图标要可定制
        .find('.layui-table-tree-flexIcon');

      // 添加展开按钮的事件
      flexIconElem.on('click', function (event) {
        layui.stope(event);
        // 处理数据
        // var trElem = item.closest('tr');
        expandNode({trElem}, null, null, null, true);
      });
    });

    // 当前层的数据看看是否需要展开
    sonSign !== false && layui.each(dataExpand, function (index, item) {
      var trDefaultExpand = tableViewElem.find('tr[lay-data-index="' + index + '"]');
      trDefaultExpand.find('.layui-table-tree-flexIcon').html(treeOptions.view.flexIconOpen);
      expandNode({trElem: trDefaultExpand.first()}, true);
    });

    treeTable.formatNumber(tableId);
    form.render(null, tableFilterId);
  }


  /**
   * 重新编号
   * @param {String} id 表格id
   * @return {Object} layui.treeTable
   * */
  treeTable.formatNumber = function (id) {
    var that = getThisTable(id);
    if(!that) return;

    var options = that.getOptions();
    var tableViewElem = options.elem.next();

    var num = 0;
    layui.each(that.treeToFlat(table.cache[id]), function (i1, item1) {
      if (layui.isArray(item1)) {
        return;
      }
      var itemData = that.getNodeDataByIndex(item1.LAY_DATA_INDEX);
      itemData['LAY_NUM'] = ++num;
      tableViewElem.find('tr[lay-data-index="' + item1.LAY_DATA_INDEX + '"] .laytable-cell-numbers').html(itemData['LAY_NUM']);
    })
    return treeTable;
  }

  // 树表渲染
  Class.prototype.render = function (type) {
    var that = this;
    that.tableIns = table[type === 'reloadData' ? 'reloadData' : 'reload'](that.tableIns.config.id, $.extend(true, {}, that.config));
    that.config = that.tableIns.config;
  };

  // 表格重载
  Class.prototype.reload = function (options, deep, type) {
    var that = this;

    options = options || {};
    delete that.haveInit;

    // 防止数组深度合并
    layui.each(options, function (key, item) {
      if (layui.type(item) === 'array') delete that.config[key];
    });

    // 对参数进行深度或浅扩展
    that.config = $.extend(deep, {}, that.config, options, {autoSort: false});

    // 执行渲染
    that.render(type);
  };

  // 仅重载数据
  treeTable.reloadData = function () {
    var args = $.extend(true, [], arguments);
    args[3] = 'reloadData';

    return treeTable.reload.apply(null, args);
  };

  var updateStatus = function (data, statusObj, childrenKey) {
    var dataUpdated = [];
    layui.each(data, function (i1, item1) {
      if (layui.type(statusObj) === 'function') {
        statusObj(item1);
      } else {
        $.extend(item1, statusObj);
      }
      dataUpdated.push($.extend({}, item1));
      dataUpdated = dataUpdated.concat(updateStatus(item1[childrenKey], statusObj, childrenKey));
    });
    return dataUpdated;
  }

  Class.prototype.updateStatus = function (data, statusObj) {
    var that = this;
    var options = that.getOptions();
    var treeOptions = options.tree;
    data = data || table.cache[options.id];

    return updateStatus(data, statusObj, treeOptions.data.key.children);
  }

  Class.prototype.getTableData = function () {
    var that = this;
    var options = that.getOptions();
    return options.url ? table.cache[options.id] : options.data;
  }

  treeTable.updateStatus = function (id, statusObj, data) {
    var that = getThisTable(id);
    var options = that.getOptions();
    if (!data) {
      if (options.url) {
        data = table.cache[options.id];
      } else {
        data = options.data;
      }
    }
    return that.updateStatus(data, statusObj);
  }

  treeTable.sort = function (id) {
    var that = getThisTable(id);
    if(!that) return;

    var options = that.getOptions();
    var initSort = options.initSort;

    if (!options.url) {
      if (initSort.type) {
        options.data = layui.sort(options.data, initSort.field, initSort.type === 'desc');
      } else {
        options.data = layui.sort(options.data, table.config.indexName);
      }
      that.initData(options.data);
      treeTable.reloadData(id);
    } else {
      // url异步取数的表格一般需要自己添加监听之后进行reloadData并且把排序参数加入到where中
    }
  }

  // 处理事件
  var updateObjParams = function (obj) {
    var tableId = obj.config.id;
    var tableThat = getThisTable(tableId);
    var trData = obj.data = treeTable.getNodeDataByIndex(tableId, obj.index); // 克隆的
    var trIndex = trData[LAY_DATA_INDEX];
    obj.dataIndex = trIndex;

    // 处理update方法
    var updateFn = obj.update;
    obj.update = function () {
      var updateThat = this;
      var args = arguments;
      $.extend(tableThat.getNodeDataByIndex(trIndex), args[0]);
      var ret = updateFn.apply(updateThat, args); // 主要负责更新节点内容
      tableThat.renderTreeTable(obj.tr, obj.tr.attr('data-level'), false);
      return ret;
    }

    // 处理del方法
    obj.del = function () {
      treeTable.removeNode(tableId, trData);
    }

    // 处理setRowChecked
    obj.setRowChecked = function (checked) {
      treeTable.checkNode(tableId, {
        node: trData, 
        checked: checked
      });
    }
  }

  // 更新数据
  treeTable.updateNode = function (id, index, newNode) {
    var that = getThisTable(id);
    if(!that) return;

    var options = that.getOptions();
    var treeOptions = options.tree;
    var tableView = options.elem.next();
    var trElem = tableView.find('tr[lay-data-index="' + index + '"]');
    var trIndex = trElem.attr('data-index');
    var trLevel = trElem.attr('data-level')

    if (!newNode) {
      return;
    }
    // 更新值
    var newNodeTemp = that.getNodeDataByIndex(index, false, newNode);
    // 获取新的tr替换
    var trNew = table.getTrHtml(id, [newNodeTemp]);
    // 重新渲染tr
    layui.each(['main', 'fixed-l', 'fixed-r'], function (i, item) {
      tableView.find('.layui-table-' + item + ' tbody tr[lay-data-index="' + index + '"]').replaceWith($(trNew[['trs', 'trs_fixed', 'trs_fixed_r'][i]].join('')).attr({
        'data-index': trIndex,
        'lay-data-index': index,
      }));
    });
    that.renderTreeTable(tableView.find('tr[lay-data-index="' + index + '"]'), trLevel);
  }

  // 删除数据
  treeTable.removeNode = function (id, node) {
    var that = getThisTable(id);
    if(!that) return;

    var options = that.getOptions();
    var treeOptions = options.tree;
    var tableView = options.elem.next();
    var delNode;
    var indexArr = [];
    delNode = that.getNodeDataByIndex(layui.type(node) === 'string' ? node : node[LAY_DATA_INDEX], false, 'delete');
    var nodeP = that.getNodeDataByIndex(delNode[LAY_PARENT_INDEX]);
    that.updateCheckStatus(nodeP, true);
    var delNodesFlat = that.treeToFlat([delNode], delNode[treeOptions.data.simpleData.pIdKey], delNode[LAY_PARENT_INDEX]);
    layui.each(delNodesFlat, function (i2, item2) {
      indexArr.push('tr[lay-data-index="' + item2[LAY_DATA_INDEX] + '"]');
    })

    tableView.find(indexArr.join(',')).remove(); // 删除行
    // 重新整理数据
    var tableData = that.initData();
    // index发生变化需要更新页面tr中对应的lay-data-index 新增和删除都要注意数据结构变动之后的index问题
    layui.each(that.treeToFlat(tableData), function (i3, item3) {
      if (item3[LAY_DATA_INDEX_HISTORY] && item3[LAY_DATA_INDEX_HISTORY] !== item3[LAY_DATA_INDEX]) {
        tableView.find('tr[lay-data-index="' + item3[LAY_DATA_INDEX_HISTORY] + '"]').attr({
          'data-index': item3[LAY_DATA_INDEX],
          'lay-data-index': item3[LAY_DATA_INDEX],
        });
        // item3[LAY_DATA_INDEX_HISTORY] = item3[LAY_DATA_INDEX]
      }
    });
    // 重新更新顶层节点的data-index;
    layui.each(table.cache[id], function (i4, item4) {
      tableView.find('tr[data-level="0"][lay-data-index="' + item4[LAY_DATA_INDEX] + '"]').attr('data-index', i4);
    })
    treeTable.formatNumber(id);
  }

  /**
   * 新增数据节点
   * @param {String} id 树表id
   * @param {String|Number} parentIndex 指定的父节点，如果增加根节点，请设置 parentIndex 为 null 即可
   * @param {Number} index:Number 新节点插入的位置（从 0 开始）index = -1(默认) 时，插入到最后
   * @param {Object|Array} newNodes 新增的节点，单个或者多个
   * @param {Boolean} focus 新增的节点，单个或者多个
   * @return {Array} 新增的节点
   * */
  treeTable.addNodes = function (id, opts) {
    var that = getThisTable(id);
    if(!that) return;

    var options = that.getOptions();
    var treeOptions = options.tree;
    var tableViewElem = options.elem.next();

    opts = opts || {};
    
    var parentIndex = opts.parentIndex;
    var index = opts.index;
    var newNodes = opts.newNodes;
    var focus = opts.focus;

    parentIndex = layui.type(parentIndex) === 'number' ? parentIndex.toString() : parentIndex;
    var parentNode = parentIndex ? that.getNodeDataByIndex(parentIndex) : null;
    index = layui.type(index) === 'number' ? index : -1;

    // 添加数据
    newNodes = $.extend(true, [], (layui.isArray(newNodes) ? newNodes : [newNodes]));

    var tableData = that.getTableData(), dataAfter;
    if (!parentNode) {
      // 添加到根节点
      dataAfter = table.cache[id].splice(index === -1 ? table.cache[id].length : index);
      table.cache[id] = table.cache[id].concat(newNodes, dataAfter);
      if (!options.url) {
        // 静态data模式
        if (!options.page) {
          options.data = table.cache[id];
        } else {
          var pageOptions = options.page;
          options.data.splice.apply(options.data, [pageOptions.limit * (pageOptions.curr - 1), pageOptions.limit].concat(table.cache[id]))
        }
      }
      // 将新节点添加到页面
      tableData = that.initData();

      var newNodesHtml = table.getTrHtml(id, newNodes);
      var newNodesHtmlObj = {
        trs: $(newNodesHtml.trs.join('')),
        trs_fixed: $(newNodesHtml.trs_fixed.join('')),
        trs_fixed_r: $(newNodesHtml.trs_fixed_r.join(''))
      }

      layui.each(newNodes, function (newNodeIndex, newNodeItem) {
        newNodesHtmlObj.trs.eq(newNodeIndex).attr({
          'data-index': newNodeItem[LAY_DATA_INDEX],
          'lay-data-index': newNodeItem[LAY_DATA_INDEX],
          'data-level': '0'
        })
        newNodesHtmlObj.trs_fixed.eq(newNodeIndex).attr({
          'data-index': newNodeItem[LAY_DATA_INDEX],
          'lay-data-index': newNodeItem[LAY_DATA_INDEX],
          'data-level': '0'
        })
        newNodesHtmlObj.trs_fixed_r.eq(newNodeIndex).attr({
          'data-index': newNodeItem[LAY_DATA_INDEX],
          'lay-data-index': newNodeItem[LAY_DATA_INDEX],
          'data-level': '0'
        })
      })
      var trIndexPrev = parseInt(newNodes[0][LAY_DATA_INDEX]) - 1;
      var tableViewElemMAIN = tableViewElem.find(ELEM_MAIN);
      var tableViewElemFIXL = tableViewElem.find(ELEM_FIXL);
      var tableViewElemFIXR = tableViewElem.find(ELEM_FIXR);
      if (trIndexPrev === -1) {
        // 插入到开头
        tableViewElemMAIN.find('tr[data-level="0"][data-index="0"]').before(newNodesHtmlObj.trs);
        tableViewElemFIXL.find('tr[data-level="0"][data-index="0"]').before(newNodesHtmlObj.trs_fixed);
        tableViewElemFIXR.find('tr[data-level="0"][data-index="0"]').before(newNodesHtmlObj.trs_fixed_r);
      } else {
        if (index === -1) {
          // 追加到最后
          tableViewElemMAIN.find('tbody').append(newNodesHtmlObj.trs);
          tableViewElemFIXL.find('tbody').append(newNodesHtmlObj.trs_fixed);
          tableViewElemFIXR.find('tbody').append(newNodesHtmlObj.trs_fixed_r);
        } else {
          var trIndexNext = dataAfter[0][LAY_DATA_INDEX_HISTORY];
          tableViewElemMAIN.find('tr[data-level="0"][data-index="' + trIndexNext + '"]').before(newNodesHtmlObj.trs);
          tableViewElemFIXL.find('tr[data-level="0"][data-index="' + trIndexNext + '"]').before(newNodesHtmlObj.trs_fixed);
          tableViewElemFIXR.find('tr[data-level="0"][data-index="' + trIndexNext + '"]').before(newNodesHtmlObj.trs_fixed_r);
        }

      }

      // 重新更新顶层节点的data-index;
      layui.each(table.cache[id], function (i4, item4) {
        tableViewElem.find('tr[data-level="0"][lay-data-index="' + item4[LAY_DATA_INDEX] + '"]').attr('data-index', i4);
      })

      that.renderTreeTable(tableViewElem.find(newNodes.map(function (value, index, array) {
        return 'tr[lay-data-index="' + value[LAY_DATA_INDEX] + '"]'
      }).join(',')));
    } else {
      var isParentKey = treeOptions.data.key.isParent;
      var childKey = treeOptions.data.key.children;

      parentNode[isParentKey] = true;
      var childrenNodes = parentNode[childKey];
      if (!childrenNodes) {
        childrenNodes = parentNode[childKey] = newNodes;
      } else {
        dataAfter = childrenNodes.splice(index === -1 ? childrenNodes.length : index);
        childrenNodes = parentNode[childKey] = childrenNodes.concat(newNodes, dataAfter);
      }
      // 删除已经存在的同级节点以及他们的子节点，并且把中间节点的已展开过的状态设置为false
      that.updateStatus(childrenNodes, function (d) {
        if (d[isParentKey]) {
          d[LAY_HAS_EXPANDED] = false;
        }
      });
      var childrenNodesFlat = that.treeToFlat(childrenNodes);
      tableViewElem.find(childrenNodesFlat.map(function (value) {
        return 'tr[lay-data-index="' + value[LAY_DATA_INDEX] + '"]'
      }).join(',')).remove();

      tableData = that.initData();
      // 去掉父节点的已经展开过的状态，重新执行一次展开的方法
      parentNode[LAY_HAS_EXPANDED] = false;
      parentNode['LAY_ASYNC_STATUS'] = 'local'; // 转为本地数据，应该规定异步加载子节点的时候addNodes的规则
      expandNode({trElem: tableViewElem.find('tr[lay-data-index="' + parentIndex + '"]')}, true)
    }
    that.updateCheckStatus(parentNode, true);
    treeTable.resize(id);
    if (focus) {
      // 滚动到第一个新增的节点
      tableViewElem.find(ELEM_MAIN).find('tr[lay-data-index="' + newNodes[0][LAY_DATA_INDEX] + '"]').get(0).scrollIntoViewIfNeeded();
    }
    return newNodes;
  }

  // 获取表格选中状态
  treeTable.checkStatus = function (id) {
    var that = getThisTable(id);
    if(!that) return;

    // 需要区分单双选
    var tableData = treeTable.getData(id, true);
    var checkedData = tableData.filter(function (value, index, array) {
      return value[table.config.checkName];
    });

    var isAll = true;
    layui.each(table.cache[id], function (i1, item1) {
      if (!item1[table.config.checkName]) {
        isAll = false;
        return true;
      }
    })

    return {
      data: checkedData,
      isAll: isAll
    }
  }

  // 排序之后重新渲染成树表
  treeTable.on('sort', function (obj) {
    var options = obj.config;
    var tableView = options.elem.next();
    var tableId = options.id;

    if (tableView.hasClass('layui-table-tree')) {
      treeTable.sort(tableId);
    }
  });

  // 行点击
  treeTable.on('row', function (obj) {
    var options = obj.config;
    var tableView = options.elem.next();

    if (tableView.hasClass('layui-table-tree')) {
      updateObjParams(obj);
    }
  })

  // 行双击
  treeTable.on('rowDouble', function (obj) {
    var options = obj.config;
    var tableView = options.elem.next();
    var tableId = options.id;

    if (tableView.hasClass('layui-table-tree')) {
      updateObjParams(obj);

      var treeOptions = options.tree || {};
      if (treeOptions.view.dblClickExpand) {
        expandNode({trElem: obj.tr.first()}, null, null, null, true);
      }
    }
  })

  // tr中带lay-event节点点击
  treeTable.on('tool', function (obj) {
    var options = obj.config;
    var tableView = options.elem.next();
    var tableId = options.id;

    if (tableView.hasClass('layui-table-tree')) {
      updateObjParams(obj);
    }
  })

  // 行内编辑
  treeTable.on('edit', function (obj) {
    // 如果编辑涉及到关键的name字段需要重新更新一下tr节点
    var options = obj.config;
    var tableView = options.elem.next();
    var tableId = options.id;

    if (tableView.hasClass('layui-table-tree')) {
      updateObjParams(obj);
      if (obj.field === options.tree.data.key.name) {
        obj.tr.find('td[data-field="' + obj.field + '"]').children('div.layui-table-cell').removeClass('layui-table-tree-item')
        obj.update({}); // 通过update调用执行tr节点的更新
      }
    }
  });

  // 单选
  treeTable.on('radio', function (obj) {
    var options = obj.config;
    var tableView = options.elem.next();
    var tableId = options.id;
    var that = getThisTable(tableId);

    if (tableView.hasClass('layui-table-tree')) {
      updateObjParams(obj);
      checkNode.call(that, obj.tr, obj.checked)
    }
  })

  // 更新表格的复选框状态
  Class.prototype.updateCheckStatus = function (dataP, checked) {
    var that = this;
    var options = that.getOptions();
    var treeOptions = options.tree;
    var tableId = options.id;
    var tableView = options.elem.next();

    var checkName = table.config.checkName;

    // 如有必要更新父节点们的状态
    if (dataP) {
      var trsP = that.updateParentCheckStatus(dataP, checked);
      layui.each(trsP, function (indexP, itemP) {
        form.render(tableView.find('tr[lay-data-index="' + itemP[LAY_DATA_INDEX] + '"]  input[name="layTableCheckbox"]:not(:disabled)').prop({
          checked: itemP[checkName],
          indeterminate: itemP[LAY_CHECKBOX_HALF]
        }))
      })
    }

    // 更新全选的状态
    var isAll = true;
    var isIndeterminate = false;
    layui.each(table.cache[tableId], function (i1, item1) {
      if (item1[checkName] || item1[LAY_CHECKBOX_HALF]) {
        isIndeterminate = true;
      }
      if (!item1[checkName]) {
        isAll = false;
      }
    })
    isIndeterminate = isIndeterminate && !isAll;
    form.render(tableView.find('input[name="layTableCheckbox"][lay-filter="layTableAllChoose"]').prop({
      'checked': isAll,
      indeterminate: isIndeterminate
    }));

    return isAll
  }

  // 更新父节点的选中状态
  Class.prototype.updateParentCheckStatus = function (dataP, checked) {
    var that = this;
    var options = that.getOptions();
    var treeOptions = options.tree;
    var tableId = options.id;
    var checkName = table.config.checkName;
    var childrenKey = treeOptions.data.key.children;

    var dataRet = [];
    dataP[LAY_CHECKBOX_HALF] = false; // 先设置为非半选，是否为半选又下面逻辑判断
    if (checked) {
      // 为真需要判断子节点的情况
      if (!dataP[childrenKey].length) {
        checked = false;
      } else {
        layui.each(dataP[childrenKey], function (index, item) {
          if (!item[checkName]) { // 只要有一个子节点为false
            checked = false;
            dataP[LAY_CHECKBOX_HALF] = true;
            return true; // 跳出循环
          }
        });
      }
    } else {
      // 判断是否为半选
      layui.each(dataP[childrenKey], function (index, item) {
        if (item[checkName] || item[LAY_CHECKBOX_HALF]) { // 只要有一个子节点为选中或者半选状态
          dataP[LAY_CHECKBOX_HALF] = true;
          return true;
        }
      });
    }
    dataP[checkName] = checked;
    dataRet.push($.extend({}, dataP));
    if (dataP[LAY_PARENT_INDEX]) {
      dataRet = dataRet.concat(that.updateParentCheckStatus(table.cache[tableId][dataP[LAY_PARENT_INDEX]], checked));
    }
    return dataRet
  }

  var checkNode = function (trElem, checked, callbackFlag) {
    var that = this;
    var options = that.getOptions();
    var tableId = options.id;
    var tableView = options.elem.next();
    var inputElem = (trElem.length ? trElem : tableView).find('.laytable-cell-radio, .laytable-cell-checkbox').children('input').last();
    // 判断是单选还是多选 不应该同时存在radio列和checkbox列
    var isRadio = inputElem.attr('type') === 'radio';

    if (callbackFlag) {
      var triggerEvent = function () {
        var fn = function (event) {
          layui.stope(event);
        }
        inputElem.parent().on('click', fn); // 添加临时的阻止冒泡事件
        inputElem.next().click();
        inputElem.parent().off('click', fn);
      }
      // 如果需要触发事件可以简单的触发对应节点的click事件
      if (isRadio) {
        // 单选只能选中或者切换其他的不能取消选中 后续看是否有支持的必要 todo
        if (checked && !inputElem.prop('checked')) {
          triggerEvent()
        }
      } else {
        if (layui.type(checked) === 'boolean') {
          if (inputElem.prop('checked') !== checked) {
            // 如果当前已经是想要修改的状态则不做处理
            triggerEvent()
          }
        } else {
          // 切换
          triggerEvent()
        }
      }
    } else {
      var trData = that.getNodeDataByIndex(trElem.attr('data-index'));
      var checkName = table.config.checkName;
      // 如果不触发事件应该有一个方法可以更新数据以及页面的节点
      if (isRadio) {
        if (!trData) {
          // 单选必须是一个存在的行
          return;
        }
        var statusChecked = {};
        statusChecked[checkName] = false;
        // that.updateStatus(null, statusChecked); // 取消其他的选中状态
        that.updateStatus(null, function (d) {
          if (d[checkName]) {
            d[checkName] = false;
            form.render(tableView.find('tr[lay-data-index="' + d[LAY_DATA_INDEX] + '"] input[type="radio"][lay-type="layTableRadio"]').prop('checked', false));
          }
        }); // 取消其他的选中状态
        trData[checkName] = checked;
        form.render(trElem.find('input[type="radio"][lay-type="layTableRadio"]').prop('checked', checked));
      } else {
        var isParentKey = options.tree.data.key.isParent;
        // 切换只能用到单条，全选到这一步的时候应该是一个确定的状态
        checked = layui.type(checked) === 'boolean' ? checked : !trData[checkName]; // 状态切换，如果遇到不可操作的节点待处理 todo
        // 全选或者是一个父节点，将子节点的状态同步为当前节点的状态
        // if (!trData || trData[isParentKey]) {
        // 处理不可操作的信息
        var checkedStatusFn = function (d) {
          if (!d[table.config.disabledName]) { // 节点不可操作的不处理
            d[checkName] = checked;
            d[LAY_CHECKBOX_HALF] = false;
          }
        }

        var trs = that.updateStatus(trData ? [trData] : table.cache[tableId], checkedStatusFn);
        form.render(tableView.find(trs.map(function (value) {
          return 'tr[lay-data-index="' + value[LAY_DATA_INDEX] + '"] input[name="layTableCheckbox"]:not(:disabled)';
        }).join(',')).prop({checked: checked, indeterminate: false}));
        // }
        var trDataP;
        // 更新父节点以及更上层节点的状态
        if (trData && trData[LAY_PARENT_INDEX]) {
          // 找到父节点，然后判断父节点的子节点是否全部选中
          trDataP = that.getNodeDataByIndex(trData[LAY_PARENT_INDEX]);
        }

        return that.updateCheckStatus(trDataP, checked);
      }
    }
  }

  // 多选
  treeTable.on('checkbox', function (obj) {
    var options = obj.config;
    var tableView = options.elem.next();
    var tableId = options.id;
    var that = getThisTable(tableId);

    if (tableView.hasClass('layui-table-tree')) {
      updateObjParams(obj);
      var checked = obj.checked;
      obj.isAll = checkNode.call(that, obj.tr, checked);
    }
  })


  /**
   * 勾选或取消勾选单个节点
   * @param {String} id 树表id
   * @param {Object|String} node 节点
   * @param {Boolean} checked 选中或取消
   * @param {Boolean} [callbackFlag] 是否触发事件回调
   * */
  treeTable.checkNode = function (id, opts) {
    var that = getThisTable(id);
    if(!that) return;

    var options = that.getOptions();
    var tableView = options.elem.next();

    opts = opts || {};

    var node = opts.node;
    var checked = opts.checked;
    var callbackFlag = opts.callbackFlag;

    var dataIndex = layui.type(node) === 'string' ? node : node[LAY_DATA_INDEX];
    // 判断是否在当前页面中
    var nodeData = that.getNodeDataByIndex(dataIndex);
    if (!nodeData) {
      // 目前只能处理当前页的数据
      return;
    }
    // 判断是否展开过
    var trElem = tableView.find('tr[lay-data-index="' + dataIndex + '"]');
    if (!trElem.length) {
      // 如果还没有展开没有渲染的要先渲染出来
      treeTable.expandNode(id, {
        index: nodeData[LAY_PARENT_INDEX], 
        expandFlag: true
      });
      trElem = tableView.find('tr[lay-data-index="' + dataIndex + '"]');
    }
    checkNode.call(that, trElem, checked, callbackFlag);
  }

  treeTable.checkAllNodes = function (id, checked) {
    var that = getThisTable(id);
    if(!that) return;

    var options = that.getOptions();
    var tableView = options.elem.next();

    checkNode.call(that, tableView.find('tr[data-index="NONE"]'), !!checked)
  }

  /**
   * 获得数据
   * @param {String} id 表格id
   * @param {Boolean} simpleData 是否返回平铺结构的数据
   * @return {Array} 表格数据
   * */
  treeTable.getData = function (id, simpleData) {
    var tableData = [];
    layui.each($.extend(true, [], table.cache[id] || []), function (index, item) {
      // 遍历排除掉临时的数据
      tableData.push(item);
    })
    return simpleData ? getThisTable(id).treeToFlat(tableData) : tableData;
  }

  // 记录所有实例
  thisTreeTable.that = {}; // 记录所有实例对象
  // thisTreeTable.config = {}; // 记录所有实例配置项

  // 重载
  treeTable.reload = function (id, options, deep, type) {
    deep = deep !== false; // 默认采用深拷贝
    var config = getThisTableConfig(id); // 获取当前实例配置项
    if (!config) return;

    var that = getThisTable(id);
    that.reload(options, deep, type);

    return thisTreeTable.call(that);
  };

  // 核心入口
  treeTable.render = function (options) {
    var inst = new Class(options);
    return thisTreeTable.call(inst);
  };

  exports(MOD_NAME, treeTable);
});
