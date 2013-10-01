/**
 * @author alteredq / http://alteredqualia.com/
 */

var utils = utils || {};

// based on https://github.com/documentcloud/underscore/blob/bf657be243a075b5e72acc8a83e6f12a564d8f55/underscore.js#L767
utils.extend = function (obj, source) {

	// ECMAScript5 compatibility based on: http://www.nczonline.net/blog/2012/12/11/are-your-mixins-ecmascript-5-compatible/
	if (Object.keys) {
		var keys = Object.keys(source);
		for (var i = 0, il = keys.length; i < il; i++) {
			var prop = keys[i];
			Object.defineProperty(obj, prop, Object.getOwnPropertyDescriptor(source, prop));
		}
	} else {
		var safeHasOwnProperty = {}.hasOwnProperty;
		for (var prop in source) {
			if (safeHasOwnProperty.call(source, prop)) {
				obj[prop] = source[prop];
			}
		}
	}
	return obj;
};

utils.Clock = function (autoStart) {
	this.autoStart = ( autoStart !== undefined ) ? autoStart : true;
	this.startTime = 0;
	this.oldTime = 0;
	this.elapsedTime = 0;
	this.running = false;
};

utils.extend(utils.Clock.prototype, {
	start: function () {
		this.startTime = window.performance !== undefined && window.performance.now !== undefined
			? window.performance.now()
			: Date.now();
		this.oldTime = this.startTime;
		this.running = true;
	},

	stop: function () {
		this.getElapsedTime();
		this.running = false;
	},

	getElapsedTime: function () {
		this.getDelta();
		return this.elapsedTime;
	},

	getDeltaAsString: function () {
		return this.getDelta().toPrecision(2) + "s";
	},

	getDelta: function () {
		var diff = 0;
		if (this.autoStart && !this.running) {
			this.start();
		}
		if (this.running) {
			var newTime = window.performance !== undefined && window.performance.now !== undefined
				? window.performance.now()
				: Date.now();

			diff = 0.001 * ( newTime - this.oldTime );
			this.oldTime = newTime;
			this.elapsedTime += diff;
		}
		return diff;
	}
});
