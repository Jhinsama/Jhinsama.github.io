var categories = [
    {type: 0, name: "全部"},
    {type: 1, name: "水/饮料"},
    {type: 2, name: "休闲食品", def: true}
];
var commoditys = [
    [
        {
            value: 0,
            name: "茶叶蛋",
            img: "",
            price: 4.5,
            oPrice: 5,
            tag: ["今日特价", "热销"]
        },
        {
            value: 1,
            name: "农夫山泉",
            img: "",
            price: 1.5
        },
        {
            value: 2,
            name: "辣条",
            img: "",
            price: 2,
            tag: ["热销"]
        }
    ],
    [
        {
            value: 1,
            name: "农夫山泉",
            img: "",
            price: 1.5
        }
    ],
    [
        {
            value: 0,
            name: "茶叶蛋",
            img: "",
            price: 4.5,
            oPrice: 5,
            tag: ["今日特价", "热销"]
        },
        {
            value: 2,
            name: "辣条",
            img: "",
            price: 2,
            tag: ["热销"]
        }
    ]
];
(function (w, u) {
    $(document).ready(function () {
        var data = w.sessionStorage.getItem("cartData");
        if (data) {
            typeData = {ware: {}};
            cartData = JSON.parse(data);
            for (var key in cartData) {
                cartData[key].dom = createCartWare(cartData[key].obj);
                cartData[key].dom.find(".num").text(cartData[key].num);
                $cartInerBox.append(cartData[key].dom);
                createCommodity(cartData[key].obj).find(".control-num").addClass('on').find(".num").text(cartData[key].num);
            }
            cartInerScroll.refresh();
            calcTotal();
        }
        data = w.sessionStorage.getItem("currentType");
        initCategories(categories, data);

        wx.ready(function () {
            var title = "",
                desc = "",
                link = "",
                imgUrl = "",
                success = function () {

                },
                cancel = function () {

                }
            wx.onMenuShareTimeline({
                title: title,
                link: link,
                imgUrl: imgUrl,
                success: success,
                cancel: cancel
            });
            wx.onMenuShareAppMessage({
                title: title,
                desc: desc,
                link: link,
                imgUrl: imgUrl,
                success: success,
                cancel: cancel
            });
            $QRcode.click(function () {
                wx.scanQRCode({
                    desc: "scanQRCode desc",
                    needResult: 0,
                    scanType: ["qrCode", "barCode"],
                    success: function (res) {
                        alert(JSON.stringify(res));
                    },
                    error: function (res) {
                        if (res.errMsg.indexOf('function_not_exist') > 0) {
                            alert('版本过低请升级');
                        }
                    }
                });
            });
        });
        wx.error(function (res) {
            console.log(res);
        });
        wx.config({
            debug: false,
            appId: "wx1b38c412b11dd4fb",
            timestamp: "1512372319",
            nonceStr: "VO6PD9Tlxsa1g3KB",
            signature: "24f2e6ea09ee21606359b5ab451711286b575f78",
            jsApiList: [
                "onMenuShareTimeline",
                "onMenuShareAppMessage",
                "scanQRCode"
            ]
        });
    });
    document.addEventListener('touchmove',function (e) {
        e.preventDefault();
    }, (function () {
        var supportsPassiveOption = false;
        try {
            addEventListener("test", null, Object.defineProperty({}, 'passive', {
                get: function () {
                    supportsPassiveOption = true;
                }
            }));
        } catch(e) {}
        return supportsPassiveOption;
    })() ? {
        capture: false,
        passive: false
    } : false);

    function parabola(config){
        var b = 0,
        INTERVAL = 15,
        timer = null,
        x1,y1,x2,y2,originx,originy,diffx,diffy;
        this.config = config || {};
        this.origin = $(this.config.origin)||null;
        this.target = $(this.config.target)||null;
        this.element = $(this.config.element)||null;
        this.a = this.config.a || 0.004;
        this.time = this.config.time || 1000;
        this.init = function(){
            var offset1 = this.origin.offset(),
                offset2 = this.target.offset(),
                offset3 = this.element.offset();
            x1 = offset1.left + offset1.width / 2 - offset3.width / 2;
            y1 = offset1.top + offset1.height / 2 - offset3.height / 2;
            x2 = offset2.left + offset2.width / 2 - offset3.width / 2;
            y2 = offset2.top + offset2.height / 2 - offset3.height / 2;
            originx = x1;
            originy = y1;
            diffx = x2-x1;
            diffy = y2-y1,
            speedx = diffx/this.time;
            b = (diffy - this.a*diffx*diffx)/diffx;
            this.element.css({
                left: x1,
                top: y1
            })
            return this;
        }
        this.moveStyle = function(){
            var moveStyle = 'position',
            testDiv = document.createElement('div');
            if('placeholder' in testDiv){
                ['','ms','moz','webkit'].forEach(function(pre){
                    var transform = pre + (pre ? 'T' : 't') + 'ransform';
                    if(transform in testDiv.style){
                        moveStyle = transform;
                    }
                });
            }
            return moveStyle;
        }
        this.move = function(){
            var start = new Date().getTime(),
            moveStyle = this.moveStyle(),
            _this = this;
            timer = setInterval(function(){
                if(new Date().getTime() - start > _this.time){
                    clearInterval(timer);
                    _this.element.css({
                        left: x2,
                        top: y2
                    });
                    typeof _this.config.callback === 'function' && _this.config.callback(_this.element);
                    return;
                }
                x = speedx * (new Date().getTime() - start);
                y = _this.a*x*x + b*x;
                if(moveStyle === 'position'){
                    _this.element.css({
                        left: x+originx,
                        top: y+originy
                    });
                }else{
                    if(window.requestAnimationFrame){
                        window.requestAnimationFrame(_this.element[0].style[moveStyle] = 'translate('+x+'px,'+y+'px)');
                    }else{
                        _this.element[0].style[moveStyle] = 'translate('+x+'px,'+y+'px)';
                    }
                }
            },INTERVAL);
            return this;
        }
        this.init();
    }
    function addCartAnimate (origin) {
        $iconCart.removeClass('animate');
        var circle = document.createElement("div");
        circle.className = "circle";
        circle.innerHTML = "<div></div>";
        document.body.appendChild(circle);
        new parabola({
            origin: origin,
            element: circle,
            target: "#target",
            a: .007,
            time: 500,
            callback: function (circle) {
                circle.remove();
                $iconCart.addClass('animate');
            }
        }).move();
    }
    function showCart () {
        if ($cartInerNum.text() == "0") {
            showToast("请选择商品");
        } else {
            cartInerScroll.scrollTo(0, 0);
            $body.addClass('show-cart');
            $confirm.text("立即支付").data("state", 1);
            state.showCart = true;
        }
    }
    function hideCart () {
        if (state.showCart) {
            $body.removeClass('show-cart');
            $confirm.text("结 算").data("state", 0);
            state.showCart = false;
        }
    }
    function showToast (str, time) {
        $toast.text(str);
        if (state.showToast) {
            clearTimeout(state.showToast);
        } else {
            $body.addClass('show-toast');
        }
        state.showToast = setTimeout(hideToast, time || 1500);
    }
    function hideToast () {
        if (state.showToast) {
            clearTimeout(state.showToast);
            $body.removeClass('show-toast');
            state.showToast = undefined;
        }
    }
    function initCategories (arr, type) {
        if (!typeData) typeData = {};
        var $categoriesBox = $categories.children();
        var defType = arr[0].type;
        for (var i = 0; i < arr.length; i++) {
            if (type != null) {
                if (arr[i].type == type) defType = type;
            } else {
                if (arr[i].def) defType = arr[i].type;
            }
            var nav = $("<div>");
            nav[0].className = "txt-over nav";
            nav.data("type", arr[i].type);
            nav.text(arr[i].name);
            $categoriesBox.append(nav);
            typeData[arr[i].type] = {};
            typeData[arr[i].type]["nav"] = nav;
        }
        categoriesScroll.refresh();
        if (!typeData["ware"]) typeData["ware"] = {};
        $nav = $categoriesBox.children();
        $nav.bind("tap", function () {
            var $this = $(this);
            setCommodityList ($this.data("type"));
        });
        setCommodityList(defType);
    }
    function setCommodityList (type) {
        if (state.currentType == type) return;
        if (state.currentType != null) typeData[state.currentType].nav.removeClass('on');
        typeData[type].nav.addClass('on');
        state.currentType = type;
        if (!state.loading) {
            state.loading = true;
            state.loadType = type;
            $commoditysBox.html("");





            state.loading = false;
            if (state.loadType != state.currentType) {
                setCommodityList(state.currentType);
            } else {
                var data = commoditys[type];
                for (var i = 0; i < data.length; i++) {
                    var ware = typeData.ware[data[i].value];
                    if (!ware){
                        ware = createCommodity(data[i]);
                    } else {
                        ware = typeData.ware[data[i].value].dom;
                    }
                    $commoditysBox.append(ware);
                }
                commodityScroll.refresh();
                w.sessionStorage.setItem("currentType", state.currentType);
            }





        }
    }
    function createCommodity (obj) {
        var ware = $("<div>"), html = "";
        ware[0].className = "commodity";
        html += "<div class='commodity-img' data-ware='";
        html += obj.value;
        html += "'><div><img src='";
        html += obj.img ? obj.img : "";
        html += "'></div></div><div class='commodity-main'><div><div class='commodity-name txt-over'>";
        html += obj.name;
        html += "</div><div class='commodity-tag'>";
        html += "";
        html += "</div><div class='commodity-price'><div class='now'>￥";
        html += obj.price.toFixed(1);
        html += "</div>";
        if (obj.oPrice) {
            html += "<div class='old'>￥";
            html += obj.oPrice.toFixed(1);
            html += "</div>";
        }
        html += "</div>";
        html += "<div class='control-num' data-ware='";
        html += obj.value;
        html += "'><div class='mask'></div><div class='pre'></div><div class='num'>0</div><div class='add'></div></div></div></div>";
        ware.html(html);
        typeData.ware[obj.value] = {
            dom: ware,
            obj: obj
        }
        return ware;
    }
    function createCartWare (obj) {
        var ware = $("<div>"), html = "";
        ware[0].className = "cart-commodity";
        html += "<div class='txt-over'>";
        html += obj.name;
        html += "</div><div class='control-num on' data-ware='";
        html += obj.value;
        html += "'><div class='mask'></div><div class='pre'></div><div class='num'>0</div><div class='add'></div></div>";
        ware.html(html);
        return ware;
    }
    function add (value, num) {
        if (!cartData[value]) {
            cartData[value] = {
                dom: createCartWare(typeData.ware[value].obj),
                obj: typeData.ware[value].obj,
                num: 0
            }
            $cartInerBox.append(cartData[value].dom);
            cartInerScroll.refresh();
        }
        cartData[value].num = num || cartData[value].num + 1;
        cartData[value].dom.find(".num").text(cartData[value].num);
        calcTotal();
        w.sessionStorage.setItem("cartData", JSON.stringify(cartData));
    }
    function pre (value, num) {
        cartData[value].num = num || cartData[value].num - 1;
        if (cartData[value].num == 0) {
            cartData[value].dom.remove();
            cartInerScroll.refresh();
            delete cartData[value];
        } else {
            cartData[value].dom.find(".num").text(cartData[value].num);
        }
        calcTotal();
        if (getVal().length == 0) hideCart();
        w.sessionStorage.setItem("cartData", JSON.stringify(cartData));
    }
    function calcTotal () {
        var num = 0, total = 0;
        for (var key in cartData) {
            num += cartData[key].num;
            total += cartData[key].num * cartData[key].obj.price;
        }
        setTotalMsg({
            num: num,
            total: total
        });
    }
    function setTotalMsg (data) {
        if (data.num == 0) {
            $cartBadge.hide();
        } else {
            $cartBadge.show().text(data.num);
        }
        $cartInerNum.text(data.num);
        $total.text(data.total.toFixed(1));
    }
    function setVal (data) {
        var arr = data;
        if (!(data instanceof Array)) arr = [data];
        for (var i = 0; i < arr.length; i++) {
            var ware = typeData.ware[arr[i].value];
            var dom, numEl, num;
            if (ware) {
                dom = ware.dom;
                numEl = dom.find(".num");
                num = ~~numEl.text();
                if (num == 0) dom. find(".control-num").addClass('on');
                num++;
                num > 99 ? 99 : num;
                numEl.text(num);
            } else {
                dom = createCommodity(arr[i]);
                num = 1;
                dom. find(".control-num").addClass('on');
                dom.find(".num").text(num);
            }
            add(arr[i].value, num);
        }
    }
    function getVal () {
        var arr = [];
        for (var key in cartData) {
            arr.push({
                val: key,
                num: cartData[key].num
            });
        }
        return arr;
    }
    function clear () {
        for (var key in cartData) {
            cartData[key].dom.remove();
            typeData.ware[key].dom.find(".control-num").removeClass('on').find(".num").text("0");
            delete cartData[key];
        }
        cartInerScroll.refresh();
        hideCart();
        calcTotal();
        w.sessionStorage.removeItem("cartData");
    }

    var $docu = $(document),
        $body = $(document.body),
        $mask = $("#mask"),
        $toast = $("#toast"),
        $QRcode = $(".scan-qr"),
        $categories = $(".categories"),
        $categoriesBox = $categories.children(),
        $commoditys = $(".commodity-list"),
        $commoditysBox = $commoditys.children(),
        $iconCart = $(".icon-cart"),
        $cartInerNum = $(".cart-iner-num"),
        $cartBadge = $(".cart-badge"),
        $cartIner = $(".cart-commodity_box"),
        $cartInerBox = $cartIner.children(),
        $total = $(".total-price"),
        $confirm = $(".btn-confirm"),
        $nav;

    var state = {
        loading: false,
        showCart: false,
        showToast: false,
        currentType: null,
        loadType: null
    }

    var typeData, cartData = {};

    var categoriesScroll = new IScroll($categories[0], {
        tap: true
    }), commodityScroll = new IScroll($commoditys[0], {
        tap: true,
    }), cartInerScroll = new IScroll($cartIner[0], {
        tap: true
    });

    $confirm.click(function () {
        var $this = $(this);
        if ($this.data("state") == "1") {
            var val = getVal();


            // val 是一个 Array 里面包含了购物车中每一个商品的 值(val) 和 数量(num)


        } else {
            showCart();
        }
    });

    $iconCart.click(function () {
        if (state.showCart) {
            hideCart();
        } else {
            showCart();
        }
    });

    $mask.click(function () {
        if (state.showCart) {
            hideCart();
        }
        hideToast();
    });

    $commoditysBox.on("tap", ".add", function(){
        var $this = $(this),
            $parent = $this.parent(),
            $numDom = $this.siblings('.num');
        var num = ~~$numDom.text();
        num++;
        num > 99 ? 99 : num;
        $numDom.text(num);
        $parent.addClass('on');
        add($parent.data("ware"), num);
        addCartAnimate(this);
    });

    $commoditysBox.on("tap", ".pre", function(){
        var $this = $(this),
            $parent = $this.parent(),
            $numDom = $this.siblings('.num');
        var num = ~~$numDom.text();
        num--;
        num = num < 0 ? 0 : num;
        $numDom.text(num);
        if (num < 1) $parent.removeClass('on');
        pre($parent.data("ware"), num);
    });

    $cartInerBox.on("tap", ".add", function () {
        var $this = $(this),
            $parent = $this.parent(),
            $numDom = $this.siblings('.num');
        var ware = $parent.data("ware"),
            num = ~~$numDom.text();
        num++;
        num > 99 ? 99 : num;
        typeData.ware[ware].dom.find(".num").text(num);
        add(ware, num);
    });

    $cartInerBox.on("tap", ".pre", function () {
        var $this = $(this),
            $parent = $this.parent(),
            $numDom = $this.siblings('.num');
        var ware = $parent.data("ware"),
            num = ~~$numDom.text();
        num--;
        num = num < 0 ? 0 : num;
        typeData.ware[ware].dom.find(".num").text(num);
        if (num < 1) typeData.ware[ware].dom.find(".control-num").removeClass('on');
        pre(ware, num);
    });

})(window);