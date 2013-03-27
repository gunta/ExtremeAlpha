(function () {
	var render, drawBackground;


	window.addEventListener('load', function () {
		new FastClick(document.body);

		var clockA = new utils.Clock();
		clockA.getDelta();
		var queueA = new createjs.LoadQueue();
		queueA.setMaxConnections(4);

		queueA.addEventListener("complete", onCompleteQueueA);
		$$('#btn-load-image-a').addEventListener('click', onClickButtonA);

		function onCompleteQueueA () {
			var images = {
				rgb: queueA.getResult('rgb'),
				alpha: queueA.getResult('alpha')
			};
			render(images);

			var delta = clockA.getDeltaAsString();
			$$('#result-requests-a').innerHTML = 2;
			$$('#result-time-a').innerHTML = delta;

		}

		function onClickButtonA () {
			clockA.getDeltaAsString();

			var manifestA = [
				{id: "rgb", src: 'img/jpeg40.jpg?' + new Date().getTime(), type: createjs.LoadQueue.IMAGE, bytes: 3412341},
				{id: "alpha", src: 'img/pngalpha32.png?' + new Date().getTime(), type: createjs.LoadQueue.IMAGE, bytes: 5414341}
			];

			queueA.loadManifest(manifestA);
		}

	});

	drawBackground = function (ctx) {
		var w = ctx.canvas.width, h = ctx.canvas.height, x, y;
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, w, h);
		ctx.fillStyle = '#ccc';
		for (x = 0; x < w; x += 16) {
			for (y = 0; y < h; y += 16) {
				ctx.fillRect(x, y, 8, 8);
				ctx.fillRect(x + 8, y + 8, 8, 8);
			}
		}
	};

	render = function (images) {
		var canvas = $$('#canvas');
		canvas.width = 2000;
		canvas.height = 2000;
		var ctx = canvas.getContext('2d');
		var rgba = utils.toRgbaFromAlphaChannel(images.rgb, images.alpha);
		drawBackground(ctx);
		ctx.drawImage(rgba, 0, 0);
	};

}());