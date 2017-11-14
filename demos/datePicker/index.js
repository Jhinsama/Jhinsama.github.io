(function (w, u) {
    "use strict";
    if (!!w.datePicker) return;
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
                target[type + handle] = function () {target["e" + type + handle](window.event);};
                target.attachEvent("on" + type, target[type + handle]);
            } else {
                target["on" + type] = handle;
            }
        }
    }
    function getElementsByClassName (target, className) {
        if (target.getElementsByClassName) {
            return target.getElementsByClassName(className);
        } else {
            var result = [];
            var tags = target.getElementsByTagName("*");
            for (var i = 0; i < tags.length; i++) {
                var classNames = tags[i].className.split(" ");
                for (var l = 0; l < classNames.length; l++) {
                    if (classNames[l] === className) {
                        result.push(tags[i]);
                        break;
                    }
                }
            }
            return result;
        }
    }
    function addClass (target, className) {
        if (!target.className) return target.className = className;
        var classNames = target.className.split(" ");
        var repeat = false;
        for (var i = 0; i < classNames.length; i++) {
            if (classNames[i] === className) repeat = true;
        }
        if (repeat) return;
        target.className += " " + className;
    }
    function removeClass (target, className) {
        if (!target.className || target.className == className) return target.className = "";
        var classNames = target.className.split(" ");
        for (var i = 0; i < classNames.length; i++) {
            if (classNames[i] === className) {
                classNames.splice(i, 1);
                target.className = classNames.join(" ");
            }
        }
    }
    function toggleClass (target, className) {
        if (!target.className) return target.className = className;
        var classNames = target.className.split(" ");
        var repeat = false;
        for (var i = 0; i < classNames.length; i++) {
            if (classNames[i] === className) {
                repeat = true;
                classNames.splice(i, 1);
            }
        }
        if (!repeat) classNames.push(className);
        target.className = classNames.join(" ");
    }
    function hasClass (target, className) {
        if (!target.className) return false;
        var has = false;
        var classNames = target.className.split(" ");
        for (var i = 0; i < classNames.length; i++) {
            if (classNames[i] === className) has = true;
        }
        return has;
    }
    function closest(el, selector) {
        var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
        while (el) {
            if (matchesSelector.call(el, selector)) {
                break;
            }
            el = el.parentElement;
        }
        return el;
    }
    function initEvent (element,event){
        if (document.createEventObject){
            var evt = document.createEventObject();
            return element.fireEvent('on' + event,evt);
        } else {
            var evt = document.createEvent( 'HTMLEvents' );
            evt.initEvent(event, true, true);
            return !element.dispatchEvent(evt);
        }
    }
    function elementOffset (element) {
        var offsetObj = {
            top: element.offsetTop,
            left: element.offsetLeft,
            width: element.offsetWdith,
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
    function datePicker () {
        this.join = "-";
        this.wW = w.innerWidth;
        this.wH = w.innerHeight;
        this.touchState = {};
        this.inputs = Array.prototype.slice.call(getElementsByClassName(document, "datepicker"),0);
        this.maxID = new Date().getTime();
        this.scrollEl = w;
        this._init();
    }
    datePicker.prototype = {
        set : function (input, options) {
            var obj = (options instanceof Object);
            if (input instanceof HTMLElement) {
                if (input.nodeName.toLowerCase() == "input") {
                    var repeat = false;
                    for (var i = 0; i < this.inputs.length; i++) {
                        if (this.inputs[i] === input) {
                            repeat = true;
                            break;
                        }
                    }
                    if (!repeat) {
                        eventListener(input, "focus", this._inputFocus.bind(this, input));
                        this.inputs.push(input);
                        input.type = "text";
                        if (obj) {
                            input.datePickerData = {
                                range : options.range || null,
                                min: options.min || null,
                                max: options.max || null,
                                bind: options.bind || null
                            }
                        }
                    } else {

                    }
                } else {
                    console.dir(input);
                }
            } else {
                try {
                    var len = input.length;
                    for (var i = 0; i < len; i++) {
                        var p = input[i];
                        if (p instanceof HTMLElement) {
                            if (p.nodeName.toLowerCase() == "input") {
                                var repeat = false;
                                for (var l = 0; l < this.inputs.length; l++) {
                                    if (this.inputs[l] === p) {
                                        repeat = true;
                                        break;
                                    }
                                }
                                if (!repeat) {
                                    eventListener(p, "focus", this._inputFocus.bind(this, p));
                                    this.inputs.push(p);
                                    p.type = "text";
                                    if (obj) {
                                        p.datePickerData = {
                                            range : options.range || null,
                                            min: options.min || null,
                                            max: options.max || null,
                                            bind: options.bind || null
                                        }
                                    }
                                } else {

                                }
                            } else {
                                console.dir(p);
                            }
                        } else {
                            console.dir(p);
                        }
                    }
                } catch (err) {
                    console.log("传入的元素或许不是输入框");
                }
            }
        },
        prev : function () {
            var month = this.currentMonth - 1;
            if (month < 0) {
                var year = this.currentYear - 1;
                if (year < this.min.year) return true;
                this.currentYear = year;
                this.yearBox.style.cssText = "";
                this.yearBox.innerHTML = "";
                this.currentMonth = 11;
                this.yearBox.setAttribute("data-month", 11);
                this._mosaicObj(this.currentYear);
            } else {
                if (this.currentYear <= this.min.year && month < this.min.month) return true;
                this.currentMonth = month;
                this.yearBox.style.cssText = "-webkit-transition:300ms;-moz-transition:300ms;-ms-transition:300ms;-o-transition:300ms;transition:300ms;";
                this.yearBox.setAttribute("data-month", this.currentMonth);
            }
            this.ymBtn.innerHTML = this.currentYear + "年" + (this.currentMonth < 9 ? ("0" + (this.currentMonth + 1)) : (this.currentMonth + 1)) + "月";
            return true;
        },
        next : function () {
            var month = this.currentMonth + 1;
            if (month > 11) {
                var year = this.currentYear + 1;
                if (year > this.max.year) return true;
                this.currentYear = year;
                this.yearBox.style.cssText = "";
                this.yearBox.innerHTML = "";
                this.currentMonth = 0;
                this.yearBox.setAttribute("data-month", 0);
                this._mosaicObj(this.currentYear);
            } else {
                if (this.currentYear >= this.max.year && month > this.max.month) return true;
                this.currentMonth = month;
                this.yearBox.style.cssText = "-webkit-transition:300ms;-moz-transition:300ms;-ms-transition:300ms;-o-transition:300ms;transition:300ms;";
                this.yearBox.setAttribute("data-month", this.currentMonth);
            }
            this.ymBtn.innerHTML = this.currentYear + "年" + (this.currentMonth < 9 ? ("0" + (this.currentMonth + 1)) : (this.currentMonth + 1)) + "月";
            return true;
        },
        _prev : function (n) {
            if (this.yearRangePosition == 0) {
                if (n) {
                    this.yearBtnBox.style.cssText = "-webkit-transition:300ms;-moz-transition:300ms;-ms-transition:300ms;-o-transition:300ms;transition:300ms;-webkit-transform: translateY(-"+this.yearRangePosition+"%) translateZ(0);-moz-transform: translateY(-"+this.yearRangePosition+"%) translateZ(0);-ms-transform: translateY(-"+this.yearRangePosition+"%) translateZ(0);-o-transform: translateY(-"+this.yearRangePosition+"%) translateZ(0);transform: translateY(-"+this.yearRangePosition+"%) translateZ(0);";
                } else {
                    return false;
                }
            }
            var n = n || 1;
            var c = this.yearRangePosition - n;
            c = c < 0 ? 0 : c;
            this.yearRangePosition = c;
            c = c * 25;
            this.yearBtnBox.style.cssText = "-webkit-transition:300ms;-moz-transition:300ms;-ms-transition:300ms;-o-transition:300ms;transition:300ms;-webkit-transform: translateY(-"+c+"%) translateZ(0);-moz-transform: translateY(-"+c+"%) translateZ(0);-ms-transform: translateY(-"+c+"%) translateZ(0);-o-transform: translateY(-"+c+"%) translateZ(0);transform: translateY(-"+c+"%) translateZ(0);";
        },
        _next : function (n) {
            var m = this.yearBtns.length / 3 - 4;
            if (this.yearRangePosition == m) {
                if (n) {
                    this.yearBtnBox.style.cssText = "-webkit-transition:300ms;-moz-transition:300ms;-ms-transition:300ms;-o-transition:300ms;transition:300ms;-webkit-transform: translateY(-"+this.yearRangePosition+"%) translateZ(0);-moz-transform: translateY(-"+this.yearRangePosition+"%) translateZ(0);-ms-transform: translateY(-"+this.yearRangePosition+"%) translateZ(0);-o-transform: translateY(-"+this.yearRangePosition+"%) translateZ(0);transform: translateY(-"+this.yearRangePosition+"%) translateZ(0);";
                } else {
                    return false;
                }
            }
            var n = n || 1;
            var c = this.yearRangePosition + n;
            c = c > m ? m : c;
            this.yearRangePosition = c;
            c = c * 25;
            this.yearBtnBox.style.cssText = "-webkit-transition:300ms;-moz-transition:300ms;-ms-transition:300ms;-o-transition:300ms;transition:300ms;-webkit-transform: translateY(-"+c+"%) translateZ(0);-moz-transform: translateY(-"+c+"%) translateZ(0);-ms-transform: translateY(-"+c+"%) translateZ(0);-o-transform: translateY(-"+c+"%) translateZ(0);transform: translateY(-"+c+"%) translateZ(0);";
        },
        _init : function () {
            this._initInputs();
            var date = new Date();
            this.currentYear = date.getFullYear();
            this.currentMonth = date.getMonth();
            this.day = {};
            if (this._create()) {
                this._getElement()._mosaicObj(this.currentYear);
                this._initEvent();
            }
        },
        _reSize : function () {
            this.wW = w.innerWidth;
            this.wH = w.innerHeight;

            this.datePicker.style.visibility = "hidden";
            this.datePicker.style.display = "block";

            this.datePickerW = this.datePicker.offsetWidth;
            this.datePickerH = this.datePicker.offsetHeight;

            this.datePicker.style.display = "none";
            this.datePicker.style.visibility = "visible";
        },
        _create : function () {
            var styleEl = document.createElement("style");
            styleEl.type = "text/css";
            styleEl.innerHTML = "";
            document.getElementsByTagName("head")[0].appendChild(styleEl);
            this.datePicker = document.createElement("div");
            this.datePicker.className = "-date-picker";
            this.datePicker.innerHTML = "<div class='-date-picker-point'><div class='-rotate45'></div></div><div class='-date-picker-main'><div class='-date-picker-foot'><div><div class='-date-picker-ym -d-p-middle'><button id='-date-picker-ym'>" + this.currentYear + "年" + (this.currentMonth < 9 ? ("0" + (this.currentMonth + 1)) : (this.currentMonth + 1)) + "月</button><span class='-dpcymt -rotate45'></span></div></div></div><div class='-date-picker-day'><div><div class='-date-picker-title'><span class='-d-p-middle'>日</span><span class='-d-p-middle'>一</span><span class='-d-p-middle'>二</span><span class='-d-p-middle'>三</span><span class='-d-p-middle'>四</span><span class='-d-p-middle'>五</span><span class='-d-p-middle'>六</span></div><div class='-date-picker-prev'><div class='-rotate45'></div></div><div class='-date-picker-box'><div id='-date-picker-year' data-month='" + this.currentMonth + "' style='-webkit-transition:300ms;-moz-transition:300ms;-ms-transition:300ms;-o-transition:300ms;transition:300ms;'></div></div><div class='-date-picker-next'><div class='-rotate45'></div></div></div></div><div class='-date-picker-btn'><div><div><button class='-date-picker-btn-tday'>今&emsp;天</button></div><div><button class='-date-picker-btn-ystday'>昨&emsp;天</button></div><div><button class='-date-picker-btn-lsweek'>上一周</button></div><div><button class='-date-picker-btn-lsmonth'>上一月</button></div></div></div><div class='-date-picker-select'><div class='-d-p-select-head'><div><div class='-d-p-select-year-touch'><div class='-d-p-select-left'></div><div class='-d-p-select-box'><div id='-d-p-select-year'></div></div><div class='-d-p-select-right'></div></div><button class='-d-p-select-year-range'></button></div></div><div class='-d-p-select-year-month'><div><div class='-d-p-s-year-box'><div class='-d-p-s-year-prev '><div class='-rotate45'></div></div><div class='-d-p-s-y-box'><div id='-d-p-s-y-box'></div></div><div class='-d-p-s-year-next'><div class='-rotate45'></div></div></div><div class='-d-p-s-month-box'><div class='-d-p-s-month' date-month='1'><div class='-d-p-middle'>一月<div class='-d-p-s-m-en'>Jan</div></div></div><div class='-d-p-s-month' date-month='2'><div class='-d-p-middle'>二月<div class='-d-p-s-m-en'>Fed</div></div></div><div class='-d-p-s-month' date-month='3'><div class='-d-p-middle'>三月<div class='-d-p-s-m-en'>Mar</div></div></div><div class='-d-p-s-month' date-month='4'><div class='-d-p-middle'>四月<div class='-d-p-s-m-en'>Apr</div></div></div><div class='-d-p-s-month' date-month='5'><div class='-d-p-middle'>五月<div class='-d-p-s-m-en'>May</div></div></div><div class='-d-p-s-month' date-month='6'><div class='-d-p-middle'>六月<div class='-d-p-s-m-en'>Jun</div></div></div><div class='-d-p-s-month' date-month='7'><div class='-d-p-middle'>七月<div class='-d-p-s-m-en'>Jul</div></div></div><div class='-d-p-s-month' date-month='8'><div class='-d-p-middle'>八月<div class='-d-p-s-m-en'>Aug</div></div></div><div class='-d-p-s-month' date-month='9'><div class='-d-p-middle'>九月<div class='-d-p-s-m-en'>Sep</div></div></div><div class='-d-p-s-month' date-month='10'><div class='-d-p-middle'>十月<div class='-d-p-s-m-en'>Oct</div></div></div><div class='-d-p-s-month' date-month='11'><div class='-d-p-middle'>十一月<div class='-d-p-s-m-en'>Nov</div></div></div><div class='-d-p-s-month' date-month='12'><div class='-d-p-middle'>十二月<div class='-d-p-s-m-en'>Dec</div></div></div></div></div></div></div></div>";
            document.body.appendChild(this.datePicker);
            this.datePickerW = this.datePicker.offsetWidth;
            this.datePickerH = this.datePicker.offsetHeight;
            this.datePicker.style.display = "none";
            return true;
        },
        _getElement : function () {
            this.point = getElementsByClassName(this.datePicker, "-date-picker-point")[0];
            this.yearMonth = getElementsByClassName(this.datePicker, "-date-picker-ym")[0];
            this.ymBtn = document.getElementById("-date-picker-ym");
            this.box = getElementsByClassName(this.datePicker, "-date-picker-box")[0];
            this.yearBox = document.getElementById("-date-picker-year");
            this.prevEl = getElementsByClassName(this.datePicker, "-date-picker-prev")[0];
            this.nextEl = getElementsByClassName(this.datePicker, "-date-picker-next")[0];
            this.today = getElementsByClassName(this.datePicker, "-date-picker-btn-tday")[0];
            this.yesterday = getElementsByClassName(this.datePicker, "-date-picker-btn-ystday")[0];
            this.lastWeek = getElementsByClassName(this.datePicker, "-date-picker-btn-lsweek")[0];
            this.lastMonth = getElementsByClassName(this.datePicker, "-date-picker-btn-lsmonth")[0];
            this.yearTouch = getElementsByClassName(this.datePicker, "-d-p-select-year-touch")[0];
            this.yearTouchInner = document.getElementById("-d-p-select-year");
            this.yearRange = getElementsByClassName(this.datePicker, "-d-p-select-year-range")[0];
            this.yearPrev = getElementsByClassName(this.datePicker, "-d-p-s-year-prev")[0];
            this.yearNext = getElementsByClassName(this.datePicker, "-d-p-s-year-next")[0];
            this.yearBtnBox = document.getElementById("-d-p-s-y-box");
            this.monthBtnBox = getElementsByClassName(this.datePicker, "-d-p-s-month-box")[0];
            this.monthBtns = getElementsByClassName(this.datePicker, "-d-p-s-month");
            return this;
        },
        _initPicker : function (input) {

            removeClass(this.datePicker, "-year");
            removeClass(this.datePicker, "-show");


            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth();
            var change = false;


            if (!this.dateCache) {
                if (year != this.currentYear) {
                    this.currentYear = year;
                    this._mosaicObj(year);
                    change = true;
                }
                if (month != this.currentMonth) {
                    this.currentMonth = month;
                    this.yearBox.setAttribute("data-month", month);
                    change = true;
                }
                if (change) {
                    this.ymBtn.innerHTML = this.currentYear + "年" + (this.currentMonth < 9 ? ("0" + (this.currentMonth + 1)) : (this.currentMonth + 1)) + "月";
                }
                if (input.datePickerData.range) {
                    removeClass(this.lastWeek, "un");
                    removeClass(this.lastMonth, "un");
                } else {
                    addClass(this.lastWeek, "un");
                    addClass(this.lastMonth, "un");
                }
            }



            var offset = elementOffset(input);
            var oT = offset.top, oH = offset.height, oL = offset.left, oW = offset.width;
            this.datePicker.style.top = oT + oH + "px";
            if (oL + this.datePickerW > this.wW) {
                this.datePicker.style.left = this.wW - this.datePickerW + "px";
                this.point.style.left = oL - this.wW + this.datePickerW + 15 + "px";
            } else {
                this.datePicker.style.left = oL + "px";
                this.point.style.left = "10%";
            }

            return offset;
        },
        _inputFocus : function (input) {
            input.blur();
            this._inputBlur(input);
            this.input = input;
            var offset = this._initPicker(input);
            this.datePicker.style.display = "block";

            var oT = offset.top, oH = offset.height, top;
            var o = this.wH - this.datePickerH - oH;
            if (this.scrollEl === w) {
                top = oT - o;
                w.scrollTo(0, top);
            } else {
                top = this.wH - this.datePickerH + this.scrollEl.scrollTop;
                this.scrollEl.scrollTop = top;
            }

            if (!this.dateCache) {
                var date = new Date();
                var min = input.datePickerData.min || "2008.01.01";
                var max = input.datePickerData.max;
                if (max) {
                    if (max == "now") max = (date.getFullYear()+"."+(date.getMonth()+1)+"."+date.getDate());
                } else {
                    max = (date.getFullYear() + 2 +".12.31");
                }
                if (min == "now") min = (date.getFullYear()+"."+(date.getMonth()+1)+"."+date.getDate());
                min = min.replace(/\D/g, ".").replace(".", "/").replace(".", "/").replace(".", " ").replace(".", ":").replace(".", ":");
                max = max.replace(/\D/g, ".").replace(".", "/").replace(".", "/").replace(".", " ").replace(".", ":").replace(".", ":");
                date = new Date(min);
                this.min = {
                    year : date.getFullYear(),
                    month : date.getMonth(),
                    day : date.getDate(),
                    hours : date.getHours(),
                    minute : date.getMinutes(),
                    second : date.getSeconds()
                };
                date = new Date(max);
                this.max = {
                    year : date.getFullYear(),
                    month : date.getMonth(),
                    day : date.getDate(),
                    hours : date.getHours(),
                    minute : date.getMinutes(),
                    second : date.getSeconds()
                };
            }

            return false;
        },
        _inputBlur : function (input) {
            if (this.dateCache) {
                if (this.dateCache.start && this.dateCache.end) {
                    if (this.dateCache.start != input && this.dateCache.end != input) {
                        var str;
                        if (this.dateCache.on == "start") {
                            var max = this.dateCache.end.datePickerData.max;
                            if (max == "now" || !max) {
                                var date = new Date();
                                str = this._mosaicStr(date.getFullYear(), date.getMonth(), date.getDate());
                            } else {
                                str = max.replace(".", this.join).replace(".", this.join).replace(".", " ").replace(".", ":").replace(".", ":");
                            }
                            this.dateCache.end.value = str;
                        } else {
                            var min = this.dateCache.end.datePickerData.min;
                            if (!min) {
                                str = this._mosaicStr(2008, 0, 1);
                            } else {
                                str = min.replace(".", this.join).replace(".", this.join).replace(".", " ").replace(".", ":").replace(".", ":");
                            }
                            this.dateCache.start.value = str;
                        }
                        this.dateCache = u;
                    }
                } else {
                    if (input != this.input) this.dateCache = u;
                }
            }
        },
        _disableEvent : function (event) {
            event = event || w.event;
            event.preventDefault();
            event.stopPropagation();
            return false;
        },
        _defaultTouch : function (event) {
            event = event || w.event;
            var a = closest(event.target, ".-date-picker");
            var b = closest(event.target, "input");
            var hide = true;
            if (b) {
                for (var i = 0; i < this.inputs.length; i++) {
                    if (this.inputs[i] === b) {
                        hide = false;
                        break;
                    }
                }
            }
            if (!a && hide) {
                this.datePicker.style.display = "none";
                this._inputBlur();
            }
        },
        _TouchS : function (target) {
            var event = event || w.event;
            this.touchState.startX = this.touchState.moveX = event.touches[0].clientX;
            this.touchState.startY = this.touchState.moveY = event.touches[0].clientY;
            if (target === this.box) return this.boxH = this.box.offsetHeight;
            if (target === this.yearTouch) return this.touchState.touchPosition = u;
            if (target === this.yearBtnBox) return this.touchState.touchPosition = u;
        },
        _TouchM : function (target) {
            var event = event || w.event;
            var x = event.touches[0].clientX;
            var y = event.touches[0].clientY;
            this.touchState.moveX = x;
            this.touchState.moveY = y;
            if (target === this.box) {
                var translateY = this.currentMonth * this.boxH + this.touchState.startY - y;
                this.yearBox.style.cssText = "-webkit-transform: translateY("+(-translateY)+"px) translateZ(0);-moz-transform: translateY("+(-translateY)+"px) translateZ(0);-ms-transform: translateY("+(-translateY)+"px) translateZ(0);-o-transform: translateY("+(-translateY)+"px) translateZ(0);transform: translateY("+(-translateY)+"px) translateZ(0);";
            } else if (target === this.yearTouch) {
                var left = this.yearTouchPosition + (this.touchState.startX - x) / this.yearTouchInner.offsetWidth;
                this.touchState.touchPosition = left;
                left = left * 100;
                this.yearTouchInner.style.cssText = "-webkit-transform: translateZ(0);-moz-transform: translateZ(0);-ms-transform: translateZ(0);-o-transform: translateZ(0);transform: translateZ(0);left: -"+left+"%;";
            } else {
                var translateY = this.yearRangePosition + (this.touchState.startY - y) / this.yearBtnBox.offsetHeight * 4;
                this.touchState.touchPosition = translateY;
                translateY = translateY * 25;
                this.yearBtnBox.style.cssText = "-webkit-transform: translateY("+(-translateY)+"%) translateZ(0);-moz-transform: translateY("+(-translateY)+"%) translateZ(0);-ms-transform: translateY("+(-translateY)+"%) translateZ(0);-o-transform: translateY("+(-translateY)+"%) translateZ(0);transform: translateY("+(-translateY)+"%) translateZ(0);";
            }
        },
        _TouchE : function (target) {
            if (target === this.box) {
                var _y = this.touchState.moveY - this.touchState.startY;
                var m = (Math.abs(_y) >= (this.boxH / 4) ? true : false);
                if (_y > 0) {
                    this.yearBox.style.cssText = "-webkit-transition:300ms;-moz-transition:300ms;-ms-transition:300ms;-o-transition:300ms;transition:300ms;";
                    if (m) this.prev();
                } else if (_y < 0) {
                    this.yearBox.style.cssText = "-webkit-transition:300ms;-moz-transition:300ms;-ms-transition:300ms;-o-transition:300ms;transition:300ms;";
                    if (m) this.next();
                }
            } else if (target === this.yearTouch) {
                var p = this.touchState.touchPosition;
                if (p) {
                    if (p % 1 < 0.5) {
                        p = ~~p;
                    } else {
                        p = ~~p + 1;
                    }
                    this._setYTP(p);
                }
            } else {
                var p = this.touchState.touchPosition;
                if (p) {
                    if (p % 1 < 0.5) {
                        p = ~~p;
                    } else {
                        p = ~~p + 1;
                    }
                }
                p = p - this.yearRangePosition;
                if (p < 0) {
                    this._prev(~p + 1);
                } else {
                    this._next(p);
                }
            }
        },
        _setYTP : function (p) {
            var c = this.max.year - this.min.year + 4;
            p = p < 4 ? 4 : (p > c ? c : p);
            this.yearTouchInner.style.cssText = "-webkit-transition:300ms;-moz-transition:300ms;-ms-transition:300ms;-o-transition:300ms;transition:300ms;-webkit-transform: translateZ(0);-moz-transform: translateZ(0);-ms-transform: translateZ(0);-o-transform: translateZ(0);transform: translateZ(0);left: -"+p+"00%;";
            if (p == 4) {
                for (var i = 0; i < this.min.month; i++) {
                    addClass(this.monthBtns[i], 'un');
                }
            } else if (p == c) {
                for (var i = this.max.month + 1; i < 12; i++) {
                    addClass(this.monthBtns[i], 'un');
                }
            } else if (this.yearTouchPosition == 4 || this.yearTouchPosition == c) {
                for (var i = 0; i < 12; i++) {
                    removeClass(this.monthBtns[i], 'un');
                }
            }
            this.yearTouchPosition = p;
            this.cacheYear = this.min.year + p - 4;
        },
        _click : function (target) {
            var event = event || w.event;
            event.preventDefault();
            event.stopPropagation();
            if (target === this.yearMonth) {
                var str = "";
                var min = this.min.year - 4;
                var max = this.max.year + 4;
                for (var i = min; i <= max; i++) {
                    if (i < min + 4 || i > max - 4) {
                        str += "<button class='-d-p-s-y' style='color:#999'>";
                    } else {
                        str += "<button class='-d-p-s-y'>";
                    }
                    str += i;
                    str += "</button>";
                }
                this.yearTouchInner.innerHTML = str;
                var c = this.currentYear - min;
                this.yearTouchInner.style.left = "-"+c+"00%";
                this.yearTouchPosition = c;
                addClass(this.datePicker, "-show");
            } else if (target === this.prevEl) {
                this.prev();
            } else if (target === this.nextEl) {
                this.next();
            } else if (target === this.today) {
                var date = new Date();
                this.input.value = this._mosaicStr(date.getFullYear(), date.getMonth(), date.getDate());
                var bind = this.input.datePickerData.bind;
                var range = this.input.datePickerData.range;
                if (bind && range == "start" || range == "end") {
                    var input;
                    for (var i = 0; i < this.inputs.length; i++) {
                        if (this.inputs[i].datePickerData.bind == bind && this.inputs[i].datePickerData.range != range) {
                            input = this.inputs[i];
                            break;
                        }
                    }
                    if (input) input.value = this.input.value;
                }
                this.datePicker.style.display = "none";
                this.dateCache = u;
            } else if (target === this.yesterday) {
                var date = new Date();
                var result = this._testDay(date.getFullYear(), date.getMonth(), date.getDate() - 1);
                this.input.value = this._mosaicStr(result.year, result.month, result.day);
                var bind = this.input.datePickerData.bind;
                var range = this.input.datePickerData.range;
                if (bind && range == "start" || range == "end") {
                    var input;
                    for (var i = 0; i < this.inputs.length; i++) {
                        if (this.inputs[i].datePickerData.bind == bind && this.inputs[i].datePickerData.range != range) {
                            input = this.inputs[i];
                            break;
                        }
                    }
                    if (input) input.value = this.input.value;
                }
                this.datePicker.style.display = "none";
                this.dateCache = u;
            } else if (target === this.lastWeek) {
                if (hasClass(target, 'un')) return false;
                var start, end, result;
                var date = new Date();
                var week = date.getDay() || 7;
                var year = date.getFullYear();
                var month = date.getMonth();
                var day = date.getDate() - week;
                if (day < 0) {
                    result = this._testDay(year, month, day);
                    start = {
                        year : result.year,
                        month : result.month,
                        day : result.day - 6
                    }
                    end = {
                        year : result.year,
                        month : result.month,
                        day : result.day
                    }
                } else {
                    end = {
                        year : year,
                        month : month,
                        day : day
                    }
                    result = this._testDay(date.getFullYear(), date.getMonth(), day - 6);
                    start = {
                        year : result.year,
                        month : result.month,
                        day : result.day
                    }
                }
                var bind = this.input.datePickerData.bind;
                var range = this.input.datePickerData.range;
                if (bind && range == "start" || range == "end") {
                    var input;
                    for (var i = 0; i < this.inputs.length; i++) {
                        if (this.inputs[i].datePickerData.bind == bind && this.inputs[i].datePickerData.range != range) {
                            input = this.inputs[i];
                            break;
                        }
                    }
                    if (input) {
                        if (range == "start") {
                            this.input.value = this._mosaicStr(start.year, start.month, start.day);
                            input.value =  this._mosaicStr(end.year, end.month, end.day);
                        } else {
                            input.value = this._mosaicStr(start.year, start.month, start.day);
                            this.input.value =  this._mosaicStr(end.year, end.month, end.day);
                        }
                    } else {
                        this.input.value = this._mosaicStr(start.year, start.month, start.day)  +  (this.join == "/" ? " - " : " / ")  + this._mosaicStr(end.year, end.month, end.day);
                    }
                } else {
                    this.input.value = this._mosaicStr(start.year, start.month, start.day)  +  (this.join == "/" ? " - " : " / ")  + this._mosaicStr(end.year, end.month, end.day);
                }
                this.datePicker.style.display = "none";
                this.dateCache = u;
            } else if (target === this.lastMonth) {
                if (hasClass(target, 'un')) return false;
                var start, end;
                var date = new Date();
                var result = this._testDay(date.getFullYear(), date.getMonth(), 0);
                start = {
                    year : result.year,
                    month : result.month,
                    day : 1
                }
                end = {
                    year : result.year,
                    month : result.month,
                    day : result.day
                }
                var bind = this.input.datePickerData.bind;
                var range = this.input.datePickerData.range;
                if (bind && range == "start" || range == "end") {
                    var input;
                    for (var i = 0; i < this.inputs.length; i++) {
                        if (this.inputs[i].datePickerData.bind == bind && this.inputs[i].datePickerData.range != range) {
                            input = this.inputs[i];
                            break;
                        }
                    }
                    if (input) {
                        if (range == "start") {
                            this.input.value = this._mosaicStr(start.year, start.month, start.day);
                            input.value =  this._mosaicStr(end.year, end.month, end.day);
                        } else {
                            input.value = this._mosaicStr(start.year, start.month, start.day);
                            this.input.value =  this._mosaicStr(end.year, end.month, end.day);
                        }
                    } else {
                        this.input.value = this._mosaicStr(start.year, start.month, start.day)  +  (this.join == "/" ? " - " : " / ")  + this._mosaicStr(end.year, end.month, end.day);
                    }
                } else {
                    this.input.value = this._mosaicStr(start.year, start.month, start.day)  +  (this.join == "/" ? " - " : " / ")  + this._mosaicStr(end.year, end.month, end.day);
                }
                this.datePicker.style.display = "none";
                this.dateCache = u;
            } else if (target === this.yearTouch) {
                this.yearRange.innerText = this.min.year + "-" + this.max.year;
                var year = this.cacheYear || this.currentYear;
                var str = "";
                var min = this.min.year - 4, max = this.max.year + 4;
                var c = max - min;
                if (c < 11) {
                    max += (11 - c);
                } else {
                    c = (c + 1) % 3;
                    if (c == 1) {
                        max += 2;
                    } else if (c == 2) {
                        max += 1;
                    }
                }
                for (var i = min; i <= max; i++) {
                    str += "<button class='-d-p-s-year";
                    if (i < this.min.year || i > this.max.year) {
                        str += " un";
                    } else if (i == year) {
                        str += " in";
                    }
                    str += "' date-year='";
                    str += i;
                    str += "'>";
                    str += i;
                    str += "</button>";
                }
                var  m = (max - min + 1) / 3 - 4;
                c = ~~((year - min) / 3) - 1;
                c = c > m ? m : c;
                this.yearRangePosition = c;
                c = c * 25;
                this.yearBtnBox.style.cssText = "-webkit-transform: translateY(-"+c+"%) translateZ(0);-moz-transform: translateY(-"+c+"%) translateZ(0);-ms-transform: translateY(-"+c+"%) translateZ(0);-o-transform: translateY(-"+c+"%) translateZ(0);transform: translateY(-"+c+"%) translateZ(0);";
                this.yearBtnBox.innerHTML = str;
                addClass(this.datePicker, "-year");
                this.yearBtns = getElementsByClassName(this.yearBtnBox, "-d-p-s-year");
            } else if (target === this.yearRange) {
                this._back();
            } else if (target === this.yearPrev) {
                this._prev();
            } else if (target === this.yearNext) {
                this._next();
            }
            return false;
        },
        __click : function (event) {
            event = event || w.event;
            event.preventDefault();
            event.stopPropagation();
            var btn;
            if (btn = closest(event.target, ".-date-picker-date")) {
                if (hasClass(btn, "prev")) {
                    this.prev();
                } else if (hasClass(btn, "next")) {
                    this.next();
                } else {
                    if (hasClass(btn, "un")) return false;
                    var year = this.currentYear;
                    var month = this.currentMonth;
                    var day = ~~btn.innerText;
                    var bind = this.input.datePickerData.bind;
                    var range = this.input.datePickerData.range;
                    if (!range) {
                        this.input.value = this._mosaicStr(year, month, day);
                        this.datePicker.style.display = "none";
                    } else {
                        var str = this._mosaicStr(year, month, day);
                        if (bind && range == "start" || range == "end") {
                            if (this.dateCache) {
                                var result = this._sortDay(this.dateCache.str, str);
                                this.dateCache.start.value = result.min;
                                this.dateCache.end.value = result.max;
                                this.datePicker.style.display = "none";
                                this.dateCache = u;
                            } else {
                                this.input.value = str;
                                this.dateCache = { str : str };
                                var input;
                                for (var i = 0; i < this.inputs.length; i++) {
                                    if (this.inputs[i].datePickerData.bind == bind && this.inputs[i].datePickerData.range != range) {
                                        input = this.inputs[i];
                                        break;
                                    }
                                }
                                if (input) {
                                    if (range == "start") {
                                        this.dateCache.start = this.input;
                                        this.dateCache.end = input;
                                    } else {
                                        this.dateCache.end = this.input;
                                        this.dateCache.start = input;
                                    }
                                    this.dateCache.on = range;
                                    initEvent(input, "focus");
                                } else {
                                    this.datePicker.style.display = "none";
                                }
                            }
                        } else {
                            if (this.dateCache) {
                                var result = this._sortDay(this.dateCache.str, str);
                                str = result.min + (this.join == "/" ? " - " : " / ") + result.max;
                                this.dateCache = u;
                                this.input.value = str;
                                this.datePicker.style.display = "none";
                            } else {
                                this.dateCache = { str : str };
                                this.input.value = str;
                            }
                        }
                    }
                }
            } else if (btn = closest(event.target, ".-d-p-s-year")) {
                if (hasClass(btn, "un")) return false;
                var year = ~~btn.innerText;
                var p = year - this.min.year + 4;
                this._setYTP(p);
                this._back();
            } else if (btn = closest(event.target, ".-d-p-s-month")) {
                if (hasClass(btn, "un")) return false;
                var year = this.yearTouchPosition + this.min.year - 4;
                var month = ~~btn.getAttribute("date-month") - 1;
                if (year != this.currentYear) {
                    this._mosaicObj(year);
                    this.currentYear = year;
                }
                this.currentMonth = month;
                this.yearBox.setAttribute("data-month", month);
                this.ymBtn.innerHTML = this.currentYear + "年" + (this.currentMonth < 9 ? ("0" + (this.currentMonth + 1)) : (this.currentMonth + 1)) + "月";
                removeClass(this.datePicker, "-show");
            }
        },
        _sortDay : function (a, b) {
            var max, min;
            var _a = new Date(a.replace(this.join, "/").replace(this.join, "/"));
            var _b = new Date(b.replace(this.join, "/").replace(this.join, "/"));
            if (_a > _b) {
                max = a;
                min = b;
            } else {
                min = a;
                max = b;
            }
            return {max : max, min : min}
        },
        _testDay : function (year, month, day) {
            if (day < 1) {
                month--;
                if (month < 0) {
                    month = 11;
                    year--;
                }
                if (month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11) {
                    day += 31;
                } else if (month == 3 || month == 5 || month == 8 || month == 10) {
                    day += 30;
                } else {
                    if (year % 4 == 0) {
                        day += 29;
                    } else {
                        day += 28;
                    }
                }
            }
            return {year : year, month : month, day : day}
        },
        _mouseWheel : function (target) {
            if (this.scroll) return false;
            this.scroll = true;
            var event = event || w.event;
            event.preventDefault();
            event.stopPropagation();
            var detail = event.detail, wheelDelta = event.wheelDelta;
            if (detail) {
                if (detail > 0) {
                    if (target == this.box) {
                        this.next();
                    } else if (target == this.yearBtnBox) {
                        this._next();
                    } else {
                        this._setYTP(this.yearTouchPosition + 1);
                    }
                } else {
                    if (target == this.box) {
                        this.prev();
                    } else if (target == this.yearBtnBox) {
                        this._prev();
                    } else {
                        this._setYTP(this.yearTouchPosition - 1);
                    }
                }
            } else {
                if (wheelDelta > 0) {
                    if (target == this.box) {
                        this.prev();
                    } else if (target == this.yearBtnBox) {
                        this._prev();
                    } else {
                        this._setYTP(this.yearTouchPosition - 1);
                    }
                } else {
                    if (target == this.box) {
                        this.next();
                    } else if (target == this.yearBtnBox) {
                        this._next();
                    } else {
                        this._setYTP(this.yearTouchPosition + 1);
                    }
                }
            }
            delete this.scroll;
            return false;
        },
        _initInputs : function () {
            var obj = {}, del = [];
            for (var i = 0; i < this.inputs.length; i++) {
                if (this.inputs[i].nodeName.toLowerCase() == "input") {
                    this.inputs[i].datePickerData = {
                        range : this.inputs[i].getAttribute("range"),
                        max : this.inputs[i].getAttribute("max"),
                        min : this.inputs[i].getAttribute("min"),
                        bind : this.inputs[i].getAttribute("bind")
                    }
                    var bind = this.inputs[i].datePickerData.bind;
                    if (bind) {
                        var min = this.inputs[i].datePickerData.min;
                        var max = this.inputs[i].datePickerData.max;
                        if (!obj[bind]) obj[bind] = {
                            inputs: [],
                            min: null,
                            max: null
                        };
                        if (max) obj[bind].max = max;
                        if (min) obj[bind].min =  min;
                        obj[bind].inputs.push(this.inputs[i]);
                    }
                } else {
                    del.push(i);
                }
            }
            for (var key in obj) {
                var inputs = obj[key].inputs;
                for (var i = 0; i < inputs.length; i++) {
                    inputs[i].datePickerData.min = obj[key].min;
                    inputs[i].datePickerData.max = obj[key].max;
                }
            }
            for (var i = 0; i < del.length; i++) {
                this.inputs.splice(i, 1);
            }
        },
        _initEvent : function () {
            var self = this;
            for (var i = 0; i < this.inputs.length; i++) {
                eventListener(this.inputs[i], "focus", this._inputFocus.bind(this, this.inputs[i]));
            }
            eventListener(this.datePicker, "touchmove", this._disableEvent);
            eventListener(this.yearBox, "click", this.__click.bind(this));
            eventListener(this.yearBtnBox, "click", this.__click.bind(this));
            eventListener(this.monthBtnBox, "click", this.__click.bind(this));
            eventListener(this.yearMonth, "click", this._click.bind(this, this.yearMonth));
            eventListener(this.prevEl, "click", this._click.bind(this, this.prevEl));
            eventListener(this.nextEl, "click", this._click.bind(this, this.nextEl));
            eventListener(this.today, "click", this._click.bind(this, this.today));
            eventListener(this.yesterday, "click", this._click.bind(this, this.yesterday));
            eventListener(this.lastWeek, "click", this._click.bind(this, this.lastWeek));
            eventListener(this.lastMonth, "click", this._click.bind(this, this.lastMonth));
            eventListener(this.yearTouch, "click", this._click.bind(this, this.yearTouch));
            eventListener(this.yearRange, "click", this._click.bind(this, this.yearRange));
            eventListener(this.yearPrev, "click", this._click.bind(this, this.yearPrev));
            eventListener(this.yearNext, "click", this._click.bind(this, this.yearNext));
            eventListener(document, "touchstart", this._defaultTouch.bind(this));
            eventListener(document, "mousedown", this._defaultTouch.bind(this));
            eventListener(w, "resize", this._reSize.bind(this));
            eventListener(this.box, "touchstart", this._TouchS.bind(this, this.box));
            eventListener(this.box, "touchmove", this._TouchM.bind(this, this.box));
            eventListener(this.box, "touchend", this._TouchE.bind(this, this.box));
            eventListener(this.box, "touchcancel", this._TouchE.bind(this, this.box));
            eventListener(this.yearTouch, "touchstart", this._TouchS.bind(this, this.yearTouch));
            eventListener(this.yearTouch, "touchmove", this._TouchM.bind(this, this.yearTouch));
            eventListener(this.yearTouch, "touchend", this._TouchE.bind(this, this.yearTouch));
            eventListener(this.yearTouch, "touchcancel", this._TouchE.bind(this, this.yearTouch));
            eventListener(this.yearBtnBox, "touchstart", this._TouchS.bind(this, this.yearBtnBox));
            eventListener(this.yearBtnBox, "touchmove", this._TouchM.bind(this, this.yearBtnBox));
            eventListener(this.yearBtnBox, "touchend", this._TouchE.bind(this, this.yearBtnBox));
            eventListener(this.yearBtnBox, "touchcancel", this._TouchE.bind(this, this.yearBtnBox));
            if (/.*Firefox.*/.test(navigator.userAgent)) {
                eventListener(this.box, "DOMMouseScroll", this._mouseWheel.bind(this, this.box));
                eventListener(this.yearTouch, "DOMMouseScroll", this._mouseWheel.bind(this, this.yearTouch));
                eventListener(this.yearBtnBox, "DOMMouseScroll", this._mouseWheel.bind(this, this.yearBtnBox));
            } else {
                eventListener(this.box, "mousewheel", this._mouseWheel.bind(this, this.box));
                eventListener(this.yearTouch, "mousewheel", this._mouseWheel.bind(this, this.yearTouch));
                eventListener(this.yearBtnBox, "mousewheel", this._mouseWheel.bind(this, this.yearBtnBox));
            }
            eventListener(w, "blur", function () {
                // self.datePicker.style.display = "none";
                // self._inputBlur();
            });
        },
        _mosaicObj : function (year) {
            var str = "<div class='-prev-year'>上一年</div>";
            if (!this.day[year]) {
                this.day[year] = [];
                for (var i = 1; i <= 12; i++) {
                    var s = this._mosaicMonth(year, i);
                    this.day[year][i-1] = s;
                    str += s;
                }
            } else {
                for (var i = 0; i < 12; i++) {
                    str += this.day[year][i];
                }
            }
            str += "<div class='-next-year'>下一年</div>";
            this.yearBox.innerHTML = str;
        },
        _mosaicMonth : function (year, month) {
            var leap = false;
            if (year % 4 == 0) leap = true;
            var length = 0;
            var str = "<div class='-date-picker-month'><div class='-before'>"+month+"</div><div class='-after'>"+month+"</div>";
            var day = new Date(year + "/" + month + "/1").getDay();
            day = day == 0 ? 7 : day;
            if (month == 1 || month == 2 || month == 4 || month == 6 || month == 9 || month == 11) {
                str += this._mosaicDate(year, month, day, 31 - day);
            } else if (month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
                str += this._mosaicDate(year, month, day, 30 - day);
            } else {
                if (leap) {
                    str += this._mosaicDate(year, month, day, 29 - day);
                } else {
                    str += this._mosaicDate(year, month, day, 28 - day);
                }
            }
            length += day;
            if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12){
                str += this._mosaicDate(year, month, 31);
                length += 31;
            } else if (month == 4 || month == 6  || month == 9 || month == 11) {
                str += this._mosaicDate(year, month, 30);
                length += 30;
            } else {
                if (leap) {
                    str += this._mosaicDate(year, month, 29);
                    length += 29;
                } else {
                    str += this._mosaicDate(year, month, 28);
                    length += 28;
                }
            }
            var len = 42 - length;
            str += this._mosaicDate(year, month, len);
            str += "</div>"
            return str;
        },
        _mosaicDate : function (year, month, len, start) {
            var date = new Date();
            var nowYear = date.getFullYear();
            var nowMonth = date.getMonth() + 1;
            var nowDay = date.getDate() - 1;
            var str = "";
            start = start || 0;
            for (var i = 0; i < len; i++) {
                if (start > 0 || len < 28) {
                    if (start > 0) {
                        str += "<button class='-date-picker-date un prev'>";
                    } else {
                        str += "<button class='-date-picker-date un next'>";
                    }
                    if (i + start < 9) str += "&ensp;";
                    str += (i + start + 1);
                    str += "</button>";
                } else {
                    if (i == nowDay &&month == nowMonth &&  year == nowYear) {
                        str += "<button class='-date-picker-date in'>";
                    } else {
                        str += "<button class='-date-picker-date'>";
                    }
                    if (i < 9) str += "&ensp;";
                    str += (i + 1);
                    str += "</button>";
                }
            }
            return str;
        },
        _mosaicStr : function (year, month, day, hours, minute, second) {
            var str;
            str = year + this.join + (month < 9 ? ("0" + (month + 1)) : (month + 1)) + this.join + (day < 10 ? ("0" + day) : day);
            if (hours != u) {
                str += " ";
                str += hours;
                str += ":";
                str += minute ? (minute < 10 ? ("0" + minute) : minute) : "00" ;
                str += ":";
                str += second ? (second < 10 ? ("0" + second) : second) : "00" ;
            }
            return str;
        },
        _back : function () {
            var i = this.datePicker;
            if (hasClass(i, "-year")) {
                removeClass(i , "-year");
            } else {
                removeClass(i, "-show");
            }
        }
    }
    w.datePicker = datePicker;
})(window, undefined);