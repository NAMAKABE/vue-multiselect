/* liepai.core.js | version 1.0 | Copyright © 2008-2016 Researching Team, 7881.com | By Misaka */
;
(function (global, fn) {
    // console.log(S)
    if (global.S) return;

    /* 绑定全局T对象 */
    global.S = fn();

    S.init();
    // console.log(S)
})(window, function () {
    // if (this.T) return;
    /* 私有错误信息 */
    // 预留Jquery模块判定
    var JQUERY = true;
    var U      = {}

    U.error = function (errorMsg) {
        errorMsg = errorMsg || '';
        throw new Error(errorMsg);
    }

    window.typeOf = function (obj) {
        if (!obj) return '';
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    }
    /* 检测空对象 */
    var ifEmptyObject = function (obj) {
        if (!obj) return true;
        if (typeOf(obj) === 'object') {
            for (prop in obj) {
                // 一旦检测到可枚举的自有属性则停止
                if (obj.propertyIsEnumerable(prop)) return false;
            }
        }
        return true;
    };
    /* 封装AJAX方法 */
    function _AJAX(URL) {
        // 需求jQuery的Ajax模块哦
        // if (!JQUERY) return;
        this.url = URL;
    }

    _AJAX.prototype = {
        constructor: _AJAX,
        defaults: {
            url: '',
            dataType: 'json',
            contentType: 'application/x-www-form-urlencoded',
            cache: false,
            processData: true,
            timeout: 0,
            headers: {
                'SM-USER': 'root'
            },
            validate: false
        },
        verf: function (url, data, options) {
            // console.log(arguments.length);
            (!url) && U.error('Request need at least one argument');

            // console.log(url, data, options)
        },
        Get: function (url, data, options) {
            this.verf.call(this, url);
            return this.Request(url, data, options);
            // return this.Request(url, data, options)
        },
        Post: function (url, data, options) {
            this.verf.call(this, url);
            options      = options || {};
            options.type = 'POST';
            return this.Request(url, data, options)
        },
        Request: function (url, data, options) {
            // 没有定义data的情况
            !options && (options = {});

            var pStat = false;

            // console.log(url, data, options)
            var requestConstructor = {
                // 类型：String 默认值: "GET"。请求方式 ("POST" 或 "GET")， 默认为 "GET"。
                // 注意：其它 HTTP 请求方法，如 PUT 和 DELETE 也可以使用，但仅部分浏览器支持。
                type: options.type || 'GET',
                // 类型：String
                // 默认值: 当前页地址。发送请求的地址。
                url: url || this.defaults.url,
                // dataType: "xml" "html" "script" "json" "jsonp" "txt"
                dataType: options.dataType || this.defaults.dataType,
                // beforeSend: function(req) {
                // 	req.setRequestHeader("Accept", "application/json");
                // },
                contentType: options.contentType || this.defaults.contentType,
                // processData: isProxy ? false : false,
                cache: options.cache || this.defaults.cache,
                processData: typeof(options.processData) === 'undefined' ? this.defaults.processData : options.processData,
                timeout: options.timeout || this.defaults.timeout,
                headers: options.headers || this.defaults.headers
            };



            (data !== '') && (requestConstructor.data = data);
            // 类型：String
            // 发送到服务器的数据。将自动转换为请求字符串格式。GET 请求中将附加在 URL 后。查看 processData 选项说明以禁止此自动转换。必须为 Key/Value 格式。
            // 如果为数组，jQuery 将自动为不同值对应同一个名称。如 {foo:["bar1", "bar2"]} 转换为 '&foo=bar1&foo=bar2'。
            // if (typeOf(data) === 'string') {
            //     requestConstructor.data = _data;
            // } else if (typeOf(data) === 'object') {
            //     if (!ifEmptyObject(data)) {
            //         requestConstructor.data = JSON.stringify(data)
            //     }
            // }
            // data: (ifEmptyObject(data) && data.length <= 0) ? '' : data,

            if (typeof(jQuery) !== 'undefined') {

                var self         = this;
                // 改造JQ的Promise
                var deferJ       = $.Deferred();
                // var promise = new Promise()
                var responseData = '';


                // 为Validation单独加入一个分支
                if (options.validate || self.defaults.validate) {

                    return new Promise(function (resolve, reject) {
                        $.ajax(requestConstructor).complete(function (xhr) {
                            // console.log(xhr)
                            xhr.responseJSON ? resolve() : reject();
                        });

                    });
                } else {
                    // 常规请求
                    requestConstructor.complete = function (xhr, status) {
                        // 根据业务，所有请求全部走complete
                        // 判定xhr的类型，如果是html，则不做判断，该返回啥返回啥
                        // 注意，测试阶段的返回格式不同



                        if ((xhr.status + '').indexOf(20) >= 0 || (xhr.status + '').indexOf(30) >= 0) {


                            // if (xhr.responseText == 'true' || xhr.responseText == 'false') {
                            //     xhr.responseText == 'true' ? pStat = true : pStat = false;
                            // }



                            // debugger;
                            if (xhr.getResponseHeader('Content-Type').indexOf('html') > 0) {
                                // HTML，直接返回，不做校验
                                responseData = xhr.responseText;
                                return deferJ.resolve(responseData);
                            }


                            if (xhr.getResponseHeader('Content-Type').indexOf('json') > 0) {

                                // 其他情况，视为JSON
                                var responseData = $.parseJSON(xhr.responseText);
                                if (S && typeof(S.settings.xhrAfterTreatment) === 'function') {
                                    return S.settings.xhrAfterTreatment(deferJ.resolve, deferJ.reject, responseData);
                                } else {
                                    return deferJ.resolve(responseData);
                                }
                            }



                        } else {
                            // 请求地址在HTTP层面报错，如404
                            // console.error(xhr)

                            ohSnap && ohSnap('请求失败，' + xhr.status, {'duration': '3000', 'color': 'red'});
                            // console.error('(╬▔皿▔) 请求失败，状态码 ' + xhr.status);
                            return deferJ.reject(xhr);
                        }

                    };
                    $.ajax(requestConstructor);
                }
                return deferJ.promise();
            }
            /**
             * Zepto的兼容写法
             */
            // if (typeof(Zepto) !== 'undefined') {
            //     var defer                   = $.Deferred();
            //     requestConstructor.complete = function (a, b, c) {
            //         // alert(1)
            //         // console.log(a.status)
            //         // var array = [200,]
            //         if ((a.status + '').indexOf(20) >= 0 || (a.status + '').indexOf(30) >= 0) {
            //
            //
            //             var www = $.parseJSON(a.responseText)
            //             if (L && typeof(L.settings.xhrAfterTreatment) === 'function') {
            //                 L.settings.xhrAfterTreatment(defer.resolve, defer.reject, www);
            //             } else {
            //                 defer.resolve(www);
            //             }
            //             // console.log(a, b, c, d)
            //
            //         } else {
            //             console.error('Response error, server returned ' + a.status + ' from ' + a.responseURL);
            //             return defer.reject(a, b, c);
            //         }
            //         // 			V: function(XMLHttpRequest, successFn, failedFn) {
            //         // 	if (XMLHttpRequest && $.parseJSON(responseText.responseText).responseCode === '0000') {
            //         // 		successFn && successFn();
            //         // 	} else {
            //         // 		failedFn && failedFn();
            //         // 		return;
            //         // 	}
            //         // }
            //     };
            //     requestConstructor.error    = function (a, b, c) {
            //         // alert(1)
            //         // defer.reject(a, b, c);
            //     };
            //     // console.log(requestConstructor)
            //     // $.ajax(requestConstructor);
            //
            //
            //
            //     return defer.promise();
            // }



            // console.log(requestConstructor)

            return $.ajax(requestConstructor);
            // return $.ajax(requestConstructor);
        }
    };
    // 	baidu.extend =
    // baidu.object.extend = function (target, source) {
    //     for (var p in source) {
    //         if (source.hasOwnProperty(p)) {
    //             target[p] = source[p];
    //         }
    //     }

    //     return target;
    // };


    var AJAX     = new _AJAX();
    var _message = {};

    var T       = function (el) {};
    T.prototype = {
        constructor: T,
        /* 放置一些初始化的方法 */
        init: function () {
            /* 防止老浏览器坑爹 */
            if (!window.console) window.console = {
                log: function () {}
            }
        },
        listen: function (type, fn) {
            if (typeof _message[type] === 'undefined') {
                _message[type] = [fn];
            } else {
                _message[type].push(fn);
            }
        },
        fire: function (type, args) {
            if (!_message[type]) return;
            var events = {
                    type: type,
                    args: args || {}
                },
                i      = 0,
                len    = _message[type].length;
            for (; i < len; i++) {
                _message[type][i].call(this, events);
            }
        },
        remove: function () {

        },
        settings: {
            xhrAfterTreatment: ''
        },
        object: {
            each: function (obj, fn) {
                // if (!fn) return obj;
                // for(){

                // }
            }
        },
        _GET: (function () {
            var getObj = {};
            var get    = location.href.split('?')[1];
            if (!get) return {};
            var kv = get.split('&');
            for (var i = 0; i < kv.length; i++) {
                if (kv[i] == '') continue;

                var k     = kv[i].split('=')[0];
                var v     = kv[i].split('=')[1] || '';
                getObj[k] = v;
            }
            return getObj;
        })(),
        _M: (function () {
            var o = document.getElementsByTagName('body')[0].getAttribute('m');
            if (o) return o.replace(/(^\s*)|(\s*$)/g, "");
            return null;
        })(),
        /* 判断访问终端 */
        // js 判断安卓或者ios 之indexOf方式
        // http://www.haorooms.com/post/js_pc_iosandmobile
        browser: {
            versions: function () {
                var u   = navigator.userAgent,
                    app = navigator.appVersion;
                return {
                    // trident: u.indexOf('Trident') > -1, //IE内核
                    // presto: u.indexOf('Presto') > -1, //opera内核
                    // webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    // gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    // mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                    // ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    // android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                    // iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                    // iPad: u.indexOf('iPad') > -1, //是否iPad
                    // webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                    weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
                    // qq: u.match(/\sQQ/i) == " qq" //是否QQ
                };
            }(),
            language: (navigator.browserLanguage || navigator.language).toLowerCase(),
            phonetype: function (argument) {
                // body...
                if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                    return 'Apple'
                } else if (/(Android)/i.test(navigator.userAgent)) {
                    //alert(navigator.userAgent);
                    //安卓端
                    return 'Android'
                } else {
                    return 'PC'
                }
                ;
            }()
        },


        /* 工具类 */
        Util: {
            /* 输出可视化数据大小 */
            // arg = 保留到小数点后多少位 默认1
            byteToBeauty: function (val, arg) {
                arg       = arg && Math.abs(parseInt(arg)) || 1;
                var _this = val;
                var bytes = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                // var bytes = ['Byte', 'KB'];
                for (var x in bytes) {
                    if (_this < Math.pow(1024, (parseInt(x) + 1))) {
                        return (val / Math.pow(1024, (x))).toFixed(arg) + bytes[x];
                    }
                }
                _U.error('Value Too Large');
                return _this;
            },

            /* 非正则的全局替换 */
            // a = 需要替换的
            // b = 替换为什么
            replaceAll: function (string, a, b) {
                if (arguments.length < 3) {
                    return U.error('replaceAll arguments error');
                }
                // console.log(this.__proto__.constructor)
                // console.log(function() {}
                // instanceof Object)
                return string.replace(new RegExp(a, "gm"), b);
            },
            getSHA1: function (txt) {
                if (!jsSHA) return;
                var shaObj = new jsSHA("SHA-1", "TEXT");
                shaObj.update(txt);
                return shaObj.getHash("HEX");
            },
            getMonth: function () {
                return 1 + new Date().getMonth();
            },
            getDate: function () {
                return new Date().getDate();
            },
            getHours: function () {
                return new Date().getHours();
            },
            getTimestamp: function () {
                return Date.parse(new Date()) / 1000;
            },
            getLocalTimeString: function (format) {
                return new Date().format(format);
            },
            format: function (_date, fmt) {
                // 例子，比如需要这样的格式：yyyy-MM-dd hh:mm:ss
                //
                if (_date.toString().length >= 10) {
                    _date = parseInt(parseInt(_date) / 1000)
                }
                var fmt  = typeOf(_date) === 'number' ? fmt : _date;
                var date = typeOf(_date) === 'number' ? (_date.toString().length > 10 ? new Date(_date) : new Date(_date * 1000)) : new Date();
                var o    = {
                    "M+": date.getMonth() + 1, //月份
                    "d+": date.getDate(), //日
                    "h+": date.getHours(), //小时
                    "m+": date.getMinutes(), //分
                    "s+": date.getSeconds(), //秒
                    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                    "S": date.getMilliseconds() //毫秒
                };

                // 年份替换
                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));

                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            },
            secondToTime: function (second, fmt) {
                var theTime = parseInt(second); // 秒
                if (theTime < 0) theTime = 0;
                var theTime1 = 0; // 分
                var theTime2 = 0; // 小时
                if (theTime > 60) {
                    theTime1 = parseInt(theTime / 60);
                    theTime  = parseInt(theTime % 60);
                    if (theTime1 > 60) {
                        theTime2 = parseInt(theTime1 / 60);
                        theTime1 = parseInt(theTime1 % 60);
                    }
                }


                var o = {
                    "h+": (theTime2 > 0) ? parseInt(theTime2) : 0, //小时
                    "m+": (theTime1 > 0) ? parseInt(theTime1) : 0, //分
                    "s+": parseInt(theTime), //秒
                };


                // var result = "" + parseInt(theTime) + "秒";
                // if (theTime1 > 0) {
                // 	result = "" + parseInt(theTime1) + "分" + result;
                // }
                // if (theTime2 > 0) {
                // 	result = "" + parseInt(theTime2) + "小时" + result;
                // }
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
                // return result;
            }
        },

        // show: function(el) {
        // 	var els = document.querySelectorAll(el);
        // 	return
        // 		for (var i = 0; i < els.length; i++) {
        // 			els[i].style.display == "none" && (els[i].style.display = '')
        // 			if (getComputedStyle(els[i], '').getPropertyValue("display") == "none")
        // 				this.style.display = defaultDisplay(this.nodeName)
        // 		}
        // },

        /* 扩展模块注册 */
        registModule: function (moduleArray, callback) {
            if (typeOf(moduleArray) !== 'array') moduleArray = [moduleArray];
            if (typeOf(callback) !== 'function') callback = function () {};
            var scirpt = [];
            var l      = moduleArray.length;


            // (function(index) {

            // })()


            var HTMLHEAD = document.getElementsByTagName('HEAD').item(0);
            for (var i = 0; i < l; i++) {
                /* 遍历模块列表，进行加载 */
                /* 禁止重载任何方法 */
                if (this[moduleArray[i]]) continue;
                var SCRIPT = document.createElement("script");
                // SCRIPT.type = "text/javascript";
                SCRIPT.src = moduleArray[i] + '.js';
                HTMLHEAD.appendChild(SCRIPT);
                SCRIPT.onload = (function (i) {
                    return function () {
                        scirpt.push(moduleArray[i]);
                        if (scirpt.length == l) callback();
                    }
                })(i)
            }

        },

        /* 简单AJAX模块包装 */

        get: function (url, data, options) {
            return AJAX.Get(url, data, options)
        },
        post: function (url, data, options) {
            return AJAX.Post(url, data, options)
        },
        json: function (url, data, options) {
            options             = options || {};
            options.contentType = 'application/json';
            (typeOf(data) === 'object' && !ifEmptyObject(data)) && (data = JSON.stringify(data));
            return AJAX.Post(url, data, options)
        },
        /* 路由封装 */
        go: function (url, queryString) {
            if (!url) return;
            var _prefix = '' + (LCONF && LCONF.baseUrl || '');
            if (!queryString) {
                // alert(url)
                location.href = _prefix + url;
                return;
            }
            if (typeOf(queryString) === 'object') {
                // var string = '?';
                // for (prop in queryString) {
                // 	sring += '' + prop + '=' + queryString[prop];
                // }
                // string
            } else {
                location.href = _prefix + url + queryString;
            }
        },
        /* 简单的扩展实现 */
        extend: function (contents) {
            for (var p in contents) {
                if (contents.propertyIsEnumerable(p)) {
                    this[p] = contents[p];
                }
            }
        },


        render: function (el, data, timeline) {
            if (!el) return;
            // 实例生命周期
            var timeline  = timeline || {};
            var _timeLine = {
                ready: timeline.created || function () {},
                created: timeline.ready || function () {},

                destroyed: timeline.destroyed || function () {},
                beforeDestroy: timeline.beforeDestroy || function () {},

                watch: timeline.watch || {},
                methods: timeline.methods || {
                    // 方法内 `this` 指向 vm
                    // alert('Hello ' + this.name + '!')
                    // `event` 是原生 DOM 事件
                    // alert(event.target.tagName)
                }
            }
            return {
                data: data || {},
                vm: new Vue({
                    el: el,
                    data: data,
                    watch: _timeLine.watch,
                    ready: _timeLine.ready,
                    created: _timeLine.created,
                    destroyed: _timeLine.destroyed,
                    beforeDestroy: _timeLine.beforeDestroy,
                    methods: _timeLine.methods
                })
            }
        },
        /**
         * 简单的验证器，还不太完善
         * @param valiObjArray
         * @param alert
         * @param fn
         */
        vali: function (valiObjArray, alert, fn) {
            if (!valiObjArray) return;
            var L = valiObjArray.length;
            for (var i = 0; i < L; i++) {
                valiObjArray[i]

                switch (valiObjArray[i].type) {
                    case 'string':
                        for (var j = 0; j < valiObjArray[i].rules.length; j++) {
                            var ruleArray = valiObjArray[i].rules;
                            for (prop in ruleArray[j]) {
                                if (prop == 'empty' && valiObjArray[i].el === '') {
                                    alert(ruleArray[j][prop]);
                                    return;
                                }

                                if (/[<=>]+/.test(prop)) {
                                    if (!valiObjArray[i].el instanceof Array) return;
                                    switch (prop) {
                                        case '<':
                                            if (valiObjArray[i].el[0] < valiObjArray[i].el[1]) {
                                                alert(ruleArray[j][prop]);
                                                return;
                                            }
                                            break;
                                        case '>':
                                            if (valiObjArray[i].el[0] > valiObjArray[i].el[1]) {
                                                alert(ruleArray[j][prop]);
                                                return;
                                            }
                                            break;
                                        case '<=':
                                            if (valiObjArray[i].el[0] <= valiObjArray[i].el[1]) {
                                                alert(ruleArray[j][prop]);
                                                return;
                                            }
                                            break;
                                        case '>=':
                                            if (valiObjArray[i].el[0] >= valiObjArray[i].el[1]) {
                                                alert(ruleArray[j][prop]);
                                                return;
                                            }
                                            break;
                                    }

                                }
                            }

                        }
                        break;
                    case 'number':
                        for (var j = 0; j < valiObjArray[i].rules.length; j++) {
                            var ruleArray = valiObjArray[i].rules;
                            for (prop in ruleArray[j]) {
                                if (prop == 'empty' && valiObjArray[i].el == 0) {
                                    alert(ruleArray[j][prop]);
                                    return;
                                }
                            }

                        }
                        break;
                    case 'true':
                        for (var j = 0; j < valiObjArray[i].rules.length; j++) {
                            var ruleArray = valiObjArray[i].rules;
                            for (prop in ruleArray[j]) {
                                if (eval(prop).test(valiObjArray[i].el)) {
                                    alert(ruleArray[j][prop]);
                                    return;
                                }

                                // if (prop == 'empty' && valiObjArray[i].el == 0) {
                                // 	alert(ruleArray[j][prop]);
                                // 	return;
                                // }
                            }

                        }
                        break;
                    case 'false':
                        for (var j = 0; j < valiObjArray[i].rules.length; j++) {
                            var ruleArray = valiObjArray[i].rules;
                            for (prop in ruleArray[j]) {
                                if (!eval(prop).test(valiObjArray[i].el)) {
                                    alert(ruleArray[j][prop]);
                                    return;
                                }

                                // if (prop == 'empty' && valiObjArray[i].el == 0) {
                                // 	alert(ruleArray[j][prop]);
                                // 	return;
                                // }
                            }

                        }
                        break;

                    case 'equal':
                        for (var j = 0; j < valiObjArray[i].rules.length; j++) {
                            var ruleArray = valiObjArray[i].rules;
                            for (prop in ruleArray[j]) {

                                for (var k = 0; k < valiObjArray[i].el.length - 1; k++) {
                                    if (valiObjArray[i].el[k] !== valiObjArray[i].el[k + 1]) {
                                        alert(ruleArray[j][prop]);
                                        return;
                                    }
                                }


                                // if (prop == 'empty' && valiObjArray[i].el == 0) {
                                // 	alert(ruleArray[j][prop]);
                                // 	return;
                                // }
                            }

                        }
                        break;

                    case 'id':
                        // 加权因子
                        var Wi         = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
                        // 身份证验证位值.10代表X
                        var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];

                    function IdCardValidate(idCard) {
                        idCard = trim(idCard.replace(/ /g, ""));               //去掉字符串头尾空格
                        if (idCard.length == 15) {
                            return isValidityBrithBy15IdCard(idCard);       //进行15位身份证的验证
                        } else if (idCard.length == 18) {
                            var a_idCard = idCard.split("");                // 得到身份证数组
                            if (isValidityBrithBy18IdCard(idCard) && isTrueValidateCodeBy18IdCard(a_idCard)) {   //进行18位身份证的基本验证和第18位的验证
                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            return false;
                        }
                    }

                    /**
                     * 判断身份证号码为18位时最后的验证位是否正确
                     * @param a_idCard 身份证号码数组
                     * @return
                     */
                    function isTrueValidateCodeBy18IdCard(a_idCard) {
                        var sum = 0;                             // 声明加权求和变量
                        if (a_idCard[17].toLowerCase() == 'x') {
                            a_idCard[17] = 10;                    // 将最后位为x的验证码替换为10方便后续操作
                        }
                        for (var i = 0; i < 17; i++) {
                            sum += Wi[i] * a_idCard[i];            // 加权求和
                        }
                        valCodePosition = sum % 11;                // 得到验证码所位置
                        if (a_idCard[17] == ValideCode[valCodePosition]) {
                            return true;
                        } else {
                            return false;
                        }
                    }

                    /**
                     * 验证18位数身份证号码中的生日是否是有效生日
                     * @param idCard 18位书身份证字符串
                     * @return
                     */
                    function isValidityBrithBy18IdCard(idCard18) {
                        var year      = idCard18.substring(6, 10);
                        var month     = idCard18.substring(10, 12);
                        var day       = idCard18.substring(12, 14);
                        var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
                        // 这里用getFullYear()获取年份，避免千年虫问题
                        if (temp_date.getFullYear() != parseFloat(year)
                            || temp_date.getMonth() != parseFloat(month) - 1
                            || temp_date.getDate() != parseFloat(day)) {
                            return false;
                        } else {
                            return true;
                        }
                    }

                    /**
                     * 验证15位数身份证号码中的生日是否是有效生日
                     * @param idCard15 15位书身份证字符串
                     * @return
                     */
                    function isValidityBrithBy15IdCard(idCard15) {
                        var year      = idCard15.substring(6, 8);
                        var month     = idCard15.substring(8, 10);
                        var day       = idCard15.substring(10, 12);
                        var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
                        // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法
                        if (temp_date.getYear() != parseFloat(year)
                            || temp_date.getMonth() != parseFloat(month) - 1
                            || temp_date.getDate() != parseFloat(day)) {
                            return false;
                        } else {
                            return true;
                        }
                    }

                        //去掉字符串头尾空格
                    function trim(str) {
                        return str.replace(/(^\s*)|(\s*$)/g, "");
                    };

                        for (var j = 0; j < valiObjArray[i].rules.length; j++) {
                            var ruleArray = valiObjArray[i].rules;
                            for (prop in ruleArray[j]) {
                                if (prop == 'true' && IdCardValidate(valiObjArray[i].el)) {
                                    alert(ruleArray[j][prop]);
                                    return;
                                } else if (prop == 'false' && !IdCardValidate(valiObjArray[i].el)) {
                                    alert(ruleArray[j][prop]);
                                    return;
                                }
                            }
                        }
                        break;
                }
            }
            // debugger;
            fn && fn();
        },
        /**
         * 本地存储的增强，支援JSON
         * @type {Object}
         */
        storage: {
            set: function (key, value) {
                if (!key) return;
                if (!value) value = '';



                if (typeOf(value) === 'object' || typeOf(value) === 'array') {
                    value = JSON.stringify(value)
                }
                localStorage[key] = value;
                return this;
            },
            get: function (key) {
                var t = localStorage[key];
                if (t === '' || t === undefined) return t;



                try {
                    var parse = JSON.parse(t);
                } catch (e) {
                    return t;
                }
                if (typeOf(parse) === 'object' || typeOf(parse) === 'array') {
                    return parse;
                }

                return t;
            },
            delete: function (key) {
                if (localStorage[key]) localStorage.removeItem(key)
                return this;
            },
            /**
             * 只取得一次本地的值，使用后销毁
             * @return {[type]} [description]
             */
            once: function (key) {
                var a = this.get(key);
                this.delete(key);
                return a;
            },
            // getAll: function(prefix) {}
        }

    }

    /* JQuery 扩展 */
    // 移动端Tap
    // 感谢 https://github.com/tommyfok/jQueryTap/blob/master/jquery.tap.js
    // if (JQUERY) {
    // 	$.fn.tap = function(fn) {
    // 		var collection = this,
    // 			isTouch = "ontouchend" in document.body,
    // 			tstart = isTouch ? "touchstart" : "mousedown",
    // 			tmove = isTouch ? "touchmove" : "mousemove",
    // 			tend = isTouch ? "touchend" : "mouseup",
    // 			tcancel = isTouch ? "touchcancel" : "mouseout";
    // 		collection.each(function() {
    // 			var i = {};
    // 			i.target = this;
    // 			$(i.target).on(tstart, function(e) {
    // 				var p = "touches" in e ? e.touches[0] : (isTouch ? window.event.touches[0] : window.event);
    // 				i.startX = p.clientX;
    // 				i.startY = p.clientY;
    // 				i.endX = p.clientX;
    // 				i.endY = p.clientY;
    // 				i.startTime = +new Date;
    // 			});
    // 			$(i.target).on(tmove, function(e) {
    // 				var p = "touches" in e ? e.touches[0] : (isTouch ? window.event.touches[0] : window.event);
    // 				i.endX = p.clientX;
    // 				i.endY = p.clientY;
    // 			});
    // 			$(i.target).on(tend, function(e) {
    // 				if ((+new Date) - i.startTime < 300) {
    // 					if (Math.abs(i.endX - i.startX) + Math.abs(i.endY - i.startY) < 20) {
    // 						var e = e || window.event;
    // 						e.preventDefault();
    // 						fn.call(i.target);
    // 					}
    // 				}
    // 				i.startTime = undefined;
    // 				i.startX = undefined;
    // 				i.startY = undefined;
    // 				i.endX = undefined;
    // 				i.endY = undefined;
    // 			});
    // 		});
    // 		return collection;
    // 	};
    // } else {
    // 	U.error('JQUERY is not defined');
    // }
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    /*
     json2.js
     2015-05-03
     Public Domain.
     NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
     See http://www.JSON.org/js.html
     This code should be minified before deployment.
     See http://javascript.crockford.com/jsmin.html
     USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
     NOT CONTROL.
     This file creates a global JSON object containing two methods: stringify
     and parse. This file is provides the ES5 JSON capability to ES3 systems.
     If a project might run on IE8 or earlier, then this file should be included.
     This file does nothing on ES5 systems.
     JSON.stringify(value, replacer, space)
     value       any JavaScript value, usually an object or array.
     replacer    an optional parameter that determines how object
     values are stringified for objects. It can be a
     function or an array of strings.
     space       an optional parameter that specifies the indentation
     of nested structures. If it is omitted, the text will
     be packed without extra whitespace. If it is a number,
     it will specify the number of spaces to indent at each
     level. If it is a string (such as '\t' or '&nbsp;'),
     it contains the characters used to indent at each level.
     This method produces a JSON text from a JavaScript value.
     When an object value is found, if the object contains a toJSON
     method, its toJSON method will be called and the result will be
     stringified. A toJSON method does not serialize: it returns the
     value represented by the name/value pair that should be serialized,
     or undefined if nothing should be serialized. The toJSON method
     will be passed the key associated with the value, and this will be
     bound to the value
     For example, this would serialize Dates as ISO strings.
     Date.prototype.toJSON = function (key) {
     function f(n) {
     // Format integers to have at least two digits.
     return n < 10
     ? '0' + n
     : n;
     }
     return this.getUTCFullYear()   + '-' +
     f(this.getUTCMonth() + 1) + '-' +
     f(this.getUTCDate())      + 'T' +
     f(this.getUTCHours())     + ':' +
     f(this.getUTCMinutes())   + ':' +
     f(this.getUTCSeconds())   + 'Z';
     };
     You can provide an optional replacer method. It will be passed the
     key and value of each member, with this bound to the containing
     object. The value that is returned from your method will be
     serialized. If your method returns undefined, then the member will
     be excluded from the serialization.
     If the replacer parameter is an array of strings, then it will be
     used to select the members to be serialized. It filters the results
     such that only members with keys listed in the replacer array are
     stringified.
     Values that do not have JSON representations, such as undefined or
     functions, will not be serialized. Such values in objects will be
     dropped; in arrays they will be replaced with null. You can use
     a replacer function to replace those with JSON values.
     JSON.stringify(undefined) returns undefined.
     The optional space parameter produces a stringification of the
     value that is filled with line breaks and indentation to make it
     easier to read.
     If the space parameter is a non-empty string, then that string will
     be used for indentation. If the space parameter is a number, then
     the indentation will be that many spaces.
     Example:
     text = JSON.stringify(['e', {pluribus: 'unum'}]);
     // text is '["e",{"pluribus":"unum"}]'
     text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
     // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'
     text = JSON.stringify([new Date()], function (key, value) {
     return this[key] instanceof Date
     ? 'Date(' + this[key] + ')'
     : value;
     });
     // text is '["Date(---current time---)"]'
     JSON.parse(text, reviver)
     This method parses a JSON text to produce an object or array.
     It can throw a SyntaxError exception.
     The optional reviver parameter is a function that can filter and
     transform the results. It receives each of the keys and values,
     and its return value is used instead of the original value.
     If it returns what it received, then the structure is not modified.
     If it returns undefined then the member is deleted.
     Example:
     // Parse the text. Values that look like ISO date strings will
     // be converted to Date objects.
     myData = JSON.parse(text, function (key, value) {
     var a;
     if (typeof value === 'string') {
     a =
     /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
     if (a) {
     return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
     +a[5], +a[6]));
     }
     }
     return value;
     });
     myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
     var d;
     if (typeof value === 'string' &&
     value.slice(0, 5) === 'Date(' &&
     value.slice(-1) === ')') {
     d = new Date(value.slice(5, -1));
     if (d) {
     return d;
     }
     }
     return value;
     });
     This is a reference implementation. You are free to copy, modify, or
     redistribute.
     */

    /*jslint
     eval, for, this
     */

    /*property
     JSON, apply, call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
     getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
     lastIndex, length, parse, prototype, push, replace, slice, stringify,
     test, toJSON, toString, valueOf
     */


    // Create a JSON object only if one does not already exist. We create the
    // methods in a closure to avoid creating global variables.

    if (typeof JSON !== 'object') {
        JSON = {};
    }

    (function () {
        'use strict';

        var rx_one       = /^[\],:{}\s]*$/,
            rx_two       = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
            rx_three     = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
            rx_four      = /(?:^|:|,)(?:\s*\[)+/g,
            rx_escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

        function f(n) {
            // Format integers to have at least two digits.
            return n < 10 ? '0' + n : n;
        }

        function this_value() {
            return this.valueOf();
        }

        if (typeof Date.prototype.toJSON !== 'function') {

            Date.prototype.toJSON = function () {

                return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate()) + 'T' +
                f(this.getUTCHours()) + ':' +
                f(this.getUTCMinutes()) + ':' +
                f(this.getUTCSeconds()) + 'Z' : null;
            };

            Boolean.prototype.toJSON = this_value;
            Number.prototype.toJSON  = this_value;
            String.prototype.toJSON  = this_value;
        }

        var gap,
            indent,
            meta,
            rep;


        function quote(string) {

            // If the string contains no control characters, no quote characters, and no
            // backslash characters, then we can safely slap some quotes around it.
            // Otherwise we must also replace the offending characters with safe escape
            // sequences.

            rx_escapable.lastIndex = 0;
            return rx_escapable.test(string) ? '"' + string.replace(rx_escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        }


        function str(key, holder) {

            // Produce a string from holder[key].

            var i, // The loop counter.
                k, // The member key.
                v, // The member value.
                length,
                mind  = gap,
                partial,
                value = holder[key];

            // If the value has a toJSON method, call it to obtain a replacement value.

            if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }

            // If we were called with a replacer function, then call the replacer to
            // obtain a replacement value.

            if (typeof rep === 'function') {
                value = rep.call(holder, key, value);
            }

            // What happens next depends on the value's type.

            switch (typeof value) {
                case 'string':
                    return quote(value);

                case 'number':

                    // JSON numbers must be finite. Encode non-finite numbers as null.

                    return isFinite(value) ? String(value) : 'null';

                case 'boolean':
                case 'null':

                    // If the value is a boolean or null, convert it to a string. Note:
                    // typeof null does not produce 'null'. The case is included here in
                    // the remote chance that this gets fixed someday.

                    return String(value);

                // If the type is 'object', we might be dealing with an object or an array or
                // null.

                case 'object':

                    // Due to a specification blunder in ECMAScript, typeof null is 'object',
                    // so watch out for that case.

                    if (!value) {
                        return 'null';
                    }

                    // Make an array to hold the partial results of stringifying this object value.

                    gap += indent;
                    partial = [];

                    // Is the value an array?

                    if (Object.prototype.toString.apply(value) === '[object Array]') {

                        // The value is an array. Stringify every element. Use null as a placeholder
                        // for non-JSON values.

                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }

                        // Join all of the elements together, separated with commas, and wrap them in
                        // brackets.

                        v   = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }

                    // If the replacer is an array, use it to select the members to be stringified.

                    if (rep && typeof rep === 'object') {
                        length = rep.length;
                        for (i = 0; i < length; i += 1) {
                            if (typeof rep[i] === 'string') {
                                k = rep[i];
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (
                                            gap ? ': ' : ':'
                                        ) + v);
                                }
                            }
                        }
                    } else {

                        // Otherwise, iterate through all of the keys in the object.

                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (
                                            gap ? ': ' : ':'
                                        ) + v);
                                }
                            }
                        }
                    }

                    // Join all of the member texts together, separated with commas,
                    // and wrap them in braces.

                    v   = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
            }
        }

        // If the JSON object does not yet have a stringify method, give it one.

        if (typeof JSON.stringify !== 'function') {
            meta           = { // table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"': '\\"',
                '\\': '\\\\'
            };
            JSON.stringify = function (value, replacer, space) {

                // The stringify method takes a value and an optional replacer, and an optional
                // space parameter, and returns a JSON text. The replacer can be a function
                // that can replace values, or an array of strings that will select the keys.
                // A default replacer method can be provided. Use of the space parameter can
                // produce text that is more easily readable.

                var i;
                gap    = '';
                indent = '';

                // If the space parameter is a number, make an indent string containing that
                // many spaces.

                if (typeof space === 'number') {
                    for (i = 0; i < space; i += 1) {
                        indent += ' ';
                    }

                    // If the space parameter is a string, it will be used as the indent string.

                } else if (typeof space === 'string') {
                    indent = space;
                }

                // If there is a replacer, it must be a function or an array.
                // Otherwise, throw an error.

                rep = replacer;
                if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                    throw new Error('JSON.stringify');
                }

                // Make a fake root object containing our value under the key of ''.
                // Return the result of stringifying the value.

                return str('', {
                    '': value
                });
            };
        }


        // If the JSON object does not yet have a parse method, give it one.

        if (typeof JSON.parse !== 'function') {
            JSON.parse = function (text, reviver) {

                // The parse method takes a text and an optional reviver function, and returns
                // a JavaScript value if the text is a valid JSON text.

                var j;

                function walk(holder, key) {

                    // The walk method is used to recursively walk the resulting structure so
                    // that modifications can be made.

                    var k, v, value = holder[key];
                    if (value && typeof value === 'object') {
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v;
                                } else {
                                    delete value[k];
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value);
                }


                // Parsing happens in four stages. In the first stage, we replace certain
                // Unicode characters with escape sequences. JavaScript handles many characters
                // incorrectly, either silently deleting them, or treating them as line endings.

                text                   = String(text);
                rx_dangerous.lastIndex = 0;
                if (rx_dangerous.test(text)) {
                    text = text.replace(rx_dangerous, function (a) {
                        return '\\u' +
                            ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                    });
                }

                // In the second stage, we run the text against regular expressions that look
                // for non-JSON patterns. We are especially concerned with '()' and 'new'
                // because they can cause invocation, and '=' because it can cause mutation.
                // But just to be safe, we want to reject all unexpected forms.

                // We split the second stage into 4 regexp operations in order to work around
                // crippling inefficiencies in IE's and Safari's regexp engines. First we
                // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
                // replace all simple value tokens with ']' characters. Third, we delete all
                // open brackets that follow a colon or comma or that begin the text. Finally,
                // we look to see that the remaining characters are only whitespace or ']' or
                // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

                if (
                    rx_one.test(
                        text
                            .replace(rx_two, '@')
                            .replace(rx_three, ']')
                            .replace(rx_four, '')
                    )
                ) {

                    // In the third stage we use the eval function to compile the text into a
                    // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
                    // in JavaScript: it can begin a block or an object literal. We wrap the text
                    // in parens to eliminate the ambiguity.

                    j = eval('(' + text + ')');

                    // In the optional fourth stage, we recursively walk the new structure, passing
                    // each name/value pair to a reviver function for possible transformation.

                    return typeof reviver === 'function' ? walk({
                        '': j
                    }, '') : j;
                }

                // If the text is not JSON parseable, then a SyntaxError is thrown.

                throw new SyntaxError('JSON.parse');
            };
        }

        var jsonParse=JSON.parse;
        JSON.parse=function(text, reviver){
            try {
                return jsonParse(text, reviver);
            } catch(e) {
                if (typeof(text) === 'string') {
                    try {
                        var result={};
                        eval('result='+text);
                        return result;
                    } catch(ex) {
                        throw e;
                    }
                }else{
                    throw e;
                }
            }
        }
    }());



    var L = new T();
    // L.settings.xhrAfterTreatment = function (resolve, reject, XMLHttpRequest) {
    //
    //     if (XMLHttpRequest && (XMLHttpRequest.responseCode === '0000' || XMLHttpRequest.responseCode === '5505')) {
    //         resolve(XMLHttpRequest);
    //     } else {
    //         var d = XMLHttpRequest;
    //         L.ui.hole.close();
    //         L.ui.alert(d.responseMsg);
    //         console.log(d.responseCode + ' ' + d.responseMsg)
    //         reject(XMLHttpRequest);
    //         // failedFn && failedFn();
    //         return false;
    //     }
    //
    // }
    // console.log(L)
    return L;
});



// v-tap封装
/**
 * Created by 二哲 on 15/12/6.
 */
/*
 * 不带参数指令
 * v-tap=handler
 * or
 * 带参数指令
 * v-tap=handler($index,el,$event)
 *
 * !!!新增!!!
 * 把tapObj对象注册在原生event对象上
 * event.tapObj拥有6个值
 * pageX,pageY,clientX,clientY,distanceX,distanceY
 * 后面2个分别的手指可能移动的位置(以后可用于拓展手势)
 *
 * */
;
(function () {
    var vueTap     = {};
    vueTap.install = function (Vue) {
        Vue.directive('tap', {
            isFn: true,
            acceptStatement: true,
            bind: function () {
                //bind callback
            },
            update: function (fn) {
                var self    = this;
                self.tapObj = {};

                if (typeof fn !== 'function') {
                    return console.error('The param of directive "v-tap" must be a function!');
                }
                self.handler = function (e) { //This directive.handler
                    e.tapObj = self.tapObj;
                    fn.call(self, e);
                }
                this.el.addEventListener('touchstart', function (e) {

                    if (self.modifiers.stop)
                        e.stopPropagation();
                    if (self.modifiers.prevent)
                        e.preventDefault();
                    self.touchstart(e, self);
                }, false);
                this.el.addEventListener('touchend', function (e) {
                    //e.preventDefault();
                    self.touchend(e, self, fn);
                }, false);
            },
            unbind: function () {},
            isTap: function () {
                var self = this;
                if (self.el.disabled) {
                    return false;
                }
                var tapObj = this.tapObj;
                return this.time < 250 && Math.abs(tapObj.distanceX) < 4 && Math.abs(tapObj.distanceY) < 4;
            },
            touchstart: function (e, self) {
                var touches    = e.touches[0];
                var tapObj     = self.tapObj;
                tapObj.pageX   = touches.pageX;
                tapObj.pageY   = touches.pageY;
                tapObj.clientX = touches.clientX;
                tapObj.clientY = touches.clientY;
                self.time      = +new Date();
            },
            touchend: function (e, self) {
                var touches      = e.changedTouches[0];
                var tapObj       = self.tapObj;
                self.time        = +new Date() - self.time;
                tapObj.distanceX = tapObj.pageX - touches.pageX;
                tapObj.distanceY = tapObj.pageY - touches.pageY;

                if (self.isTap(tapObj))
                    self.handler(e);
            }
        });
    };

    if (typeof exports == "object") {
        module.exports = vueTap;
    } else if (typeof define == "function" && define.amd) {
        define([], function () {
            return vueTap
        })
    } else if (window.Vue) {
        window.vueTap = vueTap;
        Vue.use(vueTap);
    }

})();

// /**
//  * m-layer
//  * @param  {String} a){"use strict";var   b [description]
//  * @return {[type]}          [description]
//  */
// ;
// !function (a) {
//     "use strict";
//     var b = "";
//     b     = b ? b : document.scripts[document.scripts.length - 1].src.match(/[\s\S]*\//)[0];
//     var c = document,
//         d = "querySelectorAll",
//         e = "getElementsByClassName",
//         f = function (a) {
//             return c[d](a)
//         };
//     document.head.appendChild(function () {
//         var a = c.createElement("link");
//         return a.href = b + "mlayer/layer.css", a.type = "text/css", a.rel = "styleSheet", a.id = "layermcss", a
//     }());
//     var g = {
//         type: 0,
//         shade: !0,
//         shadeClose: !0,
//         fixed: !0,
//         anim: !0
//     };
//     a.ready = {
//         extend: function (a) {
//             var b = JSON.parse(JSON.stringify(g));
//             for (var c in a) b[c] = a[c];
//             return b
//         },
//         timer: {},
//         end: {}
//     }, ready.touch = function (a, b) {
//         var c;
//         a.addEventListener("touchmove", function () {
//             c = !0
//         }, !1), a.addEventListener("touchend", function (a) {
//             a.preventDefault(), c || b.call(this, a), c = !1
//         }, !1)
//     };
//     var h = 0,
//         i = ["layermbox"],
//         j = function (a) {
//             var b = this;
//             b.config = ready.extend(a), b.view()
//         };
//     j.prototype.view = function () {
//         var a = this,
//             b = a.config,
//             d = c.createElement("div");
//         a.id = d.id = i[0] + h, d.setAttribute("class", i[0] + " " + i[0] + (b.type || 0)), d.setAttribute("index", h);
//         var g = function () {
//                 var a = "object" == typeof b.title;
//                 return b.title ? '<h3 style="' + (a ? b.title[1] : "") + '">' + (a ? b.title[0] : b.title) + '</h3><button class="layermend"></button>' : ""
//             }(),
//             j = function () {
//                 var a, c = (b.btn || []).length;
//                 return 0 !== c && b.btn ? (a = '<span type="1">' + b.btn[0] + "</span>", 2 === c && (a = '<span type="0">' + b.btn[1] + "</span>" + a), '<div class="layermbtn">' + a + "</div>") : ""
//             }();
//         if (b.fixed || (b.top = b.hasOwnProperty("top") ? b.top : 100, b.style = b.style || "", b.style += " top:" + (c.body.scrollTop + b.top) + "px"), 2 === b.type && (b.content = '<i></i><i class="laymloadtwo"></i><i></i><div>' + (b.content || "") + "</div>"), d.innerHTML = (b.shade ? "<div " + ("string" == typeof b.shade ? 'style="' + b.shade + '"' : "") + ' class="laymshade"></div>' : "") + '<div class="layermmain" ' + (b.fixed ? "" : 'style="position:static;"') + '><div class="section"><div class="layermchild ' + (b.className ? b.className : "") + " " + (b.type || b.shade ? "" : "layermborder ") + (b.anim ? "layermanim" : "") + '" ' + (b.style ? 'style="' + b.style + '"' : "") + ">" + g + '<div class="layermcont">' + b.content + "</div>" + j + "</div></div></div>", !b.type || 2 === b.type) {
//             var l = c[e](i[0] + b.type),
//                 m = l.length;
//             m >= 1 && k.close(l[0].getAttribute("index"))
//         }
//         document.body.appendChild(d);
//         var n = a.elem = f("#" + a.id)[0];
//         b.success && b.success(n), a.index = h++, a.action(b, n)
//     }, j.prototype.action = function (a, b) {
//         var c = this;
//         if (a.time && (ready.timer[c.index] = setTimeout(function () {
//                 k.close(c.index)
//             }, 1e3 * a.time)), a.title) {
//             var d = b[e]("layermend")[0],
//                 f = function () {
//                     a.cancel && a.cancel(), k.close(c.index)
//                 };
//             ready.touch(d, f), d.onclick = f
//         }
//         var g = function () {
//             var b = this.getAttribute("type");
//             0 == b ? (a.no && a.no(), k.close(c.index)) : a.yes ? a.yes(c.index) : k.close(c.index)
//         };
//         if (a.btn)
//             for (var h = b[e]("layermbtn")[0].children, i = h.length, j = 0; i > j; j++) ready.touch(h[j], g), h[j].onclick = g;
//         if (a.shade && a.shadeClose) {
//             var l = b[e]("laymshade")[0];
//             ready.touch(l, function () {
//                 k.close(c.index, a.end)
//             }), l.onclick = function () {
//                 // 该处BUG会造成tap事件下的layer提前关闭，禁用click事件
//                 // k.close(c.index, a.end)
//             }
//         }
//         a.end && (ready.end[c.index] = a.end)
//     };
//     var k = {
//         v: "1.6",
//         index: h,
//         open: function (a) {
//             var b = new j(a || {});
//             return b.index
//         },
//         close: function (a) {
//             var b = f("#" + i[0] + a)[0];
//             b && (b.innerHTML = "", c.body.removeChild(b), clearTimeout(ready.timer[a]), delete ready.timer[a], "function" == typeof ready.end[a] && ready.end[a](), delete ready.end[a])
//         },
//         closeAll: function () {
//             for (var a = c[e](i[0]), b = 0, d = a.length; d > b; b++) k.close(0 | a[0].getAttribute("index"))
//         }
//     };
//     "function" == typeof define ? define(function () {
//         return k
//     }) : a.layer = k
// }(window);


if (typeof (Vue) !== 'undefined') {
    Vue.filter('formatDate', function (value, fmt) {
        if (!value) return 0;
        if (!fmt) fmt = 'yyyy-MM-dd hh:mm:ss';
        return S.Util.format(value, fmt)
    });
}


/**
 * == OhSnap!.js ==
 * A simple jQuery/Zepto notification library designed to be used in mobile apps
 *
 * author: Justin Domingue
 * date: september 18, 2015
 * version: 1.0.0
 * copyright - nice copyright over here
 */

/* Shows a toast on the page
 * Params:
 *  text: text to show
 *  options: object that can override the following options
 *    color: alert will have class 'alert-color'. Default null
 *    icon: class of the icon to show before the alert. Default null
 *    duration: duration of the notification in ms. Default 5000ms
 *    container-id: id of the alert container. Default 'ohsnap'
 *    fade-duration: duration of the fade in/out of the alerts. Default 200ms
 *    direction: 'left', 'right', 'top' or 'bottom', default 'left'
 */
function ohSnap(text, options) {
    var defaultOptions = {
        'color': null,     // color is  CSS class `alert-color`
        'icon': null,     // class of the icon to show before the alert text
        'duration': '5000',   // duration of the notification in ms
        'container-id': 'ohsnap', // id of the alert container
        'fade-duration': 200,  // duration of the fade in/out of the alerts. integer in ms
        'elements': [],      // 'ok', 'cancel', 'ignore', 'copy', module name or {icon:'',text:'',click:function(){},module:'',id:''}
        'element-size': 2,
        'element-align': 'left',
        'direction': 'left',  // 'left', 'right', 'top' or 'bottom', default 'left'
        'float': false
    }

    options = (typeof options == 'object') ? $.extend(defaultOptions, options) : defaultOptions;

    var $container   = $('#' + options['container-id']),
        icon_markup  = "",
        color_markup = "";

    if (options.icon) {
        icon_markup = '<span style="display:inline-block; vertical-align: top; position: absolute;" class="fa fa-' + options.icon + ' ' + options.icon + ' fa-5x"></span>';
    }

    if (options.color) {
        color_markup = 'ohsnap-alert-' + options.color;
    }
    // Generate the HTML
    var html=$('<div class="ohsnap-alert-inner ' + color_markup + '"></div>').append($('<div class="ohsnap-alert-title">' + icon_markup + '<span class="ohsnap-alert-text" style="display:inline-block; text-align:left; ' + (icon_markup?'margin-left:5.5em; min-height:5.5em;':'') + '">' + text + '</span></div>')).addClass(options.direction + '-in').css('animation-duration', options['fade-duration'] + 'ms');

    var anyIcon="";
    if (options.elements&&options.elements.length>0) {
        var elements=$('<div class="ohsnap-alert-elements" style="'+ (icon_markup?'margin-left:5.5em;':'') +'"></div>').css('text-align', options['element-align']);
        for (var i=0;i<options.elements.length;i++){
            var element=options.elements[i];
            if (element==='cancel') {
                element={icon:'close',text:'消除'};
            }else if(element==='ignore') {
                element={icon:'eye-slash',text:'忽略'};
            }else if(element==='ok') {
                element={icon:'check',text:'确定'};
            }else if(element==='copy') {
                element={icon:'copy',text:'复制',ready:function(){
                    new Clipboard(this, {text:function(){return text;}}).on('success', function(){
                        ohSnap('复制成功', {float: true});
                    });
                }};
            } else if(typeof(element)==='string') {
                element={icon:'file-text-o',text:'查看',module:element};
            }else if(!anyIcon){
                anyIcon=element.icon?true:false;
            }
            element.text=element.text||'查看';
            var elm=$('<a></a>').addClass('ohsnap-alert-button').css('width', options['element-size']+'em');
            if(element.module) {
                elm.attr('module',element.module);
                elm.addClass('menu-click');
            }
            if(element.id)
                elm.attr('id',element.id);
            if(element.icon)
                elm.append('<i class="fa fa-' + options['element-size'] + 'x fa-'+element.icon+'"><br/></i>');
            if(element.text)
                elm.append(element.text);
            if(element.css)
                elm.css(element.css);
            if(element.ready)
                element.ready.call(elm.get(0));
            if(element.click)
                elm.on('click', (function(element){
                    return function(e) {
                        e.text = text;
                        return element.click.apply(this, arguments);
                    }
                })(element));
            if(element.style) {
                element.style=element.style.split(/\s+/ig);
                for(var j=0;j<element.style.length;j++){
                    elm.addClass(element.style[j]);
                }
            }
            elements.append(elm);
        }
        html.append(elements);
        if(anyIcon===false||(anyIcon===''&&!options.icon)){
            html.find('.fa').remove();
        }
    }

    // Append the label to the container
    $container.append($('<div class="ohsnap-alert '+(options.float?'ohsnap-alert-float':'')+'"></div>').append(html));

    // Remove the notification on click
    (options.elements&&options.elements.length>0?html.find('a.ohsnap-alert-button'):html).on('click', function () {
        ohSnapX(html, {
            direction: options.direction,
            duration: options['fade-duration']
        });
    });

    // After 'duration' seconds, the animation fades out
    if (options.duration && options.duration !== '0') {
        setTimeout(function () {
            ohSnapX(html, {
                direction: options.direction,
                duration: options['fade-duration']
            });
        }, parseInt(options.duration) + parseInt(options['fade-duration']));
    }

    return html;
}

/* Removes a toast from the page
 * params:
 *    Called without arguments, the function removes all alerts
 *    element: a jQuery object to remove
 *    options:
 *      duration: duration of the alert fade out - time in ms. Default 200ms
 *      direction: 'left', 'right', 'top' or 'bottom', default 'left'
 */
function ohSnapX(element, options) {

    defaultOptions = {
        'direction': 'left',
        'duration': 200
    }

    options = (typeof options == 'object') ? $.extend(defaultOptions, options) : defaultOptions;

    if (typeof element !== "undefined") {
        if (element.hasClass(options.direction + '-in')) {
            element.removeClass(options.direction + '-in').addClass(options.direction + '-out').css('animation-duration', options.duration + 'ms').on('webkitAnimationEnd', function () {
                $(this).remove();
            });
        }
    } else {
        $('.ohsnap-alert').children().removeClass(options.direction + '-in').addClass(options.direction + '-out').css('animation-duration', options.duration + 'ms').on('webkitAnimationEnd', function () {
            $(this).parent().remove();
        });
    }
}
