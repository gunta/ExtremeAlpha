module.exports = function(grunt) {
	grunt.initConfig({
		preload_assets: {
			options: {
				template: 'preloadjs',
//				process: {
//					id: function(file) {
//						return file;
////						return "POP"+ _.camelize(_.strLeftBack(path.normalize(file.src), path.extname(file.src)).replace(/\//g, '_'));
//					}
//				},
//				detect: {
//					bytes: true,
//					src: true,
//					id: true
//				}
			},
			rgb_manifest: {
				options: {
					key: 'rgbManifest'
				},
				files: {
					'json/rgb_manifest.js': ['img/rgb/**/*.jpg', 'img/rgb/**/*.png']
				}
			},
			rgba_manifest: {
				options: {
					key: 'rgbaManifest'
				},
				files: {
					'json/rgba_manifest.js': ['img/rgba/**/*.jpg', 'img/rgba/**/*.png', 'img/rgba/**/*.webp']
				}
			},
			alpha_manifest: {
				options: {
					key: 'alphaManifest'
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
