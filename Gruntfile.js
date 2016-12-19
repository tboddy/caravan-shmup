module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			development: {
				src: [
					'src/init.js',
					'src/start.js',
					'src/map.js',
					'src/level.js',
					'src/powerup.js',
					'src/explosions.js',
					'src/enemies.js',
					'src/enemyshooting.js',
					'src/blocks.js',
					'src/player.js',
					'src/hud.js',
					'src/shooting.js',
					'src/pointer.js'
				],
				dest: 'game.js'
			}
		},
		watch: {
			files: ['src/*.js'],
			tasks: ['concat']
		}
	});
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['concat', 'watch']);
};