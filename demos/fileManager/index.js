'use strict';

new Image().src = "folder.png";

(function (w, d, u) {

    var dom = {
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
        dolo : $(".menu-item.download")
    };

    var data = {
        pathListDOM : {
            "/" : dom.onel
        },
        pathHistory : [],
        wWidth : w.innerWidth,
        wHeight : w.innerHeight
    };

    var state = {
        loading : false,
        enter : false,
        path : "",
        index : -1,
        history : false
    };

    function prev () {
        console.log("prev");
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
        console.log("next");
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
        console.log("refresh");
        if (state.loading) return false;
        state.loading = true;

        createPathList(state.path, true);
        createPathContent(state.path);

        state.loading = false;
    }

    function testPath (path) {
        console.log("testPath");
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
        console.log("setPath");
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
        console.log("setPathHistory");
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
        console.log("createPathList");
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
        console.log("createPathContent");
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
        var detalis = "";
        detalis += folderCount ? (folderCount + "个文件夹&emsp;") : "";
        detalis += fileCount ? (fileCount + "个文件") : "";
        detalis = detalis ? detalis : "空荡荡的";
        dom.deta.html(detalis);
    }

    function pathFocus (event) {
        console.log("pathFocus");
        event = event || w.event;
        if (document.all) {
            w.event.returnValue = false;
        } else {
            event.preventDefault();
        }
        if (state.enter) return setPath(u, $(this).data("path"));
        this.focus();
    }

    function enterFolder (event) {
        console.log("enterFolder");
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
        console.log("contextMenu");
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
        console.log("showContextMenu");
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

    function init () {
        var path = "/";
        if (w.sessionStorage) {
            path = w.sessionStorage.getItem("path") || "/";
        }
        testPath("/");
        dom.prev.click(prev);
        dom.next.click(next);
        dom.mepr.click(prev);
        dom.mene.click(next);
        dom.relo.click(refresh);
        dom.bole.on("click", "a", setPath);
        dom.iner.on("click", ".child", pathFocus);
        dom.iner.on("dblclick", ".child", enterFolder);
        dom.open.click(enterFolder);
        dom.dolo.click(enterFolder);

        $(document).bind("contextmenu", contextMenu);
        $(document).click(function (event) {
            event = event || w.event;
            dom.menu.css("visibility", "hidden");
        });
        $(document).keydown(function (event) {
            event = event || w.event;
            if (event.keyCode == 13) state.enter = true;
        });
        $(document).keyup(function (event) {
            event = event || w.event;
            switch (event.keyCode) {
                case 13:
                    enter = false;
                break;
                case 37:
                    prev();
                break;
                case 39:
                    next();
                break;
            }
        });
        w.onunload = function () {
            if (w.sessionStorage) w.sessionStorage.setItem("path", state.path);
        }
    }

    init();

})(window, data);