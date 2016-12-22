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
		animation: bossAnimations.oneA,
		score: 2000,
		hits: 16,
		onlyDestroysPlayer: true
	};
	callback(opts);
}, drawBossOneB = function(callback){
	var opts = {
		arr: bosses.oneB,
		img: bossOneBImg,
		width: 56,
		height: 56,
		animation: bossAnimations.oneB,
		score: 2000,
		hits: 16,
		onlyDestroysPlayer: true
	};
	callback(opts);
};

const bossOneSpeed = (levelSpeed / 3) * 2;

const bossOneAnimation = function(enemyObj, enemyWidth, enemyHeight){
		if(enemyObj.y + enemyHeight >= -10 && enemyObj.y + enemyHeight <= 1 && !enemyObj.direction){
			enemyObj.y = gameHeight;
			enemyObj.direction = 'up';
		} else if(enemyObj.direction && (enemyObj.direction == 'up')){
			if(enemyObj.x + enemyWidth < playerX) enemyObj.sXDirection = 'right';
			else if(enemyObj.x >= playerX + playerWidth) enemyObj.sXDirection = 'left';
			else enemyObj.sXDirection = '';
			if(enemyObj.y > playerY + playerHeight) enemyObj.sYDirection = 'up';
			else if(enemyObj.y + enemyHeight < playerY) enemyObj.sYDirection = 'down';
			else enemyObj.sYDirection = '';
			if(enemyObj.sXDirection == 'left') enemyObj.x -= bossOneSpeed;
			else if(enemyObj.sXDirection == 'right') enemyObj.x += bossOneSpeed;
			if(enemyObj.sYDirection == 'up') enemyObj.y -= bossOneSpeed;
			else if(enemyObj.sYDirection == 'down') enemyObj.y += bossOneSpeed;
		}
		return enemyObj;
};

const bossOneInterval = 128;

const bossAnimations = {
	oneA: function(enemyObj, enemyWidth, enemyHeight){
		enemyObj = bossOneAnimation(enemyObj, enemyWidth, enemyHeight)
		if(gameClock % bossOneInterval == 0) bossBulletSpawn.oneA(enemyObj);
		return enemyObj;
	}, oneB: function(enemyObj, enemyWidth, enemyHeight){
		enemyObj = bossOneAnimation(enemyObj, enemyWidth, enemyHeight)
		if(gameClock % bossOneInterval == (bossOneInterval / 2)) bossBulletSpawn.oneB(enemyObj);
		return enemyObj;
	}
};