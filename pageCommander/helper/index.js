export function get(target, path) {
	if (!target || !path) return target;
	var _t = target,
		_p = String(path).split('.');

	for (var i = 0; i < _p.length; i++) {
		_t = _t[_p[i]];
		if (!_t) break;
	}

	return _t;
}

export function pick(obj, arr, reject) {
	var o = {};

	if (reject) each(obj, function (val, key) {
		if (arr.indexOf(key) < 0) o[key] = val;
	});
	else each(arr, function (val) {
		o[val] = obj[val];
	});

	return o;
}

export function size(agg) {
	return agg ? (isObject(agg) ? keys(agg).length : agg.length) : 0;
}

export function each(agg, fn) {
	var _fn = true;
	if (!agg || !isFunction(fn)) return;

	if (isArray(agg)) {
		for (var i = 0; i < agg.length; i++) {
			_fn = fn(agg[i], i);
			if (_fn !== undefined && _fn === false) break;
		}
	}

	if (isObject(agg)) {
		var index = 0;
		for (var k in agg) {
			_fn = fn(agg[k], k, index++);
			if (_fn !== undefined && _fn === false) break;
		}
	}
}

export function isFunction(fn) {
	return fn && typeof fn === 'function';
}

export function isString(str) {
	return str && typeof str === 'string';
}

export function isObject(obj) {
	return obj && typeof obj === 'object' && !obj.length;
}

export function isArray(arr) {
	return arr && typeof arr === 'object' && arr.length >= 0
}

export function includes(arr, target) {
	var __has = false;

	each(arr, function (val) {
		if (isFunction(target) && target(val)) __has = true;
		else if (target === val) __has = true;

		if (__has) return false;
	});

	return __has;
}

export function compact(arr) {
	var __arr = [];

	each(arr, function (val) {
		if (!!val) __arr.push(val);
	});

	return __arr;
}

export function uniq(arr) {
	var __arr = [];

	each(arr, function (val) {
		if (!includes(__arr, val)) __arr.push(val);
	});

	return __arr;
}

export function extend(a, b) {
	each(b, function (val, key) {
		a[key] = val
	});

	return a;
}

export function split(str, s) {
	if (!str || !isString(str)) return [];
	return str.split(s)
}

export function keys(obj) {
	return isObject(obj) ? Object.keys(obj) : [];
}

export default {
	keys,
	extend,
	split,
	get,
	pick,
	size,
	each,
	isFunction,
	isString,
	isObject,
	isArray,
	compact,
	uniq,
	includes
};