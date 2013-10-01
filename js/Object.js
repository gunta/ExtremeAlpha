var utils = utils || {};
/**
 * @constructor
 * @implements {utils.EventTarget}
 */
utils.Object = function () {

}

utils.Object.prototype = {
	/**
	 * @param {string} eventType
	 * @param {function(utils.Event)} listener
	 * @param {Object=} thisObject
	 */
	addEventListener: function (eventType, listener, thisObject) {
		console.assert(listener);

		if (!this._listeners)
			this._listeners = {};
		if (!this._listeners[eventType])
			this._listeners[eventType] = [];
		this._listeners[eventType].push({ thisObject: thisObject, listener: listener });
	},

	/**
	 * @param {string} eventType
	 * @param {function(utils.Event)} listener
	 * @param {Object=} thisObject
	 */
	removeEventListener: function (eventType, listener, thisObject) {
		console.assert(listener);

		if (!this._listeners || !this._listeners[eventType])
			return;
		var listeners = this._listeners[eventType];
		for (var i = 0; i < listeners.length; ++i) {
			if (listener && listeners[i].listener === listener && listeners[i].thisObject === thisObject)
				listeners.splice(i, 1);
			else if (!listener && thisObject && listeners[i].thisObject === thisObject)
				listeners.splice(i, 1);
		}

		if (!listeners.length)
			delete this._listeners[eventType];
	},

	removeAllListeners: function () {
		delete this._listeners;
	},

	/**
	 * @param {string} eventType
	 * @return {boolean}
	 */
	hasEventListeners: function (eventType) {
		if (!this._listeners || !this._listeners[eventType])
			return false;
		return true;
	},

	/**
	 * @param {string} eventType
	 * @param {*=} eventData
	 * @return {boolean}
	 */
	dispatchEventToListeners: function (eventType, eventData) {
		if (!this._listeners || !this._listeners[eventType])
			return false;

		var event = new utils.Event(this, eventType, eventData);
		var listeners = this._listeners[eventType].slice(0);
		for (var i = 0; i < listeners.length; ++i) {
			listeners[i].listener.call(listeners[i].thisObject, event);
			if (event._stoppedPropagation)
				break;
		}

		return event.defaultPrevented;
	}
}

/**
 * @constructor
 * @param {utils.EventTarget} target
 * @param {string} type
 * @param {*=} data
 */
utils.Event = function (target, type, data) {
	this.target = target;
	this.type = type;
	this.data = data;
	this.defaultPrevented = false;
	this._stoppedPropagation = false;
}

utils.Event.prototype = {
	stopPropagation: function () {
		this._stoppedPropagation = true;
	},

	preventDefault: function () {
		this.defaultPrevented = true;
	},

	/**
	 * @param {boolean=} preventDefault
	 */
	consume: function (preventDefault) {
		this.stopPropagation();
		if (preventDefault)
			this.preventDefault();
	}
}

/**
 * @interface
 */
utils.EventTarget = function () {
}

utils.EventTarget.prototype = {
	/**
	 * @param {string} eventType
	 * @param {function(utils.Event)} listener
	 * @param {Object=} thisObject
	 */
	addEventListener: function (eventType, listener, thisObject) {
	},

	/**
	 * @param {string} eventType
	 * @param {function(utils.Event)} listener
	 * @param {Object=} thisObject
	 */
	removeEventListener: function (eventType, listener, thisObject) {
	},

	removeAllListeners: function () {
	},

	/**
	 * @param {string} eventType
	 * @return {boolean}
	 */
	hasEventListeners: function (eventType) {
	},

	/**
	 * @param {string} eventType
	 * @param {*=} eventData
	 * @return {boolean}
	 */
	dispatchEventToListeners: function (eventType, eventData) {
	},
}

utils.notifications = new utils.Object();
