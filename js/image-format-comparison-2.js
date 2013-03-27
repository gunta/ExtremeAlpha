//(function () {

function addImage() {
	var imageA = document.createElement("img");
	imageA.onLoad = function () {
		console.log("Image loaded");

		imageA.setAttribute("style", "-webkit-mask-image: url(" + maskUrl + ")");
	};
	imageA.src = "../TryTwo/Images/PNG-RGB888-Color.png";

	document.getElementById('container').appendChild(imageA);
}

//addImage();

var createBigCanvas = function (parent, width, height) {
	var canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	parent.appendChild(canvas);

	// Canvas compositing code
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, width, height);
	ctx.fillStyle = 'blue';
	ctx.fillRect(0, 0, width, height);
};


var toRgbaFromInverseAlphaMask = function (rgbImage, inverseAlphaMask) {
	var width = rgbImage.width, height = rgbImage.height;
	return renderToCanvas(width, height, function (ctx) {
		ctx.drawImage(rgbImage, 0, 0);
		ctx.globalCompositeOperation = 'xor';
		ctx.drawImage(inverseAlphaMask, 0, 0);
	});
};


var toRgbaFromAlphaChannel = function (rgbImage, alphaChannelImage) {
	var width = rgbImage.width, height = rgbImage.height;
	return renderToCanvas(width, height, function (ctx) {
		var alpha = renderToCanvas(width, height, function (ctx) {
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


var createAlphaJPEG = function (parent, sourcePath, alphaPath) {
//		img.style.visiblity = 'hidden';
	// Preload the un-alpha'd image
	var image = document.createElement('img');
	image.src = sourcePath;
	image.onload = function () {
		// Then preload alpha mask
		var alpha = document.createElement('img');
		alpha.src = alphaPath;
		alpha.onload = function () {
			var canvas = document.createElement('canvas');
			canvas.width = image.width;
			canvas.height = image.height;
			//img.parentNode.replaceChild(canvas, img);
			parent.appendChild(canvas);

			// Canvas compositing code
			var ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, image.width, image.height);
			ctx.fillStyle = 'blue';
			ctx.fillRect(0, 0, image.width, image.height);

			ctx.drawImage(image, 0, 0, image.width, image.height);
			ctx.globalCompositeOperation = 'xor';
			ctx.drawImage(alpha, 0, 0, image.width, image.height);
		}
	}
};

var elemA = document.getElementById('container-image-a');
//	createAlphaJPEG(elemA, "img/jpeg40.jpg", "img/pngalpha32.png");
//	createAlphaJPEG(elemA, "img/assets_withalpha.jpg", "img/assets_alpha.png");
createAlphaJPEG(elemA, "img/jpeg40.jpg", "img/jpeg30alpha.jpg");
//	createAlphaJPEG(elemA, "img/webp20.webp", "img/assets_alpha.png");

var elemB = document.getElementById('container-image-b');

//createBigCanvas(elemB, 2260, 2288);

//})();