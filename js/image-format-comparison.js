(function () {
	var render, drawBackground, globalOptions = {};
	globalOptions.preventCaching = true;
	globalOptions.backgroundPattern = "gray";


	window.addEventListener('load', function () {
//		setTimeout(function () {
//			window.scrollTo(0, 1);
//		}, 0);

		new FastClick(document.body);

		var clocks = [];
		clocks[0] = new utils.Clock();
		clocks[1] = new utils.Clock();
		clocks[0].getDelta();
		clocks[1].getDelta();

		var queues = [];
		queues[0] = new createjs.LoadQueue();
		queues[1] = new createjs.LoadQueue();
		queues[0].setMaxConnections(4);
		queues[1].setMaxConnections(4);

		queues[0].addEventListener("complete", onCompleteQueueA);
		queues[1].addEventListener("complete", onCompleteQueueA);

		$$('#btn-load-image-a').addEventListener('click', onClickButtonA);
		$$('#btn-load-image-b').addEventListener('click', onClickButtonA);

		function getHashBasedOnManifest(id, type) {
			var found = false, originalFile = {}, resultFile = {};
			switch (type) {
				case "rgb":
					for (var i = 0; i < rgbManifest.length; ++i) {
						if (rgbManifest[i].id === id) {
							originalFile = rgbManifest[i];
							found = true;
							break;
						}
					}
					if (!found) {
						for (var j = 0; j < rgbaManifest.length; ++j) {
							if (rgbaManifest[j].id === id) {
								originalFile = rgbaManifest[j];
								found = true;
								break;
							}
						}
					}
					resultFile.id = "rgb";
					break;
				case "alpha":
					for (var k = 0; k < alphaManifest.length; ++k) {
						if (alphaManifest[k].id === id) {
							originalFile = alphaManifest[k];
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
				if (globalOptions.preventCaching) {
					resultFile.src += "?" + new Date().getTime();
				}
			}
			return resultFile;
		}

		function onClickButtonA() {
			var selectRgbA = $$('#select-image-a');
			var selectRgbAid = selectRgbA.options[selectRgbA.selectedIndex].value;
			var selectAlphaA = $$('#select-image-alpha-a');
			var selectAlphaAid = selectAlphaA.options[selectAlphaA.selectedIndex].value;

			var manifestA = [];
			manifestA.push(getHashBasedOnManifest(selectRgbAid, "rgb"));
			if (selectAlphaAid) {
				manifestA.push(getHashBasedOnManifest(selectAlphaAid, "alpha"));
			}

			clocks[0].getDeltaAsString();
			clocks[1].getDeltaAsString();

			queues[0].removeAll();
			queues[1].removeAll();
			queues[0].loadManifest(manifestA);
			queues[1].loadManifest(manifestA);
		}

		function getFilesizeAsString(rgbBytes, alphaBytes) {
			var str = "<span>";
			str += Math.floor((rgbBytes + alphaBytes) / 1024) + "kb";
			str += "</span>";

			if (alphaBytes) {
				str += " <small style='color: gray;'>(" + Math.floor((rgbBytes) / 1024) + " + " + Math.floor((alphaBytes) / 1024) + "" + ")</small>";
			}
			return str;
		}

		function onCompleteQueueA(event) {
			var images = {
				rgb: queues[0].getResult('rgb')
			};
			var rgbBytes = queues[0].getResult('rgb', true).byteLength;
			var alphaBytes = 0;
			var alpha = queues[0].getResult('alpha');
			if (alpha) {
				images.alpha = alpha;
				alphaBytes = queues[0].getResult('alpha', true).byteLength;
			}

			render(images);

			var delta = clocks[0].getDeltaAsString();
			var deltaB = clocks[1].getDeltaAsString();
			$$('#result-requests-a').innerHTML = event.target._numItemsLoaded;
			$$('#result-time-a').innerHTML = delta;
			$$('#result-size-a').innerHTML = getFilesizeAsString(rgbBytes, alphaBytes);
		}

		function populateSelects() {
			var selectA = $$('#select-image-a');
			var selectB = $$('#select-image-b');
			var selectAlphaA = $$('#select-image-alpha-a');
			var selectAlphaB = $$('#select-image-alpha-b');
			for (var i = 0; i < rgbManifest.length; ++i) {
				selectA.options[selectA.options.length] = new Option(rgbManifest[i].id, rgbManifest[i].id);
				selectB.options[selectB.options.length] = new Option(rgbManifest[i].id, rgbManifest[i].id);
			}
			for (var j = 0; j < alphaManifest.length; ++j) {
				selectAlphaA.options[selectAlphaA.options.length] = new Option(alphaManifest[j].id, alphaManifest[j].id);
				selectAlphaB.options[selectAlphaB.options.length] = new Option(alphaManifest[j].id, alphaManifest[j].id);
			}
		}

		populateSelects();

		drawBackground = function (ctx) {
			var w = ctx.canvas.width, h = ctx.canvas.height, x, y;
			if (globalOptions.backgroundPattern === "gray") {
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
			} else if (globalOptions.backgroundPattern === "none") {
				// do nothing
			} else {
				ctx.fillStyle = globalOptions.backgroundPattern;
				ctx.fillRect(0, 0, w, h);
			}

		};

		render = function (images) {
			var canvas = $$('#canvas');
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
			drawBackground(ctx);
			ctx.drawImage(rgba, 0, 0);
		};

	});


}());