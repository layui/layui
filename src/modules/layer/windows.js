/**
 * 弹出层管理组件
 *
 * @license MIT
 * Copyright (c) 2022 墨菲特
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * 
 * 
 * HISTORY:
 *
 *    @Author: Malphite
 *    @Date: 2022-07-26
 *    @description:
 *       1. 创建组件windows, 当前版本 v1.0.0
 *
 *    @Author: Malphite
 *    @Date: 2022-08-26
 *    @description:
 *       1.将当前组件尝试融入layui中,通过在layer.js和layui.js里面稍加修改实现，外界根本不会接触新引入的内容
 *       2.由于layui里面内置jQuery库，但是没有lodash，所以在binder容器里面追加lodash方法的实现
 *       3.在layer里面通过wakeUp方法嵌入，避免直接使用binder构建html，减小开发难度
 *       4.在这个js里面自发的将组件融入html中, 当前版本 v1.1.0
 *
 *    @Author: Malphite
 *    @Date: 2022-08-30
 *    @description:
 *        1.通过对layer.open方法进行过滤，减少这个组件所需的配置。
 *        2.优化了窗口选择的方法，现在支持单窗口不用通过点击预览小窗口才能进行显示与隐藏，通过点击li标签也能触发上述动作
 *        3.新增窗口动作，上下摇动最小化其它窗口。
 *        4.当前版本 v1.1.2
 *
 *    @Author: Malphite
 *    @Date: 2022-09-20
 *    @description:
 *      **********    组件重构  v2.0.0    **************
 *
 *      一、原有窗口预览的计划，现在撤销这个功能。
 *         预览功能有一个很重要的条件，那就是要随时生成一张当前弹层的快照，才能在并不需要完全打开弹层的前提下观察到这个弹层的全貌。
 *     v1.0.0 里面采用提前对弹层截图保存成图片的方式，这个方式不是动态的，而且增加开发时的配置，html2canvas可以实现，但是它
 *      实在太卡了，平均半分钟一张图，还不如直接打开看。而且会造成页面卡顿。
 *
 *      二、新增功能 窗口合并
 *          (实验性的功能)是对layui模块化开发的一个尝试，可以暂时将两个页面合并成一个页面操作。期望达到的效果是之后开发功能时
 *     可以将一个大功能开发成多个小窗口，然后根据浏览时的需要自动拼接在一起进行浏览。达到一种模块化开发的效果。
 *
 *      三、新增功能 3D Flip
 *          (实验性的功能)在操作栏向上滑动可以呼出 3D Flip 形式的卡片式多窗口栏。
 *          和上面的预览功能的相同限制，这个卡片窗口不能实时的预览窗口，是一个单色调的div
 *          由于实现方式的限制，卡片的切换动画并不丝滑，也不能随着鼠标而移动，所以添加了两个小按钮进行切换
 *
 *      四、原来有的菜单功能取消，新增窗口卡贴
 *          (实验性的功能)将窗口拖动到左下角(窗口配置参数有id，而且不是合并窗口)，如果这个窗口没有创建卡贴，
 *      那么会弹出一个框，示意可以将这个窗口拖入。
 *          在卡贴栏点击按钮可以快速的打开或置顶对应的窗口。
 *
 *      五、移除配置 TOP_LAYER_ONLY
 *          现在全是多窗口模式
 *
 *      六、新增沙箱模式
 *          之前有类似的功能。这里进行强化和优化。
 *
 *          沙箱模式： 在特殊的配置项下，调用layer.open方法打开窗口，会自发的生成一个临时的配置项作为它的沙箱配置项，
 *      后面的窗口操作都会在 这个临时配置项中进行，不会影响到原来的配置项。而这个临时的配置项也会在窗口关闭时被释放。
 *            现在的主要作用是支持多个相同配置项的窗口打开。第一个窗口即将被打开时，系统自动生成了沙箱配置项代替
 *      原来的配置项执行了打开这个操作。随后再次调用打开的方法，原来的配置项没有处于已打开的状态，会再次创建沙箱
 *      配置项打开窗口，如此同一个配置项可以生成多个互不相关的沙箱配置项，也就可以同时打开多个相同的窗口了。
 *
 *          需要注意的是html 里面的id依旧不能重复，我的解决方式是避免使用id，使用class来代替。
 *          或者使用binder容器生成动态id。
 *
 *    @Author: Malphite
 *    @Date: 2022-09-22
 *    @description:
 * 
 *          1.修改了网页联动函数的bug
 *          2.新增参数来ENABLE_FIT_POSITON关闭自动生成弹出位置(测试时效果不理想，暂时废弃)
 *          3.移除参数补全时对于skin的修改，这个使用统一的皮肤样式
 *          4.当前版本 v2.3.0
 *          5.突然发现有skin的必须舍弃，这是layui的特殊写法
 *          6.不能强制所有弹层换肤，否则会对layui特殊弹框影响，这里只能在调用时临时为每一个受管理的配置项临时添加
 *          7.当前版本 v2.3.3
 *
 *    @Author: Malphite
 *    @Date: 2022-09-25
 *    @description:
 * 
 *          1.重构卡片式多任务功能
 *          2.修改bug，在进行卡贴功能时触发窗口合并事件
 *          3.当前版本 v2.4.0
 *
 *
 *    @Author: Malphite
 *    @Date: 2022-09-26
 *    @description:
 * 
 *          1.重构卡片式多任务功能
 *          2.当前版本 v2.5.0
 *          3.这个版本可尝试上传github
 *          4.新增第三方登录名 {@linkplain config.constant.DYNAMIC_OWNER 第三方登录用户名}
 *          5.新增pageDescribe下属配置项 ignore 用来标志忽略装饰此参数
 *          6.新增配置项，开启or关闭动画 {@linkplain config.constant.DYNAMIC_STARTER 装载动画}
 * 
 * 
 *    @Author: Malphite
 *    @Date: 2022-09-28
 *    @description:
 * 
 *          1.操作栏使用文字加图标的模式
 *          2.当前版本 v2.5.1
 * 
 *    @Author: Malphite
 *    @Date: 2022-10-04
 *    @description:
 * 
 *          1.与layer组件解耦
 *          2.当前版本 v2.5.2
 * 
 */
("use strict");



(function(){
  var doc = window.document;
  var jsPath = doc.currentScript ? doc.currentScript.src : function(){
    var js = doc.scripts
    ,last = js.length - 1
    ,src;
    for(var i = last; i > 0; i--){
      if(js[i].readyState === 'interactive'){
        src = js[i].src;
        break;
      }
    }
    return src || js[last].src;
  }();

  var basePath = jsPath.substring(0, jsPath.lastIndexOf('/') + 1);

  layui.extend({
    binder: basePath + 'binder',
    vform: basePath + 'vform',
  });

})()




layui.define(['jquery' ,"layer", "binder"], function (exports) {

  var $ = layui.jquery;

  /***************************************************************************************************
   * 
   * @global
   * @constant
   * 
   * @description
   * 描述 ：
   * 
   *            全局配置项。主管所有操作的数据记录。
   *            1.{@linkplain DEFALUT_CONFIG  在页面初始化的时候会将全局配置项进行备份 }。
   *            2.{@linkplain windowsProxy.wakeUp  在layerManage唤醒的时候会根据传入的参数重新配置参数 }。
   * 
   * 成员 ： 
   * 
   *            @prop {Object} constant         配置参数常量
   *            @prop {Object} base             响应式数据
   *            @prop {Object} temp             临时描述对象
   *            @prop {Object} pageDescribe     窗口描述对象
   *            @prop {Object} pageMultiple     沙箱临时缓存关系表
   *                      *
   * HISTORY:                                            *
   *     @author: Malphite                                 *
   *     @Date: 2022-07-26         *
   *==================================================================================================*/
  let config = {
    /**
     * @member {Object} 配置参数常量
     * @description
     *  描述 ：
     * 
     *          存放窗口设置过程中相对于比较静态的一些常量数值集
     *          {@linkplain windowsProxy.wakeUp  在layerManage唤醒的时候会根据传入的参数重新配置参数 }
     *          在上述方法中，传入的第一个参数就是用来替换该项的默认配置的
     *  
     */
    constant: {
      /**
       * @var {Boolean} 沙箱标志符
       * @description
       *
       *  值：
       *
       *      true   强制开启沙箱模式
       *      false  除其它配置特殊要求外，关闭创建沙箱配置
       *
       *  作用:
       *
       *     <b>  沙箱模式下，在调用layer.open方法时会在 pageDescribe中 根据原有配置项 生成一个临时配置项。
       *          称为这个配置项的沙箱配置项。后面的操作都是在这个沙箱环境中进行不会影响原有配置项。
       *          这个临时配置项在窗口关闭后自动销毁。 </b>
       *
       */
      DISPLAY_MULTIPLE_LAYER: false,


      /**
       * @var {Boolean} 启用位置自适应
       * @description
       *  值：
       *
       *      true   开启
       *      false  关闭
       * 
       *  作用:
       * 
       *    没有设置 area 和 offset时候用不用动态的去计算
       *    由于layui这两个参数本来就要默认值，所以这个默认关闭
       * 
       */
      ENABLE_FIT_POSITON: true,

      /**
       * @var {String} 第三方登录用户名
       * @since v2.5.0
       * @description 
       * 
       *    取代下面的动态用户名
       */
      DYNAMIC_OWNER: '',


      /**
       * @var {Boolean} 装载动画
       */
      DYNAMIC_STARTER: false,

      /**
       * @var {String} 选项卡外层id
       * @description
       *
       *        这里使用了layui admin里面的选项卡样式，最外层的id是照搬的
       */
      HEADERS_ID: "LAY_app_tabsheader",

      /**
       * @var {Number} 弹层最大层级zIndex的值
       * @description
       *
       *        在窗口成功打开的回调函数中需要更新这一项
       */
      MAX_INDEX: 19891014,

      /**
       * @var {Number} 当前最高层级弹层的id
       * @description
       *
       *        这个id指的是layui.layer.open里面返回的id
       */
      TOP_INDEX: 0,

      /**
       * @var {String} layui隐藏class
       */
      HIDE: "layui-hide",

      /**
       * @var {Number} 全局递增量
       */
      INTERNAL_INDEX: 0,

      /**
       * @var {Number} 消失动画中每个单元的宽度
       */
      RADIUS: 30,

      /**
       * @var {String} 容器的id名称
       */
      CONTAINER_ID: "layui-windows-bottom",

      /**
       * @var {String} 单例字符串
       */
      SINGLETON: "property",

      /**
       * @var {String}  layui模块自动加载后自动被执行的方法名称
       */
      METHOD_AUTOEXEC_NAME: "run",

      /**
       *  @var {String}  降低层级的类选择器
       *  @description
       *
       *  作用:
       *
       *    {@linkplain config.constant.MAX_CLASSNAME 见MAX_CLASSNAME} 
       */
      MIN_CLASSNAME: "layui-min-header",

      /**
       * @var {String} 标记层级的类选择器
       * @description
       * 
       *  作用:
       *
       *        防止因为弹层原因引起的弹层问题
       *      1.在页面初始化时需要为那些可能受影响的区域添加一个 MAX_CLASSNAME 的类选择器
       *      2.在弹层最大化的时候会给之前标记的div添加 MIN_CLASSNAME的类选择器，强行降低它们的层级
       *      3.在弹层恢复会关闭的时候去掉  MIN_CLASSNAME的类选择器。
       * 
       *  相关： 
       *  
       *    {@linkplain config.constant.MIN_CLASSNAME 降低层级的类选择器} 
       */
      MAX_CLASSNAME: "layui-max-header",

      /**
       * @var {String} 预览窗口组div的外层 类选择器
       */
      CONTAINER_TIPS_CLASSNAME: "layui-windows-tip",

      /**
       * @var {Number} 初始窗口弹出的top位置
       */
      BASE_WINDOWS_TOP_OFFSET: 70,

      /**
       * @var {Number} 窗口距离下方的最小距离
       */
      BASE_WINDOWS_BOTTOM_OFFSET: 85,

      /**
       * @var {Number} 窗口距离左方的最小距离
       */
      BASE_WINDOWS_LEFT_OFFSET: 10,

      /**
       * @var {String}  窗口上下偏移方向
       * @description
       *
       *  值:
       *
       *        DOWN    向下
       *        UP      向上
       */
      BASE_WINDOWS_TOP_DIRECTION: "DOWN",

      /**
       * @var {String} 窗口左右偏移方向
       * @description
       *
       *  值:
       *
       *        LEFT    向左
       *        RIGHT   向右
       */
      BASE_WINDOWS_LEFT_DIRECTION: "RIGHT",

      /**
       * @var {Number} 窗口每次的偏移量
       */
      BASE_WINDOWS_OFFSET: 30,

      /**
       * @var {Number} 窗口默认宽度
       */
      BASE_WINDOWS_WIDTH: 380,
    },

    /**
     * @member {Object} 响应式数据
     * @description
     * 
     *  成员:
     *            
     *            @prop {String} username           用户名称
     *            @prop {Array} livelyPool         活跃池
     *            @prop {Object} hover              选中窗口原始状态配置项
     *            @prop {Array} hoverPool          分组小窗口配置对象
     *            @prop {Object} flip               3D Flip(卡片式多任务窗口) 动态配置项
     *            @prop {Array} assign             合并窗口的分组对象
     *            @prop {Object} TEMP_ASSIGN_WINDOW 预备即将被合并的layer窗口描述对象
     *            @prop {String} menuVisible        卡贴目录是否可见
     *            @prop {Object} tipsIcon           卡贴临时描述对象
     *            @prop {Array} tipsSource         卡贴列表
     */
    base: {
      /**
       * @var {String} 用户名称
       * @description
       *
       *  作用：
       *
       *        1.在窗口卡贴区域会展示用户名称
       *        2.可能存在其它功能会用到用户的地方
       *
       *  来源:
       *
       *        1.在base配置项里面配置
       *        2.考虑从上述config.constant 里面传入
       *        3.由于config.constant可以从外界传入，那么这一项也可以从外界传入
       */
      username: "Malphite",

      /**
       * @var {Array} 活跃池(非常重要)
       * @description
       *
       *   成员：
       *
       *      @prop {Number}  index :  主键， 由系统自增自发生成,主管在li标签上面的排序
       *      @prop {String}  id    :  pageDescribe配置的key, 主管一切窗口动作。如果是沙箱窗口取临时配置项的 父级id，也就是原配置项的key。合并窗口就临时组装一个id。
       *      @prop {String}  name  ： 窗口名字，仅展示。同上
       *      @prop {Boolean}  select： 用于标记这个窗口分组是否被选中。  true 为选中
       *      @prop {String}  icon  ： 给这个窗口添加一个icon。填写layui的icon码
       *      @prop {Array}  children： 这个窗口分组下属所有子窗口的配置项key的array集合。在窗口预览是弹出的小窗口就是要根据它来生成的。
       *      @prop {Number}  assign： 标记这个分组是否是窗口合并  0 正常分组  1 窗口合并    2.0.0 新增
       */
      livelyPool: [],

      /**
       * @var {Object} 选中窗口原始状态配置项
       * @description
       *
       *    作用：
       *
       *        当鼠标移到窗口对应的小窗口上时，这个窗口被临时置顶。这个参数记录窗口在指定前的状态，方便状态回滚
       *        2.0.0  更新: 仅保留id(pageDescribe配置的key),其它的状态信息在 pageDescribe配置项里面做
       *
       *    成员：
       *
       *        @prop {String} id: pageDescribe配置的key 标志当前正在预览这个窗口  为空或者0表示当前无窗口正在预览
       */
      hover: {},

      /**
       * @var {Array} 分组小窗口配置对象
       * @description
       *
       *    来源:
       *
       *        鼠标放在li标签上的时候会根据这个li标签对应的 livelyPool值(主要是children) 来动态生成
       *
       *    成员：
       *
       *        @prop {String} id:  小窗口对应窗口的id(pageDescribe配置的key) 通过它来操作窗口
       *        @prop {String} name: 窗口名字，主要用作展示
       *        @prop {String} groupid： 当前分组id， livelyPool里面的id值，在监听事件里面用来定位li标签
       *
       *    监听事件:
       *
       *        watchs.hoverPool
       *        当这个值发生改变时，主要是通过小窗口上面的关闭按钮关闭页面。这个时候要根据现有条件再次适应剩下的布局
       */
      hoverPool: [],

      /**
       * @var {Object} 3D Flip(卡片式多任务窗口) 动态配置项
       * @description
       *
       *  成员:
       *
       *        @prop {Array}  list                  当前展示的窗口队列   v2.5.0 废弃
       *        @prop {Object}  map                  当前展示的窗口原始信息  v2.5.0 新增
       *        @prop {Boolean} show                 卡片式多任务窗口展示情况  true 显示
       *        @prop {Number} size                  最大展示窗口数量
       *        @prop {Number} now                   当前读取缓存池的下标
       */
      flip: {
        /**
         * @var {Array} 当前展示的窗口队列
         * @description
         *
         *    作用：
         *
         *        指导多任务窗口中正确的排布渲染出各个窗口
         *
         *    来源:
         *
         *        在调用 getFlipList 来根据当前的状态获取
         *
         *    成员：
         *
         *        @prop {String}  id: 对应窗口的id(pageDescribe配置的key) 通过它来操作窗口
         *        @prop {String}  name: 窗口名字，主要用作展示
         * @deprecated  v2.5.0 移除，接下来由下面的map进行描述即可
         */
        list: [],

        /**
         * @var {Object} 当前展示的窗口的原始信息
         * @since v2.5.0
         * @description
         * 
         *    作用:
         * 
         *        在窗口动画之前记录下窗口当前的状态以便后面的还原
         * 
         *    来源:
         *    
         *        在调用 getFlipList 来根据当前的状态获取
         * 
         *    成员: (key 为  {@link config.pageDescribe} 的key或者id)
         * 
         *         @prop {Number}  offsetTop      窗口距离上的值
         *         @prop {Number}  offsetLeft     窗口距离左的值
         *         @prop {Number}  currentWidth   窗口当前宽度
         *         @prop {Number}  currentHeight  窗口当前高度
         *         @prop {Number}  zIndex         窗口当前zIndex从pageDescribe里面有
         *         @prop {Number}  min            窗口当前是否最小化 从pageDescribe里面有   
         * 
         */
        map: {},

        /**
         * @prop {Boolean} 窗口展示情况
         * @description
         *
         *  值：
         *
         *        true   显示
         *        false  隐藏
         */
        show: false,

        /**
         * @prop {Number} 最大展示窗口数量
         * @description
         *
         *        1.为了满足html动态加载，防止窗口过多造成页面卡死
         *        2.现有css限制仅有有现个窗口可以交互
         */
        size: 6,

        /**
         * @prop {Number} 当前读取缓存池的下标
         */
        now: 0,
      },

      /**
       * @var {Array} 合并窗口的分组对象
       * @description
       *
       *   成员：
       *
       *        @prop {String}  id                合并窗口的id，自动生成
       *        @prop {String}  name              合并窗口的name，自动生成  主窗口name + 从窗口name
       *        @prop {String}  fromid            主窗口id(pageDescribe配置的key)，放在左边的窗口
       *        @prop {String}  toid              从窗口id(pageDescribe配置的key)，放在右边的窗口
       *        @prop {Object}  from              top left width height    from窗口信息
       *        @prop {Object}  to                top left width height      to窗口信息
       *        @prop {Number}  top left width height          当前合并窗口信息
       *        @prop {Number}  zIndex                         当前合并窗口层级
       */
      assign: [],

      /***********
       * @var {Object}  预备即将被合并的layer窗口描述对象
       * @description
       * 
       *   成员：
       *
       *          @prop {String}  id         当前追踪窗口的配置项里面的id属性(最后确定的时候有用)
       *          @prop {Number}  width      跟踪窗口的宽度
       *          @prop {Number}  height     跟踪窗口的高度
       *          @prop {Number}  top        跟踪窗口的top
       *          @prop {Number}  left       跟踪窗口的left
       */
      TEMP_ASSIGN_WINDOW: {
        /**
         * @var {String} 当前追踪窗口的配置项里面的id属性(最后确定的时候有用)
         */
        id: 0,
        /**
         * @var {Number} 跟踪窗口的宽度
         */
        width: 0,
        /**
         * @var {Number} 跟踪窗口的高度
         */
        height: 0,
        /**
         * @var {Number} 跟踪窗口的top
         */
        top: 0,
        /**
         * @var {Number} 跟踪窗口的left
         */
        left: 0,
      },

      /**
       * @var {Boolean} 卡贴区域是否可见  true 显示
       */
      menuVisible: false,

      /**
       * @var {Object} 卡贴临时描述对象
       * @description
       *
       *  成员: 
       *
       *     @prop {Boolean}  visble 是否显示
       *     @prop {Number}  x      鼠标x值
       *     @prop {Number}  y      鼠标y值
       *     @prop {String}  id     记录临时的key
       */
      tipsIcon: {
        /**
         * @var {Boolean}  窗口卡贴区域是否展示
         */
        visible: false,
        /**
         * @var {Number}   鼠标x值
         */
        x: 0,
        /**
         * @var {Number}   鼠标y值
         */
        y: 0,
        /**
         * @var {String}  记录临时的key
         */
        id: "",
      },

      /**
       * @var {Array} 卡贴列表
       * @description
       * 
       *  成员：
       *
       *        @prop {Number} id            自增，控制顺序
       *        @prop {String} name          展示的名称
       *        @prop {String} icon          图标 填写符号数字代码，没有就是空
       *        @prop {String} link          窗口id(pageDescribe配置的key)
       *
       *  来源：
       *
       *        1.窗口卡贴动作添加
       *        2.在pageDescribe初始化结束时自动载入带有图标的配置项
       */
      tipsSource: [],
    },

    /**
     * @member {Object} 临时描述对象
     * @description
     *
     *  成员：
     *
     *            @prop {Object} windowsMap        窗口弹层描述对象
     *            @prop {Object} windowsAssignMap  合并窗口描述对象
     *            @prop {Object} resizeFn          窗口resize触发函数合集
     */
    temp: {
      /**
       * @var {Object} 活动中的   窗口弹层描述对象
       * @description
       *
       *  成员：
       *
       *          @prop {String}   id            pageDescribe配置的key(沙箱窗口指的是沙箱配置项的key)
       *          @prop {String}   name          窗口名称
       *          @prop {Boolean}   select        true or false 是否被选中
       *          @prop {Long}  updatetime    最近一次活跃的时间，时间越近，排序越靠前
       */
      windowsMap: {},

      /**
       * 合并窗口描述对象
       *
       *        v2.0.0 已废弃
       *        临时对象使用constant里面的变量描述
       *        合并窗口使用assign这个响应式数据保存
       */
      windowsAssignMap: {},

      /**
       * 窗口resize触发函数合集
       */
      resizeFn: {},
    },

    /**
     * @member {Object} 窗口描述对象(非常重要)
     * @description
     *
     *    来源：
     *
     *        1.在这个配置项里面直接配置
     *        2.通过wakeUp参数传入
     *        3.通过layer.open方法自动生成
     *
     *    变量：
     *
     *        --------------       layui.layer.open  经典参数    --------------------
     *
     *          id          pageDescribe配置的key,open 参数项里面的id项，没有自动生成临时配置对象(临时对象不支持沙箱，卡贴等功能)
     *
     *          type        基本层类型：这里默认给1。3.加载层、4tips层。不支持
     *          title       标题：这里默认没得，可以通过name属性自动生成
     *          content     内容：默认''
     *          skin        主题：这里建议不要设置  默认会添加全局主题
     *          area        宽高：这里默认会通过position()方法自动生成
     *          offset      坐标： 这里默认会通过position()方法自动生成
     *          ......
     *          shade       遮罩：这里默认0，带遮罩层的弹层不支持
     *          shift/anim  动画：这里默认1
     *          fixed              这里默认false
     *          maxmin   最大最小化  这里默认是true
     *
     *      ---------------      新增自定义参数         ---------------------
     *
     *          name      v1.0.0 新增     窗口名称(如果没得title属性会 合并title <b> name </b>)
     *          porperty  v1.0.0 新增     窗口沙箱策略 singleton(默认) 不启用沙箱   property启用沙箱
     *          snapshoot v2.0.0 废弃     窗口快照地址
     *          moudle    v1.0.0 新增     使用layui模块名称，如果有就会在页面成功打开之后自动载入并执行里面的run方法
     *          assign    v2.0.0 新增     标志该窗口是否参与窗口合并操作
     *          assignBy  v2.0.0 新增     assign分组的id 默认是""。另外存在这个值说明已经被合并了，监测时会放过对这个配置项的监测
     *          min       v1.0.0 新增     默认是false，窗口是否处于最小化状态
     *          icon      v1.0.0 新增     窗口小图标 默认是""。拥有小图标会在li标签上使用小图标取代文字，卡贴上也会展示小图标。
     *          ignore    v2.5.0 新增     忽略标志  如果值为true 会放弃装饰此参数
     *
     *      ---------------      非配置参数(无须配置的临时参数) ---------------
     *
     *          index    v1.0.0 新增      保存由layer.open方法的返回值
     *          parent   v1.0.0 新增      保存当前窗口的jq对象
     *          topid    v1.0.0 新增      沙箱配置项指向原配置项的key
     *          porperty v1.0.0 新增      表明这个是一个沙箱配置项
     *          temp     v1.1.0 新增      表明这个窗口仅为临时配置窗口
     */
    pageDescribe: {},

    /**
     * @member {Object}  沙箱临时缓存关系表
     */
    pageMultiple: {},
  };

  /**
   * @global
   * @constant
   * @description
   *          将config参数的原版保存一份 =>
   *          {@link config}
   */
  let DEFALUT_CONFIG = _.cloneDeep(config);

  /***************************************************************************************************
   * 
   * @global
   * @constant
   * @private
   * @since  v1.1.2        
   * @description
   * 
   *    描述 ：
   * 
   *          内部使用的变量和方法。
   *          在实际开发中，部分窗口信息被搜录在这个对象里面，是对上面config.constant的补充
   *          与 {@link config.constant} 的区别是，config.constant里面的值允许外界再次通过参数的方式进行调整
   *          而这里的值仅内部使用，不提供外界修改的途径。
   * 
   *    成员  ：
   *
   *            @prop {String}  VERSION                 当前版本号，以windows组件为0.0.1计算
   *            @prop {Boolean}  FIRST_LOADING           判断是否是第一次加载,在loadCss完成回调之后修改为true      动态加载css 动态绑定window事件时去重
   *            @prop {String}  MANAGE_CONTAINER_ID     layerManage容器的id
   *            @prop {Number}  MIN_OFFSET_TOP          移动时top的灵敏度
   *            @prop {Number}  MIN_OFFSET_LEFT         移动时left的灵敏度
   *            @prop {Number}  MIN_TIPS_AREA_LEFT      卡贴区域最大left值
   *            @prop {Number}  MIN_TIPS_AREA_BOTTOM    卡贴区域最大bottom值
   *            @prop {Boolean}  TIPS_AREA_FLAG          是否更新卡贴标志
   *            @prop {String}  TIPS_AREA_ICON          卡贴默认图标
   *            @prop {Boolean}  TIPS_INSERT_FLAG        是否加入过临时卡贴
   *            @prop {Object}  MOVE_BASE_WINDOW        当前正准备移动的layer窗口描述对象
   *            @prop {Object}  MOVE_ASSIGN_WINDOW      当前可以合并的layer窗口描述对象
   *            @prop {Boolean} SYNC_ASSIGN_FLAG        锁定合并标志
   *            @prop {Object}  SHAKE_WINDOW_OPTION     窗口抖动临时描述对象
   *            @prop {Object}  MOVEING_ASSIGN_WINDOW   正在移动的合并窗口对象
   *            @prop {Object}  MOVEING_FLIP_WINDOW     正在监听上滑移动的呼出flip事件                            *
   * HISTORY:                                            *
   *     @Author: Malphite                                 *
   *     @Date: 2022-08-23         *
   *==================================================================================================*/
  let constant = {
    /**
     * @member {String} windows当前版本号
     * @desc
     * 
     *    以windows组件为0.0.1计算
     */
    VERSION: "2.5.1",

    /**
     * @member {Boolean} 判断是否是第一次加载 true代表已经加载过了
     */
    FIRST_LOADING: false,

    /**
     * @member {String} layerManage容器的id，动态往body里面插入dom时作为id
     */
    MANAGE_CONTAINER_ID: "layui-layer-layerManage",

    /**
     * @member {Number} 窗口合并等移动校验时的灵敏度
     * @desc
     * 
     *        当top 与指定 top相差的绝对值在这个范围内的触发事件
     */
    MIN_OFFSET_TOP: 50,

    /**
     * @member {Number} 窗口合并等移动校验时的灵敏度
     * @desc
     * 
     *        当left 与指定 left相差的绝对值在这个范围内的触发事件
     */
    MIN_OFFSET_LEFT: 50,

    /**
     * @member {Number} 卡贴区域最大left值
     * @desc
     *
     *        当窗口拖动到这个监测区域时弹出卡贴窗口，进行下一步的确定位置
     */
    MIN_TIPS_AREA_LEFT: 370,

    /**
     * @member {Number} 卡贴区域最大bottom值
     * @desc
     *
     *        当窗口拖动到这个监测区域时弹出卡贴窗口，进行下一步的确定位置
     */
    MIN_TIPS_AREA_BOTTOM: 450,

    /**
     * @member {Boolean} 是否更新卡贴标志
     * @desc
     *
     *        true可以将临时对象加入卡贴中
     *        false仅移除临时卡贴
     */
    TIPS_AREA_FLAG: false,

    /**
     * @member {String} 卡贴默认图标
     * @desc
     *
     *        如果原配置项没有图标会临时使用这个默认的图标
     */
    TIPS_AREA_ICON: "&#xe62a;",

    /**
     * @member {Boolean} 是否加入过临时卡贴
     */
    TIPS_INSERT_FLAG: false,

    /******************************************************
     * @member {Object} 当前正准备移动的layer窗口描述对象
     * @desc
     *
     *  成员 :
     *
     *          @prop {String}  id   保存它的配置id(pageDescribe配置的key)，以便取出它的其它配置信息
     *          @prop {Number}  offsetTop        在点击的这一时刻，它的top
     *          @prop {Number}  offsetLeft       在点击的这一时刻，它的left
     *          @prop {Number}  currentWidth     在点击的这一时刻，它的宽度
     *          @prop {Number}  currentHeight    在点击的这一时刻，它的高度
     */
    MOVE_BASE_WINDOW: {},

    /******************************************************
     * @member {Object} 当前可以合并的layer窗口描述对象
     * @desc
     *
     *  成员 :
     *
     *          @prop {String}  id   保存它的配置id(pageDescribe配置的key)，以便取出它的其它配置信息
     *          @prop {Number}  offsetTop        在点击的这一时刻，它的top
     *          @prop {Number}  offsetLeft       在点击的这一时刻，它的left
     *          @prop {Number}  currentWidth     在点击的这一时刻，它的宽度
     *          @prop {Number}  currentHeight    在点击的这一时刻，它的高度
     */
    MOVE_ASSIGN_WINDOW: {},

    /**
     * @member {Boolean} 锁定合并标志
     * @desc
     * 
     *    作用 : 
     * 
     *        在触发窗口卡贴的时候锁住此标志，阻止可能的窗口合并。
     *        在卡贴位置还原结束时更新此标志
     *        true -- 已锁定，阻止窗口合并和窗口合并检测
     *        false -- 解除锁定，可以正常的窗口合并
     */
    SYNC_ASSIGN_FLAG: false,

    /**
     * @member {Object} 窗口抖动临时描述对象
     * @desc
     *
     *  成员 ：
     *
     *          @prop {Boolean}  AWAKE       窗口抖动动作是否唤醒
     *          @prop {Number}  X           上一个监测点的X值
     *          @prop {Number}  Y           上一个监测点的Y值
     *          @prop {String}  DIRECTION   抖动的方向  UP 向上  DOWN 向下
     *          @prop {Array}  ACTION      动作列表   达到4个的时候触发抖动方法
     */
    SHAKE_WINDOW_OPTION: {
      /**
       * @var {Boolean} 窗口抖动动作是否唤醒
       */
      AWAKE: false,
      /**
       * @var {Number} 上一个监测点的X值
       */
      X: 0,
      /**
       * @var {Number} 上一个监测点的Y值
       */
      Y: 0,
      /**
       * @var {String} 抖动的方向  UP 向上  DOWN 向下 "" 重置状态
       */
      DIRECTION: "",
      /**
       * @var {Array} 动作列表   达到4个的时候触发抖动方法
       */
      ACTION: [],
    },

    /**
     * @member {Object} 正在移动的合并窗口对象
     * @desc
     *
     *  成员 ：
     *
     *        @prop {String}  id  合并窗口id
     *        @prop {Number}  X   参比x
     *        @prop {Number}  Y   参比y
     */
    MOVEING_ASSIGN_WINDOW: {},

    /**
     * @member {Object} 正在监听上滑移动的呼出flip事件
     * @desc
     *
     *  成员 ：
     *
     *       @prop {Boolean}  flag 判断是否开始
     *       @prop {Number}  X   参比x
     *       @prop {Number}  Y   参比y
     */
    MOVEING_FLIP_WINDOW: {
      flag: false,
      X: 0,
      Y: 0,
    },

  };

  /**
   * @global
   * @description
   *        窗口的jq对象
   */
  let $body = $("body");

  /***************************************************************************************************
   * 三.实现选项卡定位逻辑
   *
   * rollPage.left
   * rollPage.auto
   * rollPage.right
   *
   * 这里的逻辑是完全照搬layui admin里面的
   *                                                  *
   * HISTORY:                                            *
   *     @Author: Malphite                                 *
   *     @Date: 2022-07-26         *
   *==================================================================================================*/

  let rollPage = {
    /**
     * 将内容向右边移动一个可视化距离
     * root.outerWidth()  可视化距离
     * prefLeft 下一步还能藏多远的距离，如果是正数说明不太够了，将第一项 left=0 的都要抽出来。
     */
    left: function (root, index) {
      // 1.首先获取到 菜单条  它距离容器左侧的距离
      let tabsLeft = parseFloat(root.css("left"));
      /**
       * 2.判断这个距离tabsLeft的值(这个值只能是小于等于00)
       *  情况一、这个值是等于0的，说明菜单条的左侧已经已经不能再向右边移动了。直接返回，不做改变
       * (仅仅使用  !tabsLeft  可能是 ''  或者 null  如果是 == 0 也不行 '' == 0 也是true
       *  所以满足 !tabsLeft 和  <= 0 两种条件的就只有 数字 0 了)
       *  情况二、这个值小于0
       */
      if (!tabsLeft && tabsLeft <= 0) return;
      /**
       * 3.计算需要移动的距离
       *  到此 tabsLeft必然小于0 ， root.outerWidth()菜单可视宽度是大于0 的
       *  -(tabsLeft + root.outerWidth())    ==>  - -tabsLeft  - root.outerWidth();
       *  - -tabsLeft 是菜单条超过左侧的距离
       *  那么prefLeft的实际意义是  菜单条 向右移动一个 菜单可视宽度，此时  菜单条和容器左侧的距离
       *
       *
       *
       *  prefLeft：首先使用菜单可视宽度(root.outerWidth())加上tabsLeft,得到移动后，原来展示的信息可保留的最大距离
       *    ( 相当于可视距离减去移动被替换的距离，得到剩下可保留的原来的最大距离 )
       *    因为这个tabsLeft必然小于0，所以最后的结果必然小于 root.outerWidth()
       *    情况一、如果这个距离大于0等于0，你左边超出的部分，菜单可视宽度完全可以展示出来，说明只需要把左边超出的部分移动展示出来。
       *    情况二、如果这个距离小于0，说明你左边超出的部分，要想一次展示出来，整个菜单可视距离都利用上还不够，只能展示一部分。
       */
      let prefLeft = -(tabsLeft + root.outerWidth());
      if (prefLeft >= 0) return root.css("left", 0);
      /**
       * 现在假设 强行将菜单的left设置为了0，菜单的左侧就对齐了，那么右侧会超出来一大截，超出的距离就是 prefLeft的等值
       * 此时
       * 依次遍历所有的li标签  它们left值第一个是0 后面慢慢增大
       * 当left值增加到等于或者超过 ‘prefLeft的等值’ 时，此时如果这个点处在菜单可视化左侧的0点，可以认为这样就刚刚好向右移了一个可视化距离
       *       a                b
       * |__________________|_________|   如果想求a比比长多少，可以将两个线段重合起来比较
       *               a-b
       * |___________|______|
       */
      root.children("li").each(function (index, item) {
        let li = $(item),
          left = li.position().left;
        if (left >= prefLeft) {
          root.css("left", -left);
          return false;
        }
      });
    },
    /**
     * 将所选中的内容展示到菜单可视范围内
     */
    auto: function (root, index) {
      let tabsLeft = parseFloat(root.css("left"));
      // 获得被选中li标签
      let thisLi = root.find('[lay-id="' + index + '"]');
      if (!thisLi[0]) return;
      let thisLeft = thisLi.position().left;
      // tabsLeft 必然是一个负数  -tabsLeft 指的是root藏住的长度
      // 如果 thisLeft < -tabsLeft 代表这个li被藏在左边了
      // 那就直接把它放在左边第一个的位置
      if (thisLeft < -tabsLeft) {
        return root.css("left", -thisLeft);
      }
      // thisLeft + thisLi.outerWidth() 指的是li标签的尾部到root头部的距离
      // outerWidth - tabsLeft 指的是可视的尾部到root头部的距离
      // li被藏在了右边看不全
      if (thisLeft + thisLi.outerWidth() >= root.outerWidth() - tabsLeft) {
        // 计算被藏住的长度
        let subLeft =
          thisLeft + thisLi.outerWidth() - (root.outerWidth() - tabsLeft);
        root.children("li").each(function (i, item) {
          let li = $(item),
            left = li.position().left;
          if (left + tabsLeft > subLeft) {
            root.css("left", -left);
            return false;
          }
        });
      }
    },
    /**
     * 将内容向左边移动一个可视化距离
     */
    right: function (root, index) {
      let tabsLeft = parseFloat(root.css("left"));
      // left + li.outerWidth() li标签的位置
      // root.outerWidth() - tabsLeft 被展示到的最远位置
      // 将第一个在右边被遮住的li放在第一个展示
      root.children("li").each(function (index, item) {
        let li = $(item),
          left = li.position().left;
        if (left + li.outerWidth() >= root.outerWidth() - tabsLeft) {
          root.css("left", -left);
          return false;
        }
      });
    },
  };

  /***************************************************************************************************
   * 
   * @namespace REFLACT
   * @desc
   * 
   *    实现上述属性的调用
   * 
   *    成员: 
   * 
   *          getWindow(key)                获取当前窗口的jq对象
   *          getTopIndex()                 获取当前置顶窗口的key, 窗口描述配置项pageDescribe里面的key值
   *          setTopIndex(key)              设置当前置顶的窗口的key,窗口描述配置项pageDescribe里面的key值
   *          getMaxIndex()                 获取当前最高的zIndex层级
   *          setMaxIndex(index)            设置当前最高的zIndex层级
   *          getInternalIndex()            获取{@linkplain config.constant.INTERNAL_INDEX 当前自增序列}
   *          getBaseWindowsWidth()         获取{@linkplain config.constant.BASE_WINDOWS_WIDTH 窗口默认宽度}
   *          getBaseWindowsTop()           获取{@linkplain config.constant.BASE_WINDOWS_TOP_OFFSET 窗口默认的top偏移量}
   *          getBaseWindowsOffset()        获取{@linkplain config.constant.BASE_WINDOWS_OFFSET 每一次窗口的偏移量}
   *          getBaseWindowsLeft()          获取{@linkplain config.constant.BASE_WINDOWS_LEFT_OFFSET 窗口默认的left偏移量}
   *          getBaseWindowsBottom()        获取{@linkplain config.constant.BASE_WINDOWS_BOTTOM_OFFSET 窗口默认的bottom偏移量}
   *          getWindowsVerticalDirection()     获取{@linkplain config.constant.BASE_WINDOWS_TOP_DIRECTION 窗口的垂直方向}
   *          setWindowsVerticalDirection(v)    设置{@linkplain config.constant.BASE_WINDOWS_TOP_DIRECTION 窗口的垂直方向}
   *          getWindowsHorizontalDirection()   获取{@linkplain config.constant.BASE_WINDOWS_LEFT_DIRECTION 窗口的水平方向}
   *          setWindowsHorizontalDirection(v)  设置{@linkplain config.constant.BASE_WINDOWS_LEFT_DIRECTION 窗口的水平方向}
   * 
   *          getSingletonKey()             获取{@linkplain config.constant.SINGLETON 禁用沙箱标志关键字}
   *          getDisplayMultipleKey()       获取{@linkplain config.constant.DISPLAY_MULTIPLE_LAYER 全局沙箱配置}
   *          getInvokeName()               获取{@linkplain config.constant.METHOD_AUTOEXEC_NAME 自执行方法名称}
   * 
   *          getFitPosition()              获取{@linkplain config.constant.ENABLE_FIT_POSITON 启用位置自适应}                                        
   * 
   *          getMaxClass()                 获取最大化层级class名称
   *          getMinClass()                 获取反最大化层级class名称
   *          
   *          getHideClass()                获取layui原生隐藏class名称
   *          getWindowsMap(key)            获取{@linkplain config.temp.windowsMap 临时配置项windowsMap}
   *          deletetWindowsMap(key)        移除{@linkplain config.temp.windowsMap 临时配置项windowsMap} 成员
   *          getPageDescribe(key)          获取{@linkplain config.pageDescribe 窗口描述配置项pageDescribe}
   *          deletePageDescribe(key)       移除{@linkplain config.pageDescribe 窗口描述配置项pageDescribe}成员
   *          getPageMultiple(key)          获取{@linkplain config.pageMultiple 沙箱临时缓存关系表pageMultiple}
   *          deletePageMultiple(group, key)    移除{@linkplain config.pageMultiple 沙箱临时缓存关系表pageMultiple}成员
   * 
   *          getResizeFn(key)              获取{@linkplain config.temp.resizeFn 窗口resize触发函数合集}              
   *          deleteResizeFn(key)           移除{@linkplain config.temp.resizeFn 窗口resize触发函数合集}里面对应的成员
   * 
   * 
   *                         *                                          *
   * HISTORY:                                            *
   *     @Author: Malphite                                 *
   *     @Date: 2022-09-19
   *     @since: v2.0.0        *
   *==================================================================================================*/
  let REFLACT = {

    /**
     * @method  获取当前窗口的jq对象
     * @param {String} key  pageDescribe配置项里面的key
     * @returns             当前窗口的jq对象
     */
    getWindow(key) {
      return config.pageDescribe[key].parent;
    },

    /**
     * @method  获取当前置顶窗口的key
     * @returns 窗口描述配置项pageDescribe里面的key值
     */
    getTopIndex(){
      return config.constant.TOP_INDEX;
    },

    /**
     * @method  设置当前置顶的窗口的key
     * @param {String} key 窗口描述配置项pageDescribe里面的key值
     */
    setTopIndex(key){
      config.constant.TOP_INDEX = key;
    },

    /**
     * @method  获取当前最高的zIndex层级
     * @returns 
     */
    getMaxIndex(){
      return config.constant.MAX_INDEX;
    },

    /**
     * @method  更新当前最高的zIndex层级
     * @param {*} index 层级 
     */
    setMaxIndex(index){
      config.constant.MAX_INDEX = index;
    },

    /**
     * @method  获取{@linkplain config.constant.INTERNAL_INDEX 当前自增序列} 调用方法后自动加一
     * @returns 当前自增序列
     */
    getInternalIndex(){
      return config.constant.INTERNAL_INDEX++;
    },


    /**
     * @method 获取{@linkplain config.constant.BASE_WINDOWS_WIDTH 窗口默认宽度}
     * @returns 窗口默认宽度
     */
    getBaseWindowsWidth(){
      return config.constant.BASE_WINDOWS_WIDTH;
    },

    /**
     * @method 获取{@linkplain config.constant.BASE_WINDOWS_TOP_OFFSET 窗口默认的top偏移量}
     * @returns 窗口默认的top偏移量
     */
    getBaseWindowsTop(){
      return config.constant.BASE_WINDOWS_TOP_OFFSET;
    },

    /**
     * @method 获取{@linkplain config.constant.BASE_WINDOWS_OFFSET 每一次窗口的偏移量}
     * @returns 每一次窗口的偏移量
     */
    getBaseWindowsOffset(){
      return config.constant.BASE_WINDOWS_OFFSET;
    },

    /**
     * @method 获取{@linkplain config.constant.BASE_WINDOWS_LEFT_OFFSET 窗口默认的left偏移量}
     * @returns 窗口默认的left偏移量
     */
    getBaseWindowsLeft(){
      return config.constant.BASE_WINDOWS_LEFT_OFFSET;
    },

    /**
     * @method 获取{@linkplain config.constant.BASE_WINDOWS_BOTTOM_OFFSET 窗口默认的bottom偏移量}
     * @returns 
     */
    getBaseWindowsBottom(){
      return config.constant.BASE_WINDOWS_BOTTOM_OFFSET;
    },

    /**
     * @method 获取{@linkplain config.constant.BASE_WINDOWS_TOP_DIRECTION 窗口的垂直方向}
     * @returns 窗口的垂直方向
     */
    getWindowsVerticalDirection(){
      return config.constant.BASE_WINDOWS_TOP_DIRECTION;
    },


    /**
     * @method 设置{@linkplain config.constant.BASE_WINDOWS_TOP_DIRECTION 窗口的垂直方向}
     * @param {String} v 方向
     */
    setWindowsVerticalDirection(v){
      config.constant.BASE_WINDOWS_TOP_DIRECTION = v;
    },


    /**
     * @method 获取{@linkplain config.constant.BASE_WINDOWS_LEFT_DIRECTION 窗口的水平方向}
     * @returns 窗口的水平方向
     */
    getWindowsHorizontalDirection(){
      return config.constant.BASE_WINDOWS_LEFT_DIRECTION;
    },

    /**
     * @method 设置{@linkplain config.constant.BASE_WINDOWS_LEFT_DIRECTION 窗口的水平方向}
     * @param {String} v 方向
     */
    setWindowsHorizontalDirection(v){
      config.constant.BASE_WINDOWS_LEFT_DIRECTION = v;
    },

    /**
     * @method 获取{@linkplain config.constant.SINGLETON 禁用沙箱标志关键字}
     * @returns 
     */
    getSingletonKey(){
      return config.constant.SINGLETON;
    },

    /**
     * @method 获取{@linkplain config.constant.DISPLAY_MULTIPLE_LAYER 全局沙箱配置}
     * @returns 
     */
    getDisplayMultipleKey(){
      return config.constant.DISPLAY_MULTIPLE_LAYER;
    },

    /**
     * @method 获取{@linkplain config.constant.METHOD_AUTOEXEC_NAME 自执行方法名称}
     * @returns 
     */
    getInvokeName(){
      return config.constant.METHOD_AUTOEXEC_NAME;
    },

    /**
     * @method 获取{@linkplain config.constant.ENABLE_FIT_POSITON 启用位置自适应}    
     * @returns 
     */
    getFitPosition(){
      return config.constant.ENABLE_FIT_POSITON;
    },

    /**
     * @method  获取layui原生隐藏class名称
     * @returns 
     */
    getHideClass(){
      return config.constant.HIDE;
    },

    /**
     * @method  获取最大化层级class名称
     * @returns 
     */
    getMaxClass(){
      return config.constant.MAX_CLASSNAME;
    },
    
    /**
     * @method  获取反最大化层级class名称
     * @returns 
     */
    getMinClass(){
      return config.constant.MIN_CLASSNAME;
    },

    /**
     * @method  获取{@linkplain config.temp.windowsMap 临时配置项windowsMap}
     * @param {String} key 临时配置项windowsMap里面的key值，如果不为空就返回key对应的值
     * @returns 临时配置项windowsMap或者它的成员
     */
    getWindowsMap(key){
      return key ? config.temp.windowsMap[key] : config.temp.windowsMap;
    },

    /**
     * @method  移除{@linkplain config.temp.windowsMap 临时配置项windowsMap}成员
     * @param {String} key 临时配置项windowsMap里面的key值
     */
    deletetWindowsMap(key){
      delete config.temp.windowsMap[key];
    },

    /**
     * @method 获取{@linkplain config.pageDescribe 窗口描述配置项pageDescribe}
     * @param {String} key  窗口描述配置项pageDescribe里面的key值，如果不为空就返回key对应的值
     * @returns 窗口描述配置项pageDescribe或者它的成员
     */
    getPageDescribe(key){
      return key ? config.pageDescribe[key] : config.pageDescribe;
    },

    /**
     * @method 移除{@linkplain config.pageDescribe 窗口描述配置项pageDescribe}成员
     * @param {*} key 窗口描述配置项pageDescribe里面的key值
     */
    deletePageDescribe(key){
      delete config.pageDescribe[key];
    },

    /**
     * @method 获取{@linkplain config.pageMultiple 沙箱临时缓存关系表pageMultiple}
     * @param {*} key 
     * @returns 沙箱临时缓存关系表pageMultiple或者它的成员
     */
    getPageMultiple(key){
      return key ? config.pageMultiple[key] : config.pageMultiple;
    },

    /**
     * @method 移除{@linkplain config.pageMultiple 沙箱临时缓存关系表pageMultiple}里面的成员
     * @param {*} group 
     * @param {*} key 
     */
    deletePageMultiple(group, key){
      delete config.pageMultiple[group][key];
    },

    /**
     * @method 获取{@linkplain config.temp.resizeFn 窗口resize触发函数合集}
     * @param {String} key resize事件的分组id,推荐使用窗口id(pageDescribe配置项里面的key)
     * @returns resize触发函数合集或者其成员
     */
    getResizeFn(key){
      return key ? config.temp.resizeFn[key] : config.temp.resizeFn;
    },

    /**
     * @method 移除{@linkplain config.temp.resizeFn 窗口resize触发函数合集}里面对应的成员
     * @param {String} key resize事件的分组id,推荐使用窗口id(pageDescribe配置项里面的key)
     */
    deleteResizeFn(key){
      delete config.temp.resizeFn[key];
    },
    
    


  };

  /***************************************************************************************************
   * 快速调用 REFLACT 对象里面的方法
   *
   *  参数列表：
   *
   *        @param {String} scope 执行方法时指定的this指向
   *        @param {String} name REFLACT对象里面的方法名称
   *        @param {...any} param 执行方法的参数列表
   *                                                 *
   * HISTORY:                                            *
   *     @Author: Malphite                                 *
   *     @Date: 2022-09-20
   *     @since: v2.0.0            *
   *==================================================================================================*/
  function invokeMethod(scope = window, name = "getWindow", ...param) {
    return REFLACT[name].call(scope, ...param);
  }

  /***************************************************************************************************                                *
   * @namespace PROXY
   * @desc
   * 
   *      部分方法集合(主要是使用jQuery操作dom的步骤方法)
   *
   *      成员:
   *
   *          getActionContainer()            获取操作栏（li标签）
   *          getMarkofMax()                  获取最大化标记dom
   *          getTipsContainer()              获取小窗口组
   *                                                *                                          *
   * HISTORY:                                            *
   *     @Author: Malphite                                 *
   *     @Date: 2022-09-19
   *     @since: v2.0.0         *
   *==================================================================================================*/
  let PROXY = {

    /**
     * @method 获取操作栏（li标签）
     * @desc
     * 
     *    值得注意是this应指向windows组件应用
     * 
     * @returns 操作栏jq对象
     */
    getActionContainer() {
      return this.parent.find("#" + config.constant.HEADERS_ID);
    },

    /**
     * @method 获取最大化标记dom jq对象
     * @desc
     * 
     *    在窗口最大化的时候，某些区域需要降低它的zIndex，这里来获取这些已标记的dom
     * 
     * @returns 标记过的jq对象
     * 
     */
    getMarkofMax(){
      return $('.' + REFLACT.getMaxClass());
    },

    /**
     * @method 获取小窗口组
     * @desc
     *        值得注意是this应指向windows组件应用
     * @returns 
     */
    getTipsContainer() {
      return this.parent.find("." + config.constant.CONTAINER_TIPS_CLASSNAME);
    },

  };

  // 定义整个菜单控制模块
  layui.binder.extend({
    name: "windows",
    data: config.base,
    template: `
    <div>
      <div id="${config.constant.CONTAINER_ID}" class = "${config.constant.MAX_CLASSNAME}">
        <div class="layui-windows-menu" title = "打开菜单" @click = "showMenu">
          <i class="layui-icon ">&#xe609;</i>
        </div>
        <div class="layui-windows-group">
          <div class="layui-icon layadmin-tabs-control layui-icon-prev" @click="rollPageLeft"></div>
          <div class="layui-icon layadmin-tabs-control layui-icon-next" @click="rollPageRight"></div>
          <div class="layui-tab">
            <ul class="layui-tab-title" id="${config.constant.HEADERS_ID}" v-each="livelyPool" mark="arr" key = "index" @mousedown = "startFlipEvent">
              <li :class="layui-tab-title-{{{{arr.select}}}}" lay-id="#{arr.id}"  @mouseenter="showWindowTip"  @mouseleave="hideWindowTip"  @click="setGroupTop(#{arr.id})" >
                <i class="layui-icon">#{arr.icon == "" ? "" : arr.icon}</i> {{{{arr.name}}}}
              </li>
            </ul>
          </div>
        </div>
        <div class="layui-windows-notice" title = "关闭全部" @click = "closeAll" @mouseenter="appendHover(0)" @mouseleave="removeHover(0)" @mousemove = "moveHover(0)">
          <i class="layui-icon layui-icon-close"></i>
        </div>
        <!-- 预览小窗口 -->
        <div class="${config.constant.CONTAINER_TIPS_CLASSNAME}"  @mouseenter="hoverTip"  @mouseleave="hideWindowTip" v-each="hoverPool" mark="arr" key = "id"  >
          <div class = "layui-windows-tips"  @mouseenter="appendHover(#{arr.id})" @mouseleave="removeHover(#{arr.id})" @mousemove = "moveHover(#{arr.id})"  wid = "#{arr.id}" @click="setHoverTop(#{arr.id})">
            <i class="layui-icon layui-icon-close" @click="closeFromTip" title = "关闭" ></i>
            <div>#{arr.name}</div>
          </div>  
        </div>
        <!-- 3d flip -->
        <div class = "layui-windows-flip" :class = "layui-windows-flip-{{flip.show}}" >
          <i class="layui-icon layui-icon-close"   @click = "closeFlip"  title = "关闭"></i>
          <i class="layui-icon layui-icon-prev" @click = "moveFlipRight"></i>
          <i class="layui-icon layui-icon-next" @click = "moveFlipLeft"></i>
        </div>
        <!-- 窗口合并 临时跟踪方框 -->
        <div class = "layui-windows-track" :class = "trackClass" :style = "trackStyle"></div>
      </div>
      <!-- 窗口合并 方框组-->
      <div class = "layui-windows-assign" v-each = "assign" mark = "arr" key = "id" >
        <div class = "layui-windows-assign-body" :class = "layui-windows-assign-body-{{{{arr.show}}}}" :style = "z-index:{{{{arr.zIndex}}}};width:{{{{arr.width}}}}px;height:{{{{arr.height}}}}px;top:{{{{arr.top}}}}px;left:{{{{arr.left}}}}px"  @mousedown = "setAssignWindowTop({{index}})" >
          <div class = "layui-windows-assign-title" assignid = "{{index}}" @mousedown = "mousedownEvent" >{{{{arr.name}}}}
            <div class = "layui-windows-assign-title-min">
              <i class="layui-icon layui-icon-subtraction" assignid = "{{index}}"  @click = "minAssignWindow"  title = "最小化"></i>
            </div>
            <div class = "layui-windows-assign-title-close">
              <i class="layui-icon layui-icon-close"  assignid = "{{index}}"  @click = "closeAssignWindow"  title = "关闭"></i>
            </div>
          </div>
          <div class = "layui-windows-assign-border"></div>
        </div>
      </div>
      <!-- 窗口卡贴 -->
      <div class = "layui-windows-tile-lively-icon" 
        :class = "layui-windows-tile-lively-icon-{{tipsIcon.visible}}" 
        :style = "top: {{tipsIcon.y}}px;left: {{tipsIcon.x}}px;">
        <i class="layui-icon ">&#xe62a;</i>
      </div>
      <div class = "layui-windows-tile" :class = "layui-windows-tile-{{menuVisible}}" @click = "stopCloseTips" >
        <i class="layui-icon layui-windows-tile-main-icon">&#xe609;</i>
        <div class="layui-windows-tile-main-text">{{username}}</div>
        <blockquote class="layui-elem-quote">窗口卡贴</blockquote>
        <div class="layui-form-item" style = "margin:0">
          <div class = "layui-notice-menu" @mousemove = "fitMenuStyle"  v-each="tipsSource" mark = "arr" key = "id">
            <div class = "layui-notice-menu-group" :lay-link = "{{arr.link}}"  tipkey = "{{index}}"  @click = "clickSubMenu(#{arr.link})">
              <div class = "layui-notice-menu-title">
                <i class="layui-icon layui-menu-icon">#{arr.icon}</i>
              </div>
              <div class = "layui-notice-menu-text">
                #{arr.name}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>  
    `,
    watchs: {
      /**
       * 预览的时候，通过增加class的方式实现当前窗口显示，其它窗口隐藏的效果
       * @param {*} value
       */
      hover(value) {
        if (value.id) {
          this.tabsBody(value.id)
            .removeClass("layui-windows-preview")
            .addClass("layui-windows-preview");
          $("body")
            .removeClass("layui-windows-preview")
            .addClass("layui-windows-preview");
        } else if (value.id == 0) {
          $("body")
            .removeClass("layui-windows-preview")
            .addClass("layui-windows-preview");
        } else {
          $(".layui-windows-preview").removeClass("layui-windows-preview");
        }
      },

      livelyPool() {
        // 如果有关闭窗口，打开窗口，合并窗口等更新操作  有打开3d flip的场合 关闭3d flip
        if(this.flip.show) this.closeFlip();
        this.parent.find(".select-tip-fixed").removeClass("select-tip-fixed");
      },

      hoverPool(value) {
        if (value && value.length > 0) {
          let $this = this.parent
            .find("#" + config.constant.HEADERS_ID)
            .find('[lay-id="' + this.$data.hoverPool[0].groupid + '"]');
          let $target = this.parent.find(
            "." + config.constant.CONTAINER_TIPS_CLASSNAME
          );
          if (!$this.get(0)) return;
          // 获取当前dom元素的位置
          let left = $this.get(0).getBoundingClientRect().left;
          let width = $this.outerWidth();
          let finalLeft = left - ($target.width() - width) / 2;
          // 设置tips位置
          $target.css({ left: finalLeft < 0 ? 0 : finalLeft + "px" });
        }
      },
    },
    computeds: {
      /**
       * 控制跟踪框的显示与隐藏
       * 有id说明有窗口可以操作，就显示。没得就隐藏
       */
      trackClass() {
        return this.TEMP_ASSIGN_WINDOW.id ? "" : "layui-hide";
      },

      /**
       * 控制跟踪框的位置与大小
       */
      trackStyle() {
        return `top:${this.TEMP_ASSIGN_WINDOW.top}px;left:${this.TEMP_ASSIGN_WINDOW.left}px;width:${this.TEMP_ASSIGN_WINDOW.width}px;height:${this.TEMP_ASSIGN_WINDOW.height}px;`;
      },
    },
    methods: {
      /**
       * 将操作栏上面的li标签整体向左移动
       *
       *        主要是在点击操作栏上面的对应小工具按钮时触发
       */
      rollPageLeft() {
        rollPage.left(PROXY.getActionContainer.call(this));
      },
      /**
       * 将操作栏上面的li标签整体向右移动
       *
       *        主要是在点击操作栏上面的对应小工具按钮时触发
       */
      rollPageRight() {
        rollPage.right(PROXY.getActionContainer.call(this));
      },
      /**
       * 调整操作栏，使对应的li标签露出
       * 
       *        在setTop等操作后自适应下面操作栏
       * 
       * @param {*} index  窗口的id(pageDescribe配置的key)
       */
      rollPageAuto(index) {
        rollPage.auto(PROXY.getActionContainer.call(this), index);
      },
      /**
       * 获取指定的窗口的jq对象
       * @param {*} index 窗口的id(pageDescribe配置的key)
       */
      tabsBody(index) {
        return REFLACT.getWindow(index);
      },
      /**
       * @method 将指定的窗口置顶
       * @param {String} index 这个指在pageDescribe配置项里面的key或者id，可以通过open方法弹出该窗口
       */
      setTop(index = config.constant.TOP_INDEX) {
        let that = this;
        if (!index) return;

        // 置顶时，如果有打开3d flip的场合 关闭3d flip
        if(that.flip.show) that.closeFlip();

        /**
         * 获取当前待置顶窗口对应的操作配置项
         */
        let wConfig = REFLACT.getPageDescribe(index);
        /**
         * 获取当前最大的层级
         */
        let zIndex = REFLACT.getMaxIndex();
        /**
         * 更新zIndex值，达到结果最近访问的窗口排在上面(预留最顶层的位置)
         * 1.根据当前更新时间，由近时间到远时间对 windowsMap 进行排序
         * 2.在1的顺序下遍历它，并更新每个窗口的zIndex的值
         */
        _.each(
          _.sortBy(REFLACT.getWindowsMap(), (u) => - u.updateTime),
          function (v) {
            that.tabsBody(v.id).css("z-index", --zIndex);
            // 记录当前的层级，在windows预览恢复的时候恢复为该层级
            REFLACT.getPageDescribe(v.id).nowIndex = zIndex;
          }
        );

        /**
         * 遍历活动组池(更新select选中状态):
         * 
         *    除了index在children列表里面的分组更新为选中，其它的分组切换成未选中状态
         *    
         */
        _.each(that.livelyPool, function (v) {
          let childernflag = false;
          _.each(v.children, function (v1) {
            if (v1 == index) childernflag = true;
          });
          v.select = childernflag;
        });

        /**
         * 更新当前置顶窗口的配置项最近活跃时间
         */
        REFLACT.getWindowsMap(index).updateTime = new Date();

        /**
         * 调整当前待置顶窗口状态
         * 1.显示这个窗口
         * 2.窗口zIndex修改为最大的index
         * 3.如果有最小化，恢复最小化
         */
        that
          .tabsBody(index)
          .css("z-index", REFLACT.getMaxIndex())
          .removeClass(REFLACT.getHideClass());
        wConfig.nowIndex = REFLACT.getMaxIndex();
        wConfig.show = true;

        // 如果有最小化，恢复最小化
        if(wConfig.min) that.restore(index);

        if (REFLACT.getTopIndex() == index) {
          /**
           * @todo 如果当前的窗口已经是最顶层了，需要闪烁提醒
           */
        }
        // 更新topIndex
        REFLACT.setTopIndex(index);
        // 菜单选项卡自适应
        that.rollPageAuto(index);

        /**
         * 
         * @todo 合并窗口特殊处理。(置顶窗口操作，不会有窗口在这个操作里面被最小化或者隐藏)
         * @desc
         * 
         *    遍历合并项参数 {@linkplain config.base.assign 响应式合并项渲染参数}
         * 
         *    两个窗口中只要有一个窗口被置顶，另一个窗口也要随之被置顶。
         *    随后临时合并遮罩层也被置顶
         * 
         *    两个窗口中全部隐藏时要将临时合并遮罩层隐藏
         * @since v2.0.0
         */
        _.each(that.assign, function (v) {
          /**
           * 判断当前遮罩层的显示或隐藏
           * 1.合并组中两个窗口均处于隐藏状态就隐藏合并遮罩层
           * 2.合并组中至少一个窗口处于显示状态就显示合并遮罩层
           */
          let showFlag =
            REFLACT.getPageDescribe(v.fromid).show ||
            REFLACT.getPageDescribe(v.toid).show;
          if (!showFlag) {
            /**
             * 隐藏合并遮罩层
             */
            v.show = false;
          } else {
            /**
             * 显示合并遮罩层
             */
            v.show = true;
            /**
             * 将这个合并分组下的窗口全部接触最小化
             * 因为这个判断中所有窗口都需要调整为显示状态
             */
            if (REFLACT.getPageDescribe(v.fromid).min) that.restore(v.fromid);
            if (REFLACT.getPageDescribe(v.toid).min) that.restore(v.toid);
            /**
             * 设置zIndex层级
             *    被合并的窗口应该共享zIndex层级，取两者中最大的一个作为整体的zIndex
             *    调整主窗口、从窗口和合并遮罩层的zIndex层级
             */
            let maxIndex = Math.max(
              REFLACT.getPageDescribe(v.fromid).nowIndex,
              REFLACT.getPageDescribe(v.toid).nowIndex
            );
            // 合并遮罩层的zIndex层级赋值
            v.zIndex = maxIndex;
            // 主、从窗口参数调整
            REFLACT.getPageDescribe(v.fromid).nowIndex = maxIndex;
            REFLACT.getWindow(v.fromid).css("z-index", maxIndex);
            REFLACT.getPageDescribe(v.toid).nowIndex = maxIndex;
            REFLACT.getWindow(v.toid).css("z-index", maxIndex);
          }
        });
      },
      /**
       * @method 添加resize 事件
       * @param {*} id  事件的分组id,这里推荐使用窗口id(pageDescribe配置项里面的key)
       * @param {*} fn  resize回调函数(), 事件的分组id会作为参数传入
       */
      resize: function (id, fn) {
        // 如果之前已经绑定过了，就进行解绑操作
        if (REFLACT.getResizeFn(id)) {
          $(window).off("resize", REFLACT.getResizeFn(id));
          REFLACT.deleteResizeFn(id);
        }
        //如果是清除 resize 事件，则终止往下执行
        if (!_.isFunction(fn)) return;
        // 添加resize事件
        REFLACT.getResizeFn().id = function(){
          debounce(fn, { args: [id] });
        };
        $(window).on("resize", REFLACT.getResizeFn(id));
      },

      /**
       * @global
       * @public
       * @method open 在打开一个图层，装饰参数(核心方法)
       * 
       * @todo
       * {@link layer.open}  ### 需要在这个方法之前拦截参数进行修饰
       * 
       * @param {*} opt pageDescribe配置项里面的key或者里面的id,现在也可以直接是layer.open 的配置项参数
       * @param {Object/Function} data 传入的参数，或者一个回调函数，回调函数的参数config是对应的pageDescribe配置项
       * @returns  1.返回的是一个配置项参数，用来供layer.open方法继续处理 2.窗口已打开返回index，这也是原open方法的返回值
       * @since v1.0.0
       * @desc
       * 
       *    原理：
       * 
       *       1. 过滤加载层和tips层(这种图层无需集中管理)，带遮罩层的也过滤掉
       *       2. 判断非配置项的参数传入: 如果传入的是字符串那么会根据需要去补全配置参数
       *       3. 确认窗口id，自动生成会匹配{@linkplain config.pageDescribe 窗口描述配置对象}
       *       4. 已描述为打开的窗口直接返回并调用回调函数
       *       5. 计算窗口弹出坐标以及大小(以配置项为准)
       *       6. 如果是沙箱模式就生成临时沙箱配置参数
       *       7. 补全title属性并合并配置参数
       *       8. 装饰success、end、cancel、full、restore、resizing等回调函数
       *       9. 如果没有content生成content
       *       10. 将参数返回。layui.layer.open接手参数并弹出窗口
       */
      open(opt = {}, data = {}) {
        // 过滤掉加载层和tips层
        if (opt.type == "3" || opt.type == "4") return opt;
        // 过滤掉带遮罩的窗口
        if (opt.shade) return opt;
        // 特殊窗口有皮肤的跳过
        if (opt.skin) return opt;
        // 显式的声明忽略的
        if (opt.ignore) return opt;
        /**
         * 参数1 opt
         * 
         *    写法一(传入一个字符串):
         *   
         *      1.  传入字符串不含中文字符,说明期望传入的是窗口id
         *      2.  传入字符串含有中文字符,说明期望传入的是窗口名称
         * 
         *      第一种情况以窗口id作为窗口名称，第二种情况需要自动生成一个窗口id
         */
        if (_.isString(opt)) {
          let _id = "";
          // 中文字符串判断
          if (/[\u4E00-\u9FA5\uF900-\uFA2D]{1,}/.test(opt)) {
            /**
             * 包含中文，重新自动的生成ID
             * 内部自动生成窗口id的会被标记为临时窗口
             * temp为true
             */
            _id = "TEMP_" + REFLACT.getInternalIndex();
            opt = { id: _id, name: opt, type: 1, temp: true };
          } else {
            /**
             * 不包含中文的传入的就是窗口id了,尝试从{@linkplain config.pageDescribe 窗口描述对象} 中去获取完整配置
             * 
             */
            opt = REFLACT.getPageDescribe(opt)
              ? REFLACT.getPageDescribe(opt)
              : { id: opt, name: opt, type: 1, temp: false };
          }
        } else {
          // 经过观察msg的type为空，需要排除
          if (opt.type === undefined) return opt;
        }
        /**
         * 如果其它情况传入的参数中没有明确窗口id的,也要生成窗口id并标记为临时窗口
         */
        if (!opt.id) {
          opt.id = "TEMP_" + REFLACT.getInternalIndex();
          opt.temp = true;
        }
        /**
         * 没有缓存窗口描述对象的将信息反填入 {@linkplain config.pageDescribe 窗口描述对象} 中管理
         * 
         */
        if (!REFLACT.getPageDescribe(opt.id)) {
          REFLACT.getPageDescribe()[opt.id] = {
            id: opt.id,
            type: opt.type || 1,
            content: opt.content || "",
            shade: opt.shade || 0,
            shift: opt.shift || opt.anim || 1,
            fixed: opt.fixed || false,
            maxmin: opt.maxmin || true,
            name: opt.name,
            porperty: opt.porperty || "singleton",
            snapshoot: opt.snapshoot || null,
            moudle: opt.moudle || "",
            assign: opt.assign || false,
            assignBy: opt.assignBy || "",
            /**
             * 为了防止用户重复调用无id的方法来创建这个配置对象
             * 使用这种方式创建的都要在接下来转化成临时节点
             * 根据传入进来的参数 temp是否是false，如果不是就要转化成临时节点。
             */
            temp: opt.temp,
          };
        } else {
          // 覆盖原有配置
          _.assign(REFLACT.getPageDescribe(opt.id), opt);
        }
        /**
         * 获取当前窗口的窗口描述对象
         */
        let wConfig = REFLACT.getPageDescribe(opt.id);
        // 2. 已打开的页面无需重新打开
        if (wConfig.index) {
          // 将选择的窗口置顶
          this.setTop(opt.id);
          // 如果第二个参数是回调函数就执行这个回调函数
          _.isFunction(data) && data(wConfig);
          return wConfig.index;
        }
        // 3.计算页面位置(这个作为参考，最后还是以配置项参数为准)
        let position = {} ; 
        // 默认的也不好用
        // if(!wConfig.offset && !wConfig.area && REFLACT.getFitPosition())
        if(REFLACT.getFitPosition())
          position = this.position(data.area);

        /**
         * 判断沙箱情景：
         *    1. 非临时窗口  wConfig.temp !== true
         *    2. 配置项中启用沙箱模式  wConfig.porperty !== {@link config.constant.SINGLETON}  适应以前的参数，还是改成只有配置正确再启动吧
         *    3. 启用全局沙箱配置项    {@link config.constant.DISPLAY_MULTIPLE_LAYER} 为true
         * 
         *    不满足1的同时满足2或3
         */
        var multipleFlag = wConfig.temp !== true && ( wConfig.porperty === REFLACT.getSingletonKey() || REFLACT.getDisplayMultipleKey() === true);   
        if (multipleFlag) {
          /**
           * 获取沙箱编号
           *     
           *    参数2 允许传入一个额外的配置项。从这个配置项中获取id或code作为沙箱编号
           *    将沙箱编号和原配置信息管理放入 {@linkplain config.pageMultiple 沙箱临时缓存关系表} 中
           *    与沙箱缓存中能匹配到的情况，与 "已打开的页面无需重新打开" 相同处理
           * 
           * 
           * 
           */
          let key = data.id || data.code || 0;
          // 查看沙箱缓存
          if(REFLACT.getPageMultiple(opt.id)){
            // 寻找并匹配沙箱编号
            if(key && REFLACT.getPageMultiple(opt.id)[key]){
              // 匹配到就按照 -- >  "已打开的页面无需重新打开" 处理
              // 将选择的窗口置顶
              this.setTop(REFLACT.getPageMultiple(opt.id)[key]);
              // 获取沙箱临时配置项
              let sConfig = REFLACT.getPageDescribe(REFLACT.getPageMultiple(opt.id)[key]);
              // 如果第二个参数是回调函数就执行这个回调函数
              _.isFunction(data) && data(sConfig);
              return sConfig.index;
            }
          }else{
            // 没有沙箱缓存就需要创建
            REFLACT.getPageMultiple()[opt.id] = {}
          }
          // 生成临时key or id
          let _index = "TEMP_" + REFLACT.getInternalIndex();
          // 如果有沙箱编号就将沙箱编号信息也加入
          if (key) {
            REFLACT.getPageMultiple(opt.id)[key] = _index;
          }
          /**
           * 组装生成沙箱配置项并加入pageDescribe配置对象中
           * 1.name属性修改，根据追加参数的name属性进行改变
           * 2.将传入的index记录为topid
           * 3.申明这个临时配置对象是一个子对象
           */
          REFLACT.getPageDescribe()[_index] = _.assign({}, wConfig, {
            id: _index,
            name:
              data && data.name ? wConfig.name + "-" + data.name : wConfig.name,
            topid: opt.id,
            porperty: "child",
          });
          /**
           * 将这个外面确定的 wConfig 配置对象
           */
           wConfig = REFLACT.getPageDescribe(_index);
        }
        // 补全参数
        if (!wConfig.name) wConfig.name = wConfig.id;
        // title属性特殊处理，用name属性来生成
        if (!wConfig.title)
        wConfig.title = `${
          wConfig.icon == undefined
              ? ""
              : `<i class="layui-icon">${wConfig.icon}</i>&nbsp;&nbsp;&nbsp;`
          }<b>${wConfig.name}</b>`;
        // 合并参数，构建layui.layer.open 所需要的参数
        let option = _.assign(
          {
            type: 1,
            shade: 0,
            shift: 1,
            fixed: false,
            maxmin: true,
            skin: "layui-layer-windows",
            offset: [position.top + "px", position.left + "px"],
            area: [position.width + "px", position.height + "px"],
          },
          wConfig
        );
        /**
         * 接下来装饰一系列的回调方法
         */
        let that = this;
        /**
         * 窗口成功打开之后的回调函数
         * @param {*} layero   如果是弹出窗口层，就是窗口的jq对象
         * @param {*} layerid  layui.layer.open的返回结果，弹层的id
         */
        option.success = function (layero, layerid) {
          // 执行windows组件里面的默认回调方法
          that.success.call(that, layero, layerid, wConfig.id);
          /**
           * 假如配置项里面填入了moudle属性,就使用layui方法引用这个模块，并自动执行里面的run方法
           * 1.判断配置项是否存在，并且这个配置项是一个字符串
           * 2.使用layui的use方法载入这个模块
           * 3.判断模块里面是否有自执行方法，并执行它
           * 4.按照需要，给这个窗口添加resize事件
           * 5.执行回调函数(参数二)
           */
          if (wConfig.moudle && _.isString(wConfig.moudle)) {
            // layui载入模块
            layui.use(wConfig.moudle, function () {
              /**
               * 执行自执行方法
               *      参数:
               *          layero: 如果是弹出窗口层，就是窗口的jq对象
               *          layerid: layui.layer.open的返回结果，弹层的id
               *          index（wConfig.id）: 这个指在pageDescribe配置项里面的key或者id，可以通过open方法弹出该窗口
               *          data: 第二个参数，如果是一个Object对象，可以以这个方式传入窗口中
               *          wConfig: 这个窗口对应的pageDescribe配置项
               */
              if(layui[wConfig.moudle][REFLACT.getInvokeName()])
                layui[wConfig.moudle][REFLACT.getInvokeName()](layero, layerid, wConfig.id, data, wConfig);
              // 添加resize事件
              if(layui[wConfig.moudle].resize)
                that.resize(wConfig.id, layui[wConfig.moudle].resize);
              // 执行回调
              // 如果第二个参数是回调函数就执行这个回调函数
              _.isFunction(data) && data(wConfig);
            });
          } else {
            // 执行回调
            // 如果第二个参数是回调函数就执行这个回调函数
            _.isFunction(data) && data(wConfig);
          }
          // 执行传入的配置项参数里面用户自定义的成功回调函数
          wConfig.success && wConfig.success(layero, layerid, wConfig.id, data, wConfig);
        };

        /**
         * 窗口关闭之后的回调函数
         */
        option.end = function () {
          // 执行windows组件默认的关闭回调函数
          that.end.call(that, wConfig.id);
          /**
           * 如果配置了moudle配置项，那么在成功回调里面就已经执行过自执行函数了。
           * 1. 那么这里需要执行配套的执行销毁方法
           * 2. 如果有视图对象, 需要释放视图对象
           */
          if (wConfig.moudle) {
            // 执行配套的销毁方法
            if(layui[wConfig.moudle].destroy){
              layui[wConfig.moudle].destroy(wConfig.id, wConfig);
            }
            // 释放视图对象
            // 上面的销毁方法里面就应该释放视图对象，这个是清除这个引用
            if (wConfig.VM) {
              wConfig.VM.$destroy();
              wConfig.VM = null;
            }
            // 移除resize事件
            if(layui[wConfig.moudle].resize){
              that.resize(wConfig.id);
            }
          }
          // 执行传入的配置项参数里面用户自定义的失败回调函数
          wConfig.end && wConfig.end(wConfig.id);
        };

        /**
         * 用户点击关闭按钮后触发的事件
         * @param {*} layerid layui.layer.open的返回结果，弹层的id
         * @param {*} layero  如果是弹出窗口层，就是窗口的jq对象
         */
        option.cancel = function (layerid, layero) {
          // 有打开3d flip的场合 关闭3d flip
          if(that.flip.show) that.closeFlip();
          // 阻止事件冒泡
          if (window.event) window.event.stopPropagation();
          /**
           * 这个窗口关闭了，将之前受它最大化影响的区域恢复zIndex
           * 
           *    因为窗口最大化的时候，有些dom会特殊的调整它们的zIndex,这里关闭了就反向调整回来
           */
          PROXY.getMarkofMax().removeClass(REFLACT.getMinClass());
          //执行配置项里面用户自定义的cancel方法
          if (wConfig.cancel && _.isFunction(wConfig.cancel)) {
            wConfig.cancel(layerid, layero, function () {
              // 即使是用户自定义的方法，也要执行windows组件的beforeDestroy销毁窗口配置
              that.beforeDestroy(wConfig.id);
            });
            return false;
          }
          // 执行windows组件的beforeDestroy销毁窗口配置
          that.beforeDestroy(wConfig.id);
          return false;
        };

        /**
         * 用户点击最大化按钮后触发的事件
         */
        option.full = function (index) {
          // 有打开3d flip的场合 关闭3d flip
          if(that.flip.show) that.closeFlip();
          /**
           * 窗口最大化了，但是它的层级并不是最高的。
           *    这个时候需要去调整这些区域的zIndex防止它们遮挡窗口
           *    这些区域被 {@linkplain config.constant.MAX_CLASSNAME 最大化修饰样式 } 的class所修饰
           *    这里需要给这些区域添加 {@linkplain config.constant.MIN_CLASSNAME 反最大化修饰样式 }的class
           */
          PROXY.getMarkofMax().removeClass(REFLACT.getMinClass()).addClass(REFLACT.getMinClass());
          // 执行用户自定义的full事件回调
          wConfig.full && wConfig.full(index);
          // 执行窗口resize事件
          if(REFLACT.getResizeFn(wConfig.id)){
            REFLACT.getResizeFn(wConfig.id).call(this);
          }
        };

        // option.min = function(layero, index){
        //   return false;
        // };

        /**
         * 用户点击恢复窗口按钮后触发的事件
         */
        option.restore = function (index) {
          /**
           * 这个窗口取消最大化状态
           * 
           *    因为窗口最大化的时候，有些dom会特殊的调整它们的zIndex,这里关闭了就反向调整回来
           */
          PROXY.getMarkofMax().removeClass(REFLACT.getMinClass());
          // 执行自定义的回调函数
          wConfig.restore && wConfig.restore(index);
          // 执行窗口resize事件
          if(REFLACT.getResizeFn(wConfig.id)){
            REFLACT.getResizeFn(wConfig.id).call(this);
          }
        };

        /**
         * layui.layer原生窗口resize事件回调函数
         */
        option.resizing = function (layero) {

          // 有打开3d flip的场合 关闭3d flip
          if(that.flip.show) that.closeFlip();

          wConfig.resizing && wConfig.resizing(layero);
          // 执行窗口resize事件
          if(REFLACT.getResizeFn(wConfig.id)){
            REFLACT.getResizeFn(wConfig.id).call(this);
          }
        };

        // 处理content
        if (!wConfig.url && !option.content)
          option.content = "<div>" + option.name + "</div>";
        return option;
      },

      /**
       * @method 计算窗口位置和大小      
       * 根据传入的宽度(默认650) 计算窗口的高度
       * 根据浏览器窗口的高宽确定使用  高度/宽度 or 宽度/高度  = 0.618
       * @param {*} area  窗口宽度, 上面这个open方法里面参数二可以指定一个宽度
       * @returns
       */
      position(area) {
        /**
         * 获取 {@linkplain $body 窗口}  的总高度和总宽度
         */
        let rootWidth = $body.width();
        let rootHeight = $body.height();
        /**
         * 2. 获取窗口宽度
         * 如果传进来的是宽度(一个字符串)就以它为准
         * 否则使用默认宽度 {@link config.constant.BASE_WINDOWS_WIDTH}   
         */
        let width = _.isString(area) ? parseInt(area) : REFLACT.getBaseWindowsWidth();
        // 高宽比例
        let [k, k1] = [0.618, 1.618];
        // 判断当前是否存在 topIndex 有没得窗口选中置顶  true  没有  false 有
        let flag = !REFLACT.getTopIndex();
        // 确定偏移的步数，如果没有就不偏移
        let step = flag ? 0 : 1;
        // 当前距离上方的偏移量，有选中窗口去选中窗口当前的值，否则取默认值
        let nowTop = flag ? REFLACT.getBaseWindowsTop()
          : parseInt(this.tabsBody(REFLACT.getTopIndex()).css("top"));
        // 当前距离左边的偏移量，有选中窗口去选中窗口当前的值，否则取默认值
        let nowLeft = flag ? REFLACT.getBaseWindowsLeft()
          : parseInt(this.tabsBody(REFLACT.getTopIndex()).css("left"));
        // 获取接下来的偏移量,根据当前的top和left与现在的偏移方向来计算出接下来的窗口它预计的top和left偏移量
        let wOffset = REFLACT.getBaseWindowsOffset();
        let top =
          "DOWN" == REFLACT.getWindowsVerticalDirection()
            ? nowTop + wOffset * step
            : nowTop - wOffset * step;
        let left =
          "RIGHT" == REFLACT.getWindowsHorizontalDirection()
            ? nowLeft + wOffset * step
            : nowLeft - wOffset * step;
        // 计算窗口高度, 总高度 - （最大高度 + 上下偏移量） 判断以最大的高度能不能容得下
        let testHeight = rootHeight - width * k1 - top - REFLACT.getBaseWindowsBottom();
        // 最大高度都够的话就取最大高度，否则取最小高度
        let height = testHeight >= 0 ? width * k1 : width * k;
        /**
         * 计算窗口会不会超出右边
         * 总宽度 - left偏移量  - 宽度  看看还有没有余下来的宽度
         * 如果超出就先对齐右边: left偏移量取 总宽度 - 宽度
         *        然后将接下来的偏移方向修改为  LEFT  向左偏移
         * 如果没有超出就暂时不管
         */
        if (rootWidth - left - width < 0) {
          // 靠右
          left = rootWidth - width;
          // 更新方向向左了
          REFLACT.setWindowsHorizontalDirection("LEFT");
        }
        /**
         * 计算窗口会不会超出左边最小偏移区域
         * 看看left偏移量有没有小于最小偏移量 config.constant.BASE_WINDOWS_LEFT_OFFSET
         * 如果超出就先对齐左边: left偏移量取 最小偏移量 config.constant.BASE_WINDOWS_LEFT_OFFSET
         *        然后将接下来的偏移方向修改为  RIGHT  向右偏移
         * 如果没有超出就暂时不管
         */
        if (left < REFLACT.getBaseWindowsLeft()) {
          // 靠左
          left = REFLACT.getBaseWindowsLeft();
          // 更新方向向右了
          REFLACT.setWindowsHorizontalDirection("RIGHT");
        }

        /**
         * 计算窗口会不会超出下方
         * 总高度 - top偏移量  - 高度  看看还有超过下方最少剩余的位置(下方至少要留一个选项卡条的高度)
         * 如果超出就先对齐下方: top偏移量取 总高度 - 高度 - 下方最少剩余的位置config.constant.BASE_WINDOWS_BOTTOM_OFFSET
         *        然后将接下来的偏移方向修改为  UP  向上偏移
         * 如果没有超出就暂时不管
         */
        if (rootHeight - top - height < REFLACT.getBaseWindowsBottom() ) {
          // 靠下
          top =
            rootHeight - height - REFLACT.getBaseWindowsBottom();
          // 更新方向向上了
          REFLACT.setWindowsVerticalDirection("UP");
        }
        /**
         * 计算窗口会不会超出上方
         * 看看top偏移量有没有小于最小偏移量 config.constant.BASE_WINDOWS_TOP_OFFSET
         * 如果超出就先对齐上方: top偏移量取 最小偏移量 config.constant.BASE_WINDOWS_TOP_OFFSET
         *        然后将接下来的偏移方向修改为  DOWN  向下偏移
         * 如果没有超出就暂时不管
         */
        if (top < REFLACT.getBaseWindowsTop()) {
          // 靠上
          top = REFLACT.getBaseWindowsTop();
          // 更新方向向下了
          REFLACT.setWindowsVerticalDirection("DOWN");
        }
        //返回测算结果
        return {
          top: top,
          left: left,
          width: width,
          height: height,
        };
      },

      /**
       * 成功打开页面之后的回调函数
       * @param {*} layero  如果是弹出窗口层，就是窗口的jq对象
       * @param {*} index   layui.layer.open的返回结果，弹层的id
       * @param {*} id      这个指在pageDescribe配置项里面的key或者id，可以通过open方法弹出该窗口
       */
      success(layero, index, id) {
        let wConfig = REFLACT.getPageDescribe(id);
        // 在窗口配置对象中写入layui返回结果，表明这个窗口已经被打开，可以使用
        wConfig.index = index;
        // 在窗口配置对象中写入layui窗口的jq对象方便后面的调用
        // ** 弹出窗口层这里就可以了，弹出的是iframe层就需要自己调方法进行处理了
        wConfig.parent = layero;
        // 设置最小化标志为false
        wConfig.min = false;
        // 设置窗口可视化标志为true
        wConfig.show = true;
        /**
         * 更新最大弹层层级
         * @since v2.0.0
         */
        REFLACT.setMaxIndex(parseInt(layero.css('zIndex')));
        // 下面进行窗口组管理
        // 获取父ID
        let parentid = wConfig.topid || id;
        // 获取父名称
        let parentname = REFLACT.getPageDescribe(parentid).name;
        //加入windows描述中
        REFLACT.getWindowsMap()[id] = {
          id: id,
          name: wConfig.name,
          select: false,
          updateTime: new Date(),
        };
        // 检查父id是否存在
        // 可能这个分组下面的其它窗口声明时已经添加了父id的声明
        let parentflag = false;
        _.each(this.livelyPool, function (v) {
          if (v.id == parentid) {
            // 如果找到对应的父id就将这个标记置为true
            parentflag = true;
            let childflag = false;
            // 遍历父id对应的children ，只有children里面没有当前的id才在里面加入
            _.each(v.children, function (v1) {
              if (v1 == id) childflag = true;
            });
            if (!childflag) v.children.push(id);
          }
        });
        // 如果没有找到父id对应的内容，这里就需要立即创建
        if (!parentflag) {
          // 向list里面加入
          // **这里之所以不直接修改list是因为list这个数据类型没有特殊处理过，暂不支持响应式插入
          // 上面的children是放弃了响应式的,所以是直接push的
          // index 取递增量主要是作为渲染时遍历的主键，防止dom的重复渲染
          let list = _.cloneDeep(this.livelyPool);
          list.push({
            index: REFLACT.getInternalIndex(),
            id: parentid,
            name: parentname,
            select: false,
            assign: 0, //  新增参数，用来判断是不是新分组，用来做窗口合并的 v2.0.0新增
            icon: wConfig.icon,
            children: [id],
          });
          this.livelyPool = list;
        }
        let that = this;
        /**
         * 最小化事件监听
         *
         * layui.layer里面的原生最小化事件是将窗口缩小成一块，摆放到下方。
         * windows组件就是管理这些窗口的，在最小化时是不展示窗口的状态，需要点击对应的选项卡才会显示。这个事件必须更改
         */
        layero
          .off("click", ".layui-layer-min")
          .on("click", ".layui-layer-min", function (e) {
            // 有打开3d flip的场合 关闭3d flip
            if(that.flip.show) that.closeFlip();
            // 阻止事件冒泡
            // ** 这个如果不设置会和下面的  “窗口点击置顶”  事件冲突
            e.stopPropagation();
            // 用添加 layui-hide class的方式来隐藏窗口页面
            // 这个在setTop的操作时有对应的 处理
            layero.removeClass(REFLACT.getHideClass()).addClass(REFLACT.getHideClass());
            // 修改窗口配置属性
            // 最小化标志设置为 true
            wConfig.min = true;
            // 可视化标志设置为false
            wConfig.show = false;
            // 选中配置为false
            wConfig.select = false;
            // 最小化之后取消置顶标志
            if (REFLACT.getTopIndex() == id) REFLACT.setTopIndex(0);
            // 这个之前的修改，后面全部隐藏就没用到了，这个也是layui.layer里面可能遇到的问题
            // 只要一次min就会添加上这条属性，一直标志它处于最小化
            // wConfig.parent.removeAttr("minleft");
            // 合并窗口最小化校验
            that.afterMin(id);
          });
        // 窗口点击置顶事件，点击一下就setTop了
        /**
         * 这个是修改layui.layer里面原生的setTop方法
         * 实现一种点击窗口，那这个窗口就自动切换成最顶层层级的窗口
         * 达到一种窗口切换的效果
         *
         * v1.1.2 修改成mousedown的事件可以将这个事件直接放到整个窗体上面
         */
        if (!wConfig.click) {
          wConfig.click = true;
          layero.on("mousedown", function () {
            that.setTop(id);
          });

          // 添加窗口移动的时候判断事件
          layero.on("mousedown", ".layui-layer-title", function (e) {
            /**
             * 记录下窗口此时的状态
             */
            constant.MOVE_BASE_WINDOW = {
              id: id,
              offsetTop: parseInt(layero.css("top")),
              offsetLeft: parseInt(layero.css("left")),
              currentWidth: layero.width(),
              currentHeight: layero.height(),
            };
          });
          // 窗口结束移动后,重置上面的缓存对象
          layero.on("mouseup", ".layui-layer-title", function (e) {
            constant.MOVE_BASE_WINDOW = {};
          });
        }
        // 最后setTop一下,防止其它操作的影响，保持新开的窗口处于最顶层级
        this.setTop(id);
      },

      /**
       * 成功关闭页面之后的回调函数
       * @param {*} id 这个指在pageDescribe配置项里面的key或者id，可以通过open方法弹出该窗口
       */
      end(id) {
        let wConfig = REFLACT.getPageDescribe(id);
        // 标记了topid,说明这个是一个临时沙箱配置对象，topid的值是它对应的父对象的 key或者id
        if (wConfig.topid) {
          let index = wConfig.topid;
          // 父对象的临时复合参数如果没有创建就自动创建
          if(!REFLACT.getPageMultiple(index)) REFLACT.getPageMultiple()[index] = {};
          let key = null;
          /**
           * 遍历 {@linkplain config.pageMultiple 沙箱临时缓存关系表}
           *      如果有和当前的id匹配上的，就将它删除
           */
          _.each(REFLACT.getPageMultiple(index), function (v, k) {
            if (v == id) {
              key = k;
              return false;
            }
          });
          if (key) REFLACT.deletePageMultiple(index, key);
        }
        // 在 windowsMap 配置项里面移除这一项
        if(REFLACT.getWindowsMap(id)) REFLACT.deletetWindowsMap(id);
        // 这里分情况了，判断是否打开了合并窗口
        if (wConfig.assignBy) {
          this.removeGroupPool(id);
        } else {
          this.resetLivelyPool(id);
        }
        // 移除配置参数中已经添加了点击事件的标记，允许下一次打开的新窗口添加点击事件
        wConfig.click = false;
        // 最后再移除,新增的临时配置参数
        if ("child" == wConfig.porperty) {
          REFLACT.deletePageDescribe(id);
        } else {
          // 一般的配置参数需要将 parent 和 index移除, 至于VM在定义end的时候就已经移除了。不移除也没得关系
          // parent 窗口打开的时候记录这个窗口的jq对象
          // index  由layui.layer.open方法返回的参数
          wConfig.index = null;
          wConfig.parent = null;
          wConfig.assignBy = "";
        }
      },

      /**
       * @method 删除小窗口的时候重置livelyPool里面的信息
       * @desc
       * 
       *        这里处理的是删除普通窗口
       * @param {*} id  被删除小窗口对应的窗口id(pageDescribe配置项里面的key)
       */
      resetLivelyPool(id) {
        // 获取分组ID
        let parentid =  REFLACT.getPageDescribe(id).topid || id;
        /**
         * 过滤  已经打开的窗口/分组 数据
         *
         * 遍历数据  (_.remove  函数会自动移除返回值为true的一项)
         * 首先遍历组
         *      if  与之不匹配  返回false
         *      if  与之匹配   遍历它下面的childern
         *              移除与id匹配的childern
         *              如果过滤后childern的length>0 说明分组下面还有别的窗口，就保留这个分组
         *              如果childern的length=0 说明这个分组被清空了，就返回true 移除这个分组
         *
         */
        let list = _.cloneDeep(this.livelyPool);
        _.remove(list, function (v) {
          // 无关的分组直接返回false来保留
          if (v.id != parentid) return false;
          // 移除分组下面该id匹配的项
          _.remove(v.children, (v1) => v1 == id);
          // 如果分组的children长度为0就移除这个分组
          return v.children.length == 0;
        });
        // 更新topIndex
        REFLACT.setTopIndex(0);
        // 更新动态数据
        this.livelyPool = list;
        // 当前的小窗口如果出现了一个窗口也需要移除,也是移除id相同的元素
        let hoverList = _.cloneDeep(this.hoverPool);
        _.remove(hoverList, (v) => v.id == id);
        // 更新动态数据
        this.hoverPool = hoverList;
      },

      /**
       * @method 删除小窗口的时候删除所在的分组，如果存在分组的话
       * @desc
       *    
       *        这里处理的是删除合并分组后的窗口
       * @param {*} id  被删除小窗口对应的窗口id(pageDescribe配置项里面的key)
       */
      removeGroupPool(id) {
        let that = this;
        let wConfig = REFLACT.getPageDescribe(id);
        // 获取所在分组的配置信息
        let key = wConfig.assignBy;

        /**
         * 处理响应式数据 assign
         * 
         *     移除相关数据
         */
        let temp_list = _.cloneDeep(that.assign);
        _.remove(temp_list, function (v) {
          if (v.id === key) {
            // 删除两个配置对象上面的assignBy配置参数
            // 修改配置参数为未合并
            REFLACT.getPageDescribe(v.fromid).assignBy = "";
            REFLACT.getPageDescribe(v.toid).assignBy = "";
            // 关闭另外一个窗口
            if (v.fromid === id) {
              that.close(v.toid);
            }
            if (v.toid === id) {
              that.close(v.fromid);
            }
            return true;
          }
          return false;
        });
        that.assign = temp_list;

        /**
         * 在 {@linkplain config.base.livelyPool 活跃池} 中移除对应的合并项分组 
         */
        let list = _.cloneDeep(that.livelyPool);
        _.remove(list, (v) => v.id === key);
        // 更新topIndex
        REFLACT.setTopIndex(0);
        // 更新动态数据  活跃池
        that.livelyPool = list;
        // 当前的小窗口如果出现了一个窗口也需要移除,也是移除id相同的元素
        /**
         * 在 {@linkplain config.base.hoverPool 分组小窗口配置对象} 中移除对应的合并项分组 
         */
        let hoverList = _.cloneDeep(that.hoverPool);
        _.remove(hoverList, (v) => v.id == id);
        // 更新动态数据
        that.hoverPool = hoverList;
      },

      /**
       * 页面关闭之前的回调函数
       * @param {*} id  这个是配置对象pageDescribe里面的 key或者id
       * @returns
       */
      beforeDestroy(id) {

        // v2.0.0 移除其他过多的复杂操作

        return this.doCloseLayer(id);
      },

      /**
       * @method 关闭窗口的方法，
       * @desc
       * 
       *    内部有几个方法在调用，作为方法的收尾
       *    外面建议调用 下面的 close 方法来关闭窗口
       * @param {*} id  这个是配置对象pageDescribe里面的 key或者id
       */
      doCloseLayer(id) {
        // 因为前置方法中可能已经有关闭窗口的操作了，这里只是查漏补缺
        // 获取index,调用layui原生方法关闭窗口即可
        let _index = REFLACT.getPageDescribe(id).index;
        _index && layui.layer.close(_index);
        // 清除index，虽然其它地方做过了，这里仅仅查漏
        REFLACT.getPageDescribe(id).index = null;
        REFLACT.getPageDescribe(id).parent = null;
        // 多删一个会导致后面删除另一个窗口的判断失效
        // REFLACT.getPageDescribe(id).assignBy = "";
      },

      /**
       * @method 恢复最小化
       * @private
       * @desc
       * 
       *        保留方法，内部有调用，不推荐使用
       * @param {*} id 这个是配置对象pageDescribe里面的 key或者id
       */
      _restore(id) {
        let _index = REFLACT.getPageDescribe(id).index;
        if (_index) {
          try {
            layui.layer.restore(_index);
          } catch (error) {}
        }
      },

      /**
       * @method 最小化恢复，
       * @param {*} id 这个是配置对象pageDescribe里面的 key或者id
       */
      restore(id) {
        let wConfig = REFLACT.getPageDescribe(id);
        if (wConfig.index) {
          // 调用原生方法恢复窗口
          try {
            layui.layer.restore(wConfig.index);
          } catch (error) {}
          // 设置 pageDescribe 的最小化参数
          wConfig.min = false;
          wConfig.select = true;
          wConfig.show = true;
          // 给窗口的jq对象添加 layui-hide 的 className
          REFLACT.getWindow(id).removeClass(REFLACT.getHideClass());
        }
      },

      /**
       * @method 最小化窗口
       * @private
       * @desc
       * 
       *        保留方法，内部有调用，不推荐使用
       * @param {*} id 这个是配置对象pageDescribe里面的 key或者id
       */
      min(id) {
        // 获取index证明这个窗口被创建出来了
        let wConfig = REFLACT.getPageDescribe(id);
        let _index = config.pageDescribe[id].index;
        if (wConfig.index && !wConfig.min) {
          // 调用原生方法最小化窗口
          layui.layer.min(wConfig.index);
          // 设置 pageDescribe 的最小化参数
          wConfig.min = true;
          wConfig.select = false;
          wConfig.show = false;
          // 给窗口的jq对象添加 layui-hide 的 className
          REFLACT.getWindow(id).removeClass(REFLACT.getHideClass()).addClass(REFLACT.getHideClass());
          // 最小化后置事件
          this.afterMin(id);
        }
      },

      /**
       * @method 窗口在最小化之后的后置事件
       * @desc
       * 
       *        解决合并窗口在最小化是需要同时最小化另一个窗口
       * @param {String} id 这个是配置对象pageDescribe里面的 key或者id
       */
      afterMin(id) {
        let wConfig = REFLACT.getPageDescribe(id);
        // 获取配置对象,存在临时配置对象被移除的风险，所以这里需要判断
        if (!wConfig) return;
        // 未合并窗口直接返回
        if (!wConfig.assign || wConfig.assignBy == "")
          return;

        // 获取窗口组id, 从assign描述对象里面筛选
        let assignID = wConfig.assignBy;

        let that = this;
        _.each(that.assign, function (v) {
          if (v.id == assignID) {
            // 隐藏外层的框
            v.show = false;
            // 查找另一个窗口的id值
            let toid = v.fromid;
            if (toid == id) toid = v.toid;
            // 这个窗口处于正常预览状态
            let sConfig = REFLACT.getPageDescribe(toid);
            if (sConfig && !!sConfig.index && !sConfig.min)
              that.min(toid);
          }
        });
      },

      /**
       * @method 窗口关闭方法，
       * @desc
       * 
       *        调用beforeDestroy关闭窗口
       * @param {*} id 这个是配置对象pageDescribe里面的 key或者id
       */
      close(id) {
        this.beforeDestroy(id);
      },

      /**
       * @method 最小化当前全部窗口
       */
      minAll() {
        let _this = this;
        _.each(REFLACT.getWindowsMap(), (v, k) => _this.min(k));
      },

      /**
       * @method 关闭当前全部窗口
       */
      closeAll() {
        let _this = this;
        _.each(REFLACT.getWindowsMap(), (v, k) => _this.close(k));
      },

      /**
       * @method 展示小窗口
       * @desc
       * 
       *    在鼠标移除下面的操作栏选项卡分组的时候，
       * 弹出分组下面的所有窗口  代表的    小窗口预览div
       */
      showWindowTip(e) {
        let $this = $(e.target);
        let that = this;
        /**
         * 添加选中样式
         *    1. 移除dom中的其它选中的样式
         *    2. 为当前dom单独添加选中样式
         * li-select-tip 标志当前选项卡被选中
         */
        this.parent.find(".li-select-tip").removeClass("li-select-tip");
        $this.addClass("li-select-tip");
        // 获取分组ID
        let id = $this.attr("lay-id");
        let $target =  PROXY.getTipsContainer.call(that);

        /**
         * select-tip-flag 添加显示在靠近底部的样式
         * no-select-tip   标记这个dom暂时不受其它事件的影响
         * 
         * 这里添加 select-tip-flag 让窗口向上升起
         * 这里添加 no-select-tip   这个配合其他方法，了解这个地方正在执行某个动画，先不要触发事件
         */
        $target
          .removeClass("no-select-tip")
          .removeClass("select-tip-flag")
          .addClass("select-tip-flag")
          .addClass("no-select-tip");
        // 遍历整个动态分组，查找到对应的分组
        _.each(that.livelyPool, function (v) {
          if (v.id == id) {
            // 清空参数
            let templist = [];
            that.$data.hoverPool = [];

            // 将分组中的children对应的配置参数写入到临时列表里面
            _.each(v.children, function (v1) {
              templist.push({
                id: REFLACT.getWindowsMap(v1).id,
                name: REFLACT.getWindowsMap(v1).name,
                groupid: id,
              });
            });

            // 参数赋值
            that.$data.hoverPool = templist;

            // 获取当前dom元素的位置
            let left = $this.get(0).getBoundingClientRect().left;
            let width = $this.outerWidth();
            let finalLeft = left - ($target.width() - width) / 2;

            // 设置tips位置
            $target.css({ left: finalLeft < 0 ? 0 : finalLeft + "px" });

            // 添加select-tip样式
            $target.removeClass("select-tip").addClass("select-tip");

            // 移除no-select-tip标记
            setTimeout(() => $target.removeClass("no-select-tip"), 300);
          }
        });
      },

      /**
       * @method  鼠标移上小窗户保持检查的状态，
       * 一直给下面的分组选项卡更新 一直添加select-tip-flag样式
       */
      hoverTip() {
        let $target =  PROXY.getTipsContainer.call(this);
        if ($target.hasClass("no-select-tip")) return;
        if (!$target.hasClass("select-tip-flag"))
          $target.addClass("select-tip-flag");
      },

      /**
       * 在鼠标移开分组选项卡或者小窗口时，隐藏小窗户
       *
       * 两个class一起作用，防止抖动。
       *    select-tip-flag
       *    select-tip
       *
       * 1.当鼠标离开时会将分组选项卡里面的 select-tip-flag 样式移除，但是如果它跳到了 小窗户 上面，会在上面hoverTip方法里面
       *  将样式重新加回来。
       * 2.如果鼠标短暂的离开分组选项卡和小窗口  select-tip-flag 样式移除 因为受其它的影响，暂时还不会关闭小窗口
       * 3.如果超过一定时间没有进入其它方法将 select-tip-flag 样式补回来，就认为是真的离开了，执行关闭小窗口的方法
       *
       */
      hideWindowTip() {
        let _this = this;
        let $target =  PROXY.getTipsContainer.call(this);
        // select-tip-flag 样式移除
        $target.removeClass("select-tip-flag");
        setTimeout(function () {
          // 如果超时之后样式还是没有补回来
          if (!$target.hasClass("select-tip-flag")) {
            /**
             * 移除select-tip样式
             * select-tip   和 select-tip-flag 样式有一个小窗口就不会关闭，
             * 现在两个都移除了，它就关闭了
             */
            $target.removeClass("select-tip");
            // 分组选项卡  取消选中样式
            _this.parent.find(".li-select-tip").removeClass("li-select-tip");
            // 添加一个class这个class在hover时阻止触发事件，阻止关闭动画时触发的影响
            $target.removeClass("no-select-tip").addClass("no-select-tip");
            // 移除标记
            setTimeout(() => $target.removeClass("no-select-tip"), 300);
          }
        }, 300);
      },

      /**
       * 通过小窗户关闭页面
       * 通过点击上面的红叉按钮关闭页面
       *
       */
      closeFromTip(e) {
        e.stopPropagation();
        e.preventDefault();
        let id = $(e.target).parent().attr("wid");
        // 关闭窗口
        this.close(id);
        // 清除预览参数,先给这个预览主窗口加个判断，防止再触发move方法
        let $target =  PROXY.getTipsContainer.call(this);

        if (!$target.hasClass("no-select-tip"))
          $target.addClass("no-select-tip");
        this.hover = {};
        setTimeout(function () {
          $target.removeClass("no-select-tip");
        }, 300);
      },

      /**
       * 点击小窗口将当前窗口置顶展示
       * @param {*} id 这个是配置对象pageDescribe里面的 key或者id
       */
      setHoverTop(id) {
        // 调用方法置顶
        this.setTop(id);
        // 清除预览参数
        this.hover = {};
        // 隐藏弹窗
        let $parent =  PROXY.getTipsContainer.call(this);
        /**
         * 模拟隐藏小窗口的效果
         * 去掉 select-tip  和  select-tip-flag
         * 标记上  no-select-tip
         * ---
         * 移除标记
         */
        $parent
          .removeClass("select-tip")
          .removeClass("select-tip-flag")
          .addClass("no-select-tip");
        setTimeout(() => $parent.removeClass("no-select-tip"), 300);
      },

      /**
       * 点击小窗口下面的li标签， 显示当前窗口
       * 当且仅当这个下面只有一个子窗口时有效
       *
       * 接下来新增一项，点击如果是它就是top了。而且是显示状态，就隐藏，如果不是再setTop
       *
       * 然后如果他是一个分组那么就变成这个分组固定在下方和取消固定
       */
      setGroupTop(id) {
        let _this = this;
        _.each(_this.livelyPool, function (v) {
          if (v.id == id) {
            let $parent =  PROXY.getTipsContainer.call(_this);
            if (v.children.length == 1 || (v.assign && v.assign == 1)) {
              // 单窗口和合并窗口的特殊处理(点击切换显示和隐藏)
              let child = v.children[0];
              if (REFLACT.getTopIndex() == child && 
                !REFLACT.getPageDescribe(child).min &&
                REFLACT.getPageDescribe(child).show
              ) {
                _this.min(v.children[0]);
              } else {
                _this.setTop(v.children[0]);
              }
              // 清除预览参数
              _this.hover = {};
              // 隐藏弹窗
              /**
               * 模拟隐藏小窗口的效果
               * 去掉 select-tip  和  select-tip-flag
               * 标记上  no-select-tip
               * ---
               * 移除标记
               */
              $parent
                .removeClass("select-tip")
                .removeClass("select-tip-flag")
                .addClass("no-select-tip");
              setTimeout(() => $parent.removeClass("no-select-tip"), 300);
            } else {
              // 切换弹窗
              // 阻止事件冒泡
              if (window.event) window.event.stopPropagation();
              // 点击固定分组框和取消固定
              if ($parent.hasClass("select-tip-fixed")) {
                $parent
                  .removeClass("select-tip-fixed")
                  .removeClass("select-tip")
                  .removeClass("select-tip-flag")
                  .addClass("no-select-tip");
                setTimeout(() => $parent.removeClass("no-select-tip"), 300);
              } else {
                $parent.addClass("select-tip-fixed");
              }
            }
          }
        });
      },

      /**
       * 预览鼠标所在的小窗口所对应的大窗口
       * @param {*} id  这个是配置对象pageDescribe里面的 key或者id
       */
      appendHover(id) {
        // 0 的特殊处理，代表关闭全部
        if (0 == id) {
          this.hover = { id: 0 };
          return;
        }
        let $target =  PROXY.getTipsContainer.call(this);
        if ($target.hasClass("no-select-tip")) return;
        // 获取窗口配置对象
        let wConfig = REFLACT.getPageDescribe(id);
        // 将当前窗口的层级上升为顶层加1
        this.tabsBody(id).css("z-index", REFLACT.getMaxIndex() + 1);
        // 如果窗口被最小化，就恢复
        if (!!wConfig.min) this._restore(id);
        // 如果窗口被隐藏，就恢复
        if (!wConfig.show) this.tabsBody(id).removeClass(REFLACT.getHideClass());
        // 设置此id为正在被预览的id
        this.hover = { id: id };
      },

      /**
       * 鼠标在小窗口上面移动的时候需要动态的判断是否切换了预览目标
       * @param {*} id 这个是配置对象pageDescribe里面的 key或者id
       */
      moveHover(id) {
        // 0 的特殊处理，代表关闭全部
        if (0 == id) {
          this.hover = { id: 0 };
          return;
        }
        let $target =  PROXY.getTipsContainer.call(this);
        if ($target.hasClass("no-select-tip")) return;
        // 如果选中的id并不是正在被预览的id
        if (this.hover.id != id) {
          // 结束正在被预览的id
          this.hover.id && this.removeHover(this.hover.id);
          // 预览选中的id
          this.appendHover(id);
        }
      },

      /**
       * 鼠标离开小窗口时结束正在被预览的窗口
       * @param {*} id 这个是配置对象pageDescribe里面的 key或者id
       */
      removeHover(id) {
        // 0 的特殊处理，代表关闭全部
        if (0 == id) {
          this.hover = {};
          return;
        }
        if (this.hover.id == id) {
          // 获取窗口配置对象
          let wConfig = REFLACT.getPageDescribe(id);
          // let option = this.hover;
          // 将层级恢复到之前的层级
          this.tabsBody(id).css("z-index", wConfig.nowIndex);
          // 如果之前被标记为最小化就恢复最小化
          if (!!wConfig.min) this.min(id);
          // 如果之前是隐藏状态就添加 上 layui-hide
          if (!wConfig.show)
            this.tabsBody(id)
              .removeClass(REFLACT.getHideClass())
              .addClass(REFLACT.getHideClass());
          // 移除正在预览的参数配置
          this.hover = {};
        }
      },

      /**
       * 点击卡贴打开窗口
       * @param {*} e
       */
      clickSubMenu(key) {
        // 打开弹层
        if (key && "looking" != key) layui.layer.open(key);
        // 关闭菜单
        this.menuVisible = false;
      },

      /**
       * 点击合并窗口，和普通窗口一样也要触发置顶操作
       * @param {*} id 
       */
      setAssignWindowTop(id) {
        let that = this;
        _.each(that.assign, function (v) {
          if (v.id == id) that.setTop(v.fromid);
        });
      },

      /**
       * 测试在窗口移动的过程中有没有可以被合并的窗口信息
       * @param {*} fromid 被移动的窗口配置参数id
       * @param {*} top    被移动的窗口当前top值
       * @param {*} left   被移动的窗口当前left值
       * @param {*} width  被移动的窗口当前width值
       * @param {*} height 被移动的窗口当前height值
       */
      assignWindowTest(fromid, top, left, width, height) {

        // v2.4.0 添加判断，防止窗口卡贴的影响
        if(constant.SYNC_ASSIGN_FLAG) return;

        let temp_config = {
            id: 0,
            width: 0,
            height: 0,
            top: 0,
            left: 0,
          };
        // 遍历配置项，获取符合条件的集合
        _.each(REFLACT.getPageDescribe(), function (v, k) {
          /**
           * 判断：
           *      0.当前配置是有窗口的
           *      1.当前配置项id不能和传入进来的配置项一样(相同id被认为是同一个配置项)
           *      2.当前配置项是允许窗口合并的
           *      3.当前配置项并没有和其它窗口合并
           *      4.当前配置项对应的窗口是显示状态
           */
          let _flag =
            v.parent &&
            v.id != fromid &&
            v.assign === true &&
            !v.assignBy &&
            v.show;
          if (_flag) {
            // 计算出当前配置项的基础信息
            let [_top, _left, _width, _height] = [
              parseInt(v.parent.css("top")),
              parseInt(v.parent.css("left")),
              v.parent.width(),
              v.parent.height(),
            ];
            //  排查，差值是否达到灵敏度,top是必须在同一位置的
            //  1.计算两个窗口的top差值
            let temp_top = Math.abs(top - _top);
            //  2.计算两个窗口的left差值
            //  2.1 判断两个窗口是否相交 true 相交(暂时不考虑相交的情况)
            //  let temp_in_left = _left > left ? left + width > _left : _left + _width > left;
            //  2.2 计算两个窗口的左右差值
            let temp_out_left =
              _left > left ? _left - left - width : left - _left - _width;
            if (
              temp_top <= constant.MIN_OFFSET_TOP &&
              temp_out_left <= constant.MIN_OFFSET_LEFT
            ) {
              /**
               * 计算外部大框框的高宽
               */
              let ftop =
                _top > top
                  ? top - constant.MIN_OFFSET_TOP
                  : _top - constant.MIN_OFFSET_TOP;
              let fleft =
                _left > left
                  ? left - constant.MIN_OFFSET_LEFT
                  : _left - constant.MIN_OFFSET_LEFT;
              let fright =
                Math.max(left + width, _left + width) +
                constant.MIN_OFFSET_LEFT;
              let fwidth = fright - fleft;
              let fheight =
                Math.max(height, _height) + constant.MIN_OFFSET_TOP * 2;
              constant.MOVE_ASSIGN_WINDOW = {
                id: k,
                offsetTop: _top,
                offsetLeft: _left,
                currentWidth: _width,
                currentHeight: _height,
              };

              // 将当前的参数记录起来。
              temp_config = {
                id: k,
                width: fwidth,
                height: fheight,
                top: ftop,
                left: fleft,
              };
            }
          }
        });
        this.TEMP_ASSIGN_WINDOW = temp_config;
      },

      /**
       * 合并窗口
       *
       * @param {*} temp_config 当前的this.TEMP_ASSIGN_WINDOW 后面应该触发了什么，总是在方法里面取值有误
       * @param {*} fromid 被移动的窗口配置参数id
       * @param {*} top    被移动的窗口当前top值
       * @param {*} left   被移动的窗口当前left值
       * @param {*} width  被移动的窗口当前width值
       * @param {*} height 被移动的窗口当前height值
       */
      assignWindow(temp_config, fromid, top, left, width, height) {
        let that = this;

        // v2.4.0 添加判断，防止窗口卡贴的影响
        if(constant.SYNC_ASSIGN_FLAG){
          // 去除临时对象
          that.TEMP_ASSIGN_WINDOW = {
            id: 0,
            width: 0,
            height: 0,
            top: 0,
            left: 0,
          };
          return;
        }

        // 没有可以合并的窗口就此打住
        // if(!that.TEMP_ASSIGN_WINDOW.id) return;
        // 构建合并窗口参数
        let _name = REFLACT.getPageDescribe(fromid).name +
          "&" +
          REFLACT.getPageDescribe(temp_config.id).name;
        let temp_assign = {
          id: "ASSIGN_" + REFLACT.getInternalIndex(),
          name: _name,
          show: true,
          zIndex: REFLACT.getMaxIndex(),
          top: temp_config.top + constant.MIN_OFFSET_TOP,
          left: temp_config.left + constant.MIN_OFFSET_LEFT / 4,
          width:
            constant.MOVE_ASSIGN_WINDOW.currentWidth +
            width +
            constant.MIN_OFFSET_LEFT,
          height: temp_config.height - constant.MIN_OFFSET_TOP / 2 - 50,
        };
        if (left > temp_config.left) {
          // 窗口从右侧过来的，作为从窗口
          temp_assign.fromid = temp_config.id;
          temp_assign.toid = fromid;
          temp_assign.from = {
            id: constant.MOVE_ASSIGN_WINDOW.id,
            top: constant.MOVE_ASSIGN_WINDOW.offsetTop,
            left: constant.MOVE_ASSIGN_WINDOW.offsetLeft,
            width: constant.MOVE_ASSIGN_WINDOW.currentWidth,
            height: constant.MOVE_ASSIGN_WINDOW.currentHeight,
          };
          temp_assign.to = {
            id: fromid,
            top: top,
            left: left,
            width: width,
            height: height,
          };
        } else {
          // 窗口从左侧过来的，作为主窗口
          temp_assign.toid = temp_config.id;
          temp_assign.fromid = fromid;
          temp_assign.to = {
            id: constant.MOVE_ASSIGN_WINDOW.id,
            top: constant.MOVE_ASSIGN_WINDOW.offsetTop,
            left: constant.MOVE_ASSIGN_WINDOW.offsetLeft,
            width: constant.MOVE_ASSIGN_WINDOW.currentWidth,
            height: constant.MOVE_ASSIGN_WINDOW.currentHeight,
          };
          temp_assign.from = {
            id: fromid,
            top: top,
            left: left,
            width: width,
            // 减去后面隐藏的标题
            height: height,
          };
        }
        // 调整两个窗口的位置
        REFLACT.getWindow(temp_assign.fromid).css({
          top: temp_assign.top + 50 + "px",
        });
        REFLACT.getWindow(temp_assign.toid).css({
          top: temp_assign.top + 50 + "px",
        });

        REFLACT.getWindow(temp_assign.fromid).css({
          left: temp_assign.left + constant.MIN_OFFSET_LEFT / 2 + "px",
        });
        REFLACT.getWindow(temp_assign.toid).css({
          left:
            temp_assign.left +
            constant.MIN_OFFSET_LEFT / 2 +
            temp_assign.from.width +
            "px",
        });

        // 宽度不变
        REFLACT.getWindow(temp_assign.fromid).css({
          height: temp_assign.height - constant.MIN_OFFSET_TOP / 2 - 50 + "px",
        });
        REFLACT.getWindow(temp_assign.toid).css({
          height: temp_assign.height - constant.MIN_OFFSET_TOP / 2 - 50 + "px",
        });

        // 隐藏拖动框
        REFLACT.getWindow(temp_assign.fromid)
          .find(".layui-layer-title")
          .hide();
        REFLACT.getWindow(temp_assign.toid)
          .find(".layui-layer-title")
          .hide();

        // 隐藏右下拖动框
        REFLACT.getWindow(temp_assign.fromid)
          .find(".layui-layer-resize")
          .hide();
        REFLACT.getWindow(temp_assign.toid)
          .find(".layui-layer-resize")
          .hide();

        // 取消主题  
        REFLACT.getWindow(temp_assign.fromid).removeClass(
          "layui-layer-windows"
        );
        REFLACT.getWindow(temp_assign.toid).removeClass(
          "layui-layer-windows"
        );

        REFLACT.getWindow(temp_assign.fromid)
          .find(".layui-layer-setwin")
          .hide();
        REFLACT.getWindow(temp_assign.toid)
          .find(".layui-layer-setwin")
          .hide();

        // 修改配置参数为已合并
        REFLACT.getPageDescribe(temp_assign.fromid).assignBy = temp_assign.id;
        REFLACT.getPageDescribe(temp_assign.toid).assignBy = temp_assign.id;

        // 替换assign数组
        let temp_list = _.cloneDeep(that.assign);
        temp_list.push(temp_assign);
        that.assign = temp_list;

        // 创建分组
        let from_parentid = REFLACT.getPageDescribe(temp_assign.fromid).topid || temp_assign.fromid;
        let to_parentid = REFLACT.getPageDescribe(temp_assign.toid).topid || temp_assign.toid;

        // 可能这个分组下面的其它窗口神明时已经添加了父id的声明
        let temp_livelyPool = _.cloneDeep(this.livelyPool);
        let temp_res_livelyPool = [];
        _.each(temp_livelyPool, function (v) {
          // 首先找到即将合并的分组
          if (v.id == from_parentid || v.id == to_parentid) {
            // 将分组里面的，与传入值相等的childern移除
            let temp_children = _.cloneDeep(v.children);
            let temp_res_children = [];
            _.each(temp_children, function (v1) {
              if (v1 == temp_assign.fromid || v1 == temp_assign.toid) {
              } else {
                temp_res_children.push(v1);
              }
            });
            v.children = temp_res_children;
            if (v.children.length != 0) {
              temp_res_livelyPool.push(v);
            }
          } else {
            temp_res_livelyPool.push(v);
          }
        });
        // 生成合并描述
        temp_res_livelyPool.push({
          index: REFLACT.getInternalIndex(),
          id: temp_assign.id,
          name: temp_assign.name,
          icon: "",
          select: true,
          assign: 1, // 标志是合并窗口配置对象
          children: [temp_assign.fromid, temp_assign.toid],
        });
        this.livelyPool = temp_res_livelyPool;

        // 去除临时对象
        that.TEMP_ASSIGN_WINDOW = {
          id: 0,
          width: 0,
          height: 0,
          top: 0,
          left: 0,
        };

        // 连接窗口
        if(REFLACT.getPageDescribe(temp_assign.fromid).VM && REFLACT.getPageDescribe(temp_assign.toid).VM){
          REFLACT.getPageDescribe(temp_assign.fromid).VM.linkWindow(REFLACT.getPageDescribe(temp_assign.toid).VM);
        }

        // 直接setTop一个，修改另一个的层级
        that.setTop(temp_assign.fromid);
      },

      /**
       * 判断窗口抖动
       *
       * 窗口抖动是记录在常量上面的一个数组，
       * 首先记录下当前的坐标 。 并根据实际情况记录下窗口是向上移动还是向下移动的
       * 记录下当前的移动方向，把方向如果和以前的不同就计入数组，数组长度超过4就触发事件并重置
       * 如果x相差过大也需要立即重置
       * 鼠标抬起的时候重置标记
       *
       */
      shakeWindowTest(id, X, Y) {
        // 唤醒监测点判断方法，开启监测
        if (!constant.SHAKE_WINDOW_OPTION.AWAKE)
          return this.awakeShakeWindow(X, Y);
        // 已经唤醒的，判断x的值，差值超过  constant.MIN_OFFSET_LEFT 无效
        if (
          Math.abs(constant.SHAKE_WINDOW_OPTION.X - X) >
          constant.MIN_OFFSET_LEFT
        )
          return this.awakeShakeWindow(X, Y);
        // 判处 Y 坐标未移动的情形, 这个情况也不重置
        if (constant.SHAKE_WINDOW_OPTION.Y == Y) return;
        // 判断鼠标移动的方向
        let direction = constant.SHAKE_WINDOW_OPTION.Y > Y ? "UP" : "DOWN";
        if (direction != constant.SHAKE_WINDOW_OPTION.DIRECTION) {
          constant.SHAKE_WINDOW_OPTION.DIRECTION = direction;
          constant.SHAKE_WINDOW_OPTION.ACTION.push(direction);
        }
        // 判断方向是否更改4次
        if (constant.SHAKE_WINDOW_OPTION.ACTION.length >= 4) {
          // 执行min方法
          let _this = this;
          _.each(REFLACT.getWindowsMap(), function (v, k) {
            if (k != id) _this.min(k);
          });
          // 沉睡监测
          _this.sleepShakeWindow();
        }
      },

      /**
       * 唤醒监测点标记
       * @param {*} X 当前监测点的X值，没有填 0
       * @param {*} Y 当前监测点的Y值，没有填 0
       */
      awakeShakeWindow(X, Y) {
        constant.SHAKE_WINDOW_OPTION.AWAKE = true;
        constant.SHAKE_WINDOW_OPTION.X = X;
        constant.SHAKE_WINDOW_OPTION.Y = Y;
        constant.SHAKE_WINDOW_OPTION.DIRECTION = "";
        constant.SHAKE_WINDOW_OPTION.ACTION = [];
      },

      sleepShakeWindow() {
        constant.SHAKE_WINDOW_OPTION.AWAKE = false;
        constant.SHAKE_WINDOW_OPTION.X = 0;
        constant.SHAKE_WINDOW_OPTION.Y = 0;
        constant.SHAKE_WINDOW_OPTION.DIRECTION = "";
        constant.SHAKE_WINDOW_OPTION.ACTION = [];
      },

      /**
       * 测试在窗口移动的过程中有没有可以添加窗口卡贴
       * @param {*} fromid 被移动的窗口配置参数id
       * @param {*} top    鼠标当前top值
       * @param {*} left   鼠标当前left值
       */
      tipsWindowTest(fromid, top, left) {
        // 首先判断这个fromid有没有先成为了卡贴
        let topid = REFLACT.getPageDescribe(fromid).topid || fromid;
        let flag = false;
        _.each(this.tipsSource, function (v) {
          if (v.link == topid && !v.temp) flag = true;
        });
        if (flag) return;
        // 然后判断这个鼠标有没有移动到指定区域
        // 首先是认为它没有到达区域
        if (
          left < constant.MIN_TIPS_AREA_LEFT &&
          $body.height() - top < constant.MIN_TIPS_AREA_BOTTOM
        ) {
          constant.TIPS_AREA_FLAG = true;
          this.menuVisible = true;
          this.tipsIcon.visible = true;
          this.tipsIcon.x = left - 35;
          this.tipsIcon.y = top - 35;
          this.tipsIcon.id = fromid;
          this.windowsTipsMove(left, top);
          // v2.4.0 添加锁定
          constant.SYNC_ASSIGN_FLAG = true;
        } else {
          constant.TIPS_AREA_FLAG = false;
          this.menuVisible = false;
          this.tipsIcon.visible = false;
          // v2.4.0 解除锁定
          constant.SYNC_ASSIGN_FLAG = false;
        }
      },

      /**
       * 将之前添加的加入成正式版
       */
      tipsWindow() {
        if (constant.TIPS_AREA_FLAG && this.tipsIcon.id) {
          // 加入正式版
          let wConfig = REFLACT.getPageDescribe(this.tipsIcon.id);
          // 排序
          let temp_list = _.sortBy(_.cloneDeep(this.tipsSource), (v) => v.id);
          let tips_list = [];
          let flag = false;
          let index = 1;
          _.each(temp_list, function (v) {
            if (v.temp) flag = true;
            tips_list.push(_.assign({}, v, { id: index++, temp: false }));
          });
          if (!flag)
            tips_list.push({
              id: index++,
              name: wConfig.name,
              icon: wConfig.icon || constant.TIPS_AREA_ICON,
              // // 这个样子防止类型是prototype的弹层的影响
              link: wConfig.topid || wConfig.id,
              temp: false,
            });
          this.tipsSource = tips_list;
          // 将窗口返回原处
          let w_config = REFLACT.getPageDescribe(constant.MOVE_BASE_WINDOW.id);
          w_config.parent.css(
            "top",
            constant.MOVE_BASE_WINDOW.offsetTop + "px"
          );
          w_config.parent.css(
            "left",
            constant.MOVE_BASE_WINDOW.offsetLeft + "px"
          );
          //暂时不修改高宽，似乎并没有影响高宽
        } else {
          // 查看是否添加了列表有就移除
          if (constant.TIPS_INSERT_FLAG) {
            let temp_list = _.cloneDeep(this.tipsSource);
            let tips_list = [];
            _.each(temp_list, function (v) {
              if (!v.temp) tips_list.push(v);
            });
            this.tipsSource = tips_list;
          }
        }
        constant.TIPS_INSERT_FLAG = false;
        constant.TIPS_AREA_FLAG = false;
        // 重置操作
        this.tipsIcon.visible = false;
        this.tipsIcon.id = "";
        // 关闭菜单
        this.menuVisible = false;
      },

      /**
       * 显示卡贴页面
       * @param {*} e 
       */
      showMenu(e) {
        e.stopPropagation();
        e.preventDefault();
        this.menuVisible = !this.menuVisible;
      },

      /**
       * 防止点击卡贴区域的时候卡贴被关闭
       * @param {*} e
       */
      stopCloseTips(e) {
        e.stopPropagation();
        e.preventDefault();
      },

      /**
       * 鼠标在卡贴上面移动的事件
       * @param {*} e
       */
      fitMenuStyle(e) {
        let x = e.clientX;
        let y = e.clientY;
        /**
         * 根据鼠标位置修改菜单的内阴影
         */
        this.parent.find(".layui-notice-menu-group").each(function () {
          let $this = $(this);
          let left = $this.get(0).getBoundingClientRect().left;
          let top = $this.get(0).getBoundingClientRect().top;
          let width = $this.outerWidth();
          let height = $this.outerHeight();
          // 计算出鼠标距离菜单中心点的距离
          let pointX = left + width / 2;
          let pointY = top + height / 2;
          let offsetX = parseInt(x - pointX);
          let offsetY = parseInt(y - pointY);
          // 计算出X与Y最大偏移量
          let offset =
            Math.abs(offsetX) > Math.abs(offsetY)
              ? Math.abs(offsetX)
              : Math.abs(offsetY);
          // 与菜单宽度的一半(与中心的距离)计算出内阴影衰减量
          let extra = Math.floor(offset / (width / 2)) * 3;
          let boxShadow = `${-offsetX}px ${-offsetY}px 10px ${-(
            offset + extra
          )}px #FCFCFC inset `;
          $this.css({ boxShadow: boxShadow });
        });
      },

      windowsTipsMove(x, y) {
        let key = 0;
        this.parent.find(".layui-notice-menu-group").each(function () {
          let $this = $(this);
          let left = $this.get(0).getBoundingClientRect().left;
          let top = $this.get(0).getBoundingClientRect().top;
          let width = $this.outerWidth();
          let height = $this.outerHeight();
          // 这里插入检查鼠标是否在其中一个区域内
          if (x > left && x - left < width) {
            if (y > top && y - top < height) {
              key = $this.attr("tipkey");
            }
          }
        });
        if (this.tipsIcon.visible && this.tipsIcon.id && key)
          this.updateWindowsTips(key);
      },

      /**
       * 插入临时tips
       * @param {*} key
       */
      updateWindowsTips(key) {
        constant.TIPS_INSERT_FLAG = true;
        // 获取当前正准备tips的配置参数
        let wConfig = REFLACT.getPageDescribe(this.tipsIcon.id) ;
        // 排序
        let temp_list = _.sortBy(_.cloneDeep(this.tipsSource), (v) => v.id);
        let tips_list = [];
        let tips_list2 = [];
        let index = 1;
        _.each(temp_list, function (v) {
          if (index == key)
            tips_list.push({
              id: index++,
              name: wConfig.name,
              icon: wConfig.icon || constant.TIPS_AREA_ICON,
              // 这个样子防止类型是prototype的弹层的影响
              link: wConfig.topid || wConfig.id,
              temp: true,
            });
          if (!v.temp) {
            tips_list.push(_.assign({}, v, { id: index++ }));
            tips_list2.push(_.assign({}, v, { id: index++ }));
          }
        });
        this.tipsSource = tips_list2;
        this.tipsSource = tips_list;
      },

      /**
       * 根据当前的信息获取list返回
       */
      getFlipList() {
        let res = [];
        let allList = _.sortBy(REFLACT.getWindowsMap(), (u) => -u.updateTime);
        if (allList.length == 0) return res;
        let index = this.flip.now;
        let key =
          this.flip.size > allList.length ? allList.length : this.flip.size;
        if (index < 0) index = (index % key) + key;
        index = index % key;
        if (allList.length < index + key) allList = allList.concat(allList);
        _.each(allList, function (v, k) {
          if (k >= index) {
            res.push({
              id: v.id,
              name: v.name,
            });
          }
        });
        res = res.slice(0, key);
        // v2.5.0 新增，直接操作dom,并完成原数据的保存
        // 获取高度和宽度
        let $this = $body.find('.layui-windows-flip');
        let left = $this.get(0).getBoundingClientRect().left; 
        let right = $this.get(0).getBoundingClientRect().right; 
        let top = $this.get(0).getBoundingClientRect().top; 
        let bottom = $this.get(0).getBoundingClientRect().bottom; 

        // 修正 2  
        let size = this.flip.size < 8 ? 8 + 2 : this.flip.size + 2;
        let maxStepX = (right - left) / size;
        let totalLeft = right;
        let tempIndex = REFLACT.getMaxIndex();
        let that = this;

        // 移除上次的影响
        $body.find('.layui-windows-flip-action').removeClass('layui-windows-flip-action');

        _.each(res, function(v , k){
          let root = REFLACT.getWindow(v.id);
          if(!that.flip.map[v.id]){
            // 最小化恢复
            if(!!REFLACT.getPageDescribe(v.id).min) that._restore(v.id);
            // 隐藏恢复
            if(!REFLACT.getPageDescribe(v.id).show) REFLACT.getWindow(v.id).removeClass(REFLACT.getHideClass());
            // 缓存原始信息
            that.flip.map[v.id] = {
              offsetTop: parseInt(root.css('top')),
              offsetLeft: parseInt(root.css('left')),
              currentWidth: parseInt(root.width()),
              currentHeight: parseInt(root.height()),
              zIndex: root.css('z-index'),
              min: REFLACT.getPageDescribe(v.id).min,
              show: REFLACT.getPageDescribe(v.id).show,
            }
          }
          let scale = 0.8;
          let width = that.flip.map[v.id].currentWidth;
          let height = that.flip.map[v.id].currentHeight;
          let mTop = top;
          if(height > 700) scale *= parseFloat(700/height);
          if(mTop + height * scale > bottom) mTop = bottom - (height * scale);
          let stepX = width > maxStepX ? maxStepX : width;
          stepX = maxStepX;
          totalLeft -= stepX;
          // 调整样式
          root.removeClass('layui-windows-flip-action')
              .addClass('layui-windows-flip-action')
              .css({
                top: mTop + width * scale * 0.45 + 'px',
                left: parseFloat(totalLeft) - width * scale * 0.45 - 100 + 'px',
                zIndex: tempIndex --,
                transformOrigin: 'left top',
                transition: 'all 0.3s',
                transform: `
                  scale(${scale - k * 0.1}) 
                  rotateY(48deg) 
                  skewY(-19deg)
                `,
              });
        });
        return res;
      },

      closeFlip() {
        // 窗口还原
        let that = this;
        _.each(that.flip.map, function(v, k){
          // 恢复形状
          let $parent = REFLACT.getWindow(k);
          if($parent){
            $parent.css({
              top: v.offsetTop + 'px',
              left: v.offsetLeft + 'px',
              winth: v.currentWidth + 'px',
              height: v.currentHeight + 'px',
              zIndex: v.zIndex,
              transform: 'none',
              transition: 'none',
            }).removeClass("layui-windows-flip-action");
            // 最小化恢复
            if(v.min) that.min(k);
            // 隐藏恢复
            if(!v.show)
              $parent.removeClass(REFLACT.getHideClass()).addClass(REFLACT.getHideClass());
          }
        });
        this.flip.map = {};
        this.flip.show = false;
        this.flip.list = [];
        this.flip.now = 0;
        $body.removeClass("layui-windows-preview");
      },

      showFlip() {
        this.flip.show = true;
        this.flip.list = this.getFlipList();
        $body
          .removeClass("layui-windows-preview")
          .addClass("layui-windows-preview");
        if(this.flip.list.length == 0) this.closeFlip();
      },

      // v2.5.0 废弃，在窗口事件上面判断
      setTopFlip(e) {
        e.stopPropagation();
        e.preventDefault();
        let id = $(e.target).attr("flipid");
        if (id) {
          this.setTop(id);
          this.closeFlip();
        }
      },

      // v2.5.0 废弃，在窗口事件上面判断
      closeFlipPart(e) {
        e.stopPropagation();
        e.preventDefault();
        let id = $(e.target).attr("flipid");
        if (id) {
          this.close(id);
          let that = this;
          setTimeout(function () {
            let list = that.getFlipList();
            if (list.length == 0) that.closeFlip();
            that.flip.list = list;
          }, 600);
        }
      },

      moveFlipLeft() {
        this.parent
          .find(".layui-windows-flip")
          .removeClass("layui-windows-flip-reverse");
        this.flip.now++;
        this.flip.list = this.getFlipList();
        if(this.flip.list.length == 0) this.closeFlip();
      },

      moveFlipRight() {
        this.parent
          .find(".layui-windows-flip")
          .removeClass("layui-windows-flip-reverse")
          .addClass("layui-windows-flip-reverse");
        this.flip.now--;
        this.flip.list = this.getFlipList();
        if(this.flip.list.length == 0) this.closeFlip();
      },

      startFlipEvent(e) {
        // 开始监听上滑事件
        e.stopPropagation();
        e.preventDefault();
        let [X, Y] = [e.clientX, e.clientY];
        constant.MOVEING_FLIP_WINDOW = {
          flag: true,
          X: X,
          Y: Y,
        };
      },

      mousedownEvent(e) {
        let id = $(e.target).attr("assignid");
        let [X, Y] = [e.clientX, e.clientY];
        constant.MOVEING_ASSIGN_WINDOW = {
          id: id,
          X: X,
          Y: Y,
        };
        e.preventDefault();
      },

      /**
       * 移动合并窗口
       * @param {*} X
       * @param {*} Y
       */
      moveingAssignWindow(X, Y) {
        let [_offsetX, _offsetY] = [
          X - constant.MOVEING_ASSIGN_WINDOW.X,
          Y - constant.MOVEING_ASSIGN_WINDOW.Y,
        ];
        _.each(this.assign, function (v) {
          if (v.id == constant.MOVEING_ASSIGN_WINDOW.id) {
            v.top = v.top + _offsetY;
            let fromTop = REFLACT.getWindow(v.fromid).css("top");
            let toTop = parseInt(fromTop) + _offsetY;
            REFLACT.getWindow(v.fromid).css("top", toTop + "px");
            REFLACT.getWindow(v.toid).css("top", toTop + "px");

            v.left = v.left + _offsetX;
            let fromLeft = REFLACT.getWindow(v.fromid).css("left");
            let toLeft = parseInt(fromLeft) + _offsetX;
            REFLACT.getWindow(v.fromid).css("left", toLeft + "px");

            fromLeft = REFLACT.getWindow(v.toid).css("left");
            toLeft = parseInt(fromLeft) + _offsetX;
            REFLACT.getWindow(v.toid).css("left", toLeft + "px");
          }
        });

        constant.MOVEING_ASSIGN_WINDOW.X = X;
        constant.MOVEING_ASSIGN_WINDOW.Y = Y;
      },

      minAssignWindow(e) {
        e.stopPropagation();
        e.preventDefault();
        let that = this;
        let id = $(e.target).attr("assignid");
        _.each(that.assign, function (v) {
          if (v.id == id) that.min(v.fromid);
        });
      },

      closeAssignWindow(e) {
        e.stopPropagation();
        e.preventDefault();
        let that = this;
        let id = $(e.target).attr("assignid");
        _.each(that.assign, function (v) {
          if (v.id == id) that.close(v.fromid);
        });
      },
    },

    beforeDestroy() {
      // 主要是解绑事件?

      // v2.3.0 临时取消 
/*       layui.layer.config({
        skin: this.defaultSkin,
      }); */

      // 关闭所有的窗口
      this.closeAll();

      // 关闭动画

    },

    mounted() {
      let that = this;

      // v2.3.0 临时取消
      /* // 保存历史主题
      this.defaultSkin = layui.layer.config().cache.skin || "";

      // 更改为当前主题
      layui.layer.config({
        skin: "layui-layer-windows",
      }); */

      // 添加全局的移动事件
      if (!constant.FIRST_LOADING) {
        $body
          .on("mousemove", function (e) {
            if (windowsProxy && windowsProxy.notify()) {
              // 获取鼠标当前的位置
              let [X, Y] = [e.clientX, e.clientY];
              // 移动不用管， 1. 窗口合并  2.半屏  3.窗口磁贴
              if (constant.MOVE_BASE_WINDOW.id) {
                // 移动时关闭3d flip
                if(that.flip.show) that.closeFlip();
                let wConfig = REFLACT.getPageDescribe(constant.MOVE_BASE_WINDOW.id);
                let $parent = wConfig.parent;
                let top = parseInt($parent.css("top"));
                let left = parseInt($parent.css("left"));
                let width = parseInt($parent.css("width"));
                let height = parseInt($parent.css("height"));
                // 判断窗口抖动
                that.shakeWindowTest(constant.MOVE_BASE_WINDOW.id, X, Y);
                if (wConfig.assign === true && !wConfig.assignBy) {
                  // 1.判断窗口合并
                  that.assignWindowTest(
                    constant.MOVE_BASE_WINDOW.id,
                    top,
                    left,
                    width,
                    height
                  );
                }
                if (wConfig.temp !== true) {
                  // 2.判断窗口磁贴
                  that.tipsWindowTest(constant.MOVE_BASE_WINDOW.id, Y, X);
                }
                // 3. 判断半屏显示
              }
              if (constant.MOVEING_ASSIGN_WINDOW.id) {
                // 4.合并窗口移动
                that.moveingAssignWindow(X, Y);
              }
            }
          })
          .on("mouseup", function (e) {
            if (windowsProxy && windowsProxy.notify()) {
              if (constant.MOVE_BASE_WINDOW.id) {
                let wConfig = REFLACT.getPageDescribe(constant.MOVE_BASE_WINDOW.id);
                let $parent = wConfig.parent;
                let top = parseInt($parent.css("top"));
                let left = parseInt($parent.css("left"));
                let width = parseInt($parent.css("width"));
                let height = parseInt($parent.css("height"));
                // 停止监测窗口抖动
                that.sleepShakeWindow();
                if (wConfig.assign === true && !wConfig.assignBy) {
                  // 1.判断窗口合并
                  if (!!that.TEMP_ASSIGN_WINDOW.id)
                    that.assignWindow(
                      that.TEMP_ASSIGN_WINDOW,
                      constant.MOVE_BASE_WINDOW.id,
                      top,
                      left,
                      width,
                      height
                    );
                }
                if (wConfig.temp !== true) {
                  // 2.判断窗口磁贴
                  that.tipsWindow();
                }
                // 3. 判断半屏显示
                // 还原配置
                constant.MOVE_BASE_WINDOW = {};
              }
              // 4.清除合并窗口标志
              if (constant.MOVEING_ASSIGN_WINDOW.id)
                constant.MOVEING_ASSIGN_WINDOW = {
                  id: "",
                  X: 0,
                  Y: 0,
                };
              // 5.监测滑动向上3d flip
              if (constant.MOVEING_FLIP_WINDOW.flag) {
                let [X, Y] = [e.clientX, e.clientY];
                if (
                  Math.abs(constant.MOVEING_FLIP_WINDOW.X - X) <
                  constant.MIN_OFFSET_LEFT
                ) {
                  if (
                    constant.MOVEING_FLIP_WINDOW.Y - Y >
                    constant.MIN_OFFSET_TOP
                  ) {
                    that.showFlip();
                  }
                }
                constant.MOVEING_FLIP_WINDOW = {
                  flag: false,
                  X: 0,
                  Y: 0,
                };
              }
            }
          });
        $body.on("click", function (e) {
          // 1.关闭卡贴
          if (that.menuVisible) that.menuVisible = false;
          // 2.取消固定的分组
          that.parent.find(".select-tip-fixed").removeClass("select-tip-fixed");
        });
        // css加载关闭哪里关闭
        // constant.FIRST_LOADING = true;
      }

      // 开启动画

    },
  });

  /**
   * 关系集合
   *
   * leaderKey --Array
   *            [ follower  VM , params, strategy,  ]
   *
   */
  let register = {};

  /**
   * leader.lead方法
   * 声明这个视图对象作为leader出现，允许其它follower注册
   * // 传入 leader 的id 后面的follower注册可以区分，存放的关系也是一个map  { id : [arr]}
   * //   follower传入的是一个对象，它还要表明它的同步条件
   * // 传入 key    默认是里面的form属性  这个属性共享
   *
   * // leader的属性发生改变的时候有条件的去修改follower里面的值。
   * // follower不存在时移除 _.remove  返回false
   * @param {*} epochId  leaderKey
   * @param {*} router   leader指定暴露的路由 ，默认是form
   * // 注意，程序设计问题，暴露的路由后面不能扩展，初始化就需要完善
   *
   */
  layui.binder.Method("lead", function (epochId, router = "form") {
    // 为了防止多实例时产生多个leader的问题，缓存了一份 leader与 epochId之间的关系
    // if (!leaderRegister[epochId]) {
    //   leaderRegister[epochId] = this;
    // } else {
    //   console.warn("leader已产生，不能重复绑定");
    //   return;
    // }
    // 创建 leader 与 follower 关系集合，这样的设计是在 leader初始化之前 follower也可以自行注册
    if (!register[epochId]) register[epochId] = [];
    // 为自己创建一个监视  router 下面的参数变化
    this.$watch(router, {
      immediate: true,
      deep: true,
      handler: function (value) {
        if (value == undefined) return;
        /**
         * 获取当前 router 对应的值
         * 回调函数放在后置事件，此时值已经修改完毕
         */
        let routerValue = this.proxy.getValue.call(this, router);
        // 移除已过时的 follower
        _.remove(register[epochId], (v) => !v.VM.isAlive);
        // follower 为空就直接返回
        if (register[epochId].length == 0) return;
        // 根据拒绝策略，筛选出符合条件的 follower
        _.each(
          _.filter(register[epochId], (v1) => {
            // 返回无拒绝策略，或者拒绝策略函数执行成功返回false的
            return (
              !v1.strategy ||
              (_.isFunction(v1.strategy) &&
                !v1.strategy.call(v1.VM, routerValue))
            );
          }),
          function (follower) {
            // 更新 follower 选择跟随的属性
            if (!follower.params) {
              // 不传入默认就是全部替换,router下面的所有key
              _.each(Object.keys(routerValue), function (key) {
                if (follower.VM.$data[router][key] !== undefined)
                  follower.VM.$data[router][key] = routerValue[key];
              });
            } else {
              _.each(String(follower.params).split(","), function (key) {
                if (
                  follower.VM.$data[router][key] !== undefined &&
                  routerValue[key] !== undefined
                )
                  follower.VM.$data[router][key] = routerValue[key];
              });
            }
          }
        );
      },
    });
  });

  /**
   * follower.followLead方法
   * 指定需要follow的lead的epochId
   * 指定它的同步条件，不传默认是无条件同步
   * @param {*} epochId  leaderKey
   * @param {*} params   指定暴露的同步的参数集合，以，分隔。这个参数是 router 下面的key
   * @param {*} strategy 拒绝策略，返回true拒绝这一次的更新，返回false接收这一次的更新
   *  strategy  Function (routerValue)  函数执行的上下文就是当前视图对象
   * 如果第二个参数是一个function，默认 params 为空
   *
   */
  layui.binder.Method("followLead", function (epochId, params, strategy) {
    // 初始化参数
    let _params = params !== undefined && _.isString(params) ? params : "";
    let _strategy =
      params !== undefined && _.isFunction(params)
        ? params
        : strategy !== undefined && _.isFunction(strategy)
        ? strategy
        : null;
    if (!register[epochId]) register[epochId] = [];
    // 放入缓存中，直到对象销毁后才能被 leader 移除
    // 这里刚刚加入是不能触发同步状态的，因为这个时候leader有没有被创建出来都说不一定
    register[epochId].push({
      VM: this,
      params: _params,
      strategy: _strategy,
    });
  });

  /**
   * linkWindow,仅建立关联关系，不提供，也不能直接提供打开窗口的方法
   *
   *
   */
  layui.binder.Method("linkWindow", function (VM) {
    let that = this;
    // 当前视图没有初始化就进行初始化
    if (!that.linkConfig) initLink.call(this);
    /**
     * 检查，当前的 linkConfig里面 VM
     * 1.如果为空   可能是第一次初始化
     * 2.如果不为空 可能是抛弃上一次的link，创建新的连接，这种断开方式就是提升自己的epochId
     */
    if (!that.linkConfig.VM) that.epochId++;
    // 首先确定视图对象
    if (VM instanceof layui.binder) {
      // 传入的视图没有初始化就进行初始化
      if (!VM.linkConfig) initLink.call(VM);
      // 双方交换视图对象
      that.linkConfig.VM = VM;
      VM.linkConfig.VM = that;
      // 如果现在的 epochId 和传入视图的 epochId 相同，那么说明他们同时提升epochId 才能断开之前的联系
      if (that.epochId == VM.epochId) that.epochId++;
      // 同步对方的 epochId
      // 这里先同步 epochId 是防止同步属性时会影响到之前link的窗口属性
      VM.epochId = that.epochId;
      // 同步两个视图的form属性
      let formData = that.proxy.getValue.call(that,"form");
      _.each(Object.keys(formData), (v) => (VM.$data.form[v] = formData[v]));
    }
  });

  /**
   * 初始化 linkWindow
   * 1.创建基础参数 linkConfig 和 epochId
   * 2.创建事件监听
   *
   * linkConfig里面有两个属性 VM 和 epochId
   * 如果 VM 不存在 或者 过期 isAlive = false 说明需要link的视图已不可用
   * 如果 epochId 和自己的 epochId 不相等 说明关联的视图对象已经被其它关联了
   *
   */
  function initLink() {
    let that = this;
    // 第一次进行初始化
    that.linkConfig = {};
    that.epochId = 0;
    // 监听关联的信息 form
    // 这一步是 从当前视图的改变去改变另一个视图的过程
    that.$watch("form", {
      immediate: true,
      deep: true,
      handler() {
        // 判断 VM 存在 并且 VM 有效
        if (!that.linkConfig.VM || !that.linkConfig.VM.isAlive) return;
        if (
          that.linkConfig.VM instanceof layui.binder &&
          that.linkConfig.VM.epochId == that.epochId
        ) {
          let formData = that.proxy.getValue.call(that,"form");
          _.each(
            Object.keys(formData),
            (v) => (that.linkConfig.VM.$data.form[v] = formData[v])
          );
        } else {
          // 如果它的 epochId 对不上，可以认为单方面断开了
          that.linkConfig = {};
        }
      },
    });
  }

  /**
   * 在这里处理对外方法
   */
  let windowsProxy = {
    /**
     * 供外部调用，启用这个windows组件
     * @param {*} option 用于替换默认的config
     */
    wakeUp: function (option, list) {
      // 1. 初始化配置
      this.initConfig(option, list);
      // this.initVm.apply(this)
      // 2. 加载css文件，然后创建容器
      this.loadCss(this.initVm.apply(this));
    },

    /**
     * 判断当前实例是否可用
     */
    notify: function () {
      return this.VM && this.VM.isAlive;
    },

    open: function () {
      return this.VM.windows.open.apply(this.VM.windows, arguments);
    },

    /**
     * 初始化配置
     */
    initConfig: function (option = {}, list = {}) {
      _.assign(config.constant, option);
      // 替换第三方登录用户名
      if(config.constant.DYNAMIC_OWNER) config.base.username = config.constant.DYNAMIC_OWNER;
      _.each(list, (v, k) => (config.pageDescribe[k] = v));
    },

    /**
     * 引入css文件
     * v2.0.0 禁止，还是手动引入
     * 好像禁止了样式会变，先保留
     */
    loadCss: function (cb) {
      if (!constant.FIRST_LOADING) {
        // 加载css，使用layui内部加载的方式
        let path = "modules/layer/windows.css?v=" + constant.VERSION;
        layui.addcss(
          path,
          function () {
            // 执行回调函数
            cb && cb();
            // 修改常量
            constant.FIRST_LOADING = true;
          },
          "windows"
        );
        // 返回
        return;
      }
      // 直接执行回调
      cb && cb();
    },

    /**
     * 初始化视图对象
     */
    initVm: function () {
      let the_container = this;
      // 1.清除以前的视图对象
      this.clear();
      // 2.创建dom节点,在上一步的before里面已经会需要清理dom节点的，现在直接插入即可
      $body.append(
        $(`
        <div id = "${constant.MANAGE_CONTAINER_ID}">
          <windows></windows>
        </div>
      `)
      );
      // 3.创建视图对象
      this.VM = layui.binder({
        el: "#" + constant.MANAGE_CONTAINER_ID,
        beforeDestroy() {
          // 销毁之前需要将页面上面的dom完全清理
          // 1.清理layerManager容器
          $body.find("#" + constant.MANAGE_CONTAINER_ID).remove();
          // 2.清理临时产生的复合窗口
          // 应该不用清除了，这个直接放里面的
        },
        mounted() {
          // 需要重新定义关闭方法
          this.windows.sleep = function () {
            the_container.clear();
          };
          //执行动画
          if(config.constant.DYNAMIC_STARTER){
            the_container.animation();
          }
        },
      });
      // 4.0 关闭当前所有的弹层
      // 4.播放出场动画
    },

    /**
     * 销毁视图对象
     */
    clear: function () {
      if (this.VM && this.VM.isAlive) this.VM.$destroy();
      this.VM = null;
    },

    /* 动画相关 */

    /**
     * @method  创建canvas上下文并返回
     * @returns 
     */
    createContext: function(){
      $body.append($(`<div class = "layui-windows-canvas-border"></div><canvas class = "layui-windows-canvas" id="myCanvas" width="240" height="280"></canvas>`));
      let canvas = document.getElementById('myCanvas');
      this.context = canvas.getContext('2d');
      return this.context;
    },

    /**
     * @method  获取canvas上下文并返回
     * @returns 
     */
    getContext: function(){
      if(!this.context) return this.createContext();
      return this.context;
    },

    /**
     * @method  在canvas上面绘制线段
     * @param {*} times 
     */
    painting: function(times){
      let ctx = this.getContext();
      ctx.strokeStyle = "rgba(255,255,255)";
      ctx.lineWidth = 5;
      ctx.clearRect(0,0,240,240);
      let [w,h] = [210, 40];
      // 绘制第一条线段
      ctx.beginPath();
      ctx.moveTo(w, h);
      if(times > 90){
         let [_w,_h] = [w - 90 * 1.93,  h + 90 * 1];
         ctx.lineTo(_w,  _h);
         let _times = times - 90;
         ctx.lineTo(_w  + _times * 2.74,  _h + _times * 1);
      }else{
         ctx.lineTo(w - times * 1.93,  h + times * 1);
      }
      ctx.stroke();
      ctx.closePath();

      // 绘制第二条线段
      ctx.beginPath();
      ctx.moveTo(w, h);
      if(times > 90){
         let [_w,_h] = [w - 90 * 1.11,  h + 90 * 1.28];
         ctx.lineTo(_w,  _h);
         let _times = times - 90;
         ctx.lineTo(_w,  _h + _times * 2.3);
      }else{
         ctx.lineTo(w - times * 1.11,  h + times * 1.28);
      }
      ctx.stroke();
      ctx.closePath();

      // 绘制第三条线段
      ctx.beginPath();
      ctx.moveTo(w, h);
      if(times > 90){
         let [_w,_h] = [w - 90 * 0.34,  h + 90 * 1.53];
         ctx.lineTo(_w,  _h);
         let _times = times - 90;
         ctx.lineTo(_w - _times * 2.98,  _h - _times * 0.9);
      }else{
         ctx.lineTo(w - times * 0.34,  h + times * 1.53);
      }
      ctx.stroke();
      ctx.closePath();
    },

    /**
     * @method  在canvas上面绘制文字
     */
    drawing: function(){
      let ctx = this.getContext();
      ctx.strokeStyle = "rgba(255,255,255)";
      ctx.lineWidth = 5;
      ctx.fillStyle = "rgba(255,255,255)"
      ctx.font = "24px orbitron";
      ctx.moveTo(0, 250);
      ctx.beginPath();
      ctx.fillText('windows '+ constant.VERSION, 40, 250);
      ctx.restore();
      ctx.closePath();
    },

    /**
     * @method 反复的绘制小图标
     * @param {*} i 
     * @returns 
     */
    action: function(i){
      let that = this;
      if(!i) i = 0;
      that.painting(i);
      i ++;
      if(i > 110) return;
      setTimeout(function(){
         that.action(i)
      },10)
    },

    /**
     * @method 执行启动动画
     */
    animation: function(){
      let that = this;
      that.action();
      setTimeout(function(){
        that.drawing()
      },1500);
      setTimeout(function(){
        that.drawing()
      },2000);
      setTimeout(function(){
        $body.find('.layui-windows-canvas-border').remove();
        $body.find('.layui-windows-canvas').remove();
      },2600);
    },
  };

  /**
   * 最后暴露出两个方法
   * wakeUp(option) 启用
   * notify() 查看是否可用
   */
  let handler = {
    wakeUp: function (option, list) {
      return windowsProxy.wakeUp(option, list);
    },
    open: function () {
      return windowsProxy.open.apply(windowsProxy, arguments);
    },
    notify: function () {
      return windowsProxy.notify();
    },
    instance: function () {
      return windowsProxy;
    },
  };

  /**
   * 
   * 在此处拦截open方法，不在layer.js里面操作了，减少影响
   * @since v2.5.1
   * 
   */
  const openForever = layui.layer.open;

  layui.layer.open = function(deliver, args0, args1){
    // 拦截open方法，预处理参数
    if(window.layui && layui.windows && layui.windows.notify && layui.windows.notify()){
      var tempResult = layui.windows.open(deliver, args0, args1);
      // 判断结果是不是数字 说明返回的就是index，就直接返回
      if(/^\d+$/.test(String(tempResult))) return tempResult;
      // 没有就是参数已经被包装过了。直接进行下面的方法
      deliver = tempResult;
    }
    return openForever(deliver);
  };


  /***************************************************************************************************
   * Method :: wakeUp                                     *
   *        @Description:  唤醒layer弹层管理器 - windows
   *                                                      
   *                                                      *
   * INPUT:  option  配置参数。详情可以查看windows.wakeUp    *
   *                                                      *
   * OUTPUT:  layui.binder instance                       *
   *                                                      *
   * WARNINGS:                                            *
   * HISTORY:                                             *
   *     @MethodAuthor: Malphite                                 *
   *     @Date: 2022-10-04
   *     @since v2.5.2         *
  *==================================================================================================*/
  layui.layer.wakeUp = function(option,list){
    if(!window.layui) return console.warn('不支持在单layer组件下启用windows组件');
    // layui.use('windows', () => layui.windows.wakeUp(option));
    // layui.use(['windows'], function(){
      layui.windows.wakeUp(option,list);
    // });
  };


  exports("windows", handler);
});
