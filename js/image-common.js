var utils = utils || {};

var $$ = $$ || function (x) {
	return document.querySelector(x);
};

utils.simpleLoader = function (files, callback) {
	var toLoad = 0, images = {}, id, image, loaded;
	loaded = function () {
		--toLoad;
		if (!toLoad) {
			callback(images);
		}
	};
	for (id in files) {
		if (files.hasOwnProperty(id)) {
			image = new Image();
			++toLoad;
			image.onload = loaded;
			image.src = files[id];

			images[id] = image;
		}
	}
};

utils.renderToCanvas = function (width, height, renderFunction) {
	var buffer = document.createElement('canvas');
	buffer.width = width;
	buffer.height = height;
	renderFunction(buffer.getContext('2d'));
	return buffer;
};

// w3 chroma-key alternative
// http://www.w3.org/2013/chroma/chroma-key.js

utils.toRgbaFromInverseAlphaMask = function (rgbImage, inverseAlphaMask) {
	var width = rgbImage.width, height = rgbImage.height;
	return utils.renderToCanvas(width, height, function (ctx) {
		ctx.drawImage(rgbImage, 0, 0);
		ctx.globalCompositeOperation = 'xor';
		ctx.drawImage(inverseAlphaMask, 0, 0);
	});
};

utils.toRgbaFromAlphaChannel = function (rgbImage, alphaChannelImage) {
	var width = rgbImage.width, height = rgbImage.height;
	return utils.renderToCanvas(width, height, function (ctx) {
		var alpha = utils.renderToCanvas(width, height, function (ctx) {
			var id, data, i;
			ctx.drawImage(alphaChannelImage, 0, 0);
			id = ctx.getImageData(0, 0, width, height);
			data = id.data;
			for (i = data.length - 1; i > 0; i -= 4) {
				data[i] = 255 - data[i - 3];
			}
			ctx.clearRect(0, 0, width, height);
			ctx.putImageData(id, 0, 0);
		});
		ctx.drawImage(rgbImage, 0, 0);
		ctx.globalCompositeOperation = 'xor';
		ctx.drawImage(alpha, 0, 0);
	});
};
