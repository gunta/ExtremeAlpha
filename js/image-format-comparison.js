(function () {
	var render, drawBackground;


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

		function onCompleteQueueA() {
			var images = {
				rgb: queueA.getResult('rgb'),
				alpha: queueA.getResult('alpha')
			};
			render(images);

			var delta = clockA.getDeltaAsString();
			$$('#result-requests-a').innerHTML = 2;
			$$('#result-time-a').innerHTML = delta;

		}

		function onClickButtonA() {
			clockA.getDeltaAsString();

			var manifestA = [
				{id: "rgb", src: 'img/jpeg40.jpg?' + new Date().getTime(), type: createjs.LoadQueue.IMAGE, bytes: 3412341},
				{id: "alpha", src: 'img/pngalpha32.png?' + new Date().getTime(), type: createjs.LoadQueue.IMAGE, bytes: 5414341}
			];

			queueA.loadManifest(manifestA);
		}

		drawBackground = function (ctx) {
			var w = ctx.canvas.width, h = ctx.canvas.height, x, y;
			var b = 16;
			ctx.fillStyle = '#fff';
			ctx.fillRect(0, 0, w, h);
			ctx.fillStyle = '#ccc';
			for (x = 0; x < w; x += b*2) {
				for (y = 0; y < h; y += b*2) {
					ctx.fillRect(x, y, b, b);
					ctx.fillRect(x + b, y + b, b, b);
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

	});


}());