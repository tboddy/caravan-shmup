const enemySmallOneImg = new Image(), enemySmallTwoImg = new Image(), enemySmallFourImg = new Image(), enemySmallFiveImg = new Image(), enemyMediumOneImg = new Image();
enemySmallOneImg.src = 'img/enemysmallone.png';
enemySmallTwoImg.src = 'img/enemysmalltwo.png';
enemyMediumOneImg.src = 'img/enemymediumone.png';
enemySmallFourImg.src = 'img/enemysmallthree.png';
enemySmallFiveImg.src = 'img/enemysmallfive.png';

const bossOneAImg = new Image(), bossOneBImg = new Image();
bossOneAImg.src = 'img/bossonea.png';
bossOneBImg.src = 'img/bossoneb.png';

const bossOneInterval = fps * 2.5;

const enemySmallOneAnimation = function(enemy){
	enemy.y += 0.8;
	const increase = 90 / 180 * Math.PI / (grid * 1.5);
	enemy.x = enemy.initial - Math.sin(enemy.count) * (grid * 5);
	enemy.count += increase;
	return enemy;
},

enemySmallTwoAnimation = function(enemy){
	enemy.y += 1.25;
	const increase = 90 / 180 * Math.PI / (grid * 1);
	enemy.x = enemy.initial - Math.sin(enemy.count) * (grid * 4);
	enemy.count += increase;
	return enemy;
},

enemySmallThreeAnimation = function(enemy){
	if(!enemy.x) enemy.x = enemy.initial;
	if(enemy.x <= playerX - 2 && enemy.y <= playerY + playerHeight && enemy.y <= grid * 2){
		enemy.y += 2;
		enemy.x += 4.5;
	} else if(enemy.x >= playerX + 2 && enemy.y <= playerY + playerHeight && enemy.y <= grid * 2){
		enemy.y += 2;
		enemy.x -= 4.5;
	} else if(enemy.y <= gameHeight - (grid * 9)) enemy.y += 2.5;
	else if(enemy.y > gameHeight - (grid * 9) && enemy.y <= gameHeight - (grid * 8)) enemy.y += 3;
	else if(enemy.y > gameHeight - (grid * 8) && enemy.y <= gameHeight - (grid * 7)) enemy.y += 3.5;
	else if(enemy.y > gameHeight - (grid * 7) && enemy.y <= gameHeight - (grid * 6)) enemy.y += 4;
	else if(enemy.y > gameHeight - (grid * 6) && enemy.y <= gameHeight - (grid * 5)) enemy.y += 4.5;
	else if(enemy.y > gameHeight - (grid * 5) && enemy.y <= gameHeight - (grid * 4)) enemy.y += 5;
	else if(enemy.y > gameHeight - (grid * 4) && enemy.y <= gameHeight - (grid * 3)) enemy.y += 5.5;
	else if(enemy.y > gameHeight - (grid * 3) && enemy.y <= gameHeight - (grid * 2)) enemy.y += 6;
	else if(enemy.y > gameHeight - (grid * 2) && enemy.y <= gameHeight - grid) enemy.y += 6.5;
	else enemy.y += 7;
	return enemy;
},

enemySmallFourAnimation = function(enemy){
	if(!enemy.x) enemy.x = enemy.initial;
	enemy.y += 2.25;
	return enemy;
},

enemyMediumOneAnimation = function(enemy){
	if((enemy.y + enemy.height) >= (gameHeight / 4) * 3) enemy.direction = 'up';
	if(enemy.direction == 'up'){
		enemy.y -= 1;
		if(gameClock % 8 == 0) spawnMediumOneShot(enemy);
	}
	else enemy.y += 2.5;
	return enemy;
},

bossOneAnimation = function(enemy){
	if(enemy.x + enemy.width <= playerX + playerWidth) enemy.x += 0.5;
	else if(enemy.x >= playerX) enemy.x -= 0.5;
	if(enemy.y + enemy.height <= playerY + playerHeight) enemy.y += 0.5;
	else if(enemy.y >= playerY) enemy.y -= 0.5;
	return enemy;
},

bossOneAAnimation = function(enemy){
	enemy = bossOneAnimation(enemy);
	if(gameClock % bossOneInterval == 0) spawnBossOneAShot(enemy);
	return enemy;
},

bossOneBAnimation = function(enemy){
	enemy = bossOneAnimation(enemy);
	// if(enemy.x <= e)
	if(gameClock % bossOneInterval == (bossOneInterval / 2)) spawnBossOneBShot(enemy);
	return enemy;
};

const waveSmallOne = function(initialPos){
	return {
		animation: enemySmallOneAnimation,
		img: enemySmallOneImg,
		width: grid,
		height: grid,
		initial: initialPos,
		score: 300,
		enemies: [
			{count: -0.4, y: grid * -8},
			{count: -0.2, y: grid * -7},
			{count: 0, y: grid * -6},
			{count: 0.2, y: grid * -5},
			{count: 0.4, y: grid * -4},
			{count: 0.6, y: grid * -3},
			{count: 0.8, y: grid * -2},
			{count: 1, y: grid * -1}
		]
	};
},

waveSmallTwo = function(initialPos){
	return {
		animation: enemySmallTwoAnimation,
		img: enemySmallTwoImg,
		width: grid,
		height: grid,
		initial: initialPos,
		score: 300,
		enemies: [
			{count: -0.4, y: grid * -8},
			{count: -0.2, y: grid * -7},
			{count: 0, y: grid * -6},
			{count: 0.2, y: grid * -5},
			{count: 0.4, y: grid * -4},
			{count: 0.6, y: grid * -3},
			{count: 0.8, y: grid * -2},
			{count: 1, y: grid * -1}
		]
	};
},

waveSmallThree = function(initialPos){
	return {
		animation: enemySmallThreeAnimation,
		img: enemySmallTwoImg,
		width: grid,
		height: grid,
		initial: initialPos,
		score: 500,
		enemies: [
			{y: grid * -6.25},
			{y: grid * -4.5},
			{y: grid * -2.75},
			{y: grid * -1}
		]
	};
},

waveSmallFour = function(initialPos){
	return {
		animation: enemySmallFourAnimation,
		img: enemySmallFourImg,
		width: grid,
		height: grid,
		initial: initialPos,
		score: 200,
		enemies: [
			{y: grid * -7},
			{y: grid * -5},
			{y: grid * -3},
			{y: grid * -1},
		]
	}
},

waveMediumOne = function(){
	return {
		animation: enemyMediumOneAnimation,
		img: enemyMediumOneImg,
		score: 1000,
		height: grid * 2,
		width: grid * 2,
		enemies: [
			{x: grid * 2, y: grid * -1, hits: 10},
			{x: gameWidth - (grid * 4), y: grid * -8, hits: 10}
		]
	};
},

waveBossOneA = function(){
	return {
		animation: bossOneAAnimation,
		img: bossOneAImg,
		height: grid * 3.5,
		width: grid * 3.5,
		score: 2000,
		onlyDestroysPlayer: true,
		enemies: [
			{x: grid * 3, y: -(grid * 3.5), hits: 25}
		]
	};
},

waveBossOneB = function(){
	return {
		animation: bossOneBAnimation,
		img: bossOneBImg,
		height: grid * 3.5,
		width: grid * 3.5,
		score: 2000,
		onlyDestroysPlayer: true,
		enemies: [
			{x: gameWidth - (grid * 4), y: -(grid * 3.5), hits: 30}
		]
	};
};

const waves = {
	0: waveSmallOne(grid * 6),
	220: waveSmallOne(grid * 9),
	// 325: waveMediumOne(),
	// 500: waveSmallTwo(grid * 7),
	// 625: waveSmallTwo(grid * 8),
	// 800: waveSmallThree(-grid),
	// 900: waveSmallThree(gameWidth + grid),
	// 1000: waveSmallThree(-grid),
	// 1100: waveSmallThree(gameWidth + grid),
	// 1200: waveSmallFour(grid * 3),
	// 1275: waveSmallFour(gameWidth - (grid * 4)),
	// 1350: waveSmallFour(grid * 3),
	// 1425: waveSmallFour(gameWidth - (grid * 4)),
	// 0: waveBossOneA(),
	// 1: waveBossOneB()
},

enemiesLoop = function(){
	for(waveTime in waves){
		if(gameClock >= parseInt(waveTime)) waveLoop(waveTime);
	};
},

waveLoop = function(waveTime){
	const draw = function(enemy, i){
		enemy.animation = waves[waveTime].animation;
		enemy.img = waves[waveTime].img;
		enemy.width = waves[waveTime].width;
		enemy.height = waves[waveTime].height;
		if(waves[waveTime].initial) enemy.initial = waves[waveTime].initial;
		enemy = enemy.animation(enemy);
		context.drawImage(enemy.img, enemy.x, enemy.y);
		if(enemy.y > gameHeight && i == 0) delete waves[waveTime];
		else if(enemy.y <= -(grid * 8) && (i + 1) == waves[waveTime].enemies.length) delete waves[waveTime];
		const enemyCollisionEl = {x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height},
		killEnemy = function(){
			score += waves[waveTime].score;
			waves[waveTime].enemies.splice(i, 1);
		};
		checkBulletCollision(enemyCollisionEl, function(bulletObj){
			explodeEntity(bulletObj);
			if(enemy.hits) {
				enemy.hits -= 1;
				if(enemy.hits == 0) killEnemy();
			} else killEnemy();
		});
		if(canGetHit){
			checkCollision({x: playerX, y: playerY, width: playerWidth, height: playerHeight}, enemyCollisionEl, function(){
				waves[waveTime].onlyDestroysPlayer ? getHit(waves[waveTime].enemies, i, true) : getHit(waves[waveTime].enemies, i);
			});
		}
	};
	waves[waveTime].enemies.forEach(function(enemy, i){
		if(waves[waveTime]) draw(enemy, i);
	});
};








// var enemiesLoop = function(){

// 	var draw = function(){

// 		var drawEnemy = function(opts){
// 			opts.arr.forEach(function(enemyObj, i){
// 				if(enemyObj.y + opts.height < 0 && (enemyObj.direction && (enemyObj.direction != 'up') || !enemyObj.direction)) enemyObj.y += levelSpeed;
// 				if(enemyObj.y + opts.height >= 0){
// 				enemyObj = opts.animation(enemyObj, opts.width, opts.height, i, opts.arr);
// 					context.drawImage(opts.img, enemyObj.x, enemyObj.y);
// 					var enemyCollisionEl = {x: enemyObj.x, y: enemyObj.y, width: opts.width, height: opts.height};
// 					checkBulletCollision(enemyCollisionEl, function(){
// 						explodeEntity(enemyCollisionEl);
// 						if(opts.hits && !opts.arr['hits']){
// 							opts.arr['hits'] = opts.hits;
// 						} else if(opts.arr['hits']) {
// 							opts.arr.hits -= 1;
// 							if(opts.arr.hits == 0){
// 								opts.arr.splice(i, 1);
// 								score += opts.score;
// 								if(opts.bossType){
// 									switch(opts.bossType){
// 										case 'bossOneA': bossOneAActive = false; break;
// 										case 'bossOneB': bossOneBActive = false; break;
// 									}
// 								}
// 							}
// 						} else {
// 							opts.arr.splice(i, 1);
// 							score += opts.score;
// 						}
// 					});
// 					if(canGetHit){
// 						checkCollision({x: playerX, y: playerY, width: playerWidth, height: playerHeight}, enemyCollisionEl, function(){
// 							opts.onlyDestroysPlayer ? getHit(opts.arr, i, true) : getHit(opts.arr, i);
// 						});
// 					}
// 					if(enemyObj.y + opts.height < 0 && enemyObj.direction){
// 						if(enemyObj.direction == 'up') opts.arr.splice(i, 1);
// 					}
// 					if((enemyObj.y + opts.height >= gameHeight + (opts.height * 2))) opts.arr.splice(i, 1);
// 				}
// 			});
// 		};

// 		if(!bossOneAActive && !bossOneBActive){
// 			if(enemies.small.one.length) drawEnemySmallOne(drawEnemy);
// 			if(enemies.small.two.length) drawEnemySmallTwo(drawEnemy);
// 			if(enemies.small.three.length) drawEnemySmallThree(drawEnemy);
// 			if(enemies.small.four.length) drawEnemySmallFour(drawEnemy);
// 			if(enemies.medium.one.length) drawEnemyMediumOne(drawEnemy);
// 		}

// 		if(bosses.oneA.length) drawBossOneA(drawEnemy);
// 		if(bosses.oneB.length) drawBossOneB(drawEnemy);

// 	};

// 	draw();

// };

// // draw farm
// var drawEnemySmallOne = function(callback){
// 	var opts = {
// 		arr: enemies.small.one,
// 		img: enemySmallOneImg,
// 		width: grid,
// 		height: grid,
// 		animation: enemyAnimations.smallOne,
// 		score: 300
// 	};
// 	callback(opts);
// }, drawEnemySmallFour = function(callback){
// 	var opts = {
// 		arr: enemies.small.four,
// 		img: enemySmallFourImg,
// 		width: grid,
// 		height: grid,
// 		animation: enemyAnimations.smallFour,
// 		score: 200
// 	};
// 	callback(opts);
// },;


// // animations

// var enemyAnimations = {
// smallFour: function(enemyObj, enemyWidth, enemyHeight, i, enemyArr){
// 		if(enemyObj.y + enemyHeight >= 0){
// 			enemyObj.y += levelSpeed * 3;
// 		}
// 		return enemyObj;
// 	}
// };