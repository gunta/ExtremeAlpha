module.exports = function (grunt) {
	grunt.initConfig({
		preload_assets: {
			options: {
				template: 'preloadjs',
				detectBytes: false,
				detectType: false,
				processId: function (file) {
					var _ = grunt.util._;
					var path = require('path');
					return _.camelize(_.strLeftBack(path.normalize(file.src), path.extname(file.src)).replace(/\//g, '_')).substr(3);
				}
			},
			rgb_manifest: {
				options: {
					key: 'imagesManifest = imagesManifest || {}; imagesManifest.rgbManifest'
				},
				files: {
					'json/rgb_manifest.js': ['img/rgb/**/*.jpg', 'img/rgb/**/*.png']
				}
			},
			rgba_manifest: {
				options: {
					key: 'imagesManifest = imagesManifest || {}; imagesManifest.rgbaManifest'
				},
				files: {
					'json/rgba_manifest.js': ['img/rgba/**/*.jpg', 'img/rgba/**/*.png', 'img/rgba/**/*.webp']
				}
			},
			alpha_manifest: {
				options: {
					key: 'imagesManifest = imagesManifest || {}; imagesManifest.alphaManifest'
				},
				files: {
					'json/alpha_manifest.js': ['img/alpha/**/*.jpg', 'img/alpha/**/*.png']
				}
			}

		}
	});

//	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-preload-assets');

	grunt.registerTask('default', ['preload_assets']);
};
