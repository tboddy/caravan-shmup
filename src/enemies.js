const enemySmallOneImg = new Image(), enemySmallTwoImg = new Image(), enemySmallFourImg = new Image(), enemySmallFiveImg = new Image(), enemySmallFiveBottomLeftImg = new Image(),
enemySmallFiveBottomRightImg = new Image(), enemyMediumOneImg = new Image();
enemySmallOneImg.src = 'img/enemysmallone.png';
enemySmallTwoImg.src = 'img/enemysmalltwo.png';
enemyMediumOneImg.src = 'img/enemymediumone.png';
enemySmallFourImg.src = 'img/enemysmallthree.png';
enemySmallFiveImg.src = 'img/enemysmallfive.png';
enemySmallFiveBottomLeftImg.src = 'img/enemysmallfivebottomleft.png';
enemySmallFiveBottomRightImg.src = 'img/enemysmallfivebottomright.png';

const bossOneAImg = new Image(), bossOneBImg = new Image();
bossOneAImg.src = 'img/bossonea.png';
bossOneBImg.src = 'img/bossoneb.png';

let bossOneAActive = false, bossOneBActive = false, currentWave;

const bossOneInterval = fps * 2.5;

const enemySmallOneAnimation = function(enemy){
	enemy.y += 1.33;
	const increase = 90 / 180 * Math.PI / (grid * 1.5);
	enemy.x = enemy.initial - Math.sin(enemy.count) * (grid * 5);
	enemy.count += increase;
	return enemy;
},

enemySmallTwoAnimation = function(enemy){
	enemy.y += 1.33;
	const increase = 90 / 180 * Math.PI / (grid * 1.25);
	enemy.x = enemy.initial - Math.sin(enemy.count) * (grid * 4);
	enemy.count += increase;
	return enemy;
},

enemySmallThreeAnimation = function(enemy){
	if(!enemy.x) enemy.x = enemy.initial;
	if(enemy.x <= playerX - 2 && enemy.y <= playerY + playerHeight && enemy.y <= grid * 2){
		enemy.y += 2;
		enemy.x += 2.5;
	} else if(enemy.x >= playerX + 2 && enemy.y <= playerY + playerHeight && enemy.y <= grid * 2){
		enemy.y += 2;
		enemy.x -= 2.5;
	} else if(enemy.y <= gameHeight - (grid * 10)) enemy.y += 2;
	else if(enemy.y > gameHeight - (grid * 10) && enemy.y <= gameHeight - (grid * 9)) enemy.y += 2.5;
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
	enemy.y += 2;
	return enemy;
},

enemySmallFiveAnimation = function(enemy){
	const foundSpeed = 2;
	if(enemy.y < enemy.changeGrid * grid){
		enemy.y += foundSpeed;
	} else if(!enemy.started){
		enemy.started = true;
		enemy.targetX = playerX;
		enemy.targetY = playerY;
		enemy.initialX = enemy.x;
		enemy.initialY = enemy.y;
	}
	if(enemy.started){
		if(enemy.initialX + enemy.width <= enemy.targetX){
			enemy.x += foundSpeed;
			enemy.img = enemySmallFiveBottomRightImg;
		}
		else if(enemy.initialX > enemy.targetX + playerWidth){
			enemy.x -= foundSpeed;
			enemy.img = enemySmallFiveBottomLeftImg;
		}
		if(enemy.initialY < enemy.targetY) enemy.y += foundSpeed;
		else if(enemy.initialY >= enemy.targetY + playerHeight) enemy.y -= foundSpeed;
		else enemy.y += foundSpeed;
	}
	return enemy;
},

enemyMediumOneAnimation = function(enemy){
	if((enemy.y + enemy.height) >= (gameHeight / 4) * 3) enemy.direction = 'up';
	if(enemy.direction == 'up'){
		enemy.y -= 1;
		if(gameClock % 12 == 0 && enemy.y + enemy.height >= 0) spawnMediumOneShot(enemy);
	}
	else enemy.y += 1.75;
	return enemy;
},

bossOneAnimation = function(enemy){
	if(!enemy.started){
		enemy.y = gameHeight;
		enemy.started = true;
	} else {
		if(enemy.x + enemy.width <= playerX + playerWidth) enemy.x += 0.5;
		else if(enemy.x >= playerX) enemy.x -= 0.5;
		if(enemy.y + enemy.height <= playerY + playerHeight) enemy.y += 0.5;
		else if(enemy.y >= playerY) enemy.y -= 0.5;
	}
	return enemy;
},

bossOneAAnimation = function(enemy, key){
	if(!bossOneAActive) bossOneAActive = true;
	enemy = bossOneAnimation(enemy);
	if(bossOneBActive){
		let nextBoss = {}, foundThis = false;
		for(waveTime in waves){
			if(foundThis){
				nextBoss = waves[waveTime];
				foundThis = false;
			}
			if(waveTime == key) foundThis = true;
		}
		if(nextBoss.enemies){
			nextBoss = nextBoss.enemies[0];
			if(enemy.x + enemy.width >= nextBoss.x) enemy.x = nextBoss.x - enemy.width;
		}
	}
	if(gameClock % bossOneInterval == 0) spawnBossOneAShot(enemy);
	return enemy;
},

bossOneBAnimation = function(enemy){
	if(!bossOneBActive) bossOneBActive = true;
	enemy = bossOneAnimation(enemy);
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
	};
},

waveSmallFive = function(initialPosA, initialPosB){
	return {
		animation: enemySmallFiveAnimation,
		img: enemySmallFiveImg,
		width: grid,
		height: grid,
		score: 500,
		enemies: [
			{x: initialPosA, y: grid * -1, started: false, changeGrid: Math.floor((Math.random() * 6) + 1)},
			{x: initialPosB, y: grid * -1, started: false, changeGrid: Math.floor((Math.random() * 6) + 1)}
		]
	};
},

waveMediumOne = function(){
	return {
		animation: enemyMediumOneAnimation,
		img: enemyMediumOneImg,
		score: 1000,
		height: grid * 2,
		width: grid * 2,
		enemies: [
			{x: grid * 3, y: grid * -1, hits: 15},
			{x: gameWidth - (grid * 5), y: grid * -10, hits: 15}
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
			{x: grid * 2, y: -(grid * 3.5), hits: 30}
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
			{x: gameWidth - (grid * 3), y: -(grid * 3.5), hits: 30}
		]
	};
},

waveBossTwoNw = function(){
	return {
		animation: bossTwoNwAnimation
	}
},

waveBossTwoNe = function(){

},

waveBossTwoSw = function(){

},

waveBossTwoSe = function(){

};

const waves = [
	waveSmallOne(grid * 6),
	waveSmallOne(grid * 9),
	waveSmallOne(grid * 6),
	waveSmallOne(grid * 9),
	waveMediumOne(),
	waveSmallTwo(grid * 5),
	waveSmallTwo(grid * 10),
	waveSmallTwo(grid * 5),
	waveSmallTwo(grid * 10),
	waveSmallThree(grid),
	waveSmallThree(grid),
	waveSmallThree(gameWidth),
	waveSmallThree(gameWidth),
	waveSmallFour(grid * 3),
	waveSmallFour(gameWidth - (grid * 4)),
	waveBossOneA(),
	waveBossOneB(),
	waveSmallThree(grid),
	waveSmallThree(grid),
	waveSmallThree(gameWidth),
	waveSmallThree(gameWidth),
	waveSmallFive(grid, gameWidth - (grid * 2)),
	waveSmallFive(grid * 5, gameWidth - (grid * 6)),
	waveSmallFive(grid, gameWidth - (grid * 2)),
	waveSmallFive(grid * 5, gameWidth - (grid * 6)),
	waveSmallFive(grid, gameWidth - (grid * 2)),
	waveSmallFive(grid * 5, gameWidth - (grid * 6)),
];

enemiesLoop = function(){
	if(waves.length){
		currentWave = waves[0];
		const draw = function(enemy, i){
			enemy.animation = currentWave.animation;
			enemy.img = currentWave.img;
			enemy.width = currentWave.width;
			enemy.height = currentWave.height;
			if(currentWave.initial) enemy.initial = currentWave.initial;
			enemy = enemy.animation(enemy);
			context.drawImage(enemy.img, enemy.x, enemy.y);
			if((enemy.y > gameHeight && i == 0) || (enemy.y <= -(grid * 10) && (i + 1) == currentWave.enemies.length)) waves.shift();
			const enemyCollisionEl = {x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height},
			killEnemy = function(){
				if(enemy.animation == bossOneAAnimation) bossOneAActive = false;
				else if(enemy.animation == bossOneBAnimation) bossOneBActive = false;
				score += currentWave.score;
				currentWave.enemies.splice(i, 1);
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
					currentWave.onlyDestroysPlayer ? getHit(currentWave.enemies, i, true) : getHit(currentWave.enemies, i);
				});
			}
		};
		if(currentWave.enemies.length){
			currentWave.enemies.forEach(function(enemy, i){
				draw(enemy, i);
			});
		} else waves.shift();
	}
},

// for(waveTime in waves){
// 	if(gameClock >= parseInt(waveTime) + 50) waveLoop(waveTime);
// };

waveLoop = function(waveTime){
	const draw = function(enemy, i){
		enemy.animation = waves[waveTime].animation;
		enemy.img = waves[waveTime].img;
		enemy.width = waves[waveTime].width;
		enemy.height = waves[waveTime].height;
		if(waves[waveTime].initial) enemy.initial = waves[waveTime].initial;
		const isBoss = enemy.animation == bossOneAAnimation || enemy.animation == bossOneBAnimation,
		drawEnemy = function(){
			enemy = enemy.animation(enemy, waveTime);
			context.drawImage(enemy.img, enemy.x, enemy.y);
			if(enemy.y > gameHeight && i == 0) delete waves[waveTime];
			else if(enemy.y <= -(grid * 10) && (i + 1) == waves[waveTime].enemies.length) delete waves[waveTime];
			const enemyCollisionEl = {x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height},
			killEnemy = function(){
				if(enemy.animation == bossOneAAnimation) bossOneAActive = false;
				else if(enemy.animation == bossOneBAnimation) bossOneBActive = false;
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
		if(isBoss){
			drawEnemy();
		} else {
			if(!bossOneAActive && !bossOneBActive) drawEnemy();
		}
	};
	waves[waveTime].enemies.forEach(function(enemy, i){
		if(waves[waveTime]) draw(enemy, i);
	});
};