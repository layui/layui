/**
 * datePicker
 * 日期和时间选择器
 */

import { lay } from '../core/lay.js';
import { i18n } from '../core/i18n.js';
import { $ } from 'jquery';
import { Popup, popupHooks } from './popup.js';

export class DatePicker extends Popup {
  static componentName = 'datePicker';

  /**
   * 默认配置项
   * 可继承 {@link Popup.options}
   */
  static options = {
    ...super.options,

    // popup 组件相关选项
    placement: 'bottom-start', // 弹出方位
    repeatClick: 'keep', // 再次点击目标元素时保持层的当前状态

    // 控件类型；可选值: year|month|date|time|datetime
    type: 'date',

    // 是否开启范围选择
    range: false,

    // 范围选择的分隔符；仅在 range 为 true 时生效
    rangeSeparator: ' ~ ',

    // 是否开启范围选择的联动模式；
    // 仅在 range 为 true 且 type 为 date|datetime 时生效
    rangeLinked: false,

    // 默认日期格式
    format: 'yyyy-MM-dd',

    // 默认日期值。支持传入 `new Date()` 或符合 `format` 设定的日期格式字符
    value: null,

    // 是否自动给目标元素填充初始值；需设置 `value` 后有效
    autoFillValue: true,

    // 一周的开始是周几。0 表示周日，1 表示周一，以此类推
    weekStart: 1,

    // 有效最小日期，年月日必须用「-」分割，时分秒必须用「:」分割
    // 注：它并不遵循 format 设定的格式
    min: '1900-1-1',

    // 有效最大日期，同上
    max: '2099-12-31',

    // 时间面板的展示模式；可选值: toggle|inline
    // 仅当 `type: 'datetime'` 且未开启 `range` 选择时生效
    timePanelMode: 'toggle',

    // 是否显示底部栏
    showBottom: true,

    // 是否显示值预览
    showPreview: true,

    // 右下角显示的按钮，会按照数组顺序排列
    btns: ['clear', 'now', 'confirm'],

    // 是否自动确认；仅在未开启 `range` 时有效
    autoConfirm: true,

    // 是否将面板内嵌渲染至目标容器中
    inline: false,

    // 语言，只内置支持中英文( cn|en )，其他语言可通过 i18n 扩展
    // 为实现 lang 选项就近生效，去除此处的默认值，$t 设置了英文回退值
    lang: '',

    // 样式变体。可选值: default|solid|grid
    variant: 'default',

    // 是否显示公历重要节日，仅支持中文版
    showFestival: false,

    // 开启并配置快捷选择栏；传入 Array
    // shortcuts: null,

    // 日期备注，如重要事件或活动标记；传入 Object 或 Function
    // mark: null,

    // 法定节假日或补班日；传入 Array 或 Function
    // holidays: null,

    // 自定义渲染日期单元格的内容；传入 Function
    // renderCell: null,

    // 格式化日期显示，不影响日期值；传入 Function
    // formatToDisplay: null,

    // 自定义禁用日期的回调，返回值为 true 的日期会被禁用
    // disabledDate: null,

    // 自定义禁用时间的回调；返回数组中指定的时间会被禁用
    // disabledTime: null,

    // 控件选择完毕后的回调，点击清空/现在/确定也均会触发
    // done: null,

    // 日期时间改变后的回调
    // onChange: null,
  };

  static get CONST() {
    return {
      ...super.CONST,
      ELEM: 'lay-datepicker',
      ELEM_MAIN: 'lay-datepicker-main',
      ELEM_LIST: 'lay-datepicker-list',
      ELEM_SELECTED: 'lay-datepicker-selected',
      ELEM_MESSAGE: 'lay-datepicker-message',
      ELEM_DAY_NOW: 'lay-datepicker-day-now',
      ELEM_PREV: 'lay-datepicker-day-prev',
      ELEM_NEXT: 'lay-datepicker-day-next',
      ELEM_FOOTER: 'lay-datepicker-footer',
      ELEM_SHORTCUT: 'lay-datepicker-shortcut',
      ELEM_NOW: 'lay-datepicker-btns-now',
      ELEM_CONFIRM: 'lay-datepicker-btns-confirm',
      ELEM_TIME_TEXT: 'lay-datepicker-time-text',
      ELEM_TIME_BTN: 'lay-datepicker-btns-time',
      ELEM_PREVIEW: 'lay-datepicker-preview',
      ELEM_INLINE: 'lay-datepicker-inline',
      LIMIT_YEAR: [100, 200000],
    };
  }

  // 实例方法静态委托
  static {
    this.delegateInstanceMethods(['showMessage']);
  }

  /**
   * 将组件内部日期对象按模板格式化为字符串
   * @param {Object} dateTime - 组件内部日期对象
   * @param {string|Array} format - 日期格式模板或已解析的格式数组
   * @param {boolean} monthOffset - 月份偏移量（传 1 表示月份 +1）
   * @returns {string} - 格式化后的日期字符串
   */
  static formatDateTime(dateTime = {}, format, monthOffset) {
    if (Object.values(dateTime).length === 0) {
      return '';
    }

    // 如果 format 是字符型，则转换为数组格式
    if (typeof format === 'string') {
      format = splitDateFormat(format);
    }
    format = (format || []).concat();

    // 转义为规定格式
    format.forEach((item, i) => {
      if (/yyyy|y/.test(item)) {
        // 年
        format[i] = lay.digit(dateTime.year, item.length);
      } else if (/MM|M/.test(item)) {
        // 月
        format[i] = lay.digit(dateTime.month + (monthOffset || 0), item.length);
      } else if (/dd|d/.test(item)) {
        // 日
        format[i] = lay.digit(dateTime.date, item.length);
      } else if (/HH|H/.test(item)) {
        // 时
        format[i] = lay.digit(dateTime.hours, item.length);
      } else if (/mm|m/.test(item)) {
        // 分
        format[i] = lay.digit(dateTime.minutes, item.length);
      } else if (/ss|s/.test(item)) {
        // 秒
        format[i] = lay.digit(dateTime.seconds, item.length);
      }
    });

    return format.join('');
  }

  /**
   * 获取指定月份的天数
   * @param {number} month - 月份（0-11）
   * @param {number} year - 年份
   * @returns {number} - 指定月份的天数
   */
  static getDaysInMonth(month, year) {
    const date = new Date();

    // 设置日期为下个月的第一天
    date.setFullYear(
      year || date.getFullYear(),
      month || date.getMonth() + 1,
      1,
    );

    // 减去一天，得到当前月最后一天
    return new Date(date.getTime() - 1000 * 60 * 60 * 24).getDate();
  }

  // 构造函数
  constructor(options) {
    super(options);

    this.overrideArrayOptions(options);

    // 更新 i18n 消息对象
    this.#i18nMessages = this.#getI18nMessages();

    // 处理日期面板顶部年月顺序
    if (typeof this.#i18nMessages.monthBeforeYear !== 'boolean') {
      const formatter = new Intl.DateTimeFormat(this.options.lang, {
        year: 'numeric',
        month: 'short',
      });
      const parts = formatter.formatToParts(new Date(1970, 0));
      const order = [];
      parts.map((part) => {
        if (part.type === 'year' || part.type === 'month') {
          order.push(part.type);
        }
      });
      this.#i18nMessages.monthBeforeYear = order[0] === 'month';
    }
  }

  /**
   * 层渲染时的内部钩子
   * @returns {void}
   */
  [popupHooks.kOnRender]() {
    const { options } = this;

    this.#prepare();

    // 内嵌模式
    if (options.inline) {
      const mainElem = this.#buildMainPanel();
      this.$mainElem.addClass('lay-panel lay-border-box');
      options.$elem.html(mainElem);
      this.#renderCalendar({ type: 'init' });
      this.#renderAdditional();
    }

    // 默认赋值
    if (options.value && options.autoFillValue) {
      let value = options.value;
      if (lay.type(value) === 'date') {
        value = this.#parse(0, this.#systemDate(options.value));
      }
      this.#setValue(value);
    }
  }

  /**
   * 层打开前的内部钩子
   * @returns {void|boolean}
   */
  [popupHooks.kBeforeOpen]() {
    const { options, $rootElem } = this;

    if (options.inline) {
      return false;
    }

    const mainElem = this.#buildMainPanel();

    // 设置 Popup 层内容
    options.content = mainElem;

    // 添加组件专属 className
    $rootElem.addClass(CONST.ELEM);
  }

  /**
   * 层打开后的内部钩子
   * @returns {void}
   */
  [popupHooks.kAfterOpen]() {
    const { constructor } = this;
    const $document = $(document);
    const eventNamespace = constructor.CONST.EVENT_NAMESPACE;

    this.#renderCalendar({ type: 'init' });
    this.#renderAdditional();

    // 回车触发确认
    $document
      .off(`keydown${eventNamespace}`)
      .on(`keydown${eventNamespace}`, (e) => {
        if (e.keyCode !== 13 || !this.isRootElemMounted()) return;
        e.preventDefault();
        const confirmBtn = $(this.footer).find(`.${CONST.ELEM_CONFIRM}`)[0];
        if (confirmBtn) {
          confirmBtn.click();
        }
      });
  }

  /**
   * 层关闭后的内部钩子
   * @returns {void}
   */
  [popupHooks.kAfterClose]() {
    const { $mainElem, constructor } = this;
    const eventNamespace = constructor.CONST.EVENT_NAMESPACE;

    if (!$mainElem.hasClass(CONST.ELEM_INLINE)) {
      this.#checkDate();
      delete this.startDate;
      delete this.endDate;
      delete this.endState;
      delete this.startTime;
      delete this.endTime;
    }

    $(document).off(`keydown${eventNamespace}`);
  }

  /**
   * 面板中的提示层
   * @param {Object} opts - 提示配置项
   * @param {string} opts.content - 提示内容
   * @param {number} opts.ms - 提示显示时长，单位毫秒
   * @returns {void}
   */
  showMessage(opts = {}) {
    const $message = $('<div>');
    const $mainElem = this.$mainElem;

    opts = {
      content: '',
      ms: 3000,
      ...opts,
    };

    if (!$mainElem) return;

    $message.addClass(`${CONST.ELEM_MESSAGE} lay-panel`);
    $message.html(opts.content);
    $mainElem.find(`.${CONST.ELEM_MESSAGE}`).remove();
    $mainElem.append($message);

    clearTimeout(this.#messageTimer);
    this.#messageTimer = setTimeout(() => {
      $mainElem.find(`.${CONST.ELEM_MESSAGE}`).remove();
    }, opts.ms);
  }
  #messageTimer = null;

  /**
   * 重写 destroy
   * @returns {void}
   */
  destroy() {
    const { options } = this;

    // 清理内嵌的主面板
    if (options.inline) {
      this.$mainElem.remove();
    }

    super.destroy();
  }

  /**
   * 规范化选项
   * @returns {void}
   */
  #normalizeOptions() {
    const options = this.options;
    const { options: defaultOptions } = this.constructor;

    // 若开启时间面板的内联模式
    if (options.timePanelMode === 'inline') {
      // 非有效的支持模式，恢复默认值
      if (options.type !== 'datetime' || options.range) {
        options.timePanelMode = defaultOptions.timePanelMode;
      }
    }

    // 若 type 非法，则重置为默认值
    if (!defaultFormat[options.type]) {
      console.error(
        `datePicker type error: '${options.type}' is not supported`,
      );
      options.type = this.constructor.options.type;
    }

    // 根据不同 type，初始化默认 format
    if (options.format === defaultFormat.date) {
      options.format = defaultFormat[options.type] || defaultFormat.date;
    }

    // 设置了一周的开始是周几，此处做一个控制
    if (options.weekStart) {
      if (!/^[0-6]$/.test(options.weekStart)) {
        const lang = this.#i18nMessages;
        options.weekStart = lang.weeks.indexOf(options.weekStart);
        if (options.weekStart === -1) {
          options.weekStart = 0;
        }
      }
    }

    // 如果不是 input|textarea 元素，则采用默认 click 事件
    if (!this.#isInput()) {
      if (options.trigger === 'focus') {
        options.trigger = 'click';
      }
    }

    // 获取限制内日期
    ['min', 'max'].forEach((item, i) => {
      let ymd = [];
      let hms = [];

      // 如果为数字
      if (typeof options[item] === 'number') {
        const day = options[item];
        const tDate = new Date();

        // 今天的最大毫秒数
        const time = this.#newDate({
          year: tDate.getFullYear(),
          month: tDate.getMonth(),
          date: tDate.getDate(),
          hours: i ? 23 : 0,
          minutes: i ? 59 : 0,
          seconds: i ? 59 : 0,
        }).getTime();

        const STAMP = 86400000;

        // 代表一天的毫秒数
        const thisDate = new Date(
          day
            ? day < STAMP
              ? time + day * STAMP
              : day // 如果数字小于一天的毫秒数，则数字为天数，否则为毫秒数
            : time,
        );

        ymd = [
          thisDate.getFullYear(),
          thisDate.getMonth() + 1,
          thisDate.getDate(),
        ];
        hms = [
          thisDate.getHours(),
          thisDate.getMinutes(),
          thisDate.getSeconds(),
        ];
      } else if (typeof options[item] === 'string') {
        ymd = (options[item].match(/\d+-\d+-\d+/) || [''])[0].split('-');
        hms = (options[item].match(/\d+:\d+:\d+/) || [''])[0].split(':');
      } else if (typeof options[item] === 'object') {
        return options[item];
      }
      options[item] = {
        year: ymd[0] | 0 || new Date().getFullYear(),
        month: ymd[1] ? (ymd[1] | 0) - 1 : new Date().getMonth(),
        date: ymd[2] | 0 || new Date().getDate(),
        hours: hms[0] | 0,
        minutes: hms[1] | 0,
        seconds: hms[2] | 0,
      };
    });
  }

  #format = [];
  #rangeLinked = false;
  #autoCalendarModel = null;
  #EXP_IF = '';
  #EXP_IF_ONE = '';
  #EXP_SPLIT = '';

  /**
   * 组件预处理
   * @returns {void}
   */
  #prepare() {
    const options = this.options;

    this.#normalizeOptions();

    // 日期范围的日历面板是否联动
    this.#rangeLinked = !!(
      options.range &&
      options.rangeLinked &&
      (options.type === 'date' || options.type === 'datetime')
    );

    // 切换日历联动方式
    this.#autoCalendarModel = () => {
      const state = this.#rangeLinked;

      this.#rangeLinked =
        options.range &&
        (options.type === 'date' || options.type === 'datetime') &&
        (!this.startDate ||
          !this.endDate ||
          (this.startDate &&
            this.endDate &&
            this.startDate.year === this.endDate.year &&
            this.startDate.month === this.endDate.month));

      this.$mainElem[this.#rangeLinked ? 'addClass' : 'removeClass'](
        'lay-datepicker-linkage',
      );

      return this.#rangeLinked != state; // 返回发生了变化
    };

    // 是否自动切换
    this.#autoCalendarModel.auto =
      this.#rangeLinked && options.rangeLinked === 'auto';

    // 若 range 参数为数组，则表示为开始日期和结束日期的 input 对象
    if (lay.type(options.range) === 'array') {
      this.$rangeElem = [$(options.range[0]), $(options.range[1])];
    }

    // 将日期格式模板拆分成数组
    this.#format = splitDateFormat(options.format);

    // 生成正则表达式
    this.#EXP_IF = '';
    this.#EXP_SPLIT = '';

    this.#format.forEach((item, i) => {
      const EXP = new RegExp(DATE_FORMAT_REGEX).test(item)
        ? `\\d{${(() => {
            if (
              new RegExp(DATE_FORMAT_REGEX).test(
                this.#format[i === 0 ? i + 1 : i - 1] || '',
              )
            ) {
              if (/^yyyy|y$/.test(item)) return 4;
              return item.length;
            }
            if (/^yyyy$/.test(item)) return '1,4';
            if (/^y$/.test(item)) return '1,308';
            return '1,2';
          })()}}`
        : `\\${item}`;

      this.#EXP_IF = `${this.#EXP_IF}${EXP}`;
      this.#EXP_SPLIT = `${this.#EXP_SPLIT}(${EXP})`;
    });

    // 验证日期格式正则
    this.#EXP_IF_ONE = new RegExp(`^${this.#EXP_IF}$`); // 验证单个日期格式
    this.#EXP_IF = new RegExp(
      `^${
        options.range
          ? `${this.#EXP_IF}${options.rangeSeparator}${this.#EXP_IF}`
          : this.#EXP_IF
      }$`,
    );
    this.#EXP_SPLIT = new RegExp(`^${this.#EXP_SPLIT}$`, '');

    // 重定义 input 元素的 get set
    if (typeof options.formatToDisplay === 'function') {
      if (this.#isInput()) {
        this.#formatToDisplay(options.$elem[0], options.formatToDisplay);
      } else {
        const $rangeElem = this.$rangeElem;

        if ($rangeElem) {
          this.#formatToDisplay($rangeElem[0][0], options.formatToDisplay);
          this.#formatToDisplay($rangeElem[1][0], options.formatToDisplay);
        }
      }
    }
  }

  #i18nMessages = null;

  /**
   * 获取国际化消息对象
   * @returns {Object} 国际化消息对象
   */
  #getI18nMessages() {
    const options = this.options;
    let locale = i18n.config.locale;

    // 纠正旧版「简体中文」语言码
    if (options.lang === 'cn') {
      options.lang = zhCN;
    } else if (!options.lang) {
      options.lang = i18n.config.locale;
    }

    locale = options.lang;

    return {
      months: i18n.$t('datePicker.months', null, {
        locale: locale,
        default: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
      }),
      weeks: i18n.$t('datePicker.weeks', null, {
        locale: locale,
        default: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      }),
      time: i18n.$t('datePicker.time', null, {
        locale: locale,
        default: ['Hour', 'Minute', 'Second'],
      }),
      literal: {
        year: i18n.$t('datePicker.literal.year', null, {
          locale: locale,
          default: '',
        }),
      },
      monthBeforeYear: i18n.$t('datePicker.monthBeforeYear', null, {
        locale: locale,
        default: null,
      }),
      selectDate: i18n.$t('datePicker.selectDate', null, {
        locale: locale,
        default: 'Select Date',
      }),
      selectTime: i18n.$t('datePicker.selectTime', null, {
        locale: locale,
        default: 'Select Time',
      }),
      startTime: i18n.$t('datePicker.startTime', null, {
        locale: locale,
        default: 'Start Time',
      }),
      endTime: i18n.$t('datePicker.endTime', null, {
        locale: locale,
        default: 'End Time',
      }),
      tools: {
        confirm: i18n.$t('datePicker.tools.confirm', null, {
          locale: locale,
          default: 'Confirm',
        }),
        clear: i18n.$t('datePicker.tools.clear', null, {
          locale: locale,
          default: 'Clear',
        }),
        now: i18n.$t('datePicker.tools.now', null, {
          locale: locale,
          default: 'Now',
        }),
        reset: i18n.$t('datePicker.tools.reset', null, {
          locale: locale,
          default: 'Reset',
        }),
      },
      rangeOrderPrompt: i18n.$t('datePicker.rangeOrderPrompt', null, {
        locale: locale,
        default: 'End time cannot be less than start Time\nPlease re-select',
      }),
      invalidDatePrompt: i18n.$t('datePicker.invalidDatePrompt', null, {
        locale: locale,
        default: 'Invalid date\n',
      }),
      formatErrorPrompt: (format) => {
        return i18n.$t(
          'datePicker.formatErrorPrompt',
          {
            format: format,
          },
          {
            locale: locale,
            default:
              'Date format is invalid\nMust follow the format:\n{format}\n',
          },
        );
      },
      autoResetPrompt: i18n.$t('datePicker.autoResetPrompt', null, {
        locale: locale,
        default: 'It has been reset',
      }),
      preview: i18n.$t('datePicker.preview', null, {
        locale: locale,
        default: 'The selected result',
      }),
    };
  }

  // 公历节日；仅 zhCN 中生效
  #markerOfChineseFestivals = {
    '0-1-1': '元旦',
    '0-3-8': '妇女',
    '0-3-12': '植树',
    '0-4-1': '愚人',
    '0-5-1': '劳动',
    '0-5-4': '青年',
    '0-6-1': '儿童',
    '0-9-10': '教师',
    '0-10-1': '国庆',
    '0-12-25': '圣诞',
  };

  /**
   * 构建主面板
   * @returns {HTMLElement} 主面板元素
   */
  #buildMainPanel() {
    const options = this.options;
    const lang = this.#i18nMessages;
    const mainElem = lay.elem('div', {
      [CONST.ATTR_ID]: options.id,
      class: (() => {
        const classLists = [CONST.ELEM];
        if (options.range) classLists.push('lay-datepicker-range');
        if (this.#rangeLinked) classLists.push('lay-datepicker-linkage');
        if (options.inline) classLists.push(CONST.ELEM_INLINE);
        if (options.timePanelMode === 'inline') {
          classLists.push('lay-datepicker-time-inline');
        }
        if (options.variant) {
          classLists.push(`lay-datepicker-variant-${options.variant}`);
        }
        return classLists.join(' ');
      })(),
    });

    // 主体区域
    const mainListElems = (this.mainListElems = []);
    const headerElems = (this.headerElems = []);
    const contentElems = (this.contentElems = []);
    const tableElems = (this.tableElems = []);

    // 底部区域
    const footerElem = (this.footer = lay.elem('div', {
      class: CONST.ELEM_FOOTER,
    }));

    // 快捷栏区域
    const shortcutElem = (this.shortcutElem = lay.elem('ul', {
      class: CONST.ELEM_SHORTCUT,
    }));

    this.$mainElem = $(mainElem);

    // 单双日历区域
    for (let i = 0; i < 2; i++) {
      if (!options.range && i > 0) {
        break;
      }

      // 头部区域
      const headerElem = lay.elem('div', {
        class: 'lay-datepicker-header',
      });

      // 头部子元素
      const headerChildren = {
        // 上一年 / 上一月
        prevYM: (() => {
          const elem = lay.elem('div', {
            class: 'lay-datepicker-prev-ym',
          });
          const yearElem = lay.elem('i', {
            class: 'lay-icon lay-icon-prev lay-datepicker-prev-y',
          });
          const monthElem = lay.elem('i', {
            class: 'lay-icon lay-icon-left lay-datepicker-prev-m',
          });
          elem.appendChild(yearElem);
          elem.appendChild(monthElem);
          return { elem, yearElem, monthElem };
        })(),

        // 选择年月
        selectYM: (() => {
          const elem = lay.elem('div', {
            class: 'lay-datepicker-select-ym',
          });
          elem.appendChild(lay.elem('span'));
          elem.appendChild(lay.elem('span'));
          return { elem };
        })(),

        // 下一年 / 下一月
        nextYM: (() => {
          const elem = lay.elem('div', {
            class: 'lay-datepicker-next-ym',
          });
          const monthElem = lay.elem('i', {
            class: 'lay-icon lay-icon-right lay-datepicker-next-m',
          });
          const yearElem = lay.elem('i', {
            class: 'lay-icon lay-icon-next lay-datepicker-next-y',
          });
          elem.appendChild(monthElem);
          elem.appendChild(yearElem);
          return { elem, yearElem, monthElem };
        })(),
      };

      // 日历内容区域
      const contentElem = lay.elem('div', {
        class: 'lay-datepicker-content',
      });
      const table = lay.elem('table');
      const thead = lay.elem('thead');
      const theadTr = lay.elem('tr');

      // 生成年月选择
      Object.values(headerChildren).forEach((item) => {
        headerElem.appendChild(item.elem);
      });

      // 生成表格
      thead.appendChild(theadTr);
      for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
        // 表体
        const tr = table.insertRow(0);
        for (let j = 0; j < 7; j++) {
          if (rowIndex === 0) {
            const th = lay.elem('th');
            th.innerHTML = lang.weeks[(j + options.weekStart) % 7];
            theadTr.appendChild(th);
          }
          tr.insertCell(j);
        }
      }
      table.insertBefore(thead, table.children[0]); // 表头
      contentElem.appendChild(table);
      mainListElems[i] = lay.elem('div', {
        class: `${CONST.ELEM_MAIN} lay-datepicker-main-list-${i}`,
      });
      mainListElems[i].appendChild(headerElem);
      mainListElems[i].appendChild(contentElem);
      headerElems.push(headerChildren);
      contentElems.push(contentElem);
      tableElems.push(table);
    }

    // 生成底部栏
    $(footerElem).html(
      (() => {
        const html = [];
        const btns = [];
        if (options.type === 'datetime') {
          html.push(
            `<span lay-type="datetime" class="${CONST.ELEM_TIME_BTN}">${lang.selectTime}</span>`,
          );
        }
        if (
          !(!options.range && options.type === 'datetime') ||
          options.timePanelMode === 'inline'
        ) {
          html.push(
            `<span class="${CONST.ELEM_PREVIEW}" title="${lang.preview}"></span>`,
          );
        }
        options.btns.forEach((item) => {
          let title = lang.tools[item] || 'btn';
          if (options.range && item === 'now') return;
          if (options.inline && item === 'clear') {
            title = lang.tools.reset;
          }
          btns.push(
            `<span lay-type="${item}" class="lay-datepicker-btns-${item}">${title}</span>`,
          );
        });
        html.push(
          `<div class="lay-datepicker-footer-btns">${btns.join('')}</div>`,
        );
        return html.join('');
      })(),
    );

    // 生成快捷键栏
    if (options.shortcuts) {
      mainElem.appendChild(shortcutElem);
      $(shortcutElem)
        .html(
          (() => {
            const shortcutBtns = [];
            options.shortcuts.forEach((item, i) => {
              shortcutBtns.push(`<li data-index="${i}">${item.text}</li>`);
            });
            return shortcutBtns.join('');
          })(),
        )
        .find('li')
        .on('click', (event) => {
          const $shortcut = $(event.currentTarget);
          const btnSetting =
            options.shortcuts[event.currentTarget.dataset.index] || {};
          let value =
            (typeof btnSetting.value === 'function'
              ? btnSetting.value()
              : btnSetting.value) || [];
          if (!lay.isArray(value)) {
            value = [value];
          }
          const type = options.type;
          value.forEach((item, i) => {
            const dateTime = [this.dateTime, this.endDate][i];
            if (type === 'time' && lay.type(item) !== 'date') {
              if (this.#EXP_IF.test(item)) {
                item = (item.match(this.#EXP_SPLIT) || []).slice(1);
                lay.extend(dateTime, {
                  hours: item[0] | 0,
                  minutes: item[2] | 0,
                  seconds: item[4] | 0,
                });
              }
            } else {
              lay.extend(
                dateTime,
                this.#systemDate(
                  lay.type(item) === 'date' ? item : new Date(item),
                ),
              );
            }
            if (type === 'time' || type === 'datetime') {
              this[['startTime', 'endTime'][i]] = {
                hours: dateTime.hours,
                minutes: dateTime.minutes,
                seconds: dateTime.seconds,
              };
            }
            if (i === 0) {
              // 第一个值作为 startDate
              this.startDate = lay.extend({}, dateTime);
            } else {
              this.endState = true;
            }
            if (type === 'year' || type === 'month' || type === 'time') {
              this.#listYM[i] = [dateTime.year, dateTime.month + 1];
            } else if (i) {
              this.#autoCalendarModel.auto && this.#autoCalendarModel();
            }
          });
          this.#checkDate('limit').#renderCalendar({ type: 'init' });
          const $timeBtn = $(this.footer)
            .find(`.${CONST.ELEM_TIME_BTN}`)
            .removeClass(CONST.CLASS_IS_DISABLED);
          $timeBtn &&
            $timeBtn.attr('lay-type') === 'date' &&
            $timeBtn[0].click();
          this.#done('onChange');
          $shortcut.addClass(CONST.CLASS_IS_SELECTED);

          // 自动确认
          if (!options.inline) {
            this.#setValue(this.#parse()).#done();
            this.close();
          }
        });
    }

    // 插入到主区域
    mainListElems.forEach((main) => {
      mainElem.appendChild(main);
    });

    if (options.showBottom) {
      mainElem.appendChild(footerElem);
    }

    this.#checkDate();
    this.#events();
    this.#preview();

    return mainElem;
  }

  // 获取递增/减后的年月
  #getAsYM(Y, M, type) {
    type ? M-- : M++;
    if (M < 0) {
      M = 11;
      Y--;
    }
    if (M > 11) {
      M = 0;
      Y++;
    }
    return [Y, M];
  }

  // 系统日期
  #systemDate(newDate) {
    const thisDate = newDate || new Date();
    return {
      year: thisDate.getFullYear(),
      // 年
      month: thisDate.getMonth(),
      // 月
      date: thisDate.getDate(),
      // 日
      hours: newDate ? newDate.getHours() : 0,
      // 时
      minutes: newDate ? newDate.getMinutes() : 0,
      // 分
      seconds: newDate ? newDate.getSeconds() : 0, // 秒
    };
  }

  /**
   * 日期校验
   * @param {string} [type] - 校验类型
   * @returns {void}
   */
  #checkDate(type) {
    const Constructor = this.constructor;
    const options = this.options;
    const lang = this.#i18nMessages;
    let dateTime = (this.dateTime = this.dateTime || this.#systemDate());
    let thisMaxDate;
    let error;
    const elem = options.$elem[0];
    let value = (() => {
      // 如果传入了开始和结束日期的 input 对象，则将其拼接为日期范围字符
      if (this.$rangeElem) {
        const vals = [this.$rangeElem[0].val(), this.$rangeElem[1].val()];
        if (vals[0] && vals[1]) {
          return vals.join(options.rangeSeparator);
        }
      }
      return this.#isInput(elem)
        ? elem.value
        : options.inline
          ? ''
          : $(elem).attr('lay-datepicker');
    })();

    // 校验日期有效数字
    const checkValid = (dateTime) => {
      if (!dateTime) {
        return;
      }
      if (dateTime.year > CONST.LIMIT_YEAR[1])
        ((dateTime.year = CONST.LIMIT_YEAR[1]), (error = true)); // 不能超过 20 万年
      if (dateTime.month > 11) ((dateTime.month = 11), (error = true));
      if (dateTime.seconds > 59)
        ((dateTime.seconds = 0), dateTime.minutes++, (error = true));
      if (dateTime.minutes > 59)
        ((dateTime.minutes = 0), dateTime.hours++, (error = true));
      if (dateTime.hours > 23) ((dateTime.hours = 0), (error = true));

      // 计算当前月的最后一天
      thisMaxDate = Constructor.getDaysInMonth(
        dateTime.month + 1,
        dateTime.year,
      );
      if (dateTime.date > thisMaxDate)
        ((dateTime.date = thisMaxDate), (error = true));
    };

    // 获得初始化日期值
    const initDate = (dateTime, value, index) => {
      const startEnd = ['startTime', 'endTime'];
      value = (value.match(this.#EXP_SPLIT) || []).slice(1);
      index = index || 0;
      if (options.range) {
        this[startEnd[index]] = this[startEnd[index]] || {};
      }
      this.#format.forEach((item, i) => {
        let thisv = parseFloat(value[i]);
        if (value[i].length < item.length) error = true;
        if (/yyyy|y/.test(item)) {
          // 年
          if (thisv < CONST.LIMIT_YEAR[0])
            ((thisv = CONST.LIMIT_YEAR[0]), (error = true)); // 年不能低于 100 年
          dateTime.year = thisv;
        } else if (/MM|M/.test(item)) {
          // 月
          if (thisv < 1) ((thisv = 1), (error = true));
          dateTime.month = thisv - 1;
        } else if (/dd|d/.test(item)) {
          // 日
          if (thisv < 1) ((thisv = 1), (error = true));
          dateTime.date = thisv;
        } else if (/HH|H/.test(item)) {
          // 时
          if (thisv < 0) ((thisv = 0), (error = true));
          if (thisv > 23) ((thisv = 23), (error = true));
          dateTime.hours = thisv;
          options.range && (this[startEnd[index]].hours = thisv);
        } else if (/mm|m/.test(item)) {
          // 分
          if (thisv < 0) ((thisv = 0), (error = true));
          if (thisv > 59) ((thisv = 59), (error = true));
          dateTime.minutes = thisv;
          options.range && (this[startEnd[index]].minutes = thisv);
        } else if (/ss|s/.test(item)) {
          // 秒
          if (thisv < 0) ((thisv = 0), (error = true));
          if (thisv > 59) ((thisv = 59), (error = true));
          dateTime.seconds = thisv;
          options.range && (this[startEnd[index]].seconds = thisv);
        }
      });
      checkValid(dateTime);
    };

    if (type === 'limit') {
      if (options.range) {
        checkValid(this.#rangeLinked ? this.startDate : dateTime); // 校验开始时间
        this.endDate && checkValid(this.endDate); // 校验结束时间
      } else {
        checkValid(dateTime);
      }
      return this;
    }

    value = value || options.value;

    if (typeof value === 'string') {
      value = value.replace(/\s+/g, ' ').replace(/^\s|\s$/g, '');
    }

    // 如果开启范围，则计算结束日期
    const getEndDate = () => {
      if (options.range) {
        this.endDate =
          this.endDate ||
          lay.extend(
            {},
            this.dateTime,
            (() => {
              const obj = {},
                dateTime = this.dateTime,
                EYM = this.#getAsYM(dateTime.year, dateTime.month);

              // 初始右侧面板的年月
              if (options.type === 'year') {
                obj.year = dateTime.year + 1;
              } else if (options.type !== 'time') {
                obj.year = EYM[0];
                obj.month = EYM[1];
              }

              // 初始右侧面板的时间
              if (options.type === 'datetime' || options.type === 'time') {
                obj.hours = 23;
                obj.minutes = obj.seconds = 59;
              }
              return obj;
            })(),
          );
      }
    };

    getEndDate();

    if (typeof value === 'string' && value) {
      if (this.#EXP_IF.test(value)) {
        // 校验日期格式
        if (options.range) {
          value = value.split(options.rangeSeparator);
          [this.dateTime, this.endDate].forEach((item, i) => {
            initDate(item, value[i], i);
          });
        } else {
          initDate(dateTime, value);
        }
      } else {
        // 格式不合法
        this.showMessage({
          content: `${lang.formatErrorPrompt(
            options.range
              ? `${options.format}${options.rangeSeparator}${options.format}`
              : options.format,
          )}${lang.autoResetPrompt}`,
        });
        error = true;
      }
    } else if (value && lay.type(value) === 'date') {
      // 若值为日期对象
      this.dateTime = this.#systemDate(value);
    } else {
      // 重置开始日期
      this.dateTime = this.#systemDate();
      delete this.startTime;

      // 重置结束日期
      delete this.endDate; // 删除原有的结束日期
      getEndDate(); // 并重新获得新的结束日期
      delete this.endTime;
    }

    // 从日期范围表单中获取初始值
    (() => {
      if (this.$rangeElem) {
        const vals = [this.$rangeElem[0].val(), this.$rangeElem[1].val()],
          arrDate = [this.dateTime, this.endDate];
        vals.forEach((_v, _i) => {
          if (this.#EXP_IF_ONE.test(_v)) {
            // 校验日期格式
            initDate(arrDate[_i], _v, _i);
          }
        });
      }
    })();

    // 校验日期有效数字
    checkValid(dateTime);
    if (options.range) checkValid(this.endDate);

    // 如果初始值格式错误，则纠正初始值
    if (error && value) {
      this.#setValue(
        options.range ? (this.endDate ? this.#parse() : '') : this.#parse(),
      );
    }

    // 如果当前日期不在设定的最大小日期区间，则自动纠正在可选区域
    // 校验主面板是否在可选日期区间
    let minMaxError;
    if (this.#getDateTime(dateTime) > this.#getDateTime(options.max)) {
      // 若超出最大日期
      dateTime = this.dateTime = lay.extend({}, options.max);
      minMaxError = true;
    } else if (this.#getDateTime(dateTime) < this.#getDateTime(options.min)) {
      // 若少于最小日期
      dateTime = this.dateTime = lay.extend({}, options.min);
      minMaxError = true;
    }

    // 校验右侧面板是否在可选日期区间
    if (options.range) {
      if (
        this.#getDateTime(this.endDate) < this.#getDateTime(options.min) ||
        this.#getDateTime(this.endDate) > this.#getDateTime(options.max)
      ) {
        this.endDate = lay.extend({}, options.max);
        minMaxError = true;
      }
      // 有时间范围的情况下初始化 startTime 和 endTime
      this.startTime = {
        hours: this.dateTime.hours,
        minutes: this.dateTime.minutes,
        seconds: this.dateTime.seconds,
      };
      this.endTime = {
        hours: this.endDate.hours,
        minutes: this.endDate.minutes,
        seconds: this.endDate.seconds,
      };

      // 如果是年月范围，将对应的日期统一成当月的 1 日进行比较，避免出现同一个月但是开始日期大于结束日期的情况
      if (options.type === 'month') {
        this.dateTime.date = 1;
        this.endDate.date = 1;
      }
    }

    // 初始值不在最大最小范围内
    if (minMaxError && value) {
      this.#setValue(this.#parse());
      this.showMessage({
        content: `value ${lang.invalidDatePrompt + lang.autoResetPrompt}`,
      });
    }

    // 初始赋值 startDate, endState
    this.startDate = this.startDate || (value && lay.extend({}, this.dateTime));
    this.#autoCalendarModel.auto && this.#autoCalendarModel();
    this.endState =
      !options.range ||
      !this.#rangeLinked ||
      !!(this.startDate && this.endDate); // 初始化选中范围状态

    return this;
  }

  /**
   * 渲染备注
   * @param {JQuery} $tdElem td 元素
   * @param {[number, number, number]} YMD 年月日
   * @param {object | string} markers 备注信息
   * @returns {void}
   */
  #renderMark($tdElem, YMD, markers) {
    let markText;
    if (typeof markers === 'object') {
      Object.entries(markers || {}).forEach(([key, title]) => {
        const keys = key.split('-');
        if (
          (keys[0] == YMD[0] || keys[0] == 0) &&
          // 每年的每月
          (keys[1] == YMD[1] || keys[1] == 0) &&
          // 每月的每日
          keys[2] == YMD[2]
        ) {
          // 特定日
          markText = title || YMD[2];
        }
      });
    } else if (typeof markers === 'string') {
      markText = markers || YMD[2];
    }
    markText &&
      $tdElem
        .find('div')
        .html(`<span class="lay-datepicker-day-mark">${markText}</span>`);
  }

  /**
   * 公历重要日期与自定义备注
   * @param {JQuery} $td - td 元素
   * @param {[number, number, number]} YMD
   * @returns {this}
   */
  #mark($td, YMD) {
    const options = this.options;
    const render = (markers) => {
      this.#renderMark($td, YMD, markers);
    };

    // chineseFestivals 仅简体中文生效
    if (options.showFestival) {
      if (options.lang === zhCN) {
        render(this.#markerOfChineseFestivals);
      }
    }
    if (typeof options.mark === 'function') {
      options.mark(
        {
          year: YMD[0],
          month: YMD[1],
          date: YMD[2],
        },
        render,
      );
    } else if (typeof options.mark === 'object') {
      render(options.mark);
    }
    return this;
  }

  /**
   * 渲染法定节假日或补假上班标记
   * @param {JQuery} $td - td 元素
   * @param {[number, number, number]} YMD 年月日
   * @param {[Array<string>, Array<string>] | string} markers 标记信息
   * @returns {void}
   */
  #renderHolidays($td, YMD, markers) {
    const type = ['holidays', 'workdays'];
    const isEquals = (ymdStr1, ymdStr2) => {
      const ymd1 = ymdStr1.split('-');
      const ymd2 = ymdStr2.split('-');
      ymd1.forEach((v, i) => {
        ymd1[i] = parseInt(v, 10);
      });
      ymd2.forEach((v, i) => {
        ymd2[i] = parseInt(v, 10);
      });
      return ymd1.join('-') === ymd2.join('-');
    };
    const insertHtml = (el, type, text) => {
      el.find('div').html(
        [
          '<span',
          ' class="lay-datepicker-day-holidays"',
          ` type="${type}"`,
          '>',
          text,
          '</span>',
        ].join(''),
      );
    };
    if (lay.type(markers) === 'array') {
      markers.forEach((item, idx) => {
        (item || []).forEach((dayStr) => {
          if (isEquals(dayStr, $td.attr('lay-ymd'))) {
            insertHtml($td, type[idx], YMD[2]);
          }
        });
      });
    } else if (typeof markers === 'string') {
      if (type.indexOf(markers) !== -1) {
        insertHtml($td, markers, YMD[2]);
      }
    }
  }

  /**
   * 标注法定节假日或补假上班
   * @param {JQuery} $td
   * @param {[number, number, number]} YMD
   * @returns {this}
   */
  #holidays($td, YMD) {
    const options = this.options;
    const render = (markers) => {
      this.#renderHolidays($td, YMD, markers);
    };
    if (typeof options.holidays === 'function') {
      options.holidays(
        {
          year: YMD[0],
          month: YMD[1],
          date: YMD[2],
        },
        render,
      );
    } else if (lay.type(options.holidays) === 'array') {
      render(options.holidays);
    }

    return this;
  }

  /**
   * 自定义单元格的内容
   * @param {HTMLElement|Array<HTMLElement>} el - 单元格元素
   * @param {{year:number, month:number, date:number}} dateObj - 当前单元格对应的日期信息
   * @param {'year' | 'month' | 'date'} panelMode - 面板模式
   * @returns {this}
   */
  #renderCell(el, dateObj, panelMode) {
    const options = this.options;
    if (typeof options.renderCell === 'function') {
      const render = (content) => {
        if (typeof content === 'string') {
          $(el).html(content);
        } else if (typeof content === 'object') {
          $(el).html('').append($(content)[0]);
        }
      };
      options.renderCell(dateObj, render, {
        originElem: el,
        type: panelMode,
      });
    }

    return this;
  }

  /**
   * 给定年份的开始日期
   * @param {Date} date
   * @returns {Date}
   */
  #startOfYear(date) {
    const newDate = new Date(date);
    newDate.setFullYear(newDate.getFullYear(), 0, 1);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }

  /**
   * 给定年份的结束日期
   * @param {Date} date
   * @returns {Date}
   */
  #endOfYear(date) {
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    newDate.setFullYear(year + 1, 0, 0);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
  }

  /**
   * 给定月份的开始日期
   * @param {Date} date
   * @returns {Date}
   */
  #startOfMonth(date) {
    const newDate = new Date(date);
    newDate.setDate(1);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }

  /**
   * 给定月份的结束日期
   * @param {Date} date
   * @returns {Date}
   */
  #endOfMonth(date) {
    const newDate = new Date(date);
    const month = newDate.getMonth();
    newDate.setFullYear(newDate.getFullYear(), month + 1, 0);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
  }

  /**
   * 将指定的天数添加到给定日期
   * @param {Date} date 要更改的日期
   * @param {number} amount 天数
   * @returns {Date}
   */
  #addDays(date, amount) {
    const newDate = new Date(date);
    if (!amount) return newDate;
    newDate.setDate(newDate.getDate() + amount);
    return newDate;
  }

  /**
   * 不可选取的年或月。年或月中的所有日期都禁用时，才判定为不可选取。
   * @param {Date} date 要检测的年或月
   * @param {'year' | 'month'} type 面板类型
   * @param {'start' | 'end'} position 面板位置
   * @returns {boolean}
   */
  #isDisabledYearOrMonth(date, type, position) {
    const options = this.options;
    const millisecondsInDay = 24 * 60 * 60 * 1000;
    const startDay =
      type === 'year' ? this.#startOfYear(date) : this.#startOfMonth(date);
    const endDay =
      type === 'year' ? this.#endOfYear(date) : this.#endOfMonth(date);
    const numOfDays =
      Math.floor((endDay.getTime() - startDay.getTime()) / millisecondsInDay) +
      1;
    let disabledCount = 0;
    for (let i = 0; i < numOfDays; i++) {
      const day = this.#addDays(startDay, i);
      if (options.disabledDate.call(options, day, position)) {
        disabledCount++;
      }
    }
    return disabledCount === numOfDays;
  }

  /**
   * @typedef limitOptions
   * @prop {JQuery} [elem] - 检测的元素, 例如面板中年月日时分秒元素，「现在」，「确认」 按钮等
   * @prop {number} [index] - 元素集合中，当前检测元素的索引，years:0,month:0,date:0-41,hms:0
   * @prop {['hours', 'minutes', 'seconds'] | ['hours', 'minutes'] | ['hours']} [time] - 是否比较时分秒
   * @prop {'year'|'month'|string} [type] - 面板类型?
   * @prop {0 | 1} [rangeType] - 面板索引, 0 表示 start, 1 表示 end
   * @prop {Partial<{year:number,month: number,date:number,hours:number,minutes:number,seconds:number}>} [date] - 检测的日期时间对象
   * @prop {'date' | 'time' | 'datetime'} disabledType - 禁用类型，按钮应使用 datetime
   */
  /**
   * 不可选取的日期
   * @param {number} date 当前检测的日期的时间戳
   * @param {limitOptions} opts
   * @returns {boolean}
   */
  #isDisabledDate(date, opts) {
    opts = opts || {};
    const options = this.options;
    const position = options.range
      ? opts.rangeType === 0
        ? 'start'
        : 'end'
      : 'start';
    if (!options.disabledDate) return false;
    if (options.type === 'time') return false;
    if (!(opts.disabledType === 'date' || opts.disabledType === 'datetime'))
      return false;

    // 不需要时分秒
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    return opts.type === 'year' || opts.type === 'month'
      ? this.#isDisabledYearOrMonth(normalizedDate, opts.type, position)
      : options.disabledDate.call(options, normalizedDate, position);
  }

  /**
   * 不可选取的时间
   * @param {number} date 当前检测的日期的时间戳
   * @param {limitOptions} opts
   * @returns {boolean}
   */
  #isDisabledTime(date, opts) {
    opts = opts || {};
    const options = this.options;
    const position = options.range
      ? opts.rangeType === 0
        ? 'start'
        : 'end'
      : 'start';
    if (!options.disabledTime) return false;
    if (!(options.type === 'time' || options.type === 'datetime')) return false;
    if (!(opts.disabledType === 'time' || opts.disabledType === 'datetime'))
      return false;
    const isDisabledItem = (compareVal, rangeFn, rangeFnParam) => {
      return () => {
        return (
          (
            (typeof rangeFn === 'function' &&
              rangeFn.apply(options, rangeFnParam)) ||
            []
          ).indexOf(compareVal) !== -1
        );
      };
    };
    const dateObj = this.#systemDate(new Date(date));
    const disabledTime =
      options.disabledTime.call(options, this.#newDate(dateObj), position) ||
      {};

    // 面板中的时分秒 HTML 元素需要分别检测是否禁用
    // 按钮检测任意一项是否禁用即可
    return opts.disabledType === 'datetime'
      ? isDisabledItem(dateObj.hours, disabledTime.hours)() ||
          isDisabledItem(dateObj.minutes, disabledTime.minutes, [
            dateObj.hours,
          ])() ||
          isDisabledItem(dateObj.seconds, disabledTime.seconds, [
            dateObj.hours,
            dateObj.minutes,
          ])()
      : [
          isDisabledItem(dateObj.hours, disabledTime.hours),
          isDisabledItem(dateObj.minutes, disabledTime.minutes, [
            dateObj.hours,
          ]),
          isDisabledItem(dateObj.seconds, disabledTime.seconds, [
            dateObj.hours,
            dateObj.minutes,
          ]),
        ][opts.time.length - 1]();
  }

  /**
   * 不可选取的日期时间
   * @param {number} timestamp 当前检测的日期的时间戳
   * @param {limitOptions} opts
   * @returns {boolean}
   */
  #isDisabledDateTime(timestamp, opts) {
    opts = opts || {};

    return (
      this.#isDisabledDate(timestamp, opts) ||
      this.#isDisabledTime(timestamp, opts)
    );
  }

  /**
   * 无效日期范围的标记
   * @param {limitOptions} opts
   * @returns {boolean}
   */
  #limit(opts) {
    opts = opts || {};
    const options = this.options;
    const timestamp = {};
    const dateTime =
      opts.index > (opts.time ? 0 : 41) ? this.endDate : this.dateTime;
    Object.entries({
      now: lay.extend({}, dateTime, opts.date || {}),
      min: options.min,
      max: options.max,
    }).forEach(([key, item]) => {
      timestamp[key] = this.#newDate(
        lay.extend(
          {
            year: item.year,
            month: opts.type === 'year' ? 0 : item.month,
            // 年份的时候只比较年
            date: opts.type === 'year' || opts.type === 'month' ? 1 : item.date, // 年月只比较年月不与最大最小比日期
          },
          (() => {
            const hms = {};
            (opts.time || []).forEach((keys) => {
              hms[keys] = item[keys];
            });
            return hms;
          })(),
        ),
      ).getTime(); // time：是否比较时分秒
    });
    const isOut =
      timestamp.now < timestamp.min ||
      timestamp.now > timestamp.max ||
      this.#isDisabledDateTime(timestamp.now, opts);
    opts.elem &&
      opts.elem[isOut ? 'addClass' : 'removeClass'](CONST.CLASS_IS_DISABLED);

    return isOut;
  }

  /**
   * 当前日期和时间对象
   * @param {0 | 1} index - 面板索引
   * @returns {Object} 返回日期和时间对象
   */
  thisDateTime(index) {
    return index ? this.endDate : this.dateTime;
  }

  /**
   * 渲染日历表
   * @param {Object} opts - 参数对象
   * @param {Object} opts.dateTime - 日期和时间对象
   * @param {0 | 1} opts.index - 面板索引
   * @param {string} opts.type - 面板类型
   * @returns {this}
   */
  #renderCalendar(opts = {}) {
    const Constructor = this.constructor;
    const options = this.options;
    const index = opts.index ? 1 : 0;
    const dateTime = opts.dateTime || this.thisDateTime(index);
    const thisDate = new Date();
    const lang = this.#i18nMessages;
    const isAlone = options.type !== 'date' && options.type !== 'datetime';
    const $tds = $(this.tableElems[index]).find('td');
    const $selectYMSpans = $(this.headerElems[index].selectYM.elem).children(
      'span',
    );

    // 年份是否在有效范围内
    if (dateTime.year < CONST.LIMIT_YEAR[0]) {
      dateTime.year = CONST.LIMIT_YEAR[0];
      this.showMessage({
        content: lang.invalidDatePrompt,
      });
    }
    if (dateTime.year > CONST.LIMIT_YEAR[1]) {
      dateTime.year = CONST.LIMIT_YEAR[1];
      this.showMessage({
        content: lang.invalidDatePrompt,
      });
    }

    // 记录初始值
    if (!this.firstDate) {
      this.firstDate = lay.extend({}, dateTime);
    }

    // 计算当前月第一天的星期
    thisDate.setFullYear(dateTime.year, dateTime.month, 1);
    const startWeek = (thisDate.getDay() + (7 - options.weekStart)) % 7;

    // 计算上个月的最后一天
    const prevMaxDate = Constructor.getDaysInMonth(
      dateTime.month || 12,
      dateTime.year,
    );

    // 计算当前月的最后一天
    const thisMaxDate = Constructor.getDaysInMonth(
      dateTime.month + 1,
      dateTime.year,
    );

    // 赋值日
    $tds.each((_index, item) => {
      let YMD = [dateTime.year, dateTime.month],
        st;
      const $item = $(item);
      $item.removeAttr('class');
      if (_index < startWeek) {
        st = prevMaxDate - startWeek + _index;
        $item.addClass('lay-datepicker-day-prev');
        YMD = this.#getAsYM(dateTime.year, dateTime.month, 'sub');
      } else if (_index >= startWeek && _index < thisMaxDate + startWeek) {
        st = _index - startWeek;
        if (!this.#rangeLinked) {
          st + 1 === dateTime.date && $item.addClass(CONST.CLASS_IS_SELECTED);
        }
      } else {
        st = _index - thisMaxDate - startWeek;
        $item.addClass('lay-datepicker-day-next');
        YMD = this.#getAsYM(dateTime.year, dateTime.month);
      }
      YMD[1]++;
      YMD[2] = st + 1;
      $item.attr('lay-ymd', YMD.join('-')).html(`<div>${YMD[2]}</div>`);
      this.#mark($item, YMD)
        .#holidays($item, YMD)
        .#limit({
          elem: $item,
          date: {
            year: YMD[0],
            month: YMD[1] - 1,
            date: YMD[2],
          },
          index: _index,
          rangeType: index,
          disabledType: 'date', // 日面板，检测当前日期是否禁用
        });
      this.#renderCell(
        $item,
        {
          year: YMD[0],
          month: YMD[1],
          date: YMD[2],
        },
        'date',
      );
    });

    // 同步头部年月
    const layYM = `${dateTime.year}-${dateTime.month + 1}`;
    $selectYMSpans[0].setAttribute('lay-ym', layYM);
    $selectYMSpans[1].setAttribute('lay-ym', layYM);

    if (!this.panelYM) {
      this.panelYM = {};
    }

    this.panelYM[index] = {
      year: dateTime.year,
      month: dateTime.month,
    };

    const normalizedYearStr = addSpaceBetweenChars(
      `${dateTime.year}${lang.literal.year}`,
    );
    const normalizedMonthStr = addSpaceBetweenChars(
      lang.months[dateTime.month],
    );

    if (!lang.monthBeforeYear) {
      $($selectYMSpans[0]).attr('lay-type', 'year').html(normalizedYearStr);
      $($selectYMSpans[1]).attr('lay-type', 'month').html(normalizedMonthStr);
    } else {
      $($selectYMSpans[0]).attr('lay-type', 'month').html(normalizedMonthStr);
      $($selectYMSpans[1]).attr('lay-type', 'year').html(normalizedYearStr);
    }

    // 初始默认选择器
    if (isAlone) {
      // 年、月等独立选择器
      if (options.range) {
        if (opts.dateTime || opts.type !== 'init') {
          // 判断是否需要显示年月时间列表
          this.#listYM = [
            [
              (this.startDate || this.dateTime).year,
              (this.startDate || this.dateTime).month + 1,
            ],
            [this.endDate.year, this.endDate.month + 1],
          ];
          this.#renderlist(options.type, 0).#renderlist(options.type, 1);

          // 同步按钮可点状态
          options.type === 'time'
            ? this.#updateConfirmButtonStatus(
                true,
                lay.extend({}, this.#systemDate(), this.startTime),
                lay.extend({}, this.#systemDate(), this.endTime),
              )
            : this.#updateConfirmButtonStatus(true);
        }
      } else {
        this.#listYM = [[dateTime.year, dateTime.month + 1]];
        this.#renderlist(options.type, 0);
      }
    }

    // 初始赋值双日历
    if (options.range && opts.type === 'init') {
      // 执行渲染第二个日历
      if (this.#rangeLinked) {
        const EYM = this.#getAsYM(
          dateTime.year,
          dateTime.month,
          index ? 'sub' : null,
        );
        this.#renderCalendar({
          dateTime: lay.extend({}, dateTime, {
            year: EYM[0],
            month: EYM[1],
          }),
          index: 1 - index,
        });
      } else {
        this.#renderCalendar({ index: 1 - index });
      }
    }

    // 通过检测当前有效日期，来设定底部按钮状态
    if (!options.range) {
      const timeParams = ['hours', 'minutes', 'seconds'];

      // 现在按钮
      this.#limit({
        elem: $(this.footer).find(`.${CONST.ELEM_NOW}`),
        date: this.#systemDate(
          /^(datetime|time)$/.test(options.type) ? new Date() : null,
        ),
        index: 0,
        time: timeParams,
        disabledType: 'datetime', // 按钮，检测日期和时间
      });

      // 确认按钮
      this.#limit({
        elem: $(this.footer).find(`.${CONST.ELEM_CONFIRM}`),
        index: 0,
        time: timeParams,
        disabledType: 'datetime', // 按钮，检测日期和时间
      });
    } else {
      this.#updateConfirmButtonStatus();
    }

    // 重置快捷栏选中状态
    $(this.shortcutElem)
      .find(`li.${CONST.CLASS_IS_SELECTED}`)
      .removeClass(CONST.CLASS_IS_SELECTED);

    // 标记选择范围
    if (options.range && !isAlone && opts.type !== 'init') this.#stampRange();

    return this;
  }

  /**
   * 渲染「年/月/时间」列表
   * @param {'year' | 'month' | 'time'} type - 列表类型
   * @param {0 | 1} index - 面板索引
   * @returns {this}
   */
  #renderlist(type, index) {
    const options = this.options;
    const dateTime = this.#rangeLinked
      ? this.dateTime
      : [this.dateTime, this.endDate][index];
    const lang = this.#i18nMessages;
    const isAlone =
      options.range && options.type !== 'date' && options.type !== 'datetime';
    // 独立范围选择器
    const ul = lay.elem('ul', {
      class: `${CONST.ELEM_LIST} ${
        {
          year: 'lay-datepicker-year-list',
          month: 'lay-datepicker-month-list',
          time: 'lay-datepicker-time-list',
        }[type]
      }`,
    });
    const headerElem = this.headerElems[index];
    const $elemYM = $(headerElem.selectYM.elem).children('span');
    const contentElem = this.contentElems[index || 0];
    const haveList = $(contentElem).find(`.${CONST.ELEM_LIST}`)[0];
    const isMonthBeforeYear = lang.monthBeforeYear;
    const text = lang.literal.year;
    const listYM = this.#listYM[index] || {};
    const hms = ['hours', 'minutes', 'seconds'];
    const startEnd = ['startTime', 'endTime'][index];
    let setTimeStatus;

    if (listYM[0] < 1) {
      listYM[0] = 1;
    }

    // 生成年列表
    if (type === 'year') {
      let yearNum,
        startY = (yearNum = listYM[0] - 7);
      if (startY < 1) startY = yearNum = 1;
      for (let yearIndex = 0; yearIndex < 15; yearIndex++) {
        const li = lay.elem('li', {
            'lay-ym': yearNum,
          }),
          ymd = {
            year: yearNum,
            month: 0,
            date: 1,
          };
        yearNum == listYM[0] && $(li).addClass(CONST.CLASS_IS_SELECTED);
        li.innerHTML = `${yearNum}${text}`;
        ul.appendChild(li);

        this.#limit({
          elem: $(li),
          date: ymd,
          index: index,
          type: type,
          rangeType: index,
          disabledType: 'date', // 年面板，检测当前年份中的所有日期是否禁用
        });
        this.#renderCell(
          li,
          {
            year: yearNum,
            month: 1,
            date: 1,
          },
          'year',
        );
        yearNum++;
      }
      $($elemYM[!isMonthBeforeYear ? 0 : 1])
        .attr('lay-ym', `${yearNum - 8}-${listYM[1]}`)
        .html(`${startY}${text} - ${yearNum - 1}${text}`);
    }

    // 生成月列表
    else if (type === 'month') {
      for (let i = 0; i < 12; i++) {
        const li = lay.elem('li', {
          'lay-ym': i,
        });
        const ymd = {
          year: listYM[0],
          month: i,
          date: 1,
        };
        i + 1 == listYM[1] && $(li).addClass(CONST.CLASS_IS_SELECTED);
        li.innerHTML = lang.months[i];
        ul.appendChild(li);

        this.#limit({
          elem: $(li),
          date: ymd,
          index: index,
          type: type,
          rangeType: index,
          disabledType: 'date', // 月面板，检测当前月份中的所有日期是否禁用
        });

        this.#renderCell(
          li,
          {
            year: listYM[0],
            month: i + 1,
            date: 1,
          },
          'month',
        );
      }
      $($elemYM[!isMonthBeforeYear ? 0 : 1])
        .attr('lay-ym', `${listYM[0]}-${listYM[1]}`)
        .html(`${listYM[0]}${text}`);
    }

    // 生成时间列表
    else if (type === 'time') {
      // 检测时分秒状态是否在有效日期时间范围内
      setTimeStatus = () => {
        $(ul)
          .find('ol')
          .each((i, ol) => {
            $(ol)
              .find('li')
              .each((ii, li) => {
                this.#limit({
                  elem: $(li),
                  date: [
                    {
                      hours: ii,
                    },
                    {
                      hours: this[startEnd].hours,
                      minutes: ii,
                    },
                    {
                      hours: this[startEnd].hours,
                      minutes: this[startEnd].minutes,
                      seconds: ii,
                    },
                  ][i],
                  index: index,
                  rangeType: index,
                  disabledType: 'time',
                  // 时间面板，分别检测时分秒列表是否禁用
                  time: [
                    ['hours'],
                    ['hours', 'minutes'],
                    ['hours', 'minutes', 'seconds'],
                  ][i],
                });
              });
          });
        if (!options.range) {
          this.#limit({
            elem: $(this.footer).find(`.${CONST.ELEM_CONFIRM}`),
            date: this[startEnd],
            index: 0,
            time: ['hours', 'minutes', 'seconds'],
            disabledType: 'datetime', // 确认按钮，检测时分秒列表任意一项是否禁用
          });
        }
      };
      const setTimeListVisibility = () => {
        const showHour = options.format.indexOf('H') !== -1;
        const showMinute = options.format.indexOf('m') !== -1;
        const showSecond = options.format.indexOf('s') !== -1;
        const liElem = ul.children;
        let hideCount = 0;
        [showHour, showMinute, showSecond].forEach((isShow, i) => {
          if (!isShow) {
            liElem[i].className = `${liElem[i].className} lay-hide`;
            hideCount++;
          }
        });
        ul.className += ` lay-datepicker-time-list-hide-${hideCount}`;
      };

      // 初始化时间对象
      if (options.range) {
        if (!this[startEnd]) {
          this[startEnd] = startEnd === 'startTime' ? dateTime : this.endDate;
        }
      } else {
        this[startEnd] = dateTime;
      }

      // 生成时分秒
      [24, 60, 60].forEach((item, i) => {
        const li = lay.elem('li'),
          childUL = [`<p>${lang.time[i]}</p><ol>`];
        for (let ii = 0; ii < item; ii++) {
          childUL.push(
            `<li${this[startEnd][hms[i]] === ii ? ` class="${CONST.CLASS_IS_SELECTED}"` : ''}>${lay.digit(ii, 2)}</li>`,
          );
        }
        li.innerHTML = `${childUL.join('')}</ol>`;
        ul.appendChild(li);
      });
      setTimeStatus();
      setTimeListVisibility();
    }

    // 插入容器
    if (haveList) contentElem.removeChild(haveList);
    contentElem.appendChild(ul);

    // 年月面板 - 选择事件
    if (type === 'year' || type === 'month') {
      // 显示切换箭头
      $(this.mainListElems[index]).addClass('lay-datepicker-ym-show');

      // 选中
      $(ul)
        .find('li')
        .on('click', (event) => {
          const $item = $(event.currentTarget);
          const ym = $item.attr('lay-ym') | 0;
          if ($item.hasClass(CONST.CLASS_IS_DISABLED)) return;
          if (this.#rangeLinked) {
            lay.extend(dateTime, {
              year: type === 'year' ? ym : listYM[0],
              month: type === 'year' ? listYM[1] - 1 : ym,
            });
          } else {
            dateTime[type] = ym;
          }

          // 当为年选择器或者年月选择器
          const isYearOrMonth = ['year', 'month'].indexOf(options.type) !== -1;
          const isChangeMonth =
            type === 'year' &&
            ['date', 'datetime'].indexOf(options.type) !== -1;
          if (isYearOrMonth || isChangeMonth) {
            $(ul)
              .find(`.${CONST.CLASS_IS_SELECTED}`)
              .removeClass(CONST.CLASS_IS_SELECTED);
            $item.addClass(CONST.CLASS_IS_SELECTED);

            // 如果为年月选择器，点击了年列表，则切换到月选择器
            if (
              (options.type === 'month' && type === 'year') ||
              isChangeMonth
            ) {
              this.#listYM[index][0] = ym;
              isAlone && ((index ? this.endDate : dateTime).year = ym);
              this.#renderlist('month', index);
            }
          } else {
            // 重新渲染一下两个面板
            this.#checkDate('limit').#renderCalendar({
              dateTime,
              index,
              type: 'init',
            });
            this.#closeList();
          }
          if (!options.range) {
            this.#limit({
              type: type,
              elem: $(this.footer).find(`.${CONST.ELEM_CONFIRM}`),
              date: dateTime,
              disabledType: 'datetime', // 按钮，检测日期和时间
            });
          } else {
            this.#updateConfirmButtonStatus();
          }

          // 若为月选择器，只有当选择月份时才自动关闭；
          // 若为年选择器，选择年份即自动关闭
          // 且在范围未开启时
          if (!options.range && options.autoConfirm) {
            if (
              (options.type === 'month' && type === 'month') ||
              (options.type === 'year' && type === 'year')
            ) {
              this.#setValue(this.#parse()).#done();
              this.close();
            }
          }
          this.#autoCalendarModel.auto && !this.#rangeLinked
            ? this.#choose(
                $(contentElem).find(`td.${CONST.CLASS_IS_SELECTED}`),
                index,
              )
            : this.endState && this.#done('onChange');
          $(this.footer)
            .find(`.${CONST.ELEM_TIME_BTN}`)
            .removeClass(CONST.CLASS_IS_DISABLED);
        });
    } else {
      // 时间选择面板 - 选择事件
      const span = lay.elem('span', {
        class: CONST.ELEM_TIME_TEXT,
      });
      // 滚动条定位
      const scroll = () => {
        $(ul)
          .find('ol')
          .each((i, ol) => {
            const $li = $(ol).find('li');
            const firstItem = $li[0];
            const selectedItem = $li[this[startEnd][hms[i]]];
            const itemHeight = (firstItem && firstItem.offsetHeight) || 30;

            // 锚点行偏移：scrollTop 始终停留在 itemHeight 整数倍上，
            // 让选中项显示在接近 ol 中央的整行位置，端点项自然贴顶/贴底
            const anchorOffset =
              Math.floor((ol.clientHeight - itemHeight) / 2 / itemHeight) *
              itemHeight;
            // item.offsetTop 和同级 li[0] 相减，差值即 item 在 ol 中的真实偏移，无需考虑 offsetParent
            const getScrollTop = (item) => {
              if (!item || !firstItem) return 0;
              return Math.max(
                0,
                item.offsetTop - firstItem.offsetTop - anchorOffset,
              );
            };

            const isDisabled = $(selectedItem).hasClass(
              CONST.CLASS_IS_DISABLED,
            );

            if (!isDisabled) {
              ol.scrollTop = getScrollTop(selectedItem);
            }

            // 选中项缺失或被禁用时，回退到首个可用项
            if (!selectedItem || isDisabled) {
              $li.each(function (ii, item) {
                if (!$(this).hasClass(CONST.CLASS_IS_DISABLED)) {
                  ol.scrollTop = getScrollTop(item);
                  return false;
                }
              });
            }
          });
      };
      const $existingSpan = $(headerElem.selectYM.elem).find(
        `.${CONST.ELEM_TIME_TEXT}`,
      );

      scroll();

      span.innerHTML = options.range
        ? [lang.startTime, lang.endTime][index]
        : lang.selectTime;

      $(this.mainListElems[index]).addClass('lay-datepicker-time-show');
      if ($existingSpan[0]) {
        $existingSpan.remove();
      }
      headerElem.selectYM.elem.appendChild(span);

      const $olElem = $(ul).find('ol');

      $olElem.each((i, ol) => {
        // 选择时分秒
        $(ol)
          .find('li')
          .on('click', (event) => {
            const $item = $(event.currentTarget);
            const value = event.currentTarget.innerHTML | 0;
            if ($item.hasClass(CONST.CLASS_IS_DISABLED)) return;
            if (options.range) {
              this[startEnd][hms[i]] = value;
            } else {
              dateTime[hms[i]] = value;
            }
            $(ol)
              .find(`.${CONST.CLASS_IS_SELECTED}`)
              .removeClass(CONST.CLASS_IS_SELECTED);
            $item.addClass(CONST.CLASS_IS_SELECTED);
            setTimeStatus();
            scroll();
            (this.endDate ||
              options.type === 'time' ||
              options.type === 'datetime') &&
              this.#done('onChange');

            this.#updateConfirmButtonStatus();
          });
      });
      if (lay.device().mobile) {
        $olElem.css({
          overflowY: 'auto',
          touchAction: 'pan-y',
        });
      }
    }

    return this;
  }

  // 记录列表切换后的年月
  #listYM = [];

  /**
   * 关闭列表
   * @returns {void}
   */
  #closeList() {
    this.contentElems.forEach((item, index) => {
      $(item).find(`.${CONST.ELEM_LIST}`).remove();
      $(this.mainListElems[index]).removeClass(
        'lay-datepicker-ym-show lay-datepicker-time-show',
      );
    });
    this.$mainElem.find(`.${CONST.ELEM_TIME_TEXT}`).remove();
  }

  /**
   * 同步范围选择的确定按钮状态
   * @param {boolean} [tips] - 是否提示范围顺序异常
   * @param {Object} [start] - 用于校验的开始日期对象
   * @param {Object} [end] - 用于校验的结束日期对象
   * @returns {void}
   */
  #updateConfirmButtonStatus(tips, start, end) {
    const options = this.options;
    const lang = this.#i18nMessages;
    const $elemBtn = $(this.footer).find(`.${CONST.ELEM_CONFIRM}`);
    const timeParams =
      options.type === 'datetime' || options.type === 'time'
        ? ['hours', 'minutes', 'seconds']
        : undefined;
    let isOut;

    if (options.range) {
      start = start || (this.#rangeLinked ? this.startDate : this.dateTime);
      end = end || this.endDate;
      isOut =
        !this.endState ||
        this.#newDate(start).getTime() > this.#newDate(end).getTime();

      // 如果不在有效日期内，直接禁用按钮，否则比较开始和结束日期
      this.#limit({
        date: start,
        disabledType: 'datetime',
        // 按钮，检测日期和时间
        time: timeParams,
        rangeType: 0,
      }) ||
      this.#limit({
        date: end,
        disabledType: 'datetime',
        // 按钮，检测日期和时间
        time: timeParams,
        rangeType: 1,
      })
        ? $elemBtn.addClass(CONST.CLASS_IS_DISABLED)
        : $elemBtn[isOut ? 'addClass' : 'removeClass'](CONST.CLASS_IS_DISABLED);

      // 是否异常提示
      if (tips && isOut) {
        this.showMessage({
          content: lang.rangeOrderPrompt,
        });
      }
    }
  }

  /**
   * 转义为规定格式的日期字符
   * @param {'start' | 'end'} state - 日期范围的状态，start 表示开始日期，end 表示结束日期
   * @param {Object} [dt] - 日期和时间对象
   * @returns {string} 返回转义后的日期字符串
   */
  #parse(state, dt) {
    const Constructor = this.constructor;
    const options = this.options;
    const startDate = this.#rangeLinked ? this.startDate : this.dateTime;
    const dateTime =
      dt ||
      (state == 'end'
        ? lay.extend({}, this.endDate, this.endTime)
        : options.range
          ? lay.extend({}, startDate || this.dateTime, this.startTime)
          : this.dateTime);
    const format = Constructor.formatDateTime(dateTime, this.#format, 1);

    // 返回日期范围字符
    if (options.range && state === undefined && format) {
      return `${format}${options.rangeSeparator}${this.#parse('end')}`;
    }

    return format;
  }

  // 创建指定日期时间对象
  #newDate(dateTime) {
    dateTime = dateTime || {};
    return new Date(
      dateTime.year || 1,
      dateTime.month || 0,
      dateTime.date || 1,
      dateTime.hours || 0,
      dateTime.minutes || 0,
      dateTime.seconds || 0,
    );
  }

  // 获得指定日期时间对象的毫秒数
  #getDateTime(obj) {
    return this.#newDate(obj).getTime();
  }

  /**
   * 格式化输入框显示值
   * @param {HTMLInputElement} elem HTML input 元素
   * @param {(value: string) => string} displayValueCallback
   */
  #formatToDisplay(elem, displayValueCallback) {
    const props = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    );
    Object.defineProperty(
      elem,
      'value',
      lay.extend({}, props, {
        get: () => {
          return elem.getAttribute('lay-datepicker');
        },
        set: (value) => {
          props.set.call(elem, displayValueCallback.call(this, value));
          elem.setAttribute('lay-datepicker', value);
        },
      }),
    );
  }

  // 赋值
  #setValue(value) {
    const options = this.options;
    const $elem = options.$elem;

    // 内嵌模式不作默认赋值
    if (options.inline) return this;

    value = value || '';

    // 绑定的元素是否为 input
    if (this.#isInput($elem[0])) {
      $elem.val(value);
    } else {
      // 如果 range 传入了开始和结束的 input 对象，则分别对其赋值
      const $rangeElem = this.$rangeElem;
      if ($rangeElem) {
        if (lay.type(value) !== 'array') {
          value = value.split(options.rangeSeparator);
        }
        $rangeElem[0].val(value[0] || '');
        $rangeElem[1].val(value[1] || '');
      } else {
        if ($elem.find('*').length === 0) {
          const displayValue =
            typeof options.formatToDisplay === 'function'
              ? options.formatToDisplay(value)
              : value;
          $elem.html(displayValue);
        }
        $elem.attr('lay-datepicker', value);
      }
    }

    return this;
  }

  // 预览
  #preview() {
    const options = this.options;
    if (!options.showPreview) return;
    const $elemPreview = this.$mainElem.find(`.${CONST.ELEM_PREVIEW}`);
    const value = options.range
      ? (this.#rangeLinked ? this.endState : this.endDate)
        ? this.#parse()
        : ''
      : this.#parse();

    // 显示预览
    $elemPreview.html(value);

    // 预览颜色渐变
    const oldValue = $elemPreview.html();
    if (oldValue) {
      const color =
        lay.type(options.variant) === 'array'
          ? options.variant[0]
          : options.variant;
      $elemPreview.css({
        color: /^#/.test(String(color)) ? color : '#16b777',
      });
      setTimeout(() => {
        $elemPreview.css({
          color: '#777',
        });
      }, 300);
    }
  }

  // 附加的渲染处理
  #renderAdditional() {
    const options = this.options;

    // 若开启时间面板的内联模式
    if (options.timePanelMode === 'inline') {
      this.#renderlist('time', 0);
    }
  }

  // 标记范围内的日期
  #stampRange() {
    const options = this.options;
    let startTime = this.#rangeLinked ? this.startDate : this.dateTime;
    const $tds = this.$mainElem.find('td');
    if (options.range && !this.endState)
      $(this.footer)
        .find(`.${CONST.ELEM_CONFIRM}`)
        .addClass(CONST.CLASS_IS_DISABLED);
    startTime =
      startTime &&
      this.#newDate({
        year: startTime.year,
        month: startTime.month,
        date: startTime.date,
      }).getTime();
    const endTime =
      this.endState &&
      this.endDate &&
      this.#newDate({
        year: this.endDate.year,
        month: this.endDate.month,
        date: this.endDate.date,
      }).getTime();

    $tds.each((i, item) => {
      const ymd = $(item).attr('lay-ymd').split('-');
      const thisTime = this.#newDate({
        year: ymd[0],
        month: ymd[1] - 1,
        date: ymd[2],
      }).getTime();

      // 标记当天
      if (options.rangeLinked && !this.startDate) {
        if (thisTime === this.#newDate(this.#systemDate()).getTime()) {
          $(item).addClass(
            $(item).hasClass(CONST.ELEM_PREV) ||
              $(item).hasClass(CONST.ELEM_NEXT)
              ? ''
              : CONST.ELEM_DAY_NOW,
          );
        }
      }

      /*
       * 标注区间
       */

      $(item).removeClass(`${CONST.ELEM_SELECTED} ${CONST.CLASS_IS_SELECTED}`);
      if (thisTime === startTime || thisTime === endTime) {
        (this.#rangeLinked ||
          (!this.#rangeLinked &&
            (i < 42 ? thisTime === startTime : thisTime === endTime))) &&
          $(item).addClass(
            $(item).hasClass(CONST.ELEM_PREV) ||
              $(item).hasClass(CONST.ELEM_NEXT)
              ? CONST.ELEM_SELECTED
              : CONST.CLASS_IS_SELECTED,
          );
      }
      if (thisTime > startTime && thisTime < endTime) {
        $(item).addClass(CONST.ELEM_SELECTED);
      }
    });
  }

  // 执行 done/onChange 等回调
  #done(type) {
    const options = this.options;
    const start = lay.extend(
      {},
      lay.extend(
        this.#rangeLinked ? this.startDate : this.dateTime,
        this.startTime,
      ),
    );
    const end = lay.extend({}, lay.extend(this.endDate, this.endTime));

    [start, end].forEach((item) => {
      if (!('month' in item)) return;
      lay.extend(item, {
        month: item.month + 1,
      });
    });

    this.#preview();

    // 返回的参数对象
    const params = {
      instance: this,
      options,
      value: this.#parse(),
      dateTime: start,
      endDateTime: end,
    };

    type === 'onChange' && this.#renderAdditional();
    options[type || 'done']?.(params);

    return this;
  }

  /**
   * 判断日期是否存在面板，用于处理日期范围选择的一些边缘情况
   * @param {object} datetime 日期时间对象
   * @param {number} index - 面板索引
   * @returns
   */
  #checkPanelDate(datetime, index) {
    const options = this.options;
    // 年月范围选择不需要处理
    if (options.type !== 'date' && options.type !== 'datetime') return;
    const startPanel = index === 0;
    const month = datetime.month + 1; // 点击的日期所在月份
    const panelMonth = this.panelYM[index].month + 1; // 当前面板头部月份

    // 边缘日期的处理
    const firstRenderIndex = this.endState
      ? // 二次点击（一般为结束日期）任意一侧面板时：
        // 1. 左侧面板中，点击的月份属于下一个月时，应渲染右侧面板而不是左侧面板;
        // 2. 左侧面板中，点击的月份属于上一个月时，应将两个面板都重新渲染(等效点击 prevMonth);
        // 3. 右侧面板同理。
        (() => {
          return (startPanel && month > panelMonth) ||
            (!startPanel && month < panelMonth)
            ? 1 - index
            : index;
        })()
      : // 初次点击（一般为开始日期）任意一侧面板时：
        // 1. 让该面板自行切换，以保持日期的「选中状态」在该侧；
        // 2. 另一侧面板则根据点击的面板进行响应式切换，以保持左右面板始终为连续月份。
        index;

    // 为简化实现，只要点击的月份不等于当前面板顶部显示的月份时，就重新渲染两侧面板
    return {
      needFullRender: month !== panelMonth,
      index: firstRenderIndex,
    };
  }

  /**
   * 选择日期
   * @param {JQuery<HTMLElement>} $td - td 元素
   * @param {number} index - 面板索引
   * @returns {void}
   */
  #choose($td, index) {
    if (!$td.length || $td.hasClass(CONST.CLASS_IS_DISABLED)) return;

    const options = this.options;
    const panelIndex = index;
    let isChange;

    if (this.#rangeLinked) {
      if (this.endState || !this.startDate) {
        // 重新选择或者第一次选择
        index = 0;
        this.endState = false;
      } else {
        index = 1;
        this.endState = true;
      }
    }

    const dateTime = this.thisDateTime(index);
    let YMD = $td.attr('lay-ymd').split('-');

    YMD = {
      year: YMD[0] | 0,
      month: (YMD[1] | 0) - 1,
      date: YMD[2] | 0,
    };
    lay.extend(dateTime, YMD); // 同步 dateTime

    // 范围选择
    if (options.range) {
      // 补充时分秒
      ['startTime', 'endTime'].forEach((item, i) => {
        this[item] = this[item] || {
          hours: i ? 23 : 0,
          minutes: i ? 59 : 0,
          seconds: i ? 59 : 0,
        };
        if (index === i) {
          // 判断选择之后的是否在范围内，超出则需要调整时分秒
          if (
            this.#getDateTime(lay.extend({}, dateTime, this[item])) <
            this.#getDateTime(options.min)
          ) {
            this[item] = {
              hours: options.min.hours,
              minutes: options.min.minutes,
              seconds: options.min.seconds,
            };
            lay.extend(dateTime, this[item]);
          } else if (
            this.#getDateTime(lay.extend({}, dateTime, this[item])) >
            this.#getDateTime(options.max)
          ) {
            this[item] = {
              hours: options.max.hours,
              minutes: options.max.minutes,
              seconds: options.max.seconds,
            };
            lay.extend(dateTime, this[item]);
          }
        }
      });
      if (!index) {
        this.startDate = lay.extend({}, dateTime); // 同步 startDate
      }
      // 校验另外一个日期是否在有效的范围内
      // 此处为范围选择的日期面板点击选中处理，所以 disabledType 为 date
      if (
        this.endState &&
        !this.#limit({
          date: this.#rangeLinked
            ? this.startDate
            : this.thisDateTime(1 - index),
          disabledType: 'date',
        })
      ) {
        // 根据选择之后判断是否需要切换模式
        if (this.endState && this.#autoCalendarModel.auto) {
          isChange = this.#autoCalendarModel();
        }
        // 判断是否反选
        const needSwapDate =
          (isChange || (this.#rangeLinked && this.endState)) &&
          this.#newDate(this.startDate) > this.#newDate(this.endDate);
        if (needSwapDate) {
          const isSameDate =
            this.startDate.year === this.endDate.year &&
            this.startDate.month === this.endDate.month &&
            this.startDate.date === this.endDate.date;
          let startDate;
          // 如果是同一天并且出现了反选证明是时分秒出现开始时间大于结束时间的现象
          if (isSameDate) {
            startDate = this.startTime;
            this.startTime = this.endTime;
            this.endTime = startDate;
          }
          // 当出现反向选择时（即「后点击」的日期比「先点击」的日期小），重新提取区间
          startDate = this.startDate;
          this.startDate = lay.extend({}, this.endDate, this.startTime);
          this.dateTime = lay.extend({}, this.startDate);
          this.endDate = lay.extend({}, startDate, this.endTime);
        }
        isChange && (this.dateTime = lay.extend({}, this.startDate));
      }
      if (this.#rangeLinked) {
        // 处理日期范围选择的一些边缘情况
        const checkState = this.#checkPanelDate(dateTime, panelIndex);
        const dateTimeTemp = lay.extend({}, dateTime);
        const renderMode =
          isChange || (checkState && checkState.needFullRender) ? 'init' : null;
        const panelIdx = checkState ? checkState.index : panelIndex;
        this.#renderCalendar({
          dateTime: dateTimeTemp,
          index: panelIdx,
          type: renderMode,
        });
      } else {
        this.#renderCalendar({
          index,
          type: isChange ? 'init' : null,
        });
      }
      this.endState && this.#done('onChange');
    } else if (options.inline) {
      // 直接嵌套的选中
      this.#renderCalendar().#done().#done('onChange'); // 同时执行 done 和 onChange 回调
    } else if (options.type === 'date') {
      if (options.autoConfirm) {
        this.#setValue(this.#parse()).#done();
        this.close();
      } else {
        this.#renderCalendar().#done('onChange');
      }
    } else if (options.type === 'datetime') {
      this.#renderCalendar().#done('onChange');
    }
  }

  /**
   * 底部工具按钮
   * @param {HTMLElement} btn - 按钮元素
   * @param {string} type - 按钮类型
   * @returns {void}
   */
  #tool(btn, type) {
    const options = this.options;
    const lang = this.#i18nMessages;
    const dateTime = this.dateTime;
    const active = {
      // 选择时间
      datetime: () => {
        if ($(btn).hasClass(CONST.CLASS_IS_DISABLED)) return;
        this.#renderlist('time', 0);
        options.range && this.#renderlist('time', 1);
        $(btn).attr('lay-type', 'date').html(this.#i18nMessages.selectDate);
      },
      // 选择日期
      date: () => {
        this.#closeList();
        $(btn).attr('lay-type', 'datetime').html(this.#i18nMessages.selectTime);
      },
      // 清空/重置
      clear: () => {
        if (options.inline) {
          lay.extend(dateTime, this.firstDate);
          this.#renderCalendar();
        } else {
          delete this.dateTime;
        }

        if (options.range) {
          delete this.dateTime;
          delete this.startTime;
          delete this.endDate;
          delete this.endTime;
        }

        this.#setValue('');
        this.#done('onClear').#done();
        this.close();
      },
      // 现在
      now: () => {
        const thisDate = new Date();

        // 当前系统时间未在 min/max 范围内，则不可点击
        if ($(btn).hasClass(CONST.CLASS_IS_DISABLED)) {
          return this.showMessage({
            content: `${lang.tools.now}, ${lang.invalidDatePrompt}`,
          });
        }
        lay.extend(dateTime, this.#systemDate(), {
          hours: thisDate.getHours(),
          minutes: thisDate.getMinutes(),
          seconds: thisDate.getSeconds(),
        });
        this.#setValue(this.#parse());
        options.inline && this.#renderCalendar();
        this.#done('onNow').#done();
        this.close();
      },
      // 确定
      confirm: () => {
        if (options.range) {
          if ($(btn).hasClass(CONST.CLASS_IS_DISABLED)) {
            const isTimeout =
              options.type === 'time'
                ? this.startTime &&
                  this.endTime &&
                  this.#newDate(this.startTime) > this.#newDate(this.endTime)
                : this.startDate &&
                  this.endDate &&
                  this.#newDate(
                    lay.extend({}, this.startDate, this.startTime || {}),
                  ) >
                    this.#newDate(
                      lay.extend({}, this.endDate, this.endTime || {}),
                    );
            return this.showMessage({
              content: isTimeout
                ? lang.rangeOrderPrompt
                : lang.invalidDatePrompt,
            });
          }
        } else {
          if ($(btn).hasClass(CONST.CLASS_IS_DISABLED))
            return this.showMessage({
              content: lang.invalidDatePrompt,
            });
        }
        this.#setValue(this.#parse());
        this.#done('onConfirm').#done();
        this.close();
      },
    };
    active[type]?.();
  }

  /**
   * 统一切换处理
   * @param {number} index - 面板索引
   * @returns {Object} 返回切换方法的对象
   */
  #change(index) {
    const options = this.options;
    const dateTime = this.thisDateTime(index);
    const isAlone =
      options.range && (options.type === 'year' || options.type === 'month');
    const contentElem = this.contentElems[index || 0];
    const listYM = this.#listYM[index];
    const addSubYear = (type) => {
      const isYear = $(contentElem).find('.lay-datepicker-year-list')[0];
      const isMonth = $(contentElem).find('.lay-datepicker-month-list')[0];

      // 切换年列表
      if (isYear) {
        listYM[0] = type ? listYM[0] - 15 : listYM[0] + 15;
        this.#renderlist('year', index);
      }
      if (isMonth) {
        // 切换月面板中的年
        type ? listYM[0]-- : listYM[0]++;
        this.#renderlist('month', index);
      }
      if (isYear || isMonth) {
        lay.extend(dateTime, {
          year: listYM[0],
        });
        if (isAlone) dateTime.year = listYM[0];
        options.range || this.#done('onChange');
        options.range ||
          this.#limit({
            elem: $(this.footer).find(`.${CONST.ELEM_CONFIRM}`),
            date: {
              year: listYM[0],
              month: isYear ? 0 : listYM[1] - 1,
            },
            disabledType: 'datetime', // 按钮，检测日期和时间
          });
      }
      this.#updateConfirmButtonStatus();

      return isYear || isMonth;
    };

    return {
      prevYear: () => {
        if (addSubYear('sub')) return;
        if (this.#rangeLinked) {
          this.dateTime.year--;
          this.#checkDate('limit').#renderCalendar({ type: 'init' });
        } else {
          dateTime.year--;
          this.#checkDate('limit').#renderCalendar({ index });
          // 面板自动切换的模式下重新判定是否发生模式转换等细节处理
          this.#autoCalendarModel.auto
            ? this.#choose(
                $(contentElem).find(`td.${CONST.CLASS_IS_SELECTED}`),
                index,
              )
            : this.#done('onChange');
        }
      },
      prevMonth: () => {
        let YM;
        // rangeLinked 模式非实时选择日期，不需要同步 options.dateTime，应根据面板显示日期切换
        if (this.#rangeLinked) {
          const panelYM = this.panelYM[0];
          YM = this.#getAsYM(panelYM.year, panelYM.month, 'sub');
          const dateTimeTemp = lay.extend({}, this.dateTime, this.panelYM[0], {
            year: YM[0],
            month: YM[1],
          });
          this.#checkDate('limit').#renderCalendar({
            dateTime: dateTimeTemp,
            type: 'init',
          });
        } else {
          YM = this.#getAsYM(dateTime.year, dateTime.month, 'sub');
          lay.extend(dateTime, {
            year: YM[0],
            month: YM[1],
          });
          this.#checkDate('limit').#renderCalendar({ type: 'init' });
          this.#autoCalendarModel.auto
            ? this.#choose(
                $(contentElem).find(`td.${CONST.CLASS_IS_SELECTED}`),
                index,
              )
            : this.#done('onChange');
        }
      },
      nextMonth: () => {
        let YM;
        if (this.#rangeLinked) {
          const panelYM = this.panelYM[0];
          YM = this.#getAsYM(panelYM.year, panelYM.month);
          const dateTimeTemp = lay.extend({}, this.dateTime, this.panelYM[0], {
            year: YM[0],
            month: YM[1],
          });
          this.#checkDate('limit').#renderCalendar({
            dateTime: dateTimeTemp,
            type: 'init',
          });
        } else {
          YM = this.#getAsYM(dateTime.year, dateTime.month);
          lay.extend(dateTime, {
            year: YM[0],
            month: YM[1],
          });
          this.#checkDate('limit').#renderCalendar({ type: 'init' });
          this.#autoCalendarModel.auto
            ? this.#choose(
                $(contentElem).find(`td.${CONST.CLASS_IS_SELECTED}`),
                index,
              )
            : this.#done('onChange');
        }
      },
      nextYear: () => {
        if (addSubYear()) return;
        if (this.#rangeLinked) {
          this.dateTime.year++;
          this.#checkDate('limit').#renderCalendar({ index: 0, type: 'init' });
        } else {
          dateTime.year++;
          this.#checkDate('limit').#renderCalendar({ index });
          this.#autoCalendarModel.auto
            ? this.#choose(
                $(contentElem).find(`td.${CONST.CLASS_IS_SELECTED}`),
                index,
              )
            : this.#done('onChange');
        }
      },
    };
  }

  /**
   * 目标元素是否为输入框
   * @param {HTMLElement} elem - HTML 元素
   * @returns {boolean}
   */
  #isInput(elem = this.options.$elem?.[0]) {
    if (!elem) return false;
    return (
      /input|textarea/.test(elem.tagName.toLocaleLowerCase()) ||
      /INPUT|TEXTAREA/.test(elem.tagName)
    );
  }

  /**
   * 事件处理
   * @returns {void}
   */
  #events() {
    // 年月切换
    this.headerElems.forEach((header, i) => {
      // 上一年
      $(header.prevYM.yearElem).on('click', () => {
        this.#change(i).prevYear();
      });

      // 上一月
      $(header.prevYM.monthElem).on('click', () => {
        this.#change(i).prevMonth();
      });

      // 选择年月
      const $selectYMSpans = $(header.selectYM.elem).children('span');
      $selectYMSpans.on('click', (e) => {
        const $this = $(e.currentTarget);
        const layType = $this.attr('lay-type');
        let layYM = $this.attr('lay-ym');

        if (!layYM) return;

        layYM = layYM.split('-');
        this.#listYM[i] = [layYM[0] | 0, layYM[1] | 0];
        this.#renderlist(layType, i);
        $(this.footer)
          .find(`.${CONST.ELEM_TIME_BTN}`)
          .addClass(CONST.CLASS_IS_DISABLED);
      });

      // 下一月
      $(header.nextYM.monthElem).on('click', () => {
        this.#change(i).nextMonth();
      });

      // 下一年
      $(header.nextYM.yearElem).on('click', () => {
        this.#change(i).nextYear();
      });
    });

    // 点击日期
    this.tableElems.forEach((table, i) => {
      const $tds = $(table).find('td');
      $tds.on('click', (event) => {
        this.#choose($(event.currentTarget), i);
      });
    });

    // 点击底部按钮
    $(this.footer)
      .find('span')
      .on('click', (event) => {
        const $this = $(event.currentTarget);
        const type = $this.attr('lay-type');
        this.#tool(event.currentTarget, type);
      });
  }
}

const CONST = DatePicker.CONST;

// 简体中文语言码
const zhCN = 'zh-CN';

// 默认日期时间格式
const defaultFormat = {
  year: 'yyyy',
  month: 'yyyy-MM',
  date: 'yyyy-MM-dd',
  time: 'HH:mm:ss',
  datetime: 'yyyy-MM-dd HH:mm:ss',
};

// 日期格式占位符正则模式
const DATE_FORMAT_REGEX = 'yyyy|y|MM|M|dd|d|HH|H|mm|m|ss|s';

// 将日期格式字符拆分为数组
const splitDateFormat = (format) => {
  return (format || '').match(new RegExp(`${DATE_FORMAT_REGEX}|.`, 'g')) || [];
};

/**
 * 在字符之间添加空格
 * @param {string} str
 * @returns {string}
 */
const addSpaceBetweenChars = (str) => {
  if (typeof str !== 'string' || str.length <= 1) {
    return str;
  }

  const isDigit = (char) => {
    const code = char.charCodeAt(0);
    // '0' 到 '9' 的 ASCII 码范围
    return code >= 48 && code <= 57;
  };
  let result = '';

  for (let i = 0; i < str.length - 1; i++) {
    const char = str[i];
    const nextChar = str[i + 1];
    result = `${result}${char}`;

    // 判断当前字符和下一个字符的类型
    const isCharDigit = isDigit(char);
    const isNextCharDigit = isDigit(nextChar);

    // 在数字和非数字（非空格）之间添加空格
    if (
      (isCharDigit && !isNextCharDigit && nextChar !== ' ') ||
      // 数字 → 非数字（非空格）
      (char !== ' ' && !isCharDigit && isNextCharDigit) // 非空格非数字 → 数字
    ) {
      result = `${result} `;
    }
  }

  // 添加最后一个字符
  result = `${result}${str[str.length - 1]}`;

  return result;
};

export { DatePicker as datePicker };
