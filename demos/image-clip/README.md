# 图片裁切插件

一个简单易用的图片裁切工具，实现了 两点触控和鼠标滚轮缩放、单点触控及鼠标拖动改变裁切位置。
你可以很轻松的把他嵌入你的网页里面，并且该插件只负责裁切图片，只包含少量的css样式。
所以呢，想要好看的界面只有靠你们自己去实现咯。。。

> 如果你们有幸发现了什么BUG 或者有什么更好的提议的话 可以发送至邮箱 `a598805559@hotmail.com` 。 十分感谢！
> emmm ~

## 使用说明

如果引入 [EXIF.js](https://github.com/exif-js/exif-js) 图片会自动修正方向，不要问我为什么要修正方向，iphone拍的照片就是这么坑。。。

> 查看效果[点这里](https://jhinsama.github.io/demos/image-clip/)

```javascript
    /**
     * Clip(dom,options)
     *
     * dom : 用来当做容器的块级元素 可以是$(".dom")
     *
     * options :
     *      size 裁切框的大小 格式可以是 size: {w: Number, h: Number} 也可以是 size: Number 后者设置宽高相等 默认等于容器的宽高
     *      max 图片最大边的大小 值为 Number 类型
     *      min 图片最小边的大小 值为 Number 类型
     *      scale 当图片宽高均小于 max 或 min 时是否等比例缩放 值为 0 或 1 默认 0
     *      color 中心裁切窗口边框的颜色
     *      image 用来裁剪时预览的 <img> 标签   可以是Array 比如$(".image")
     *
     * function :
     *      start(file) 开始进行裁切 传入File对象
     *      end(function(base64){}) 完成裁切 传入回调函数 base64为返回的base64编码格式的图片数据
     *      refresh() 刷新当前状态
     */
```

### 试例

```html

<style>
    #clip {
        width: 750px;
        height: 750px;
    }
</style>
<div id="clip"></div>
<input type="file" id="file" accept="image/png,image/gif,image/jpeg"/>
<button type="button" id="confirm">裁切</button>
<img src="" id="img">

```

```javascript

// 创建实例
var a = new Clip(document.getElementById("clip"),{
    size : {
        w : 510,
        h : 680
    }
    ,max : 750
    // ,min : 750 // 如果同时传入 max 和 min  则只有max生效
    ,scale : 1
    ,color : "rgba(255,100,255,.5)"
    ,image : document.getElementById("img")
});

// 监听文件选框改变事件
document.getElementById("file").addEventListener("change",function(){
    // 传入 File 对象
    a.start(this.files[0])
})

// 监听确认按钮点击事件
document.getElementById("confirm").addEventListener("click",function(){
    // 调用 end 方法，传入回调函数
    a.end(function(data){
        // data 是传回的 base64 编码格式的图片
        document.getElementById("img").src = data;
    })
})

// 清除当前选中的图片
a.refresh();

```