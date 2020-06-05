### 关于PageCommander

纯前端实现，无需改后端代码，快速将多页面的站点转化为单页应用。
<br>
实现更友好的界面转场效果。
<br>
还可以节省网络资源。
<br>
不会影响SEO，不影响页面收录。



### 开始使用

```html
<script src="./jquery-2.1.4.js" type="text/javascript"></script>
<script src="./pageCommander.js" type="text/javascript"></script>
<scirpt>
$(function(){
    SPA({
        //是否缓存页面
        cacheOn: true,
        
        //定义规则
        rules: {
            link: {
                'main': ['/example/pages/'],
                'footer': ['/example/pages/'],
            }
        },
    	
        //定义loading动画
        loading: ['body', 'loading ...'],
    })
})
</scirpt>
```

### 定义规则的第二种方式
直接在a标签上添加data-ref属性，如：`<a href="/about.html" data-ref="main|sidebar">关于我们</a>"`表示加载about.html后，替换main和sidebar的内容。
<br>
当在入口程序填写了rules配置，同时又添加了a标签的data-ref属性的时候，则会优先使用data-ref的规则。

### 注意
js脚本的运行时机：在html插入的时候，script标签的js脚本将会被运行，如果是src的引用，则立即请求并执行。
<br>
这是浏览器渲染的策略，并非插件的特别处理。
<br>
在页面有幻灯片、tab控件有js脚本控制的，则务必当心，应该把触发执行的脚本包含在组件的html中，这样就每次都可以重新执行而不会出错。但这也会导致一些问题，比如每次执行幻灯片脚本，则每次的脚本实例都存储在内存中，而得不到释放。
比如你在index的main内容区<script>var a = {b:1}</script>定义了一个a对象，那么在about的页面中访问a.b，同样可以访问到。
所以，本插件的定位是小型的网站，特别是重排版轻交互的网站，这类网站对以上缺陷不那么敏感。
<br>
在后面的改进中，本插件会增加全局资源的管理方案。

### 使用示例

参考example/pages/app.js