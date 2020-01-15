import {
	keys,
	extend,
	split,
	get,
	size,
	each,
	isFunction,
	isString,
	isArray,
	compact,
	uniq,
	includes
} from './helper/index';

export default function (config) {
	var conf = extend({split: '|', namespace: true, loading: 'loading ...', timeout: 10000}, config);
	var loadingHtmlTpl = '<div style="display: block; width: auto; height: auto; position: fixed; left: 0; top:0">${loading}</div>';
	var $loading;
	var $title = $('title');
	var __setTimeout;
	var __isTimeout = false;
	var __updatedData = {success: null, db: null};
	var __updated = function (fn) {
		fn && fn(__updatedData);
	};
	var __cache = {};

	function refreshPage() {
		location.reload();
	}

	function timeout(containers) {
		each(containers, function (container) {
			container.html('<div> :< 内容加载失败了！<a href="javascript:refreshPage()">点此刷新页面</a></div>');
		})
	}

	function loadingStart(containers) {
		var loading = conf.loading;
		if (!loading) return;
		if (isFunction(loading)) loading(containers, __updated);
		else {
			loading = isString(loading) ? loading : loading[1];
			var loadingWrap = isString(loading) ? 'body' : (loading[0] || 'body');
			var loadingHtml = loading.indexOf('<div') > -1 ? loading : loadingHtmlTpl.replace('${loading}', loading);

			$loading = $(loadingHtml);
			$(loadingWrap).append($loading);
		}
	}

	function loadingEnd(success, db, $body) {
		__updatedData.success = success;
		__updatedData.db = db;
		if ($body) __updatedData.$body = $body;
		__updated();

		($loading || {remove: new Function}).remove();
	}

	function append2($body, $containers, targets) {
		handleHtml($body);

		$title.text($body.find('title').text());

		each($containers, function ($container, flag) {
			var oldEl = $container;
			var newEl = $body.find(targets[flag]);

			function run() {
				$container.children().remove();
				$container.html(newEl.children());
			}

			conf.onInsert ? conf.onInsert(oldEl, newEl, run) : run();
		});

		//$body.children().remove();
	}

	function getSltTag(flag) {
		return '[data-flag="' + flag + '"]'
	}

	function get$(htmlStr) {
		return $('<div></div>').append($(htmlStr));
	}

	function $isEmpty($el) {
		return ($el || []).length < 1
	}

	function find$BodyFn($body) {
		return function (slt) {
			return $body.find(slt)
		}
	}

	function toPage(state) {
		var flags = split(state.flag || '', conf.split);
		var containers = {};
		var targets = {};

		each(flags, function (flag) {
			targets[flag] = getSltTag(flag);
			containers[flag] = $(targets[flag]);
		});

		loadingStart(containers);

		__isTimeout = false;
		clearTimeout(__setTimeout);

		function success(db) {
			var $body = get$(db);
			clearTimeout(__setTimeout);
			append2($body, containers, targets);
			loadingEnd(true, db, $body);
		}

		function fail(db) {
			timeout(containers);
			clearTimeout(__setTimeout);
			loadingEnd(false, db);
		}

		if (conf.timeout) {
			__setTimeout = setTimeout(function () {
				__isTimeout = true;
				clearTimeout(__setTimeout);
			}, conf.timeout);
		}

		if (!__isTimeout) {
			var cache = conf.cacheOn ? __cache[state.url] : null;
			if (cache) success(cache);
			else $.get(state.url).then(function (db) {
				var __db = conf.intercept ? conf.intercept(db, get$) : db;
				__isTimeout ? fail(__db) : success(__db, containers, targets);
				if (conf.cacheOn && !cache) __cache[state.url] = db;
			}).fail(fail);
		}
	}

	function backPage(e) {
		toPage(e.state);
	}

	function test(org, tar) {
		return isString(tar) ? org.indexOf(tar) > -1 : tar.test(org)
	}

	function handleATag($body) {
		var find = find$BodyFn($body);
		var $aTags = find('a');

		$aTags.each(function (index, el) {
			var $a = $(el);
			var href = $a.attr('href');
			var dataRefs = compact(split($a.attr('data-ref'), conf.split));
			var rulesLink = get(conf, 'rules.link');

			//匹配规则，发现有符合的则写入a标签的data-ref
			each(rulesLink, function (val, key) {
				var isTest = false;

				if (isArray(val)) isTest = includes(val, function (v) {
					return test(href, v)
				});
				else isTest = test(href, val);

				if (isTest && !includes(dataRefs, key)) dataRefs.push(key);
			});

			//去除无效的空值 ['','main'] => ['main']
			dataRefs = compact(dataRefs);

			if (size(dataRefs)) $a.attr('data-ref', dataRefs.join(conf.split));
		});

		find('[data-ref]').click(function (event) {
			var $link = $(this);
			var href = $link.attr('href');
			var refs = $link.attr('data-ref');
			var allRefresh = includes(split(refs || '', conf.split), 'all');

			if (allRefresh) return;

			event.preventDefault();

			var state = {
				url: href,
				flag: refs
			};
			toPage(state);
			history.pushState(state, null, href);
		});
	}

	function handleFlag($body) {
		var find = find$BodyFn($body);

		//处理兼容 没有设置link或flag两种可能的情况
		var flagRules = get(conf, 'rules.flag');
		var flags = flagRules ? keys(flagRules) : keys(get(conf, 'rules.link'));

		//如果link和flag都没有设置，则从a标签中找flag
		var aTags = find('[data-ref]');
		aTags.each(function (index, a) {
			flags.concat(split(find(a).attr('data-ref') || '', conf.split))
		});

		//去假去重
		flags = uniq(compact(flags));

		each(flags, function (flagName) {
			//当前flag已经在元素有设定 则不处理
			if (!$isEmpty(find(getSltTag(flagName)))) return true;

			var slt = get(flagRules, flagName);
			//有预设则使用预设
			if (slt) {
				//字符串直接找到目标就设定，否则是数组就找到目标就停止
				if (isString(slt)) find(slt).attr('data-flag', flagName);
				else each(slt, function (s) {
					var $t = find(s);
					if (!$isEmpty($t)) {
						$t.attr('data-flag', flagName);
						return false;
					}
				})
			}

			//没有预设则直接把id值写到flag
			else {
				var $target = find('#' + flagName);
				$target.attr('data-flag', $target.attr('id'))
			}
		})
	}

	function handleHtml($body) {
		var $b = $body || $('body');
		handleFlag($b);
		handleATag($b);
	}

	if (typeof window["onpopstate"] !== "undefined") {
		window.onpopstate = backPage;

		$(function () {
			try {
				handleHtml()
			}
			catch (error) {
				console.warn('Page init has failed!', error);
			}
		})
	}
}