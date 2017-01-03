module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			development: {
				src: [
					'src/global.js',
					'src/map.js',
					'src/start.js',
					'src/game.js',
					'src/level.js',
					'src/blocks.js',
					'src/pointer.js',
					'src/enemies.js',
					'src/player.js',
					'src/enemyshooting.js',
					'src/playershooting.js',
					'src/explosions.js',
					'src/hud.js'
					// 'src/powerup.js',
					// 'src/secrets.js',
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