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

### 使用教程

暂略，可参考example/pages/app.js