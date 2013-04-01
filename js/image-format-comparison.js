//(function () {

var App = {
	options: {
		preventCaching: true,
		backgroundPattern: 'gray'
	},
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
				if (App.options.preventCaching) {
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
			var selectRgbAid = App.el.rgbSelects[n].options[App.el.rgbSelects[n].selectedIndex].value;
			var selectAlphaAid = App.el.alphaSelects[n].options[App.el.alphaSelects[n].selectedIndex].value;

			var currentFiles = [];
			currentFiles.push(App.helpers.getHashBasedOnManifest(selectRgbAid, "rgb"));
			if (selectAlphaAid) {
				currentFiles.push(App.helpers.getHashBasedOnManifest(selectAlphaAid, "alpha"));
			}

			console.dir(currentFiles);
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
			if (App.options.backgroundPattern === "gray") {
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
			} else if (App.options.backgroundPattern === "none") {
				// do nothing
			} else {
				ctx.fillStyle = App.options.backgroundPattern;
				ctx.fillRect(0, 0, w, h);
			}

		},
		render: function (images) {
			var canvas = App.el.canvas;
			var w = images.rgb.width;
			var h = images.rgb.height;
			canvas.width = w;
			canvas.height = h;
			canvas.style.width = w / 2 + "px";
			canvas.style.height = h / 2 + "px";
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