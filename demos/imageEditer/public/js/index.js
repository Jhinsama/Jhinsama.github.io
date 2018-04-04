(function(win) {
    var $ = win.$, doc = win.document;
    if (!$ || win.EditCanvas) return;

    function cImg(src) {
        var img = doc.createElement('img');
        img.src = src;
        doc.body.appendChild(img);
    }

    function App(options) {
        if (!options.el) return;
        this.config = $.extend({
            width: 400,
            height: 300,
            format: 'jpg'
        }, options);
        this.app = $(this.config.el);
        this.drawArr = [];
        this.mouse = {};
        this.line = {};
        this.init();
    }
    App.prototype = {
        init: function() {
            var app = this.app,
                conf = this.config, 
                box, canvas,
                position = app.css('position');
            if (!position || position == 'static') app.css('position', 'relative');
            app.css('overflow', 'hidden');
            app.html('<div class="draw-box" style="width:100%;height:100%"><canvas style="width:100%;height:100%"></canvas></div>');
            box = this.box = app.find('.draw-box');
            box.css({width: conf.width, height: conf.height});
            this.cvs = doc.createElement('canvas');
            this.ctx = this.cvs.getContext('2d');
            canvas = this.canvas = box.find('canvas')[0];
            this.cvs.width = canvas.width = conf.width;
            this.cvs.height = canvas.height = conf.height;
            this.canvasCtx = canvas.getContext('2d');
            this.initTools();
            this.initEvent();
        },
        initTools: function() {
            var app = this.app;
            app.append('<div class="draw-tool"><label id="draw-image"><input type="file" accept="image/jpg, image/jpeg, image/png" style="position:absolute;top:0;left:0;width:0;height:0;opacity:0;"></label><label id="draw-font"></label><label id="draw-pen"></label><label id="draw-clean"></label><label id="draw-save"></label></div>');
            this.image = app.find('#draw-image input');
            this.font = app.find('#draw-font');
            this.pen = app.find('#draw-pen');
            this.clean = app.find('#draw-clean');
            this.save = app.find('#draw-save');
        },
        initEvent: function() {
            var self = this, $doc = $(doc);
            this.image.change(function() {
                if (!this.value) return;
                self.createImg(this.files[0]);
                this.value = '';
            });
            this.font.click(function() {
                console.log('font');
            });
            this.pen.click(function() {
                self.onPen = !self.onPen;
                if (self.onPen) return self.pen.addClass('active');
                return self.pen.removeClass('active');
            });
            this.clean.click(function() {
                self.canvasCtx.clearRect(0, 0, self.canvas.width, self.canvas.height);
                self.drawArr = [];
            });
            this.save.click(function() {
                console.log('save');
            });
            this.box.click(function(e) {
                if (self.mouse.move) return;
                if (self.focus) {
                    self.drawArr.splice(self.focus.i, 1);
                    self.focus.i = self.drawArr.length;
                    self.drawArr.push(self.focus.cvs);
                    self.draw();
                }
            });
            this.box.bind('mousedown', function(e) {
                self.mouseDown(e.offsetX, e.offsetY);
            });
            this.box.bind('mousemove', function(e) {
                self.mouseMove(e.offsetX, e.offsetY);
            });
            $doc.bind('mouseup', function(e) {
                self.mouseUp();
            });
        },
        createImg: function(file) {
            var self = this;
            var img = doc.createElement('img');
            var winURL = win.URL || win.webkitURL;
            img.onload = function() {
                var obj = {type: 'img', rotate: 0}, cvs, ctx, conf = self.config, scale = 1;
                cvs = obj.c = doc.createElement('canvas');
                cvs.width = obj.w = this.naturalWidth;
                cvs.height = obj.h = this.naturalHeight;
                ctx = cvs.getContext('2d');
                ctx.drawImage(this, 0, 0);
                if (obj.w > conf.width) scale = conf.width / obj.w;
                if (obj.h * scale > conf.height) scale = conf.height / obj.h;
                obj.scaleX = obj.scaleY = scale;
                self.updataImg(obj);
                obj.x = (conf.width - obj.w) / 2;
                obj.y = (conf.height - obj.h) / 2;
                self.drawArr.push(obj);
                self.draw();
            }
            img.src = winURL.createObjectURL(file);
        },
        createLine: function() {
            var obj = {type: 'line'};
            obj.c = doc.createElement('canvas');
            obj.ctx = obj.c.getContext('2d');
            obj.c.width = this.config.width;
            obj.c.height = this.config.height;
            obj.ctx.lineWidth = 5; 
            obj.ctx.lineJoin = obj.ctx.lineCap = 'round';
            obj.ctx.strokeStyle = '#999999';
            obj.arr = [];
            this.line = obj;
        },
        updataImg: function(obj, old) {
            var cvs = doc.createElement('canvas'),
                ctx = obj.ctx = cvs.getContext('2d'),
                width = obj.w = cvs.width = obj.c.width * obj.scaleX,
                height = obj.h = cvs.height = obj.c.height * obj.scaleY;
            if (!old || old.rotate != obj.rotate) {
                switch (obj.rotate) {
                    case 1:
                        obj.w = cvs.width = height;
                        obj.h = cvs.height = width;
                        ctx.translate(height, 0);
                    break;
                    case 2:
                        ctx.translate(width, height);
                    break;
                    case 3:
                        obj.w = cvs.width = height;
                        obj.h = cvs.height = width;
                        ctx.translate(0, width);
                    break;
                }
                ctx.rotate(Math.PI * (obj.rotate / 2));
            }
            ctx.drawImage(obj.c, 0, 0, obj.c.width, obj.c.height, 0, 0, width, height);
            obj._c = cvs;
        },
        focusCvs: function(x, y) {
            var res = this.getCvs(x, y);
            if (res.cvs) {
                this.focus = res;
            } else {
                this.focus = null;
            }
        },
        mouseDown: function(x, y) {
            var mouse = this.mouse;
            mouse.down = true;
            mouse.move = false;
            mouse.x = x;
            mouse.y = y;
            if (this.onPen) {
                this.createLine();
                this.line.arr.push([x, y]);
            } else {
                this.focusCvs(x, y);
            }
        },
        mouseMove: function(x, y) {
            var mouse = this.mouse;
            if (!mouse.down) return;
            mouse.move = true;
            if (this.onPen) {
                this.line.arr.push([x, y]);
            } else {
                if (!this.focus) return;
                var cvs = this.focus.cvs;
                cvs.x += x - mouse.x;
                cvs.y += y - mouse.y;
                mouse.x = x;
                mouse.y = y;
            }
            this.draw();
        },
        mouseUp: function() {
            var mouse = this.mouse;
            if (!mouse.down) return;
            mouse.down = false;
            if (this.onPen) {
                
            }
        },
        getCvs: function(x, y) {
            var back = null, index = -1;
            for (var i = 0; i < this.drawArr.length; i++) {
                var obj = this.drawArr[i];
                if (x > obj.x && y > obj.y && x < obj.x + obj.w && y < obj.y + obj.h) {
                    if (obj.ctx.getImageData(x - obj.x, y - obj.y, 1, 1).data[3] != 0) {
                        back = obj;
                        index = i;
                    }
                }
            }
            return {cvs: back, i: index};
        },
        draw: function() {
            var cvs = this.canvas, ctx = this.canvasCtx,
                _cvs = this.cvs, _ctx = this.ctx;
            _ctx.clearRect(0, 0, _cvs.width, _cvs.height);
            for (var i = 0; i < this.drawArr.length; i++) {
                var obj = this.drawArr[i];
                _ctx.drawImage(obj._c || obj.c, obj.x, obj.y, obj.w, obj.h);
            }
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            ctx.drawImage(_cvs, 0, 0);
        }
    }
    win.EditCanvas = App;
})(window);