(function (w, d, u) {
    'use strict';
    if (!!w.DatePicker) return;
    function elIndexOf (element) {
        var index = -1;
        var els = element.parentNode.children;
        for (var i = 0; i < els.length; i++) {
            if (els[i] === element) {
                index = i;
                break;
            }
        }
        return index;
     }
    function addClass (target, className) {
        if (!target.className) return target.className = className;
        if (!hasClass(target, className)) target.className += " " + className;
     }
    function removeClass (target, className) {
        if (!target.className) return;
        var regexp = new RegExp("(^|\\s+)" + className + "((?=\\s)|$)");
        target.className = target.className.replace(regexp, "");
     }
    function toggleClass (target, className) {
        if (hasClass(target, className)) return removeClass(target, className);
        addClass(target, className);
     }
    function hasClass (target, className) {
        if (!target.className) return false;
        var regexp = new RegExp("(^|\\s+)" + className + "((?=\\s)|$)");
        return regexp.test(target.className);
     }
    function createEl (nodeName) {
        return d.createElement(nodeName);
     }
    function display (target, state) {
        if (target.nodeType == 1) {
            target.style.display = state;
        } else {
            for (var i = 0; i < target.length; i++) {
                target[i].style.display = state;
            }
        }
     }
    function className (target, str) {
        if (target.nodeType == 1) {
            target.className = str;
        } else {
            for (var i = 0; i < target.length; i++) {
                target[i].className = str;
            }
        }
     }
    function eventListener (target, type, handle, remove) {
        if (remove) {
            if (target.removeEventListener) {
                target.removeEventListener(type, handle);
            } else if (target.detachEvent) {
                target.detachEvent("on" + type, target[type + handle]);
                target[type + handle] = null;
                target["e" + type + handle] = null;
            } else {
                target["on" + type] = null;
            }
        } else {
            if (target.addEventListener) {
                target.addEventListener(type, handle);
            } else if (target.attachEvent) {
                target["e" + type + handle] = handle;
                target[type + handle] = function () {target["e" + type + handle](w.event);};
                target.attachEvent("on" + type, target[type + handle]);
            } else {
                target["on" + type] = handle;
            }
        }
     }
    function getClassEl (target, className) {
        if (target.getElementsByClassName) {
            return target.getElementsByClassName(className);
        } else {
            var result = [],
                regexp = new RegExp("(^|\\s+)" + className + "((?=\\s)|$)"),
                tags = target.getElementsByTagName("*");
            for (var i = 0; i < tags.length; i++) {
                if (regexp.test(tags[i].className)) result.push(tags[i]);
            }
            return result;
        }
     }
    function closest(el, selector) {
        if (selector.nodeType && selector.nodeType == 1) {
            while (el) {
                if (el == selector) break;
                el = el.parentElement;
            }
        } else {
            var arr = selector.split("");
            if (arr[0] == ".") {
                selector = selector.replace(".", "");
                var regexp = new RegExp("(^|\\s+)" + selector + "(\\s+|$)");
                while (el) {
                    if (el.className && regexp.test(el.className)) break;
                    el = el.parentElement;
                }
            } else if (arr[0] == "#") {
                selector = selector.replace("#", "");
                while (el) {
                    if (el.id == selector) break;
                    el = el.parentElement;
                }
            } else {
                while (el) {
                    if (el.nodeName.toLowerCase() == selector) break;
                    el = el.parentElement;
                }
            }
        }
        return el;
     }
    function initEvent (element,event){
        if (d.createEventObject){
            var evt = d.createEventObject();
            return element.fireEvent('on' + event,evt);
        } else {
            var evt = d.createEvent( 'HTMLEvents' );
            evt.initEvent(event, true, true);
            return !element.dispatchEvent(evt);
        }
     }
    function elOffset (element) {
        var offsetObj = {
            top: element.offsetTop,
            left: element.offsetLeft,
            width: element.offsetWidth,
            height: element.offsetHeight
        };
        element = element.offsetParent;
        while (element != null) {
            offsetObj.top += element.offsetTop;
            offsetObj.left += element.offsetLeft;
            element = element.offsetParent;
        }
        return offsetObj;
     }
    function DatePicker (format) {
        console.time("初始化时间选择器");
        this.monthEn = ["Jan","Fed","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        this.month = ["一","二","三","四","五","六","七","八","九","十","十一","十二"];
        this.week = ["日","一","二","三","四","五","六"];
        this.day = [31,[28,29],31,30,31,30,31,31,30,31,30,31];
        this.type = 3;
        this.isFF = /.*Firefox.*/.test(navigator.userAgent);    // 判断火狐浏览器
        this.doms = {};                                         // 存储获取的元素
        this.datas = {};                                        // 存储输入框参数
        this.state = {};                                        // 存储状态数据
        this.cache = {};                                        // 存储拼接页面
        this.touch = {};                                        // 存储触摸数据
        this.check = {};                                        // 存储选中日期
        this.maxId = new Date().getTime();                      // 输入框唯一ID
        this.init(format);
        console.timeEnd("初始化时间选择器");
        return this.api;
     }
    DatePicker.prototype = {
        init: function (str) {
            this.createPicker();
            this.format = this.initFormat(str);
            this.initInputs();
            this.api = {
                set: this.set.bind(this),
                join: "/",
                show: this.showPicker.bind(this),
                value: "",
                refresh: this.refresh.bind(this),
                callback: function (obj) {console.log(JSON.stringify(obj))}
            }
         },
        // 设置输入框参数
        set: function (el, op) {
            if (!this.isInput(el)) return;
            if (op instanceof Object) {

            } else {
                if (this.datas[el.bindId]) {
                    op = {offset: elOffset(el)};
                } else {
                    eventListener(el, "focus", this.showPicker.bind(this, el));
                    op = {
                        offset: elOffset(el),
                        max: null,
                        min: null,
                        format: this.format,
                        range: null,
                        bind: null
                    }
                }
                this.setInput(el, op);
            }
         },
        // 创建选择器结构
        createPicker: function () {
            var style = createEl("style");
            style.type = "text/css";
            style.innerHTML = "";
            d.getElementsByTagName("head")[0].appendChild(style);
            var div = this.doms.box = createEl("div");
            div.className = "-date-picker";
            var html = "\
            <div id='-date-picker-point'>\
                <div class='-rotate45'></div>\
            </div>\
            <div class='-date-picker-main'>\
                <div id='-date-picker-main'></div>\
            </div>";
            div.innerHTML = html;
            d.body.appendChild(div);
            this.reSize();
            this.getElement();
         },
        // 创建年月选择容器
        createSelectBox: function () {
            var div = createEl("div");
            div.className = "-date-picker-select";
            div.innerHTML = "\
            <div class='-d-p-select-head'>\
                <div id='-d-p-select-head'></div>\
            </div>\
            <div class='-d-p-select-year-month'>\
                <div id='-d-p-select-main'></div>\
            </div>\
            <div class='-d-p-select-foot'>\
                <div>\
                    <button id='-date-picker-btn-back'>返回</button>\
                </div>\
            </div>";
            this.doms.main.appendChild(div);
            this.getElement(2);
         },
        // 创建日期选择容器
        createDayBox: function () {
            var head = createEl("div"), main = createEl("div"), foot = createEl("div");
            className(head, "-date-picker-head");
            className(main, "-date-picker-day");
            className(foot, "-date-picker-btn");
            head.innerHTML = "\
            <div>\
                <div class='-date-picker-ym'>\
                    <button id='-date-picker-ym'></button>\
                    <span class='-dpcymt -rotate45'></span>\
                </div>\
            </div>";
            foot.innerHTML = "\
            <div>\
                <div id='-date-picker-btn-tday'><button>今&emsp;天</button></div>\
                <div id='-date-picker-btn-ystday'><button>昨&emsp;天</button></div>\
                <div id='-date-picker-btn-lsweek'><button>上一周</button></div>\
                <div id='-date-picker-btn-lsmonth'><button>上一月</button></div>\
                <div id='-date-picker-btn-hour'><button>00</button></div>\
                <div id='-date-picker-btn-minute'><button>00</button></div>\
                <div id='-date-picker-btn-second'><button>00</button></div>\
                <div id='-date-picker-btn-confirm'><button>确定</button></div>\
            </div>";
            var html = "\
            <div>\
                <div class='-date-picker-title'>";
                    for (var i = 0; i < this.week.length; i++) {
                        html += "<button class=''>";
                        html += this.week[i];
                        html += "</button>";
                    }
                    html += "\
                </div>\
                <div id='-date-picker-prev'>\
                    <div class='-rotate45'></div>\
                </div>\
                <div class='-date-picker-box'>\
                    <div id='-date-picker-year' data-month='0' style='transition:transform 300ms;'>\
                        <div class='-prev-year'>上一年</div>";
                        for (var i = 1; i < 13; i++) {
                            html += "<div class='-date-picker-month'><div class='-bg-month'>";
                            html += i;
                            html += "</div></div>";
                        }
                        html += "\
                        <div class='-next-year'>下一年</div>\
                    </div>\
                </div>\
                <div id='-date-picker-next'>\
                    <div class='-rotate45'></div>\
                </div>\
            </div>";
            main.innerHTML = html;
            this.doms.main.appendChild(head);
            this.doms.main.appendChild(main);
            this.doms.main.appendChild(foot);
            this.getElement(1);
         },
        // 创建月份选择容器
        createMonthBox: function () {
            if (!this.state.step[2]) this.createSelectBox();
            var head = createEl("div"),
                main = createEl("div"),
                html = "";
            head.id = "-d-p-select-year-touch";
            className(main, "-d-p-s-month-box");
            head.innerHTML = "\
            <div class='-d-p-select-left'></div>\
            <div class='-d-p-select-box'>\
                <div id='-d-p-select-year'></div>\
            </div>\
            <div class='-d-p-select-right'></div>";
            for (var i = 0; i < 12; i++) {
                html += "<div class='-d-p-s-month' data-month='";
                html += (i + 1);
                html += "'><div>";
                html += this.month[i];
                html += "月<div class='-d-p-s-m-en'>";
                html += this.monthEn[i];
                html += "</div></div></div>";
            }
            main.innerHTML = html;
            this.doms.selectHead.appendChild(head);
            this.doms.selectMain.appendChild(main);
            this.getElement(3);
         },
        // 创建年份选择容器
        createYearBox: function () {
            if (!this.state.step[2]) this.createSelectBox();
            var head = createEl("button"),
                main = createEl("div");
            className(main, "-d-p-s-year-box");
            main.innerHTML = "\
            <div id='-d-p-s-year-prev'>\
                <div class='-rotate45'></div>\
            </div>\
            <div class='-d-p-s-y-box'>\
                <div id='-d-p-s-y-box'></div>\
            </div>\
            <div id='-d-p-s-year-next'>\
                <div class='-rotate45'></div>\
            </div>";
            head.id = "-d-p-select-year-range";
            this.doms.selectHead.appendChild(head);
            this.doms.selectMain.appendChild(main);
            this.getElement(4);
         },
        // 获取元素
        getElement: function (step) {
            step = step || 0;
            var el = this.doms,
                div = el.box,
                get = d.getElementById.bind(d);
            switch (step) {
                case 0:
                    el.point = get("-date-picker-point");
                    el.main = get("-date-picker-main");
                break;
                case 1:
                    el.btn = get("-date-picker-ym");
                    el.btnBox = el.btn.parentElement;
                    el.year = get("-date-picker-year");
                    el.dayBox = el.year.parentElement;
                    el.months = getClassEl(div, "-date-picker-month");
                    el.prevMonth = get("-date-picker-prev");
                    el.nextMonth = get("-date-picker-next");
                    el.today = get("-date-picker-btn-tday");
                    el.yesterday = get("-date-picker-btn-ystday");
                    el.lastweek = get("-date-picker-btn-lsweek");
                    el.lastmonth = get("-date-picker-btn-lsmonth");
                    el.hour = get("-date-picker-btn-hour");
                    el.hourBtn = el.hour.children[0];
                    el.minute = get("-date-picker-btn-minute");
                    el.minuteBtn = el.minute.children[0];
                    el.second = get("-date-picker-btn-second");
                    el.secondBtn = el.second.children[0];
                    el.confirm = get("-date-picker-btn-confirm");
                break;
                case 2:
                    el.selectHead = get("-d-p-select-head");
                    el.selectMain = get("-d-p-select-main");
                    el.backBtn = get("-date-picker-btn-back");
                break;
                case 3:
                    el.touchBox = get("-d-p-select-year");
                    el.yearDrag = get("-d-p-select-year-touch");
                    el.monthBtns = getClassEl(div, "-d-p-s-month");
                    el.monthBox = el.monthBtns[0].parentElement;
                break;
                case 4:
                    el.yearRnage = get("-d-p-select-year-range");
                    el.prevYear = get("-d-p-s-year-prev");
                    el.nextYear = get("-d-p-s-year-next");
                    el.yearBox = get("-d-p-s-y-box");
                break;
            }
            if (!this.state.step) this.state.step = {};
            if (!this.state.step[step]) this.initEvent(step);
            this.state.step[step] = true;
         },
        // 初始化默认事件
        initEvent: function (step) {
            var l = eventListener;
            var el = this.doms;
            switch (step) {
                case 0:
                    // l(w, "blur", this.blurPicker.bind(this));
                    l(w, "resize", this.reSize.bind(this));
                    // l(d, "mousedown", this.blurPicker.bind(this));
                    // l(d, "touchstart", this.blurPicker.bind(this));
                    l(el.box, "touchmove", this.disabledEvent);
                break;
                case 1:
                    var dayBox = el.dayBox;
                    l(el.btnBox, "click", this.clickEv.bind(this, el.btnBox));
                    l(el.prevMonth, "click", this.prevMonth.bind(this));
                    l(el.nextMonth, "click", this.nextMonth.bind(this));
                    l(el.today, "click", this.clickEv.bind(this, el.today));
                    l(el.yesterday, "click", this.clickEv.bind(this, el.yesterday));
                    l(el.lastweek, "click", this.clickEv.bind(this, el.lastweek));
                    l(el.lastmonth, "click", this.clickEv.bind(this, el.lastmonth));
                    l(el.hour, "click", this.clickEv.bind(this, el.hour));
                    l(el.minute, "click", this.clickEv.bind(this, el.minute));
                    l(el.second, "click", this.clickEv.bind(this, el.second));
                    l(el.confirm, "click", this.clickEv.bind(this, el.confirm));
                    l(dayBox, "click", this.clickEv.bind(this, dayBox));
                    l(dayBox, "touchstart", this.touchS.bind(this, dayBox));
                    l(dayBox, "touchmove", this.touchM.bind(this, dayBox));
                    l(dayBox, "touchend", this.touchE.bind(this, dayBox));
                    l(dayBox, "touchcancel", this.touchE.bind(this, dayBox));
                    if (this.isFF) {
                        l(dayBox, "DOMMouseScroll", this.mouseW.bind(this, dayBox));
                    } else {
                        l(dayBox, "mousewheel", this.mouseW.bind(this, dayBox));
                    }
                break;
                case 2:
                    l(el.backBtn, "click", this.back.bind(this));
                break;
                case 3:
                    var yearDrag = el.yearDrag;
                    l(el.monthBox, "click", this.clickEv.bind(this, el.monthBox));
                    l(yearDrag, "click", this.clickEv.bind(this, yearDrag));
                    l(yearDrag, "touchstart", this.touchS.bind(this, yearDrag));
                    l(yearDrag, "touchmove", this.touchM.bind(this, yearDrag));
                    l(yearDrag, "touchend", this.touchE.bind(this, yearDrag));
                    l(yearDrag, "touchcancel", this.touchE.bind(this, yearDrag));
                    if (this.isFF) {
                        l(yearDrag, "DOMMouseScroll", this.mouseW.bind(this, yearDrag));
                    } else {
                        l(yearDrag, "mousewheel", this.mouseW.bind(this, yearDrag));
                    }
                break;
                case 4:
                    var yearBox = el.yearBox;
                    l(el.yearBox, "click", this.clickEv.bind(this, el.yearBox));
                    l(el.prevYear, "click", this.clickEv.bind(this, el.prevYear));
                    l(el.nextYear, "click", this.clickEv.bind(this, el.nextYear));
                    l(yearBox, "touchstart", this.touchS.bind(this, yearBox));
                    l(yearBox, "touchmove", this.touchM.bind(this, yearBox));
                    l(yearBox, "touchend", this.touchE.bind(this, yearBox));
                    l(yearBox, "touchcancel", this.touchE.bind(this, yearBox));
                    if (this.isFF) {
                        l(yearBox, "DOMMouseScroll", this.mouseW.bind(this, yearBox));
                    } else {
                        l(yearBox, "mousewheel", this.mouseW.bind(this, yearBox));
                    }
                break;
            }
         },
        // 窗口大小改变
        reSize: function () {
            var div = this.doms.box;
            div.style.visibility = "hidden";
            display(div, "block");
            this.state.boxWidth = div.offsetWidth;
            this.state.boxHeight = div.offsetHeight;
            display(div, "none");
            div.style.visibility = "visible";
         },
        // 刷新
        refresh: function () {
            for (var key in this.datas) {
                this.set(this.datas[key].el);
            }
         },
        // 清除默认事件
        disabledEvent: function (e) {
            e = e || w.event;
            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) event.stopPropagation();
            return false;
         },
        // 选择器失去焦点
        blurPicker: function (e) {
            e = e || w.event;
            var hide = true;
            if (e.target != w) {
                var a = closest(e.target, ".-date-picker"),
                    b = closest(e.target, "input");
                if (a) {
                    hide = false;
                } else if (b){
                    for (var key in this.datas) {
                        if (this.datas[key].el === b) {
                            hide = false;
                            break;
                        }
                    }
                }
            }
            if (hide) {
                this.hidePicker();
                this.endSelect();
            }
         },
        // 隐藏选择器
        hidePicker: function () {
            display(this.doms.box, "none");
            this.state.cY = 0;
            this.state.date = u;
            this.state.focus = u;
            this.maxDate = u;
            this.minDate = u;
         },
        // 初始化默认输入框
        initInputs: function () {
            var objs = {};
            var inputs = getClassEl(d, "datepicker");
            for (var i = 0; i < inputs.length; i++) {
                var el = inputs[i];
                if (this.isInput(el)) {
                    eventListener(el, "focus", this.showPicker.bind(this, el));
                    var op = {
                        min: el.getAttribute("min"),
                        max: el.getAttribute("max"),
                        bind: el.getAttribute("bind"),
                        range: el.getAttribute("range"),
                        format: this.initFormat(el.getAttribute("format")),
                        offset: elOffset(el)
                    }
                    if (op.min && op.min != "now" && typeof(op.min) == "string" && !op.min.match(/[YMD]\d+(?!\d)/g)) op.min = this.judgeDateStr(op.min, op.format);
                    if (op.max && op.max != "now" && typeof(op.max) == "string" && !op.max.match(/[YMD]\d+(?!\d)/g)) op.max = this.judgeDateStr(op.max, op.format);
                    if (op.range && op.bind && op.range == "start" || op.range == "end") {
                        if (!objs[op.bind]) objs[op.bind] = {};
                        if (!objs[op.bind][op.range]) objs[op.bind][op.range] = {
                            el: el,
                            op: op
                        }
                    } else {
                        this.setInput(el, op);
                    }
                }
            }
            for (var key in objs){
                var obj = objs[key];
                if (obj.start && obj.end) {
                    var op = {
                        min: obj.end.op.min || obj.start.op.min,
                        max: obj.end.op.max || obj.start.op.max,
                        format: obj.end.op.format || obj.start.op.format
                    }
                    op.bindElId = obj.end.el.bindId;
                    op.range = "start";
                    op.offset = obj.start.offset;
                    this.setInput(obj.start.el, op);
                    op.bindElId = obj.start.el.bindId;
                    op.range = "end";
                    op.offset = obj.end.offset;
                    this.setInput(obj.end.el, op);
                } else {
                    var o = obj.start || obj.end;
                    o.op.range = "self";
                    this.setInput(o.el, o.op);
                }
            }
         },
        // 判断是否输入框
        isInput: function (el) {
            if (el && el.nodeType && el.nodeType == 1 && el.nodeName.toLowerCase() == "input") return true;
            return false;
         },
        // 绑定输入框与参数
        setInput: function (el, op) {
            if (!el.bindId) el.bindId = (++this.maxId);
            var id = el.bindId;
            if (!this.datas[id]) this.datas[id] = {el: el};
            for (var key in op) { this.datas[id][key] = op[key]; }
            el.type = "text";
         },
        // 判断时间格式
        initFormat: function (str) {
            var defStr = this.format || {str: "YYYY-MM-DD"};
            if (typeof str != "string") return defStr;
            if (!(/\d/.test(str))) {
                var obj = {str: str};
                if (/YYYY(?!Y)/.test(str)) obj.Y = true;
                if (/MM(?!M)/.test(str)) obj.M = true;
                if (/DD(?!D)/.test(str)) obj.D = true;
                if (/hh(?!h)/.test(str)) obj.h = true;
                if (/mm(?!m)/.test(str)) obj.m = true;
                if (/ss(?!s)/.test(str)) obj.s = true;
                return obj;
            } else {
                return defStr;
            }
         },
        // 显示选择器
        showPicker: function (el) {
            if (!el || !el.bindId) return;
            el.blur();
            if (!this.check[el.bindId]) this.check[el.bindId] = {};
            this.endSelect();
            this.state.focus = this.datas[el.bindId];
            this.state.date = this.getDate();
            this.judgeRange();
            var top = this.initPicker();
            display(this.doms.box, "block");
            w.scrollTo(0, top);
         },
        // 结束选择
        endSelect: function () {

         },
        // 重置选择器
        initPicker: function () {
            var state = this.state;
            var date = state.date;
            var focus = state.focus;
            var format = focus.format || this.format;
            var el = this.doms;
            var div = el.box;
            var point = el.point;

            if (format.D || format.h || format.m || format.s) {
                className(div, "-date-picker");
                this.setCurrent(date.Y, date.M);
                if (format.h || format.m || format.s) {
                    display([el.hour, el.minute, el.second, el.confirm], "inline-block");
                    display([el.today, el.yesterday, el.lastweek, el.lastmonth], "none");
                    el.hourBtn.innerText = date.hs;
                    el.minuteBtn.innerText = date.ms;
                    el.secondBtn.innerText = date.ss;
                    this.type = 4;
                } else {
                    display([el.hour, el.minute, el.second, el.confirm], "none");
                    display([el.today, el.yesterday, el.lastweek, el.lastmonth], "inline-block");
                    var ms = date.d - this.minDate.d;
                    className([el.today, el.yesterday, el.lastweek, el.lastmonth], "un");
                    if (ms > 0) {
                        className(el.today, "");
                        ms -= (date.h * 3600000 + date.m * 60000 + date.s * 1000 + date.d.getMilliseconds());
                        if (ms > 0) {
                            className(el.yesterday, "");
                            if (focus.range) {
                                if (ms - date.w * 86400000 > 0) {
                                    className(el.lastweek, "");
                                }
                                if (ms - date.D * 86400000 > 0) {
                                    className(el.lastmonth, "");
                                }
                            }
                        }
                    }
                    this.type = 3;
                }
            } else {
                if (format.M) {
                    this.showMonthBox();
                    this.type = 2;
                } else {
                    this.showYearBox();
                    this.type = 1;
                }
            }


            var oT = focus.offset.top,
                oH = focus.offset.height,
                oL = focus.offset.left,
                oW = focus.offset.width;
            div.style.top = oT + oH + "px";
            if (oL + state.boxWidth > w.innerWidth) {
                div.style.left = w.innerWidth - state.boxWidth + "px";
                point.style.left = oL - w.innerWidth + state.boxWidth + 15 + "px";
            } else {
                div.style.left = oL + "px";
                point.style.left = "10%";
            }
            var o = w.innerHeight - state.boxHeight - oH;
            return oT - o;
         },
        // 获取自定义时间对象
        getDate: function (str) {
            var date = str ? new Date(str) : new Date();
            var obj = {
                d: date,
                Y: date.getFullYear(),
                M: date.getMonth() + 1,
                D: date.getDate(),
                w: date.getDay() || 7,
                h: date.getHours(),
                m: date.getMinutes(),
                s: date.getSeconds()
            }
            obj.Ms = this.toFiexd(obj.M);
            obj.Ds = this.toFiexd(obj.D);
            obj.hs = this.toFiexd(obj.h);
            obj.ms = this.toFiexd(obj.m);
            obj.ss = this.toFiexd(obj.s);
            return obj;
         },
        // 不足两位前面补零
        toFiexd: function (num) { return num > 9 ? num : ("0" + num) },
        // 判断选择日期区间
        judgeRange: function () {
            var focus = this.state.focus;
            if (!focus.min) {
                this.minDate = this.judgeDateStr("Y5");
            } else if (typeof focus.min == "string") {
                this.minDate = this.judgeDateStr(focus.min);
            } else {
                this.minDate = focus.min;
            }
            if (!focus.max) {
                this.maxDate = this.judgeDateStr("Y5", 1);
            } else if (typeof focus.max == "string") {
                this.maxDate = this.judgeDateStr(focus.max, 1);
            } else {
                this.maxDate = focus.max;
            }
         },
        // 判断时间字符转化为对象
        judgeDateStr: function (str, format) {
            if (str == "now") return this.getDate();
            var arr = str.match(/[YMD]\d+(?!\d)/g);
            if (arr) {
                var obj = {};
                for (var i = 0; i < arr.length; i++) {
                    obj[arr[i].match(/[YMD]/)[0]] = ~~(arr[i].match(/\d+/)[0]);
                }
                if (!format) {
                    for (var key in obj) {
                        obj[key] = -(obj[key]);
                    }
                }
                return this.judgeDate(obj);
            }
            var obj = this.initDate(str, format);
            if (obj) return this.getDate(obj.str);
            return false;
         },
        // 根据时间差返回对象
        judgeDate: function (obj, date) {
            date = date || this.getDate();
            if (obj.D) date.d.setDate(date.D + obj.D);
            if (obj.M) date.d.setMonth(date.M + obj.M - 1);
            if (obj.Y) date.d.setFullYear(date.Y + obj.Y);
            return this.getDate(date.d.getTime());
         },
        // 判断月份包含天数
        judgeDay: function (Y, M) {
            if (M == 13) {
                Y++;
                M = 1;
            }
            if (M == 0) {
                Y--;
                M = 12;
            }
            if (M != 2) return this.day[M-1];
            if (Y % 4) return this.day[1][0];
            return this.day[1][1];
         },
        // 重置时间串格式
        initDate: function (str, format) {
            format = format || this.format;
            var defArr = format.str
                .replace(/YYYY(?!Y)/, 0)
                .replace(/MM(?!M)/, 1)
                .replace(/DD(?!D)/, 2)
                .replace(/hh(?!h)/, 3)
                .replace(/mm(?!m)/, 4)
                .replace(/ss(?!s)/, 5)
                .replace(/\D/g, " ")
                .split(" ");
            var arr = str.replace(/\D/g, " ").split(" ");
            var newArr = [];
            for (var i = 0; i < arr.length; i++) {
                if (defArr[i]) newArr[defArr[i]] = arr[i];
            }
            if (newArr[0] == u || newArr[1] == u || newArr[2] == u) return false;
            str = newArr[0] + "/" + newArr[1] + "/" + newArr[2];
            if (newArr[3] != u) {
                str += " ";
                str += newArr[3];
                if (!newArr[4]) newArr[4] = "00";
                str += ":";
                str += newArr[4];
                if (!newArr[5]) newArr[5] = "00";
                str += ":";
                str += newArr[5];
            }
            return {arr: newArr, str: str}
         },
        // 拼接时间串
        mosaicDateStr: function (obj, format) {
            format = format || this.format;
            return format.str
                .replace(/YYYY(?!Y)/, obj.Y)
                .replace(/MM(?!M)/, this.toFiexd(obj.M))
                .replace(/DD(?!D)/, this.toFiexd(obj.D))
                .replace(/hh(?!h)/, this.toFiexd(obj.h))
                .replace(/mm(?!m)/, this.toFiexd(obj.m))
                .replace(/ss(?!s)/, this.toFiexd(obj.s));
         },
        // 比较两个时间大小
        sortDate: function (a, b, format) {
            format = format || this.format;
            var max, min;
            var _a = new Date(this.initDate(a, format).str),
                _b = new Date(this.initDate(b, format).str);
            if (_a > _b) {
                max = a;
                min = b;
            } else {
                max = b;
                min = a;
            }
            return {max: max, min: min}
         },
        // 设置选择年月的按钮的内容
        setBtnMsg: function (Y, M) { this.doms.btn.innerHTML = Y + "年" + this.toFiexd(M) + "月" },
        // 设置当前年月
        setCurrent: function (Y, M) {
            if (!this.state.step[1]) this.createDayBox();
            this.state.Y = Y;
            this.state.M = M;
            this.setBtnMsg(Y, M);
            this.showMonth(Y, M);
            this.doms.year.setAttribute("data-month", M - 1);
            this.showMonth(Y, M + 1);
            this.showMonth(Y, M - 1);
         },
        // 显示当前月份
        showMonth: function (Y, M) {
            if (M < 1 || M > 12) return false;
            var months = this.doms.months,
                state = this.state,
                focus = state.focus,
                el = focus.el,
                id = el.bindId,
                _id = el.bindElId,
                check = this.check[id] || {}, 
                // _check = this.check[_id] || {},
                btns, D, un;
            months[M - 1].innerHTML = this.mosaicMonth(Y, M);
            btns = getClassEl(months[M - 1], "-date-picker-date");
            if (Y == state.Y && M == state.M) state.btns = btns;
            for (var i = 0; i < 42; i++) {
                D = ~~btns[i].innerText;
                un = hasClass(btns[i], "un");
                if (Y == check.Y && M == check.M && check.D == D && !un) addClass(btns[i], "active");
            }
         },
        // 拼接月份
        mosaicMonth: function (Y, M) {
            if (!this.cache[Y]) this.cache[Y] = {};
            if (!this.cache[Y][M]) {
                var date = this.getDate(Y + "/" + M);
                var str = "<div class='-bg-month'>"+M+"</div>";
                var len = date.w;
                var num = this.judgeDay(Y, M);
                var prevNum = this.judgeDay(Y, M - 1);
                str += this.mosaicDay(len, prevNum - len);
                str += this.mosaicDay(num);
                len += num;
                str += this.mosaicDay(42 - len);
                this.cache[Y][M] = str;
                return str;
            }
            return this.cache[Y][M];
         },
        // 拼接日期
        mosaicDay: function (len, start) {
            var date = this.getDate();
            var str = "";
            start = start || 0;
            for (var i = 0; i < len; i++) {
                str += "<button class='-date-picker-date";
                if (len < 28 || start > 0) {
                    str += " un' data-skip='";
                    if (start > 0) {
                        str += "prev";
                    } else {
                        str += "next";
                    }
                }
                str += "'>";
                if (i + start < 9) str += "&ensp;";
                str += (i + start + 1);
                str += "</button>";
            }
            return str;
         },
        // 上一月
        prevMonth: function () {
            var Y = this.state.Y, M = this.state.M;
            if (M == 1) {
                Y--;
                M = 13;
                this.setDayBoxCss();
            } else {
                this.setDayBoxCss(0);
            }
            this.setCurrent(Y, M - 1);
         },
        // 下一月
        nextMonth: function () {
            var Y = this.state.Y, M = this.state.M;
            if (M == 12) {
                Y++;
                M = 0;
                this.setDayBoxCss();
            } else {
                this.setDayBoxCss(0);
            }
            this.setCurrent(Y, M + 1);
         },
        // 设置日期容器的CSS
        setDayBoxCss: function (t) {
            var yearEl = this.doms.year;
            if (typeof t == "number") {
                if (t == 0) {
                    yearEl.style.cssText = "transition:transform 300ms;";
                } else {
                    t = -t;
                    yearEl.style.cssText = "-webkit-transform: translateY("+t+"px) translateZ(0);-moz-transform: translateY("+t+"px) translateZ(0);-ms-transform: translateY("+t+"px) translateZ(0);-o-transform: translateY("+t+"px) translateZ(0);transform: translateY("+t+"px) translateZ(0);";
                }
            } else {
                yearEl.style.cssText = "";
            }
         },
        // 显示月份选择
        showMonthBox: function () {
            if (!this.state.step[3]) this.createMonthBox();
            var el = this.doms,
                minDate = this.minDate,
                maxDate = this.maxDate,
                min = minDate.Y - 4,
                max = maxDate.Y + 4,
                Y = this.state.cY || this.state.Y || this.getDate().Y,
                html = "";
            for (var i = min; i <= max; i++) {
                html += "<button class='-d-p-s-y'";
                if (i < minDate.Y || i > maxDate.Y) html += " style='color:#999'";
                html += ">";
                html += i;
                html += "</button>";
            }
            el.touchBox.innerHTML = html;
            this.setMonthBox(Y);
            this.state.cY = Y;
            className(el.box, "-date-picker -month");
         },
        // 设置月份选择容器
        setMonthBox: function (Y) {
            Y = Y || 0;
            var minDate = this.minDate,
                maxDate = this.maxDate;
            Y = Y < minDate.Y ? minDate.Y : (Y > maxDate.Y ? maxDate.Y : Y);
            var el = this.doms,
                p = Y - minDate.Y + 4,
                div = el.touchBox;
            el.yearDrag.setAttribute("data-jump", p);
            p *= -1;
            div.style.cssText = "\
                transition:left 300ms;\
                -webkit-transform: translateZ(0);\
                -moz-transform: translateZ(0);\
                -ms-transform: translateZ(0);\
                -o-transform: translateZ(0);\
                transform: translateZ(0);\
                left: "+p+"00%;";
            el.yearDrag.setAttribute("data-year", Y);
            this.state.cY = Y;
            if (Y == minDate.Y) {
                for (var i = 0; i < 12; i++) {
                    if (i + 1 < minDate.M) {
                        className(el.monthBtns[i], "-d-p-s-month un");
                    } else {
                        className(el.monthBtns[i], "-d-p-s-month");
                    }
                }
                return;
            }
            if (Y == maxDate.Y) {
                for (var i = 0; i < 12; i++) {
                    if (i + 1 > maxDate.M) {
                        className(el.monthBtns[i], "-d-p-s-month un");
                    } else {
                        className(el.monthBtns[i], "-d-p-s-month");
                    }
                }
                return;
            }
            className(el.monthBtns, "-d-p-s-month");
         },
        // 显示年份选择
        showYearBox: function () {
            if (!this.state.step[4]) this.createYearBox();
            var minDate = this.minDate,
                maxDate = this.maxDate,
                min = minDate.Y - 4,
                max = maxDate.Y + 4,
                Y = this.state.cY || this.state.Y || this.getDate().Y,
                el = this.doms,
                head = el.yearRnage,
                main = el.yearBox,
                html = "", c, row;
            head.innerText = minDate.Y + " - " + maxDate.Y;
            c = max - min;
            if (c < 12) {
                max += (12 - c);
            } else {
                c = c % 3;
                c = c || 3;
                max += (3 - c);
            }
            for (var i = min; i < max; i++) {
                html += "<button class='-d-p-s-year";
                if (i < minDate.Y || i > maxDate.Y) {
                    html += " un";
                } else if (i == Y) {
                    html += " in";
                }
                html += "' data-year='";
                html += i;
                html += "'>";
                html += i;
                html += "</button>";
            }
            main.innerHTML = html;
            row = ~~((Y - min) / 3) - 1;
            this.setYearBox(row, 1);
            this.state.cY = Y;
            className(el.box, "-date-picker -year");
         },
        // 设置年份选择容器
        setYearBox: function (row, t) {
            var cssText = "", max;
            if (t) {
                cssText += "transition:transform 300ms;";
                max = this.doms.yearBox.childNodes.length / 3 - 4;
                row = row < 0 ? 0 : (row > max ? max : row);
            }
            this.doms.yearBox.setAttribute("data-row", row);
            row *=  -25;
            cssText += "\
                -webkit-transform:translateY(" + row + "%) translateZ(0);\
                -moz-transform:translateY(" + row + "%) translateZ(0);\
                -ms-transform:translateY(" + row + "%) translateZ(0);\
                -o-transform:translateY(" + row + "%) translateZ(0);\
                transform:translateY(" + row + "%) translateZ(0);";
            this.doms.yearBox.style.cssText = cssText;
         },
        // 触摸拖动事件
        touchS: function (tg, e) {
            e = e || w.event;
            var data = event.touches[0];
            var el = this.doms;
            switch (tg) {
                case el.dayBox:
                    this.touch = {
                        sy: data.clientY,
                        my: data.clientY,
                        bh: el.dayBox.offsetHeight
                    }
                break;
                case el.yearDrag:
                    this.touch = {
                        Y: ~~el.yearDrag.getAttribute("data-year"),
                        j: ~~el.yearDrag.getAttribute("data-jump"),
                        sx: data.clientX,
                        mx: data.clientX,
                        bw: el.touchBox.offsetWidth
                    }
                break;
                case el.yearBox:
                    this.touch = {
                        sy: data.clientY,
                        my: data.clientY,
                        ro: ~~el.yearBox.getAttribute("data-row"),
                        bh: el.yearBox.offsetHeight / 4
                    }
                break;
            }
            return false;
         },
        touchM: function (tg, e) {
            e = e || w.event;
            var el = this.doms;
            switch (tg) {
                case el.dayBox:
                    var M = this.state.M - 1,
                        my = e.touches[0].clientY;
                    this.touch.my = my;
                    this.setDayBoxCss(M * this.touch.bh + this.touch.sy - my);
                break;
                case el.yearDrag:
                    var mx = e.touches[0].clientX, touch = this.touch;
                    touch.mx = mx;
                    el.touchBox.style.cssText = "left:" + (((touch.sx - mx) / touch.bw + touch.j) * -100) + "%;";
                break;
                case el.yearBox:
                    var my = e.touches[0].clientY, touch = this.touch;
                    this.touch.my = my;
                    this.setYearBox((touch.sy - my) / touch.bh + touch.ro);
                break;
            }
            return false;
         },
        touchE: function (tg, e) {
            e = e || w.event;
            var data = this.touch;
            var el = this.doms;
            switch (tg) {
                case el.dayBox:
                    if (data.my === data.sy) return false;
                    var cy = data.my - data.sy,
                        skip = (Math.abs(cy) >= (data.bh / 4) ? true : false);
                    if (skip) {
                        if (cy > 0) {
                            this.prevMonth();
                        } else if (cy < 0) {
                            this.nextMonth();
                        }
                    } else {
                        this.setDayBoxCss(0);
                    }
                break;
                case el.yearDrag:
                    if (data.mx === data.sx) return false;
                    var Y = data.Y + ((data.sx - data.mx) / data.bw);
                    if (Y % 1 >= .5) Y++;
                    this.setMonthBox(~~Y);
                break;
                case el.yearBox:
                    if (data.my === data.sy) return false;
                    var row = (data.sy - data.my) / data.bh + data.ro;
                    if (row % 1 >= .5) row++;
                    this.setYearBox(~~row, 1);
                break;
            }
            return false;
         },
        // 鼠标滚动事件
        mouseW: function (tg, e) {
            if (this.state.wheel) return false;
            this.state.wheel = true;
            e = e || w.event;
            this.disabledEvent(e);
            var el = this.doms;
            if (this.isFF) {
                if (e.detail > 0) {
                    switch (tg) {
                        case el.dayBox:
                            this.nextMonth();
                        break;
                        case el.yearDrag:
                            this.setMonthBox(~~tg.getAttribute("data-year") + 1);
                        break;
                        case el.yearBox:
                            this.setYearBox(~~tg.getAttribute("data-row") + 1, 1);
                        break;
                    }
                } else {
                    switch (tg) {
                        case el.dayBox:
                            this.prevMonth();
                        break;
                        case el.yearDrag:
                            this.setMonthBox(tg.getAttribute("data-year") - 1);
                        break;
                        case el.yearBox:
                            this.setYearBox(tg.getAttribute("data-row") - 1, 1);
                        break;
                    }
                }
            } else {
                if (e.wheelDelta > 0) {
                    switch (tg) {
                        case el.dayBox:
                            this.prevMonth();
                        break;
                        case el.yearDrag:
                            this.setMonthBox(tg.getAttribute("data-year") - 1);
                        break;
                        case el.yearBox:
                            this.setYearBox(tg.getAttribute("data-row") - 1, 1);
                        break;
                    }
                } else {
                    switch (tg) {
                        case el.dayBox:
                            this.nextMonth();
                        break;
                        case el.yearDrag:
                            this.setMonthBox(~~tg.getAttribute("data-year") + 1);
                        break;
                        case el.yearBox:
                            this.setYearBox(~~tg.getAttribute("data-row") + 1, 1);
                        break;
                    }
                }
            }
            this.state.wheel = false;
            return false;
         },
        // 点击事件
        clickEv: function (tg, e) {
            e = e || w.event;
            this.disabledEvent(e);
            var el = this.doms;
            switch (tg) {
                case el.btnBox:
                    this.showMonthBox();
                break;
                case el.yearDrag:
                    this.showYearBox();
                break;
                case el.today:
                    this.hidePicker();
                break;
                case el.yesterday:
                    this.hidePicker();
                break;
                case el.lastweek:
                    this.hidePicker();
                break;
                case el.lastmonth:
                    this.hidePicker();
                break;
                case el.hour:
                    this.hidePicker();
                break;
                case el.minute:
                    this.hidePicker();
                break;
                case el.second:
                    this.hidePicker();
                break;
                case el.confirm:
                    this.hidePicker();
                break;
                case el.dayBox:
                    var btn = closest(e.target, ".-date-picker-date");
                    if (!btn) return false;
                    var txt = btn.innerText;
                    if (hasClass(btn, "un")) {
                        var skip = btn.getAttribute("data-skip");
                        if (skip) {
                            var M = this.state.M;
                            this[skip + "Month"]();
                            if (M != this.state.M) {
                                M = this.state.M - 1;
                                var btns = getClassEl(this.doms.months[M], "-date-picker-date");
                                var checked;
                                for (var i = 0; i < 42; i++) {
                                    if (!hasClass(btns[i], "un") && btns[i].innerText == txt) {
                                        checked = btns[i];
                                        break;
                                    }
                                }
                                if (checked) initEvent(checked, "click");
                            }
                        }
                    } else {
                        var state = this.state,
                            D = ~~txt,
                            focus = state.focus,
                            id = focus.el.bindId,
                            check = this.check[id];
                        check.Y = state.Y;
                        check.M = state.M;
                        check.D = D;
                        addClass(btn, "active");
                        if (this.type == 3) {
                            var val, obj,
                                str = this.mosaicDateStr({
                                    Y: check.Y,
                                    M: check.M,
                                    D: D
                                }, focus.format);
                            focus.el.value = str;
                            if (focus.range) {
                                if (focus.el.bindElId) {

                                } else {

                                }
                            } else {
                                val = str;
                                obj = {value: str};
                                this.hidePicker();
                            }
                            this.api.value = str;
                            this.callback(obj);
                        }
                    }
                break;
                case el.prevYear:
                    this.setYearBox(el.yearBox.getAttribute("data-row") - 1, 1);
                break;
                case el.nextYear:
                    this.setYearBox(~~el.yearBox.getAttribute("data-row") + 1, 1);
                break;
                case el.monthBox:
                    var btn = closest(e.target, ".-d-p-s-month");
                    if (!btn || btn.className == "-d-p-s-month un") return false;
                    var M = ~~btn.getAttribute("data-month"),
                        foc = this.state.focus;
                    if (this.type > 2) {
                        this.setCurrent(this.state.cY, M);
                    } else {
                        foc.el.value = this.mosaicDateStr({Y: this.state.cY, M: M}, foc.format);
                    }
                    this.back();
                break;
                case el.yearBox:
                    var btn = closest(e.target, ".-d-p-s-year");
                    if (!btn || btn.className == "-d-p-s-year un") return false;
                    var Y = ~~btn.getAttribute("data-year"),
                        foc = this.state.focus;
                    if (this.type > 1) {
                        this.setMonthBox(Y);
                    } else {
                        foc.el.value = this.mosaicDateStr({Y: Y}, foc.format);
                    }
                    this.back();
                break;
            }
            return false;
         },
        // 返回上一级
        back: function () {
            var div = this.doms.box,
                str = div.className,
                typ = this.type;
            switch (str) {
                case "-date-picker -month":
                    if (typ > 2) {
                        className(div, "-date-picker");
                        this.state.cY = 0;
                    } else {
                        this.hidePicker();
                    }
                break;
                case "-date-picker -year":
                    if (typ > 1) {
                        className(div, "-date-picker -month");
                    } else {
                        this.hidePicker();
                    }
                break;
                case "-date-picker":
                    this.hidePicker();
                break;
            }
         },
        // 回调
        callback: function (data) {
            if (this.api.callback instanceof Function)
            this.api.callback(data);
         }












    }
    w.DatePicker = DatePicker;
})(window,document);