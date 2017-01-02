let enemies = {
	small: {one: [], two: [], three: [], four: []},
	medium: {one: []}
};

const enemySmallOneImg = new Image(), enemySmallTwoImg = new Image(), enemySmallFourImg = new Image(), enemySmallFiveImg = new Image(), enemyMediumOneImg = new Image();
enemySmallOneImg.src = 'img/enemysmallone.png';
enemySmallTwoImg.src = 'img/enemysmalltwo.png';
enemyMediumOneImg.src = 'img/enemymediumone.png';
enemySmallFourImg.src = 'img/enemysmallthree.png';
enemySmallFiveImg.src = 'img/enemysmallfive.png';


const enemySmallOneAnimation = function(enemy){
	enemy.y += 1.25;
	const increase = 90 / 180 * Math.PI / (grid * 1.15);
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
	if(enemy.x <= playerX - 2 && enemy.y <= playerY + playerHeight && enemy.y <= gameHeight / 3){
		enemy.y += 1;
		enemy.x += 3;
	} else if(enemy.x >= playerX + 2 && enemy.y <= playerY + playerHeight && enemy.y <= gameHeight / 3){
		enemy.y += 1;
		enemy.x -= 3;
	} else {
		enemy.y += 2.5;
	}
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
			{count: -0.8, y: grid * -10},
			{count: -0.6, y: grid * -9},
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

waveSmallThree = function(){
	return {
		animation: enemySmallThreeAnimation,
		img: enemySmallTwoImg,
		width: grid,
		height: grid,
		score: 500,
		enemies: [
			{x: -grid, y: grid * -3},
			{x: -grid, y: grid * -1}
		]
	};
};

waveMediumOne = function(){
	return {
		animation: enemyMediumOneAnimation,
		img: enemyMediumOneImg,
		score: 1000,
		hits: 5,
		height: grid * 2,
		width: grid * 2,
		enemies: [
			{x: grid * 2, y: grid * -1},
			{x: gameWidth - (grid * 4), y: grid * -8}
		]
	}
};

const waves = {
	// 0: waveSmallOne(grid * 6),
	// 150: waveSmallOne(grid * 9),
	// 325: waveMediumOne(),
	// 500: waveSmallTwo(grid * 7),
	// 625: waveSmallTwo(grid * 8)
	0: waveSmallThree()
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
		const enemyCollisionEl = {x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height};
		checkBulletCollision(enemyCollisionEl, function(bulletObj){
			explodeEntity(bulletObj);
			score += waves[waveTime].score;
			waves[waveTime].enemies.splice(i, 1);
		});
		if(canGetHit){
			checkCollision({x: playerX, y: playerY, width: playerWidth, height: playerHeight}, enemyCollisionEl, function(){
				enemy.onlyDestroysPlayer ? getHit(waves[waveTime].enemies, i, true) : getHit(waves[waveTime].enemies, i);
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
// }, drawEnemySmallTwo = function(callback){
// 	var opts = {
// 		arr: enemies.small.two,
// 		img: enemySmallTwoImg,
// 		width: grid,
// 		height: grid,
// 		animation: enemyAnimations.smallTwo,
// 		score: 300
// 	};
// 	callback(opts);
// }, drawEnemySmallThree = function(callback){
// 	var opts = {
// 		arr: enemies.small.three,
// 		img: enemySmallTwoImg,
// 		width: grid,
// 		height: grid,
// 		animation: enemyAnimations.smallThree,
// 		score: 500
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
// }, drawEnemyMediumOne = function(callback){
// 	var opts = {
// 		arr: enemies.medium.one,
// 		img: enemyMediumOneImg,
// 		width: grid * 2,
// 		height: grid * 2,
// 		animation: enemyAnimations.mediumOne,
// 		score: 1000,
// 		hits: 5
// 	};
// 	callback(opts);
// };


// // animations

// var enemyAnimations = {
// 	smallOne: function(enemyObj){
// 		if(enemyObj.y + grid >= 0) enemyObj.y += (levelSpeed / 4) * 3;
// 		enemyObj = sineCurve(enemyObj, (grid / 5) * 2, grid * 4);
// 		return enemyObj;
// 	},
// 	smallTwo: function(enemyObj, enemyWidth, enemyHeight){
// 		if(enemyObj.y + grid >= 0) enemyObj.y += levelSpeed;
// 		enemyObj = sineCurve(enemyObj, (grid / 5) * 2, grid * 2.5);
// 		return enemyObj;
// 	},
// 	smallThree: function(enemyObj, enemyWidth, enemyHeight, i, enemyArr){
// 		if(enemyObj.y + enemyHeight >= 0){
// 			let ySpeed = levelSpeed;
// 			if(enemyObj.y + grid > grid){
// 				if(enemyObj.y + enemyObj.height < playerY){
// 					if(enemyObj.x + enemyWidth < playerX) enemyObj.x += grid / 3;
// 					else if(enemyObj.x + enemyObj.width > playerX + playerWidth) enemyObj.x -= grid / 3;
// 					if(enemyObj.x + enemyWidth >= playerX - grid && enemyObj.x + enemyObj.width < playerX + playerWidth + grid) ySpeed = levelSpeed * 2.5;
// 				} else ySpeed = levelSpeed * 2.5;
// 			}
// 			enemyObj.y += ySpeed;
// 		}
// 		return enemyObj;
// 	}, smallFour: function(enemyObj, enemyWidth, enemyHeight, i, enemyArr){
// 		if(enemyObj.y + enemyHeight >= 0){
// 			enemyObj.y += levelSpeed * 3;
// 		}
// 		return enemyObj;
// 	}, mediumOne: function(enemyObj){
// 		if((enemyObj.y + enemyObj.height) >= gameHeight / 2) enemyObj.direction = 'up';
// 		if(enemyObj.direction == 'up'){
// 			enemyObj.y -= levelSpeed / 2;
// 			if(gameClock % 6 == 0){
// 				spawnMediumOneShot(enemyObj);
// 			}
// 		}
// 		else enemyObj.y += levelSpeed * 2;
// 		return enemyObj;
// 	}
// };