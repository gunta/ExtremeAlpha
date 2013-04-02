//(function () {


var SettingsModal = {
	el: {
		selectRenderMethod: $$('#select-render-method'),
		checkboxRetina: $$('#checkbox-retina'),
		optionsBackgroundNone: $$('#options-background-none'),
		optionsBackgroundPattern: $$('#options-background-pattern'),
		optionsBackgroundCustom: $$('#options-background-custom'),
		inputBackgroundCustomPicker: $$('#input-background-custom-picker'),
		checkboxDisableCache: $$('#checkbox-disable-cache')
	},
	initialize: function () {
		// Load
		switch (utils.settings.renderMethod.get()) {
			case "canvas-white":
				SettingsModal.el.selectRenderMethod.selectedIndex = 0;
				break;
			case "canvas-transparent":
				SettingsModal.el.selectRenderMethod.selectedIndex = 1;
				break;
			case "css-transparent":
				SettingsModal.el.selectRenderMethod.selectedIndex = 2;
				break;
		}
		SettingsModal.el.checkboxRetina.checked = utils.settings.retinaEnabled.get();
		SettingsModal.el.optionsBackgroundNone.checked = utils.settings.backgroundType.get() === "none";
		SettingsModal.el.optionsBackgroundPattern.checked = utils.settings.backgroundType.get() === "pattern";
		SettingsModal.el.optionsBackgroundCustom.checked = utils.settings.backgroundType.get() === "custom";
		SettingsModal.el.checkboxDisableCache.checked = utils.settings.cacheDisabled.get();
		$(SettingsModal.el.inputBackgroundCustomPicker).spectrum({
			color: utils.settings.backgroundColor.get(),
			disabled: utils.settings.backgroundType.get() !== "custom",
			showInitial: true,
			chooseText: "Choose",
			cancelText: "Cancel",
			preferredFormat: "hex6",
			change: function (color) {
				utils.settings.backgroundColor.set(color.toHexString());
			}
		});

		// Events
		SettingsModal.el.selectRenderMethod.addEventListener('change', function () {
			var renderMethod = SettingsModal.el.selectRenderMethod.options[SettingsModal.el.selectRenderMethod.selectedIndex].value;
			utils.settings.renderMethod.set(renderMethod);
		});
		SettingsModal.el.checkboxRetina.addEventListener('click', function () {
			utils.settings.retinaEnabled.set(SettingsModal.el.checkboxRetina.checked);
		});
		SettingsModal.el.optionsBackgroundNone.addEventListener('click', function () {
			if (SettingsModal.el.optionsBackgroundNone.checked) {
				utils.settings.backgroundType.set("none");
				$(SettingsModal.el.inputBackgroundCustomPicker).spectrum('disable');
			}
		});
		SettingsModal.el.optionsBackgroundPattern.addEventListener('click', function () {
			if (SettingsModal.el.optionsBackgroundPattern.checked) {
				utils.settings.backgroundType.set("pattern");
				$(SettingsModal.el.inputBackgroundCustomPicker).spectrum('disable');
			}
		});
		SettingsModal.el.optionsBackgroundCustom.addEventListener('click', function () {
			if (SettingsModal.el.optionsBackgroundCustom.checked) {
				utils.settings.backgroundType.set("custom");
				$(SettingsModal.el.inputBackgroundCustomPicker).spectrum('enable');
			}
		});
		SettingsModal.el.checkboxDisableCache.addEventListener('click', function () {
			utils.settings.cacheDisabled.set(SettingsModal.el.checkboxDisableCache.checked);
		});
	}
};

SettingsModal.initialize();


var App = {
	el: {
		btnLoadImages: [
			$$('#btn-load-image-a'),
			$$('#btn-load-image-b')
		],
		rgbSelects: [
			$$('#select-image-a'),
			$$('#select-image-b')
		],
		alphaSelects: [
			$$('#select-image-alpha-a'),
			$$('#select-image-alpha-b')
		],
		resultRequests: [
			$$('#result-requests-a'),
			$$('#result-requests-b')
		],
		resultTimes: [
			$$('#result-time-a'),
			$$('#result-time-b')
		],
		resultSizes: [
			$$('#result-size-a'),
			$$('#result-size-b')
		],
		canvas: $$('#canvas')
	},
	clocks: [],
	queues: [],

	initialize: function () {
		// FastClick
		new FastClick(document.body);

		App.initializeEachN(0);
		App.initializeEachN(1);

		// Queues
		App.queues[0].addEventListener("complete", App.events.onCompleteQueueA);
		App.queues[1].addEventListener("complete", App.events.onCompleteQueueB);

		// Buttons
		App.el.btnLoadImages[0].addEventListener('click', App.events.onClickButtonA);
		App.el.btnLoadImages[1].addEventListener('click', App.events.onClickButtonB);
	},
	initializeEachN: function (n) {
		// Clocks
		App.clocks[n] = new utils.Clock();
		App.clocks[n].getDelta();

		// Queues
		App.queues[n] = new createjs.LoadQueue();
		App.queues[n].setMaxConnections(4);

		// Selects
		for (var i = 0; i < imagesManifest.rgbManifest.length; ++i) {
			App.el.rgbSelects[n].options[App.el.rgbSelects[n].options.length] = new Option(imagesManifest.rgbManifest[i].id, imagesManifest.rgbManifest[i].id);
		}
		for (var j = 0; j < imagesManifest.alphaManifest.length; ++j) {
			App.el.alphaSelects[n].options[App.el.alphaSelects[n].options.length] = new Option(imagesManifest.alphaManifest[j].id, imagesManifest.alphaManifest[j].id);
		}

		// TODO: initialize from settings maybe
	},
	helpers: {
		getHashBasedOnManifest: function (id, type) {
			var found = false, originalFile = {}, resultFile = {};
			switch (type) {
				case "rgb":
					for (var i = 0; i < imagesManifest.rgbManifest.length; ++i) {
						if (imagesManifest.rgbManifest[i].id === id) {
							originalFile = imagesManifest.rgbManifest[i];
							found = true;
							break;
						}
					}
					if (!found) {
						for (var j = 0; j < imagesManifest.rgbaManifest.length; ++j) {
							if (imagesManifest.rgbaManifest[j].id === id) {
								originalFile = imagesManifest.rgbaManifest[j];
								found = true;
								break;
							}
						}
					}
					resultFile.id = "rgb";
					break;
				case "alpha":
					for (var k = 0; k < imagesManifest.alphaManifest.length; ++k) {
						if (imagesManifest.alphaManifest[k].id === id) {
							originalFile = imagesManifest.alphaManifest[k];
							found = true;
							break;
						}
					}
					resultFile.id = "alpha";
					break;
			}
			if (found) {
				resultFile.type = createjs.LoadQueue.IMAGE;
				resultFile.src = originalFile.src;
				if (utils.settings.cacheDisabled.get()) {
					resultFile.src += "?" + new Date().getTime();
				}
			}
			return resultFile;
		},
		getFileSizeAsString: function (rgbBytes, alphaBytes) {
			var totalKBytes = Math.floor((rgbBytes + alphaBytes) / 1024);
			var rgbKBytes = Math.floor((rgbBytes) / 1024);
			var alphaKBytes = Math.floor((alphaBytes) / 1024);

			var str = "<span>" + totalKBytes + "kb" + "</span>";
			if (alphaBytes) {
				str += " <small style='color: gray;'>(" + rgbKBytes + " + " + alphaKBytes + "" + ")</small>";
			}
			return str;
		}
	},
	events: {
		onClickButton: function (n) {
			$(App.el.btnLoadImages[n]).button('loading');

			var selectRgbAid = App.el.rgbSelects[n].options[App.el.rgbSelects[n].selectedIndex].value;
			var selectAlphaAid = App.el.alphaSelects[n].options[App.el.alphaSelects[n].selectedIndex].value;

			var currentFiles = [];
			currentFiles.push(App.helpers.getHashBasedOnManifest(selectRgbAid, "rgb"));
			if (selectAlphaAid) {
				currentFiles.push(App.helpers.getHashBasedOnManifest(selectAlphaAid, "alpha"));
			}

			App.clocks[n].getDeltaAsString();

			App.queues[n].removeAll();
			App.queues[n].loadManifest(currentFiles);
		},
		onClickButtonA: function () {
			App.events.onClickButton(0);
		},
		onClickButtonB: function () {
			App.events.onClickButton(1);
		},
		onCompleteQueue: function (event, n) {
			var images = {
				rgb: App.queues[n].getResult('rgb')
			};
			var rgbBytes = App.queues[n].getResult('rgb', true).byteLength;
			var alphaBytes = 0;
			var alpha = App.queues[n].getResult('alpha');
			if (alpha) {
				images.alpha = alpha;
				alphaBytes = App.queues[n].getResult('alpha', true).byteLength;
			}

			App.core.render(images);

			var delta = App.clocks[n].getDeltaAsString();
			App.el.resultRequests[n].innerHTML = event.target._numItemsLoaded;
			App.el.resultTimes[n].innerHTML = delta;
			App.el.resultSizes[n].innerHTML = App.helpers.getFileSizeAsString(rgbBytes, alphaBytes);

			$(App.el.btnLoadImages[n]).button('reset');
		},
		onCompleteQueueA: function (event) {
			App.events.onCompleteQueue(event, 0);
		},
		onCompleteQueueB: function (event) {
			App.events.onCompleteQueue(event, 1);
		}
	},
	core: {
		drawBackground: function (ctx) {
			var w = ctx.canvas.width, h = ctx.canvas.height, x, y;

			switch (utils.settings.backgroundType.get()) {
				case "none":
					break;
				case "pattern":
					var b = 16;
					ctx.fillStyle = '#fff';
					ctx.fillRect(0, 0, w, h);
					ctx.fillStyle = '#ccc';
					for (x = 0; x < w; x += b * 2) {
						for (y = 0; y < h; y += b * 2) {
							ctx.fillRect(x, y, b, b);
							ctx.fillRect(x + b, y + b, b, b);
						}
					}
					break;
				case "custom":
					ctx.fillStyle = utils.settings.backgroundColor.get();
					ctx.fillRect(0, 0, w, h);
					break;
			}
		},
		render: function (images) {
			var canvas = App.el.canvas;
			var w = images.rgb.width;
			var h = images.rgb.height;
			canvas.width = w;
			canvas.height = h;
			var pixelRatio = utils.settings.retinaEnabled.get() ? 2 : 1;
			canvas.style.width = w / pixelRatio + "px";
			canvas.style.height = h / pixelRatio + "px";
			var ctx = canvas.getContext('2d');
			var rgba;
			if (images.alpha) {
				rgba = utils.toRgbaFromAlphaChannel(images.rgb, images.alpha);
			} else {
				rgba = utils.renderRGBImage(images.rgb);
			}
			App.core.drawBackground(ctx);
			ctx.drawImage(rgba, 0, 0);
		}
	}


};

App.initialize();

window.addEventListener('load', function () {


});


//}());