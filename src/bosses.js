const bosses = {
	oneA: [], oneB: []
};

const bossOneAImg = new Image(), bossOneBImg = new Image();
bossOneAImg.src = 'img/bossonea.png';
bossOneBImg.src = 'img/bossoneb.png';

const drawBossOneA = function(callback){
	var opts = {
		arr: bosses.oneA,
		img: bossOneAImg,
		width: 56,
		height: 56,
		animation: bossAnimations.one,
		score: 2000,
		hits: 20,
		onlyDestroysPlayer: true
	};
	callback(opts);
}, drawBossOneB = function(callback){
	var opts = {
		arr: bosses.oneB,
		img: bossOneBImg,
		width: 56,
		height: 56,
		animation: bossAnimations.one,
		score: 2000,
		hits: 10,
		onlyDestroysPlayer: true
	};
	callback(opts);
};

const bossOneSpeed = (levelSpeed / 3) * 2;

const bossAnimations = {
	one: function(enemyObj, enemyWidth, enemyHeight, i, enemyArr){
		if(enemyObj.y + enemyHeight >= -10 && enemyObj.y + enemyHeight <= 1 && !enemyObj.direction){
			enemyObj.y = gameHeight;
			enemyObj.direction = 'up';
		} else if(enemyObj.direction && (enemyObj.direction == 'up')){

			// game bounds
			// if(enemyObj.x <= 0) enemyObj.sXDirection = 'left';
			// else if(enemyObj.x + enemyWidth >= gameWidth) enemyObj.sXDirection = 'right';
			// if(enemyObj.y <= 0) enemyObj.sYDirection = 'down';
			// else if(enemyObj.y + enemyHeight >= gameHeight) enemyObj.sYDirection = 'up';

			// player tracking
			if(enemyObj.x + enemyWidth < playerX) enemyObj.sXDirection = 'right';
			else if(enemyObj.x >= playerX + playerWidth) enemyObj.sXDirection = 'left';
			else enemyObj.sXDirection = '';

			if(enemyObj.y > playerY + playerHeight) enemyObj.sYDirection = 'up';
			else if(enemyObj.y + enemyHeight < playerY) enemyObj.sYDirection = 'down';
			else enemyObj.sYDirection = '';
			// if(enemyObj.y > playerY + playerHeight) enemyObj.sXDirection = 'up';
			// else enemyObj.sYDirection = '';
			// enemyObj.sYDirection = 'up';

			// assign vals
			if(enemyObj.sXDirection == 'left') enemyObj.x -= bossOneSpeed;
			else if(enemyObj.sXDirection == 'right') enemyObj.x += bossOneSpeed;
			if(enemyObj.sYDirection == 'up') enemyObj.y -= bossOneSpeed;
			else if(enemyObj.sYDirection == 'down') enemyObj.y += bossOneSpeed;
		}
		return enemyObj;
	}
};