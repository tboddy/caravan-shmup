module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			development: {
				src: [
					'src/global.js',
					'src/start.js',
					'src/game.js',
					'src/enemies.js',
					'src/player.js',
					'src/enemyshooting.js',
					'src/playershooting.js',
					'src/explosions.js',
					'src/hud.js'
					// 'src/map.js',
					// 'src/level.js',
					// 'src/powerup.js',
					// 'src/explosions.js',
					// 'src/secrets.js',
					// 'src/bosses.js',
					// 'src/enemyshooting.js',
					// 'src/bossshooting.js',
					// 'src/blocks.js',
					// 'src/shooting.js',
					// 'src/pointer.js'
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