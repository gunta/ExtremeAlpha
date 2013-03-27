module.exports = function(grunt) {
	grunt.initConfig({
		preload_assets: {
			rgb_images: {
				options: {
					key: 'rgbManifest',
//					ignoreBasePath: 'somebasepath/path/',
					template: 'preloadjs'
				},
				files: {
					'json/rgb_images.js': ['img/rgb/**']
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-preload-assets');
	grunt.registerTask('default', ['grunt-preload-assets']);
};
