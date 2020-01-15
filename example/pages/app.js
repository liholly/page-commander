$(function () {
	SPA({
		//启用缓存
		// cacheOn: true,

		//自动匹配
		rules: {
			//key表示可选的待刷新内容区域(all表示所有区域)，value表示哪些页面需要刷新这个区域(支持正则、字符串)，多个规则可使用数组
			link: {
				'main': '/example/pages/',
				'footer': '/example/pages/',
				//'all': []
			},
			//为待刷新区域绑定jquery选择器，可指定多个规则，匹配到目标则停止(如果未设flag而页面又找不到对应的flag，则默认为ID选择器)
			// flag: {
			// 	'main': '#main',
			// 	'sidebar': '#sidebar',
			// }
		},

		//data-ref表达式分隔符
		//split: '|',

		//loading动画 index:0表示所在界面的位置选择器 index:1是动画html 支持html、函数
		loading: ['body', 'loading ...'],
		// loading: function (wraps, updated) {
		//
		// 	//更新完成后的动作
		// 	updated(function (data) {
		//
		// 	});
		// },

		//加载超时 ms
		//timeout: 10000,

		//数据返回时拦截 返回处理好的html字符串 只在请求成功时执行。get$是一个工具函数，用来把html字符串转化为JQuery对象，以使用JQuery方法操作结果，注意要复制db后再操作，该函数比较影响效率，不推荐使用
		intercept: function (html, get$) {
			return html;
		},

		//新内容插入 有多个flag则被调用多次 可以用来做离场效果 注意：此时新内容并未正式插入DOM
		onInsert: function (oldEl, newEl, next) {
			next();
		},
	});
});