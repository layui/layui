// 异步校验使用说明

// 首先会对整个表单进行同步校验 同步校验成功后才进行异步校验

// 配置方式

form.asyncVerify({

    // 最简配置 需要提供一个 send 参数 内容为异步校验请求的 url

    // data receive accept 方法都有默认实现

    // 这种情况下 后台接口接收一个名为 value 的参数

    // 后台接收到的值为当前 input 的 value 值

    // 返回值必须为 { succ: true|false } 这样的 json

    interface0: {

        send: '/server/asyncVerify/interface0'
    },

    // 可选配置

    // 任意步骤均可使用自定义方法覆盖默认实现

    // data 配置 不写 => 后台接收到的值为当前 input 的 value 值

    // data 配置 Function =>

    // 函数签名为 function($, data, ele) 其中 $ = jQuery, data = { value: 当前 input 的 value 值 }, ele = 当前 input 的 dom 元素

    // 返回值必须为 Object 并且这个对象会直接当作 send 方法的提交参数

    // send 配置 String => 异步校验请求的 url 参数由 data 配置提供

    // send 配置 Function =>

    // 函数签名为 function($, data, ele) 其中 $ = jQuery, data = data 配置提供的值, ele = 当前 input 的 dom 元素

    // 返回值必须为 Promise 用于后续调用链

    // receive 配置 不写 => 默认值为 function($, data, ele) { return data; } 即原分不动返回接收到的值

    // receive 配置 Function =>

    // 函数签名为 function($, data, ele) 其中 $ = jQuery, data = ajax 调用返回的值, ele = 当前 input 的 dom 元素

    // 返回值任意 但必须能够被后续的 accept 配置接收

    // accept 配置 不写 => 默认值为 function($, data, ele) { return data.succ ? null : '该字段未通过校验'; } 即由返回值中的 succ 属性判断是否校验成功

    // accept 配置 Function =>

    // 函数签名为 function($, data, ele) 其中 $ = jQuery, data = receive 配置提供的值, ele = 当前 input 的 dom 元素

    // 返回值为 null 时校验通过 返回值为 String 时校验失败 并且使用这个值作为校验失败的提示信息

    interface1: {

        send: function($, data, ele) {

            var url = '/server/asyncVerify/interface1';

            return $.get(url, data);
        },

        accept: function($, data, ele) {

            return data.succ ? null : '校验1未通过';
        }
    },

    // 完整配置

    interface2: {

        data: function($, value, ele) {

            return { value: $(ele).val() };
        },

        send: function($, data, ele) {

            var url = '/server/asyncVerify/interface2';

            return $.post(url, data);
        },

        receive: function($, data, ele) {

            return { succ: data.value === true };
        },

        accept: function($, data, ele) {

            return data.succ ? null : '校验2未通过';
        }
    },

    // 可以不依赖后台进行接口测试

    interface3: {

        send: function($, data, ele) {

            var df = $.Deferred();

            setTimeout(function() {

                df.resolve({ succ: data.value === 'some value' });

            }, 1000);

            return df.promise();
        }
    }
});