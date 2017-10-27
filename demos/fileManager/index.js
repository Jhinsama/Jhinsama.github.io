'use strict';

new Image().src = "folder.png";

(function (w, d, u) {

    var dom = {
        docu : $(document),
        path : $(".path"),
        prev : $(".con-prev"),
        next : $(".con-next"),
        mepr : $(".menu-prev"),
        mene : $(".menu-next"),
        relo : $(".menu-refresh"),
        bole : $("#body-left"),
        bori : $("#body-right"),
        onel : $("#grand"),
        iner : $(".folder-inner"),
        deta : $(".details"),
        menu : $("#menu"),
        open : $(".menu-item.open"),
        dolo : $(".menu-item.download"),
        temp : $("#temp")
    }

    var data = {
        pathListDOM : {
            "/" : dom.onel
        },
        pathHistory : [],
        wWidth : w.innerWidth,
        wHeight : w.innerHeight,
        details : "",
        x : u,
        y : u,
        inerW : w.innerWidth - 200
    }

    var state = {
        loading : false,
        click : false,
        input : false,
        enter : false,
        shift : false,
        ctrl : false,
        path : "",
        index : -1,
        history : false,
        mouseDown : false
    }

    function prev () {
        if (state.loading) return false;
        state.loading = true;
        state.index--;
        state.index = state.index < 0 ? 0 : state.index;
        state.history = true;
        state.loading = false;
        var path = data.pathHistory[state.index];
        if (data.pathListDOM[path]) return !setPath(u, path, true);
        testPath(path);
    }

    function next () {
        if (state.loading) return false;
        state.loading = true;
        state.index++;
        var len = data.pathHistory.length - 1;
        state.index = state.index > len ? len : state.index;
        state.history = true;
        state.loading = false;
        var path = data.pathHistory[state.index];
        if (data.pathListDOM[path]) return !setPath(u, path, true);
        testPath(path);
    }

    function refresh () {
        if (state.loading) return false;
        state.loading = true;

        createPathList(state.path, true);
        createPathContent(state.path);

        state.loading = false;
    }

    function testPath (path) {
        if (path == "/") return setPath(u, "/", true);
        var keys = [];
        for (var key in data.pathListDom) {
            keys.push(key);
        }
        var testKey = function (arr, str) {
            var repeat = false;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == str) repeat = true;
            }
            return repeat;
        }
        var pathArr = path.split("/");
        path = "";
        var len = pathArr.length - 1;
        for (var i = 0; i <= len; i++) {
            if (i == len) {
                setPath(u, path + "/" + pathArr[i], true);
            } else {
                if (!pathArr[i]) {
                    if (!testKey(keys, "/")) {
                        createPathList("/");
                    }
                } else {
                    path = path + "/" + pathArr[i];
                    if (!testKey(keys, path)) {
                        createPathList(path);
                    }
                }
            }
        }
    }

    function setPath (event, path, show) {
        if (state.loading) return false;
        state.loading = true;
        path = path ? path : ($(this).parent("li").data("path") || "/");
        var li = data.pathListDOM[path];
        if (show || !li.hasClass('on') || path != state.path) {
            li.addClass('active');
        } else {
            li.toggleClass('active');
        }
        if (path != state.path) {
            state.path = path;
            dom.path.text(path);
            for (var key in data.pathListDOM) {
                data.pathListDOM[key].removeClass('on');
            }
            var folders = path.split("/");
            folders.shift();
            var _path = "";
            var i = -1;
            do {
                if (i < 0) {
                    _path = "/";
                } else {
                    if (!folders[i]) break;
                    if (_path != "/") {
                        _path = _path + "/" + folders[i];
                    } else {
                        _path = _path + folders[i];
                    }
                }
                li = data.pathListDOM[_path];
                if (show) li.addClass('active');
                li.addClass('on');
                i++;
            } while (i < folders.length);
            createPathList(path);
            createPathContent(path);
            if (!state.history) setPathHistory(path);
            state.history = false;
        }
        state.loading = false;
        return false;
    }

    function setPathHistory (path) {
        var len = data.pathHistory.length;
        if (state.index + 1 < len) {
            data.pathHistory.splice(state.index + 1, len - state.index - 1);
        }
        for (var i = 0; i < len; i++) {
            if (data.pathHistory[i] == path) data.pathHistory.splice(i, 1);
        }
        data.pathHistory.push(path);
        state.index = data.pathHistory.length - 1;
    }

    function createPathList (path, reload) {
        var li = data.pathListDOM[path];
        var ul = li.children(".file-list");
        if (ul.length == 0) {
            ul = $("<ul class='file-list'></ul>");
            li.append(ul);
        } else {
            if (!reload) return;
            ul.html("");
        }
        for (var i = 0; i < d[path].length; i++) {
            if (d[path][i].type == "folder") {
                var _path = (path == "/" ? "" : path) + "/" + d[path][i].name;
                var li = $("<li data-path='" + _path + "'></li>");
                li.html("<a class='folder' href='javascript:void(0)'>" + d[path][i].name + "</a>");
                ul.append(li);
                data.pathListDOM[_path] = li;
            }
        }
    }

    function createPathContent (path) {
        var folderCount = 0, fileCount = 0;
        var content = "";
        for (var i = 0; i < d[path].length; i++) {
            content += "<div class='child-box'>";
            content += "<a class='child";
            content += d[path][i].type == "folder" ? " folder" : "";
            content += "' data-path='";
            content += (path == "/" ? "" : path) + "/" + d[path][i].name;
            content += "' href='javascript:void(0)'><div class='child-icon icon-";
            content += d[path][i].type;
            content += "'></div><div class='child-name'>";
            content += d[path][i].name;
            content += "</div></a></div>";
            if (d[path][i].type == "folder") {
                folderCount++;
            } else {
                fileCount++;
            }
        }
        dom.iner.html(content);
        var details = "";
        details += folderCount ? ("<div>Folder: " + folderCount + "</div>") : "";
        details += fileCount ? ("<div>File: " + fileCount + "</div>") : "";
        details = details ? details : "空荡荡的";
        data.details = details;
        dom.deta.html(details);
    }

    function pathClick (event) {
        if (state.click) return;
        state.click = true;
        event = event || w.event;
        if (document.all) {
            w.event.returnValue = false;
        } else {
            event.preventDefault();
        }
        if (state.enter) return setPath(u, $(this).data("path"));
        this.focus();
        setTimeout(function () {state.click = false;}, 500);
    }

    function enterFolder (event) {
        event = event || w.event;
        if (document.all) {
            w.event.returnValue = false;
        } else {
            event.preventDefault();
        }
        if ($(this).hasClass('folder') || $(this).hasClass('open')) {
            setPath(u, $(this).data("path"));
        } else {
            console.log("download");
        }
    }

    function contextMenu (event) {
        event = event || w.event;
        var target = $(event.target);
        if (target.closest(".folder-inner").length > 0) {
            showContextMenu(event);
            return false;
        } else if (target.closest("#menu").length > 0) {
            return false;
        } else {
            dom.menu.css("visibility", "hidden");
        }
    }

    function showContextMenu (event) {
        var x = event.clientX, y = event.clientY;
        dom.menu.css("visibility", "hidden");
        var target = $(event.target).closest(".child");
        if (target.length > 0) {
            var path = target.data("path");
            if (target.hasClass("folder")) {
                dom.menu.removeClass('download').addClass('open');
                dom.open.data("path", path);
            } else {
                dom.menu.removeClass('open').addClass('download');
                dom.dolo.data("path", path);
            }
        } else {
            dom.menu.removeClass('download').removeClass('open');
        }
        var menuW = dom.menu.width() + 10, menuH = dom.menu.height() + 10;
        if (data.wWidth - x < menuW) {
            dom.menu.css("left", data.wWidth - menuW + "px");
        } else {
            dom.menu.css("left", x + "px");
        }
        if (data.wHeight - y < menuH) {
            dom.menu.css("top", data.wHeight - menuH + "px");
        } else {
            dom.menu.css("top", y + "px");
        }
        dom.menu.css("visibility", "visible");
    }

    function pathFocus (event) {
        event = event || w.event;
        dom.deta.html("");
    }

    function pathBlur (event) {
        event = event || w.event;
        dom.deta.html(data.details);
    }

    function defaultClick (event) {
        event = event || w.event;
        dom.menu.css("visibility", "hidden");
    }

    function keyDown (event) {
        event = event || w.event;
        switch (event.keyCode) {
            case 13:
                state.enter = true;
            break;
            case 16:
                state.shift = true;
            break;
            case 17:
                state.ctrl = true;
            break;
        }
    }

    function keyUp (event) {
        event = event || w.event;
        switch (event.keyCode) {
            case 8:
                if (!state.input) prev();
            break;
            case 13:
                state.enter = false;
            break;
            case 16:
                state.shift = false;
            break;
            case 17:
                state.ctrl = false;
            break;
            case 37:
                if (!state.input) prev();
            break;
            case 39:
                if (!state.input) next();
            break;
        }
    }

    function mouseDown (event) {
        state.mouseDown = true;
        event = event || w.event;
        data.x = event.clientX;
        data.y = event.clientY;
        dom.temp.css({
            "top" : data.y + "px",
            "left" : data.x + "px",
            "width" : 0,
            "height" : 0
        });
        if ($(event.target).closest(".child").length > 0) return false;
    }

    function mouseMove (event) {
        if (!state.mouseDown) return;
        event = event || window.event;
        var x = event.clientX, y = event.clientY;
        var _x, _y;
        if (x > data.x) {
            if (x > data.wWidth) x = data.wWidth;
            _x = x - data.x;
            dom.temp.css("width", _x + "px");
        } else {
            if (x < 200) x = 200;
            _x = x - data.x;
            dom.temp.css({
                "width" : - _x + "px",
                "left" : x + "px"
            });
        }
        if (y > data.y) {
            if (y > data.wHeight - 80) y = data.wHeight - 80;
            _y = y - data.y;
            dom.temp.css("height", _y + "px");
        } else {
            if (y < 50) y = 50;
            _y = y - data.y;
            dom.temp.css({
                "height" : - _y + "px",
                "top" : y + "px"
            });
        }
    }

    function mouseUp (event) {
        if (!state.mouseDown) return;
        state.mouseDown = false;
        dom.temp.css({
            "width" : 0,
            "height" : 0
        });
    }

    function storage () {
        var path = "/";
        if (w.sessionStorage) {
            var pathHistory = w.sessionStorage.getItem("pathHistory");
            if (pathHistory) {
                data.pathHistory = JSON.parse(pathHistory);
                state.history = true;
            }
            var index = w.sessionStorage.getItem("pathHistoryIndex");
            if (index) state.index = parseInt(index);
            path = w.sessionStorage.getItem("path") || "/";
        }
        testPath(path);
    }

    function unLoad () {
        if (w.sessionStorage) {
            w.sessionStorage.setItem("path", state.path);
            w.sessionStorage.setItem("pathHistory", JSON.stringify(data.pathHistory));
            w.sessionStorage.setItem("pathHistoryIndex", state.index);
        }
    }

    function reSize() {
        data.wWidth = w.innerWidth;
        data.wHeight = w.innerHeight;
        data.inerW = w.innerWidth - 200;
    }

    function init () {
        storage();
        dom.prev.click(prev);
        dom.next.click(next);
        dom.mepr.click(prev);
        dom.mene.click(next);
        dom.relo.click(refresh);
        dom.open.click(enterFolder);
        dom.dolo.click(enterFolder);
        dom.docu.click(defaultClick);
        dom.bole.on("click", "a", setPath);
        dom.iner.on("click", ".child", pathClick);
        dom.iner.on("dblclick", ".child", enterFolder);
        dom.iner.on("focus", ".child", pathFocus);
        dom.iner.on("blur", ".child", pathBlur);
        dom.docu.bind("contextmenu", contextMenu);
        dom.docu.keydown(keyDown);
        dom.docu.keyup(keyUp);
        // dom.iner.mousedown(mouseDown);
        // dom.docu.mousemove(mouseMove);
        // dom.docu.mouseup(mouseUp);
        dom.docu.bind("dragstart", function () {return false;});
        dom.docu.bind("selectstart", function () {return false;});

        w.onunload = unLoad;
        w.onresize = reSize;
    }

    init();

})(window, data);