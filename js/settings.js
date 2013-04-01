var utils = utils || {};

utils.Settings = function () {
	this._eventSupport = new utils.Object();
	this._registry = /** @type {!Object.<string, !utils.Setting>} */ ({});

	this.renderMethod = this.createSetting("renderMethod", "canvas-white");
	this.retinaEnabled = this.createSetting("retinaEnabled", (window.retina || window.devicePixelRatio > 1));
	this.cacheDisabled = this.createSetting("cacheDisabled", true);
	this.backgroundType = this.createSetting("backgroundType", "pattern");
	this.backgroundColor = this.createSetting("backgroundColor", "red");

};

utils.Settings.prototype = {
	/**
	 * @param {string} key
	 * @param {*} defaultValue
	 * @return {!utils.Setting}
	 */
	createSetting: function (key, defaultValue) {
		if (!this._registry[key]) {
			this._registry[key] = new utils.Setting(key, defaultValue, this._eventSupport, window.localStorage);
		}
		return this._registry[key];
	}
};

/**
 * @constructor
 * @param {string} name
 * @param {*} defaultValue
 * @param {!utils.Object} eventSupport
 * @param {?Storage} storage
 */
utils.Setting = function (name, defaultValue, eventSupport, storage) {
	this._name = name;
	this._defaultValue = defaultValue;
	this._eventSupport = eventSupport;
	this._storage = storage;
};

utils.Setting.prototype = {
	addChangeListener: function (listener, thisObject) {
		this._eventSupport.addEventListener(this._name, listener, thisObject);
	},

	removeChangeListener: function (listener, thisObject) {
		this._eventSupport.removeEventListener(this._name, listener, thisObject);
	},

	get name() {
		return this._name;
	},

	get: function () {
		if (typeof this._value !== "undefined") {
			return this._value;
		}

		this._value = this._defaultValue;
		if (this._storage && this._name in this._storage) {
			try {
				this._value = JSON.parse(this._storage[this._name]);
			} catch (e) {
				delete this._storage[this._name];
			}
		}
		return this._value;
	},

	set: function (value) {
		this._value = value;
		if (this._storage) {
			try {
				this._storage[this._name] = JSON.stringify(value);
			} catch (e) {
				console.error("Error saving setting with name:" + this._name);
			}
		}
		this._eventSupport.dispatchEventToListeners(this._name, value);
	}
};


utils.settings = new utils.Settings();
