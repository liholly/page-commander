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


### 使用示例

参考example/pages/app.js