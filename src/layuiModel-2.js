"use strict";

/*
 * 2017.10.19
 * xzb
 */

var layConfig = {},
    layInit = function(options,selectData) {
        /*
         * 传入参数
         * url 数据地址
         * numpage 每页出现的数据量 默认为 10
         * title 表格标题
         */
        var that = this,
            initData,
            jwidth = ($(window).width() !== 0) ? $(window).width() : Number($.cookie("cookieBefore").split("$")[0]),
            jheight = ($(window).height() !== 0) ? $(window).height() : Number($.cookie("cookieBefore").split("$")[1]),
            defaults = {
                elem:"",
                id:"",
                url: "",
                ajaxtype:"",
                width: jwidth,
                height: jheight,
                numpage: 50,
                limits:"",
                page: true,
                where:"",
                checkName:'',
                initSort: "",
                done :""
            };
        if($(window).width() !== 0 && $(window).height() !== 0) {
            $.cookie("cookieBefore", $(window).width() + "$" + $(window).height(), {path: "/" });
        }

        initData = $.extend(true,defaults, options);
        return new layInit.prototype.init(initData,selectData);
    },
    layPaging = function(data) {
        var paging = {where:data},
            newData = $.extend(true,{},layConfig.RenderJson,paging)
        ;
        layui.use(['table'], function() {
            var table = layui.table,
                reloadId = newData.elem.split("#")[1]
            ;
            table.reload(reloadId, newData);
            //table.renderData();
            // table.reloadData(reloadId, newData);
        })
    },
    layWindow = {}
;

layInit.prototype = {
    init : function(data,selectData) {
        var that = this,
            RenderJson
        ;
        RenderJson = {
            elem: data.viewId,
            id: data.id,
            cols: [data.columns],
            url: data.url,
            method:data.ajaxtype,
            width: data.width,
            height: data.height,
            limit: data.numpage,
            limits: data.limits,
            page: data.page,
            initSort: data.initSort,
            clearArray:that.events.clearArray,
            where: data.where || selectData,
            done : function (res, curr, count){
                if(data.done) {
                    data.done.event(res, curr, count);
                }
            }
        };

        if($(RenderJson.elem).attr('lay-filter') == undefined) {
            $(RenderJson.elem).attr('lay-filter',"LAY-table-1");
        }
        layConfig['RenderJson'] = RenderJson;

        $(data.columns).each(function(index, el) {
            if(el.checkbox || el.type == 'checkbox') {
                data.checkName = el.field;
            }
        });
        layui.use(['table', 'form', 'layer', 'jquery'], function() {
            var table = layui.table,
                form = layui.form,
                layer = parent.layer,
                $ = layui.jquery,
                checboxFid = [],
                checkId = data.viewId.split("#")[1]
            ;
            if(table.cache.PageList == undefined) {
                table.render(RenderJson);
            }
            table.reloadData(selectData);

            table.on('checkbox(LAY-table-1)', function(obj){
                var checkStatus = table.checkStatus(checkId), //test即为基础参数id对应的值
                    checkName = (data.checkName) ? data.checkName: 'FID'
                ;
                if(!layConfig.jChecbox) {checboxFid = [];}
                if(obj.type == 'all') {
                    if(obj.checked){
                        checboxFid = [];
                        $(checkStatus.data).each(function(index, item) {
                            checboxFid.push(item[checkName]);
                        });
                    } else {
                        checboxFid = [];
                    }
                } else {
                    if(obj.checked){
                        checboxFid.push(obj.data[checkName]);
                    } else {
                        checboxFid = $.grep(checboxFid, function(value) {
                          return value != obj.data.FID;
                        });
                    }
                }

                layConfig.jChecbox = checboxFid;
                // console.log(obj.checked); //当前是否选中状态
                // console.log(obj.data.FID); //选中行的相关数据
                // console.log(obj.type); //如果触发的是全选，则为：all，如果触发的是单选，则为：one
            });
        })
    },
    events : {
        clearArray : function(checkStatus){ // 事件处理
            var that = this;
            layConfig.checkStatus = null; //将选中项值置为空
            layConfig.jChecbox =  null;
            layConfig.checkStatus = checkStatus.object;
        }
    }
}

layInit.prototype.init.prototype = layInit.prototype;

layWindow =  {
    /*
     *打开layer弹窗
     *OConfig 弹窗配置
     *title 标题
     *href 地址
     *boxArea 宽高,
     */
    layerOpen: function layerOpen(OConfig, callback) {
        // 阻止event默认行为 a标签的跳转
        // event.preventDefault();//支持DOM标准的浏览器
        // event.returnValue = false;//IE
        var boxSize = [],
            boxWidth,
            boxheight,
            boxType,
            boxShade
        ;
        if (OConfig.boxArea == "" || OConfig.boxArea == null) {
            //判断页面高度
            boxWidth = 1200 + 'px';
            boxheight = 600 + 'px';
        } else if (OConfig.boxArea.width == "auto" || OConfig.boxArea.height == "auto") {
            boxWidth = "100%";
            boxheight = "100%";
        } else {
            boxWidth = OConfig.boxArea.width + 'px';
            boxheight = OConfig.boxArea.height + 'px';
        }
        //判断是否有遮罩
        boxShade = (OConfig.closeShade == true) ? 0 : 0.3;
        boxSize.push(boxWidth, boxheight);

        layui.use(['layer'], function() {
            var layer = layui.layer;

            var index = layer.open({
                id: 'UrgeEdit',
                type: 2,
                title: OConfig.title,
                area: boxSize,
                shade:boxShade,
                anim: 0,
                resize: true,
                content: [OConfig.href] //iframe的url，no代表不显示滚动条
                ,
                success: function success(event, index) {
                    //给予index属性
                    event.attr("lr-index", index);
                },
                cancel: function cancel() {//右上角关闭按钮触发的回调
                    //回调函数
                    // if (callback) {
                    //     callback();
                    // }
                }
            });
            if (OConfig.maxmin == true) {
                layer.full(index);
            }
        });

        //layer.full(index);
    },
    /*
     * index 弹出框 自动关闭
     */
    layerPopup: function layerPopup(OConfig, callback) {
        var layOffset = OConfig.offset || 'rb',
            latTime = OConfig.time || 6000,
            btnClick = OConfig.btnClick == "null" ? "" : OConfig.btnClick,
            boxSize = [],
            boxWidth,
            boxheight;
        if (OConfig.boxArea == "" || OConfig.boxArea == null) {
            //判断页面高度
            boxWidth = 300;
            boxheight = 200;
        } else {
            boxWidth = OConfig.boxArea.width;
            boxheight = OConfig.boxArea.height;
        }
        boxSize.push(boxWidth + 'px', boxheight + 'px');
        layui.use(['layer'], function() {
            layer.open({
                type: 1,
                offset: layOffset,
                id: 'LAY_demo', //防止重复弹出
                time: latTime,
                area: boxSize,
                content: '<div style="padding: 20px 0; text-align:center">' + OConfig.content + '</div>',
                btn: btnClick,
                btnAlign: 'c', //按钮居中
                shade: 0, //不显示遮罩
                yes: function yes(index) {
                    if (callback) {
                        callback();
                    }
                    layer.close(index);
                }
            });
        });
    },
    /*
     *layerPrompt 输入层
     *PConfig 弹窗配置参数
     *
     *PConfig.title  标题名字 type:string  可缺省
     *PConfig.formType   输入框类型  type:number 可缺省
     *支持0（文本）默认1（密码）2（多行文本）
     *PConfig.boxArea 宽高 type:object 可缺省
     *PConfig.value 默认值 type:string  可缺省
     */
    layerPrompt: function layerPrompt(PConfig, execute) {
        var boxSize = [],
            boxWidth,
            boxheight;

        if (PConfig.boxArea == "" || PConfig.boxArea == null) {
            //判断页面高度
            boxWidth = 300;
            boxheight = 100;
        } else {
            boxWidth = PConfig.boxArea.width;
            boxheight = PConfig.boxArea.height;
        }

        boxSize.push(boxWidth + 'px', boxheight + 'px');

        layui.use(['layer'], function() {
            var layer = layui.layer;
            layer.prompt({
                formType: PConfig.formType || 0,
                value: PConfig.value || "",
                title: PConfig.title || "输入层",
                area: boxSize //自定义文本域宽高
            }, function(value, index, elem) {
                execute(value, elem); //执行事件
                layer.close(index);
            });
        });
    },
    /**
     * layerConfirm 询问框
     * @param  {[string]} content [提示内容]
     * @param  {[object]} options [标题，标签]
     * @param  {[function]} yes     [确定事件]
     * @param  {[function]} cancel  [取消事件]
     */
    layerConfirm: function layerConfirm(content, options, yes, cancel) {
        layui.use(['layer'], function() {
            var layer = layui.layer;
            layer.confirm(content, options, function(index) {
                yes();
                layer.close(index);
            }, cancel);
        });
    },
    /**
     * layMsg 提示框
     * @param  {[string]} content [提示内容]
     * @param  {[function]} options  [关闭后执行事件]
     */
    layMsg: function layMsg(content, callback, time) {
        layui.use(['layer'], function() {
            var layer = layui.layer;
            layer.msg(content, {
                time: time || 2000
            }, callback);
        });
    },
    layerLoad: function layerLoad(isClose, index) {
        if (!isClose) {
            var layShade = '<div class="layui-layer-shade" style="background-color:#000; opacity:0.01; filter:alpha(opacity=1);"></div>\n        <div class="layui-layer-loading" style="position: absolute;top:50%;left:50%;">\n        <div class="layui-layer-contimg" style="width: 32px;height: 32px;background: url(/images/loading-2.gif) no-repeat;"></div>\n    </div>';

            $("body").append(layShade);

        } else {
            $(".layui-layer-shade,.layui-layer-loading").remove();
        }
    },
    //关闭自身
    layerCloseSelf: function layerCloseSelf(callback,time) {
        var index,isParent;
        layui.use(['layer'], function() {
            //关闭当前iframe,parent找不到就去top找
            index = (parent.layer.getFrameIndex(window.name)) ?  parent.layer.getFrameIndex(window.name): top.layer.getFrameIndex(window.name);
            isParent = (parent.layer.getFrameIndex(window.name)) ? true :false ;
            if (callback) { callback(); }
            if(time) {
                if(isParent) {
                    setTimeout(function(){ parent.layWindow.layerClose(index); },time);
                } else {
                    setTimeout(function(){ top.layWindow.layerClose(index); },time) ;
                }
            } else {
                if(isParent) {
                    parent.layWindow.layerClose(index);
                } else {
                    top.layWindow.layerClose(index);
                }
            }


            // if (parent.layer.getFrameIndex(window.name)) {
            //     if (callback) { callback(); }

            //     index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            //     if(time) {
            //         setTimeout(function(){ parent.layWindow.layerClose(index); },time)
            //     } else {
            //         parent.layWindow.layerClose(index); //再执行关闭
            //     }

            // } else {
            //     if (callback) { callback(); }

            //     index = top.layer.getFrameIndex(window.name); //先得到当前iframe层的索引

            //     if(time) {
            //         setTimeout(function(){ top.layWindow.layerClose(index); },time)
            //     } else {
            //         top.layWindow.layerClose(index); //再执行关闭
            //     }
            // }
        });
    },
    //关闭所有
    layerCloseAll: function layerCloseAll() {
        layui.use(['layer'], function() {
            layer.closeAll();
        });
    },
    layerClose: function layerClose(index) {
        layui.use(['layer'], function() {
            layer.close(index);
        });
    },
    /*
     * input 自动补全
     */
    completion: function completion(config, callback) {
        var tautocomp = $("#" + config.id).tautocomplete({
            columns: config.columns,
            delay: 1000,
            ajax: {
                url: config.url,
                type: "GET",
                data: function data() {
                    var x = {
                        SearchText: tautocomp.searchdata()
                    };
                    return x;
                },
                success: function success(data) {
                    return data.object;
                }
            },
            onchange: function onchange() {}
        }, callback);
    },
    /*
     * 时间轴插件
     */
    timeAxis: function timeAxis(config) {
        var AxisId = $('#' + config.id);
        $.fn.axisOption = function(data) {
            var jThis = $(this);
            $.ajax({
                url: data,
                type: 'GET',
                dataType: "JSON",
                success: loopData
            });

            function loopData(oData) {
                var dataTpl = "";
                if (oData.object !== null) {
                    AxisId.append("<div class=\"debrisBox\"></div><div class=\"container\"></div>");
                    $(oData.object).each(function(index, item) {

                        if (item.complete == true) {
                            dataTpl += "<li class = 'complTrue'>\n                                    <span class='dsk-circle-title'>" + item.title + "</span>\n                                    <span class='dsk-circle dsk-success'>\u5B8C\u6210</span>\n                                    <span class='dsk-circle-time'>" + item.time + "</span>\n                                </li>";
                        } else {
                            dataTpl += "<li class = 'complFalse'>\n                                    <span class='dsk-circle-title'>" + item.title + "</span>\n                                    <span class='dsk-circle dsk-failed'>\u672A\u5B8C\u6210</span>\n                                    <span class='dsk-circle-time'>" + item.time + "</span>\n                                </li>";
                        }
                    });
                    jThis.find('.container').html("<ul class='ks-clear'>" + dataTpl + "</ul>");
                }

            }
        };
        AxisId.axisOption(config.url);
    }
}
