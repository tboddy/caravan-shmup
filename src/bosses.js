let bossOneAActive = false, bossOneBActive = false;

const bosses = {
	oneA: [], oneB: []
};

const bossOneAImg = new Image(), bossOneBImg = new Image();
bossOneAImg.src = 'img/bossonea.png';
bossOneBImg.src = 'img/bossoneb.png';

const drawBossOneA = function(callback){
	callback({
		arr: bosses.oneA,
		img: bossOneAImg,
		width: 56,
		height: 56,
		animation: bossAnimations.oneA,
		score: 2000,
		hits: 20,
		onlyDestroysPlayer: true,
		bossType: 'bossOneA'
	});
}, drawBossOneB = function(callback){
	callback({
		arr: bosses.oneB,
		img: bossOneBImg,
		width: 56,
		height: 56,
		animation: bossAnimations.oneB,
		score: 2000,
		hits: 20,
		onlyDestroysPlayer: true,
		bossType: 'bossOneB'
	});
};

const bossOneSpeed = (levelSpeed / 3) * 2;

const bossOneAnimation = function(enemyObj, enemyWidth, enemyHeight, isB){
	if(gameClock >= 1750){
		enemyObj.y += bossOneSpeed;
		enemyObj.x = enemyObj.x;
			if(isB && bossOneBActive) bossOneBActive = false;
			else if(!isB && bossOneAActive) bossOneAActive = false;
	} else {
		if(enemyObj.y + enemyHeight >= -10 && enemyObj.y + enemyHeight <= 1 && !enemyObj.direction){
			enemyObj.y = gameHeight;
			enemyObj.direction = 'up';
			if(isB && !bossOneBActive) bossOneBActive = true;
			else if(!isB && !bossOneAActive) bossOneAActive = true;
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
	}
	return enemyObj;
};

const bossOneInterval = 128;

const bossAnimations = {
	oneA: function(enemyObj, enemyWidth, enemyHeight){
		enemyObj = bossOneAnimation(enemyObj, enemyWidth, enemyHeight, false)
		if(gameClock % bossOneInterval == 0 && bossOneAActive) bossBulletSpawn.oneA(enemyObj);
		return enemyObj;
	}, oneB: function(enemyObj, enemyWidth, enemyHeight){
		enemyObj = bossOneAnimation(enemyObj, enemyWidth, enemyHeight, true)
		if(gameClock % bossOneInterval == (bossOneInterval / 2) && bossOneBActive) bossBulletSpawn.oneB(enemyObj);
		return enemyObj;
	}
};