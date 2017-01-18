let gameLoopInterval, isGameOver = false, gameClock = 0;

const initGame = function(){
	setupLevel();
	setupPlayer();
	setupHighScore();
	// setupBackgroundMusic();
	loop = gameLoop();
},

gameLoop = function(){
	return function(){
		clearGame();
		levelLoop();
		secretLoop();
		pointerLoop();
		powerupLoop();
		enemyShootingLoop();
		enemiesLoop();
		shootingLoop();
		playerLoop();
		explosionsLoop();
		hudLoop();
		gameClock++;
		window.requestAnimationFrame(loop);
	};
},

setupBackgroundMusic = function(){
	const musicEl = '<audio autoplay style="display:none;position:absolute;top:-100px;left:-100px;">\
		<source src="sound/bg.ogg" type="audio/ogg"></source>\
		</audio>';
	$('body').append(musicEl);
};