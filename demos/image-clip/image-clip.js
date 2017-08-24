(function () {
    'use strict';
    if (!!self.Clip) return;
    var timeOut, touches = {}, change;
    function init () {
        try {
            initOptions.call(this);
        } catch (err) {
            console.log("没有找到容器");
        }
    }
    function initOptions () {
        if (this.box && !(this.box instanceof HTMLElement)) {
            if (this.box[0] instanceof HTMLElement) {
                this.box = this.box[0];
            } else {
                this.box = undefined;
            }
        }
        if (this.box) {
            this.boxSize = {
                w : this.box.clientWidth,
                h : this.box.clientHeight
            }
            if (this.options) {
                if (this.options.size) {
                    if (this.options.size instanceof Object) {
                        this.size = {
                            w : this.options.size.w > this.boxSize.w ? this.boxSize.w : this.options.size.w,
                            h : this.options.size.h > this.boxSize.h ? this.boxSize.h : this.options.size.h
                        }
                        if (typeof this.size.w != "number" || typeof this.size.h != "number") this.size = this.boxSize;
                    } else if (typeof this.options.size == "number") {
                        this.size = {
                            w : this.options.size > this.boxSize.w ? this.boxSize.w : this.options.size,
                            h : this.options.size > this.boxSize.h ? this.boxSize.h : this.options.size
                        }
                    }
                } else {
                    this.size = this.boxSize;
                }
                if (this.options.max || this.options.min) {
                    if (this.options.max) {
                        this.clipSize = this.options.max;
                        this.clipFor = "max";
                    } else {
                        this.clipSize = this.options.min;
                        this.clipFor = "min";
                    }
                }
                if (this.options.scale) this.scale = this.options.scale;
                if (this.options.image) {
                    this.preview = [];
                    if (this.options.image instanceof HTMLElement) {
                        this.preview.push(this.options.image);
                    } else {
                        var arr = this.options.image;
                        for (var i=0;i<arr.length;i++) {
                            if (arr[i] instanceof HTMLElement)
                                this.preview.push(arr[i]);
                        }
                    }
                }
                if (this.options.color) this.color = this.options.color;
                delete this.options
            }
            initView.call(this);
        }
    }
    function initView () {
        var x,y,X,Y,Max;
        x = this.size.w;
        y = this.size.h;
        X = this.boxSize.w;
        Y = this.boxSize.h;
        Max = X > Y ? X : Y;
        this.box.style.padding = "0";
        this.box.innerHTML = "";
        this.clipMain = document.createElement("div");
        this.clipMain.style.cssText = "position:relative;width:100%;height:100%;overflow:hidden;text-align:center;z-index:1;";
        this.clipWindow = document.createElement("div");
        this.clipWindow.style.cssText = "position:absolute;top:50%;left:50%;width:"+x+"px;height:"+y+"px;margin:-"+(Max+y/2)+"px -"+(Max+x/2)+"px;border:"+Max+"px solid "+(this.color?this.color:"rgba(66,66,66,.8)")+";line-height:"+y+"px;box-sizing:content-box;";
        this.clipImage = document.createElement("img");
        this.clipImage.style.cssText = "position:relative;z-index:-2;display:none;vertical-align:middle;";
        this.clipImage.onload = loadEnd.bind(this);
        this.clipWindow.appendChild(this.clipImage);
        this.clipMain.appendChild(this.clipWindow);
        this.box.appendChild(this.clipMain);
        initEvent.call(this);
    }
    function loadEnd () {
        var that = this;
        this.clipImageData = {
            w : this.clipImage.naturalWidth,
            h : this.clipImage.naturalHeight,
            o : 0, x : 0, y : 0, ix : 0, iy : 0
        }
        var msg = this.clipImageData;
        msg.r = msg.w / msg.h;
        if (msg.w < msg.h) {
            if (msg.w > this.boxSize.w) {
                msg.cw = this.boxSize.w;
                msg.ch = (this.boxSize.w / msg.r);
            } else {
                msg.cw = msg.w;
                msg.ch = msg.h;
            }
        } else {
            if (msg.h > this.boxSize.h) {
                msg.ch = this.boxSize.h;
                msg.cw = (this.boxSize.h * msg.r);
            } else {
                msg.ch = msg.h;
                msg.cw = msg.w;
            }
        }
        if (msg.cw < this.boxSize.w) {
            if (msg.cw < this.size.w) {
                if(!this.scale || this.scale === 0){
                    msg.ix = (this.size.w - msg.cw) / 2;
                } else {
                    msg.cw = this.size.w;
                    msg.ch = (this.size.w / msg.r);
                }
            } else {
                msg.x = (this.size.w - msg.cw) / 2;
            }
        } else {
            msg.x = (this.size.w - msg.cw) / 2;
        }
        if (msg.ch < this.boxSize.h) {
            if (msg.ch < this.size.h) {
                if (!this.scale || this.scale === 0){
                    msg.iy = (this.size.h - msg.ch) / 2;
                } else {
                    msg.ch = this.size.h;
                    msg.cw = (this.size.h * msg.r);
                    if (msg.cw < this.size.w) {
                        msg.ix = (this.size.w - msg.cw) / 2;
                    } else {
                        msg.x = (this.size.w - msg.cw) / 2;
                    }
                }
            } else {
                msg.y = (this.size.h - msg.ch) / 2;
            }
        } else {
            msg.y = (this.size.h - msg.ch) / 2;
        }
        msg.sr = msg.cw / msg.w;
        this.clipImage.style.width = msg.cw + "px";
        this.clipImage.style.height = msg.ch + "px";
        this.clipImage.style.transform = "translate("+msg.x+"px,"+msg.y+"px) translateZ(0px)";
        this.clipImage.style.display = "inline-block";
        info.call(this,true);
        this.canFinish = true;
        var callback = function (src) {
            var arr = that.preview;
            for (var i=0;i<arr.length;i++){
                arr[i].src = src;
            }
        }
        if (!!this.preview) this.end(callback,true);
    }
    function initEvent () {
        var that = this;
        if (/.*Firefox.*/.test(navigator.userAgent)) {
            document.addEventListener("DOMMouseScroll",function (e) {
                if (!that.canFinish) return;
                e = e || window.event;
                if (e.target !== that.clipWindow) return;
                e.preventDefault();
                var detail = e.detail;
                if (detail > 0) {
                    mouseWheel.call(that,"down");
                } else {
                    mouseWheel.call(that,"up");
                }
            },false);
        } else {
            document.addEventListener("mousewheel",function (e) {
                if (!that.canFinish) return;
                e = e || window.event;
                if (e.target !== that.clipWindow) return;
                e.preventDefault();
                var wheelDelta = e.wheelDelta;
                if (wheelDelta > 0) {
                    mouseWheel.call(that,"up");
                } else {
                    mouseWheel.call(that,"down");
                }
            },false)
        }
        document.addEventListener("mousedown",function (e) {
            if (!that.canFinish) return;
            e = e || window.event;
            if (e.target !== that.clipWindow) return;
            e.preventDefault();
            mouseDrag.call(that,e);
        },false);
        document.addEventListener("touchstart",function (e) {
            if (!that.canFinish) return;
            e = e || window.event;
            if (e.target !== that.clipWindow) return;
            e.preventDefault();
            touchEvent.call(that,e);
        },false);
        document.addEventListener("touchmove",function (e) {
            if (!that.canFinish) return;
            e = e || window.event;
            if (e.target !== that.clipWindow) return;
            e.preventDefault();
            touchEvent.call(that,e);
        },false);
        document.addEventListener("touchend",function (e) {
            if (!that.canFinish) return;
            e = e || window.event;
            if (e.target !== that.clipWindow) return;
            e.preventDefault();
            touchEvent.call(that,e);
        },false);
    }
    function mouseWheel (asp) {
        clearTimeout(timeOut);
        var that = this;
        var w, h, r, msg = this.clipImageData;
        var x, y, ix, iy, o;
        switch (asp) {
            case "up":
                r = msg.sr + 0.01;
            break;
            case "down":
                r = msg.sr - 0.01;
            break;
            case undefined:
                return;
            break;
        }
        w = msg.w * r;
        h = msg.h * r;
        if (this.scale) {
            if (w <= this.size.w) {
                w = this.size.w;
                r = w / msg.w;
                h = msg.h * r;
            }
            if (h <= this.size.h) {
                h = this.size.h;
                r = h / msg.h;
                w = msg.w * r;
            }
        } else {
            if (w <= 8) {
                w = 8;
                r = w / msg.w;
                h = msg.h * r;
            }
            if (h <= 8) {
                h = 8;
                r = h / msg.h;
                w = msg.w * r;
            }
        }
        if (r == msg.sr) return;
        if (w < this.size.w) {
            ix = (this.size.w - w) / 2;
            x = msg.x;
            x = x < (-ix) ? (-ix) : (x > ix ? ix : x);
        } else {
            ix = 0;
            x = msg.cw < this.size.w ? ((this.size.w - w) / 2 + msg.x) : ((msg.cw - w) / 2 + msg.x);
            o = this.size.w - w;
            x = x > 0 ? 0 : (x < o ? o : x);
        }
        if (h < this.size.h) {
            iy = (this.size.h - h) / 2;
            y = msg.y;
            y = y < (-iy) ? (-iy) : (y > iy ? iy : y);
        } else {
            iy = 0;
            y = msg.ch < this.size.h ? ((this.size.h - h) / 2 + msg.y) : ((msg.ch - h) / 2 + msg.y);
            o = this.size.h - h;
            y = y > 0 ? 0 : (y < o ? o : y);
        }
        msg.x = x;
        msg.y = y;
        msg.cw = w;
        msg.ch = h;
        msg.sr = r;
        msg.ix = ix;
        msg.iy = iy;
        this.clipImage.style.width = w + "px";
        this.clipImage.style.height = h + "px";
        this.clipImage.style.transform = "translate("+x+"px,"+y+"px) translateZ(0px)";
        if (!!this.preview) {
            timeOut = setTimeout(function () {
                that.end(function (src) {
                    var arr = that.preview;
                    for (var i=0;i<arr.length;i++){
                        arr[i].src = src;
                    }
                },true);
            },200);
        }
    }
    function mouseDrag (e) {
        var that = this;
        var x = e.clientX, y = e.clientY,mouseMove,mouseUp;
        var _x, _y, msg = this.clipImageData;
        mouseMove = function (ev) {
            ev = event || window.event;
            var X = ev.clientX, Y = ev.clientY,o;
            _x = X - x + msg.x;
            _y = Y - y + msg.y;
            if (msg.cw < that.size.w) {
                o = (that.size.w - msg.cw) / 2;
                _x = _x < (-o) ? (-o) : (_x > o ? o : _x);
            } else {
                o = that.size.w - msg.cw;
                _x = _x >= 0 ? 0 : (_x <= o ? o : _x);
            }
            if (msg.ch < that.size.h) {
                o = (that.size.h - msg.ch) / 2;
                _y = _y < (-o) ? (-o) : (_y > o ? o : _y);
            } else {
                o = that.size.h - msg.ch;
                _y = _y >= 0 ? 0 : (_y <= o ? o : _y);
            }
            that.clipImage.style.transform = "translate("+_x+"px,"+_y+"px) translateZ(0px)";
        }
        mouseUp = function () {
            document.removeEventListener("mousemove",mouseMove,false);
            document.removeEventListener("mouseup",mouseUp,false);
            msg.x = _x;
            msg.y = _y;
            var callback = function (src) {
                var arr = that.preview;
                for (var i=0;i<arr.length;i++){
                    arr[i].src = src;
                }
            }
            if (!!that.preview) that.end(callback,true);
        }
        document.addEventListener("mousemove",mouseMove,false);
        document.addEventListener("mouseup",mouseUp,false);
    }
    function touchEvent (e) {
        var msg = this.clipImageData, img = this.clipImage;
        var that = this;
        switch (e.type) {
            case "touchstart":
                var obj = {
                    x : e.changedTouches[0].clientX,
                    y : e.changedTouches[0].clientY,
                    X : 0, Y : 0, _x : 0, _y : 0
                }
                touches[e.changedTouches[0].identifier] = obj;
            break;
            case "touchmove":
                var count = Object.getOwnPropertyNames(touches).length;
                var ides = [];
                for (var i = 0; i < count; i++) {
                    var ide = e.touches[i].identifier,
                        x = e.touches[i].clientX,
                        y = e.touches[i].clientY,
                        obj = touches[ide];
                    ides.push(ide);
                    obj.X = x - obj.x;
                    obj.Y = y - obj.y;
                }
                switch (count) {
                    case 1:
                        var ide = ides[0];
                        var _x = touches[ide].X + msg.x,
                            _y = touches[ide].Y + msg.y;
                        var o;
                        if (msg.cw < this.size.w) {
                            o = (this.size.w - msg.cw) / 2;
                            _x = _x < (-o) ? (-o) : (_x > o ? o : _x);
                        } else {
                            o = this.size.w - msg.cw;
                            _x = _x >= 0 ? 0 : (_x <= o ? o : _x);
                        }
                        if (msg.ch < this.size.h) {
                            o = (this.size.h - msg.ch) / 2;
                            _y = _y < (-o) ? (-o) : (_y > o ? o : _y);
                        } else {
                            o = this.size.h - msg.ch;
                            _y = _y >= 0 ? 0 : (_y <= o ? o : _y);
                        }
                        touches[ide]._x = _x;
                        touches[ide]._y = _y;
                        change = ide;
                        img.style.transform = "translate("+_x+"px,"+_y+"px) translateZ(0px)";
                    break;
                    case 2:
                        var ide = ides[0], _ide = ides[1];
                        if (typeof change == "number") {
                            msg.x = touches[change]._x;
                            msg.y = touches[change]._y;
                            touches[change] = {
                                x : touches[change].x + touches[change].X,
                                y : touches[change].y + touches[change].Y,
                                X : 0,
                                Y : 0
                            }
                            change = undefined;
                        }
                        var sS, cS, m, r, w, h;
                        sS = Math.sqrt(Math.pow(Math.abs(touches[ide].x - touches[_ide].x), 2) + Math.pow(Math.abs(touches[ide].y - touches[_ide].y), 2));
                        cS = Math.sqrt(Math.pow(Math.abs(touches[ide].x + touches[ide].X - touches[_ide].x - touches[_ide].X), 2) + Math.pow(Math.abs(touches[ide].y + touches[ide].Y - touches[_ide].y - touches[_ide].Y), 2));
                        m = cS / sS;
                        r = msg.sr * m;
                        w = msg.w * r;
                        h = msg.h * r;
                        if (this.scale) {
                            if (w <= this.size.w) {
                                w = this.size.w;
                                r = w / msg.w;
                                h = msg.h * r;
                            }
                            if (h <= this.size.h) {
                                h = this.size.h;
                                r = h / msg.h;
                                w = msg.w * r;
                            }
                        } else {
                            if (w <= 8) {
                                w = 8;
                                r = w / msg.w;
                                h = msg.h * r;
                            }
                            if (h <= 8) {
                                h = 8;
                                r = h / msg.h;
                                w = msg.w * r;
                            }
                        }
                        if (r == msg.sr) return;
                        var x, y, ix, iy;
                        if (w < this.size.w) {
                            ix = (this.size.w - w) / 2;
                            x = msg.x;
                            x = x < (-ix) ? (-ix) : (x > ix ? ix : x);
                        } else {
                            ix = 0;
                            x = msg.cw < this.size.w ? ((this.size.w - w) / 2 + msg.x) : ((msg.cw - w) / 2 + msg.x);
                            o = this.size.w - w;
                            x = x > 0 ? 0 : (x < o ? o : x);
                        }
                        if (h < this.size.h) {
                            iy = (this.size.h - h) / 2;
                            y = msg.y;
                            y = y < (-iy) ? (-iy) : (y > iy ? iy : y);
                        } else {
                            iy = 0;
                            y = msg.ch < this.size.h ? ((this.size.h - h) / 2 + msg.y) : ((msg.ch - h) / 2 + msg.y);
                            o = this.size.h - h;
                            y = y > 0 ? 0 : (y < o ? o : y);
                        }
                        msg.x = x;
                        msg.y = y;
                        msg.cw = w;
                        msg.ch = h;
                        msg.ix = ix;
                        msg.iy = iy;
                        img.style.width = w + "px";
                        img.style.height = h + "px";
                        img.style.transform = "translate("+x+"px,"+y+"px) translateZ(0px)";
                    break;
                }
            break;
            case "touchend":
                var ides = [], count = 0, delIDE = e.changedTouches[0].identifier;
                for (var key in touches) {
                    ides.push(key);
                    count++;
                }
                switch (count) {
                    case 1:
                        var ide = ides[0];
                        msg.x = touches[ide]._x;
                        msg.y = touches[ide]._y;
                    break;
                    case 2:
                        msg.sr = msg.cw / msg.w;
                        for (var key in touches) {
                            if (key != delIDE) {
                                touches[key] = {
                                    x : touches[key].x + touches[key].X,
                                    y : touches[key].y + touches[key].Y,
                                    X : 0,
                                    Y : 0
                                }
                            }
                        }
                    break;
                }
                delete touches[delIDE];
                if (!!this.preview && count == 1) this.end(function (src) {
                    var arr = that.preview;
                    for (var i=0;i<arr.length;i++){
                        arr[i].src = src;
                    }
                },true);
            break;
        }
    }
    function repairImage (file,callback) {
        var windowURL = window.URL || window.webkitURL;
        var src = windowURL.createObjectURL(file);
        try {
            EXIF.getData(file,function () {
                var orientation;
                if (orientation = EXIF.getTag(this,"Orientation")) {
                    var img = document.createElement("img"),
                        cvs = document.createElement("canvas"),
                        ctx = cvs.getContext("2d"),
                        deg = 0,width,height,
                        drawWidth,drawHeight;
                    img.onload = function () {
                        width = drawWidth = this.naturalWidth;
                        height = drawHeight = this.naturalHeight;
                        cvs.width = width;
                        cvs.height = height;
                        switch (orientation) {
                            case 3:
                                deg = 180;
                                drawWidth=-width;
                                drawHeight=-height;
                            break;
                            case 6:
                                cvs.width=height;
                                cvs.height=width;
                                deg=90;
                                drawWidth=width;
                                drawHeight=-height;
                            break;
                            case 8:
                                cvs.width=height;
                                cvs.height=width;
                                deg=270;
                                drawWidth=-width;
                                drawHeight=height;
                            break;
                        }
                        ctx.rotate(deg*Math.PI/180);
                        ctx.drawImage(this,0,0,drawWidth,drawHeight);
                        callback(cvs.toDataURL("image/jpeg"));
                    }
                    img.src = src;
                } else {
                    callback(src);
                }
            })
        } catch (err) {
            callback(src);
            console.log(err);
        }
    }
    function info (del) {
        if (!del) {
            var span = document.createElement("span");
            span.innerText = "图片加载中";
            span.style.cssText = "display:block;width:100%;height:100%;color:#f44;font-size:1.5em;position:relative;z-index:1;text-shadow:0 0 .1em #f99;";
            this.clipMain.appendChild(span);
        } else {
            var span = this.clipMain.getElementsByTagName("span")[0];
            if (span) this.clipMain.removeChild(span);
        }
    }
    function Clip (box,options) {
        this.box = box;
        this.preview = false;
        this.options = options;
        init.call(this);
    }
    Clip.prototype = {
        start : function (file) {
            if (!this.clipMain || !file || !(file instanceof File)) return;
            this.refresh();
            if (self.EXIF) {
                var that = this;
                info.call(this);
                repairImage(file,function (src) {
                    that.clipImage.src = src;
                })
            }else{
                var windowURL = window.URL || window.webkitURL;
                this.clipImage.src = windowURL.createObjectURL(file);
            }
        },
        end : function (callback,preview) {
            if (!this.canFinish) return;
            var cvs = document.createElement("canvas"),
                ctx = cvs.getContext("2d"),
                msg = this.clipImageData,
                rat = msg.sr, _rat = 1,
                width = this.size.w / rat,
                height = this.size.h / rat,
                clipSize, clipFor, data;
            if (preview) {
                clipFor = "max";
                clipSize = 300;
            } else {
                clipFor = this.clipFor;
                clipSize = this.clipSize;
            }
            cvs.width = width;
            cvs.height = height;
            if (clipFor) {
                switch (clipFor) {
                    case "min":
                        if (cvs.width > cvs.height) {
                            if (cvs.height > clipSize) {
                                _rat = clipSize / cvs.height;
                                cvs.width = cvs.width * _rat;
                                cvs.height = clipSize;
                            }
                        } else {
                            if (cvs.width > clipSize) {
                                _rat = clipSize / cvs.width;
                                cvs.width = clipSize;
                                cvs.height = cvs.height*_rat;
                            }
                        }
                    break;
                    case "max":
                        if (cvs.width > cvs.height) {
                            if (cvs.width > clipSize) {
                                _rat = clipSize / cvs.width;
                                cvs.width = clipSize;
                                cvs.height = cvs.height*_rat;
                            }
                        } else {
                            if (cvs.height > clipSize) {
                                _rat = clipSize / cvs.height;
                                cvs.width = cvs.width*_rat;
                                cvs.height = clipSize;
                            }
                        }
                    break;
                }
            }
            var sx, sy, dx, dy, sWidth, sHeight, dWidth, dHeight;
            sx = Math.round(msg.x*100) >= Math.round(-msg.ix*100) ? 0 : -(msg.x/rat);
            sy = Math.round(msg.y*100) >= Math.round(-msg.iy*100) ? 0 : -(msg.y/rat);
            dx = (msg.ix+msg.x)/rat*_rat;
            dx = dx < 0 ? 0 : dx;
            dy = (msg.iy+msg.y)/rat*_rat;
            dy = dy < 0 ? 0 : dy;
            if (width > msg.w) {
                sWidth = msg.w;
                dWidth = sWidth / width * cvs.width;
            } else {
                sWidth = width;
                dWidth = cvs.width;
            }
            if (height > msg.h) {
                sHeight = msg.h;
                dHeight = sHeight / height * cvs.height;
            } else {
                sHeight = height;
                dHeight = cvs.height;
            }
            if (preview) {
                ctx.fillStyle = "#fff";
                ctx.fillRect(0,0,cvs.width,cvs.height);
                ctx.drawImage(this.clipImage,sx,sy,sWidth,sHeight,dx,dy,dWidth,dHeight);
                data = cvs.toDataURL("image/jpeg");
            } else {
                ctx.drawImage(this.clipImage,sx,sy,sWidth,sHeight,dx,dy,dWidth,dHeight);
                data = cvs.toDataURL();
            }
            if (callback && callback instanceof Function) callback(data);
        },
        refresh : function () {
            if (!this.clipMain) return;
            this.canFinish = false;
            this.clipImage.src="";
            this.clipImage.style.cssText="position:relative;z-index:-1;display:none;vertical-align:middle;";
            if (!!this.preview) {
                var arr = this.preview;
                for (var i = 0; i < arr.length; i++) {
                    arr[i].src = "";
                }
            }
        }
    }
    self.Clip = Clip;
})();