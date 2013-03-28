(function () {
	var render, drawBackground, globalOptions = {};
	globalOptions.preventCaching = true;


	window.addEventListener('load', function () {
		setTimeout(function () {
			window.scrollTo(0, 1);
		}, 0);

		new FastClick(document.body);

		var clockA = new utils.Clock();
		clockA.getDelta();
		var queueA = new createjs.LoadQueue();
		queueA.setMaxConnections(4);

		queueA.addEventListener("complete", onCompleteQueueA);
		$$('#btn-load-image-a').addEventListener('click', onClickButtonA);

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

			clockA.getDeltaAsString();

			queueA.removeAll();
			queueA.loadManifest(manifestA);
		}

		function getFilesizeAsString(rgbBytes, alphaBytes) {
			var str = "" + Math.floor((rgbBytes + alphaBytes) / 1024) + "kb";
			if (alphaBytes) {
				str += " <small>(" + Math.floor((rgbBytes) / 1024) + "kb + " + Math.floor((alphaBytes) / 1024) + "kb" + ")</small>";
			}
			return str;
		}

		function onCompleteQueueA(event) {
			var images = {
				rgb: queueA.getResult('rgb')
			};
			var rgbBytes = queueA.getResult('rgb', true).byteLength;
			var alphaBytes = 0;
			var alpha = queueA.getResult('alpha');
			if (alpha) {
				images.alpha = alpha;
				alphaBytes = queueA.getResult('alpha', true).byteLength;
			}

			render(images);

			var delta = clockA.getDeltaAsString();
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