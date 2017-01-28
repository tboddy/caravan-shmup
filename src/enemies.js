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

let currentWave;

const bossOneInterval = fps * 2.5;

const enemyAnimations = {
	small: {
		one: function(enemy){
			enemy.y += 0.75;
			const increase = 90 / 180 * Math.PI / (grid * 1.67);
			enemy.x = enemy.initial - Math.sin(enemy.count) * (grid * 6.5);
			enemy.count += increase;
			return enemy;
		},
		two: function(enemy){
			let vel = 2;
			const trackPlayer = function(){
				const dAngle = Math.atan2(playerY - enemy.y, playerX - enemy.x);
				enemy.x += vel * Math.cos(dAngle);
				if(enemy.y <= grid * 2) vel = 3;
				if(enemy.y < grid * 2 && enemy.y <= grid * 3) vel = 3.5;
				if(enemy.y < grid * 3 && enemy.y <= grid * 4) vel = 4;
				if(enemy.y < grid * 4 && enemy.y <= grid * 5) vel = 3.5;
				if(enemy.y < grid * 5 && enemy.y <= grid * 6) vel = 3;
				if(enemy.y < grid * 6 && enemy.y <= grid * 7) vel = 2.5;
				enemy.y += vel * Math.sin(dAngle);
				context.save();
				context.translate(enemy.x, enemy.y);
				context.rotate(dAngle - degToRad(90))
				context.drawImage(enemySmallFiveImg, enemy.width / -2, enemy.height / -2);
				context.restore();
			}, goUp = function(){
				enemy.y -= vel;
				context.save();
				context.translate(enemy.x, enemy.y);
				context.rotate(degToRad(180));
				context.drawImage(enemySmallFiveImg, enemy.width / -2, enemy.height / -2);
				context.restore();
			};
			enemy.hits == 2 ? trackPlayer() : goUp();
			return enemy;
		},
		three: function(enemy){
			enemy.y += 2;
			if(!enemy.dAngle){
				enemy.dAngle = Math.atan2(playerY - enemy.y, playerX - enemy.x);
			}
			enemy.x += 2 * Math.cos(enemy.dAngle);
			context.save();
			context.translate(enemy.x, enemy.y);
			context.rotate(enemy.dAngle - degToRad(90));
			context.drawImage(enemySmallFourImg, enemy.width / -2, enemy.height / -2);
			context.restore();
			return enemy;
		},
		four: function(enemy){
			if(enemy.y >= (gameHeight / 3) * 2 && enemy.direction == 'downRight') enemy.direction = 'upRight';
			else if(enemy.direction == 'upRight' && enemy.y <= gameHeight / 3) enemy.direction = 'downAgain';
			if(enemy.y >= (gameHeight / 3) * 2 && enemy.direction == 'downLeft') enemy.direction = 'upLeft';
			else if(enemy.direction == 'upLeft' && enemy.y <= gameHeight / 3) enemy.direction = 'downAgain';
			const yVel = 2, xVel = 0.75;
			switch(enemy.direction){
				case 'downRight':
					enemy.y += yVel;
					break;
				case 'downLeft':
					enemy.y += yVel;
					break;
				case 'upRight':
					enemy.y -= yVel;
					enemy.x += xVel;
					break;
				case 'upLeft':
					enemy.y -= yVel;
					enemy.x -= xVel;
					break;
				case 'downAgain':
					enemy.y += yVel;
					break;
			};
			return enemy;
		},
		five: function(enemy){
			const vel = 3, rotateSpeed = 0.035, rotateRadius = grid * 5;
			if(!enemy.angle) enemy.angle = 0;
			if(!enemy.initial) enemy.initial = enemy.x;
			if(enemy.y <= (gameHeight / 2) - (grid * 0.4) && !enemy.startedCircle){
				enemy.y += vel;
			} else {
				if(!enemy.startedCircle) enemy.startedCircle = true;
				if(enemy.y <= grid * 2.55){
					enemy.x += vel;
				} else {
					enemy.x = ((gameWidth / 2) - grid) + Math.cos(enemy.angle) * rotateRadius;
					enemy.y = (gameHeight / 2) + Math.sin(enemy.angle) * rotateRadius;
					enemy.angle += rotateSpeed;
				}
			}
			return enemy;
		},
		six: function(enemy){
			const vel = 2;
			if(enemy.y <= enemy.limit && !enemy.hitLimit){
				enemy.y += vel * 1.33;
				context.drawImage(enemySmallFourImg, enemy.x, enemy.y);
			} else {
				if(!enemy.hitLimit) {
					enemy.hitLimit = true;
					enemy.xTarget = playerX;
					enemy.yTarget = playerY;
					enemy.dAngle = Math.atan2(enemy.yTarget - enemy.y, enemy.xTarget - enemy.x);
					enemy.xPath = vel * Math.cos(enemy.dAngle);
					enemy.yPath = vel * Math.sin(enemy.dAngle);
				}
				enemy.x += enemy.xPath;
				enemy.y += enemy.yPath;
				context.save();
				context.translate(enemy.x, enemy.y);
				context.rotate(enemy.dAngle - degToRad(90));
				context.drawImage(enemySmallFourImg, enemy.width / -2, enemy.height / -2);
				context.restore();
			}
			return enemy;
		},
		seven: function(enemy){
			if(enemy.y <= gameHeight / 2 && !enemy.hitBottom){
				enemy.y += 2;
			} else {
				const xVel = 1.5;
				if(!enemy.hitBottom) enemy.hitBottom = true;
				enemy.y -= 0.75;
				enemy.direction == 'right' ? enemy.x += xVel : enemy.x -= xVel;
				if(!enemy.hasShot && enemy.y <= gameHeight / 2){
					spawnShots.small.seven(enemy);
					enemy.hasShot = true;
				}
			}
			return enemy;
		},
		eight: function(enemy){
			if(enemy.y <= (gameHeight / 3) && enemy.direction == 'downRight') enemy.direction = 'upRight';
			else if(enemy.direction == 'upRight' && enemy.y >= (gameHeight / 3) * 2) enemy.direction = 'upAgain';
			if(enemy.y <= (gameHeight / 3) && enemy.direction == 'downLeft') enemy.direction = 'upLeft';
			else if(enemy.direction == 'upLeft' && enemy.y >= (gameHeight / 3) * 2) enemy.direction = 'upAgain';
			const yVel = 2, xVel = 0.75;
			switch(enemy.direction){
				case 'downRight':
					enemy.y -= yVel;
					break;
				case 'downLeft':
					enemy.y -= yVel;
					break;
				case 'upRight':
					enemy.y += yVel;
					enemy.x += xVel;
					break;
				case 'upLeft':
					enemy.y += yVel;
					enemy.x -= xVel;
					break;
				case 'upAgain':
					enemy.y -= yVel;
					break;
			};
			return enemy;
		},
		nine: function(enemy){
			const vel = 3, rotateSpeed = 0.035, rotateRadius = grid * 5;
			if(!enemy.angle) enemy.angle = 0;
			if(!enemy.initial) enemy.initial = enemy.x;
			if(enemy.y <= (gameHeight / 2) - (grid * 0.4) && !enemy.startedCircle){
				enemy.y += vel;
			} else {
				if(!enemy.startedCircle) enemy.startedCircle = true;
				if(enemy.y <= grid * 2.55){
					enemy.x -= vel;
				} else {
					enemy.x = ((gameWidth / 2) - grid) + Math.cos(enemy.angle) * -rotateRadius;
					enemy.y = (gameHeight / 2) + Math.sin(enemy.angle) * rotateRadius;
					enemy.angle += rotateSpeed;
				}
			}
			return enemy;
		}
	},
	medium: {
		one: function(enemy){
			if(!enemy.started){
				enemy.y = gameHeight;
				enemy.started = true;
				enemy.circleStarted = false;
			} else {
				if(enemy.circleStarted){
					if(enemy.circleFinished){
						if(enemy.reachedMiddle){
							if(!enemy.hCount){
								enemy.hCount = 0;
								enemy.hInitial = enemy.x;
							}
							const hIncrease = 90 / 180 * Math.PI / (grid * 5);
							enemy.x = enemy.hInitial - Math.sin(enemy.hCount) * (grid * 6);
							enemy.hCount -= hIncrease;
							if(!enemy.vCount){
								enemy.vCount = 0;
								enemy.vInitial = enemy.y;
							}
							const vIncrease = 90 / 180 * Math.PI / (grid * 2);
							enemy.y = enemy.vInitial - Math.sin(enemy.vCount) * (grid * 0.5);
							enemy.vCount -= vIncrease;
							if(enemy.y + enemy.height >= 0){
								const shotTime = 112, shotInterval = 15;
								if(gameClock % shotTime == 0 || gameClock % shotTime == shotInterval || gameClock % shotTime == (shotInterval * 2)) spawnShots.medium.one(enemy);
							}
						} else {
							enemy.x += 2;
							if(enemy.x >= (gameWidth / 2) - (enemy.width / 2)) enemy.reachedMiddle = true;
						}
					} else {
						const vel = 2, rotateSpeed = 0.03, rotateRadius = -grid * 4;
						if(!enemy.angle) enemy.angle = 0;
						if(!enemy.initial) enemy.initial = enemy.x;
						enemy.x = (gameWidth / 2) + Math.cos(enemy.angle) * rotateRadius;
						enemy.y = (gameHeight / 3) + Math.sin(enemy.angle) * rotateRadius;
						if(enemy.angle <= 1) enemy.angle += rotateSpeed;
						else enemy.circleFinished = true;
					}
				} else {
					if(enemy.y >= gameHeight / 3){
						enemy.y -= 2.5;
					} else {
						enemy.circleStarted = true;
					}
				}
			}
			return enemy;
		},
		two: function(enemy){
			const rotateRadius = grid * 2, rotateMulti = 0.99;
			if(enemy.angle <= 3.2 && enemy.rotateSpeed != enemy.rotateSpeed * rotateMulti) enemy.rotateSpeed = enemy.rotateSpeed * rotateMulti;
			if(!enemy.initial) enemy.initial = enemy.x;
			enemy.x = gameWidth + Math.cos(enemy.angle) * (rotateRadius * enemy.radiusMulti);
			enemy.y = enemy.initialY - (enemy.height / 2) + Math.sin(enemy.angle) * rotateRadius;
			enemy.angle -= enemy.rotateSpeed;
			if(enemy.angle <= 3.2 && gameClock % 16 == 0) spawnShots.medium.two(enemy);
			return enemy;
		},
		three: function(enemy){
			if(!enemy.started){
				enemy.y = gameHeight;
				enemy.started = true;
			} else {
				if(enemy.y >= gameHeight - (grid * 3)) enemy.y -= 2.5;
				else if(enemy.y >= gameHeight - (grid * 4) && enemy.y < gameHeight - (grid * 3)) enemy.y -= 2;
				else if(enemy.y >= gameHeight - (grid * 5) && enemy.y < gameHeight - (grid * 4)) enemy.y -= 1.5;
				else {
					enemy.y -= 1;
					const shotTime = 112, shotInterval = 15;
					if(gameClock % 24 == 0) spawnShots.medium.two(enemy);
				}
			}
			return enemy;
		},
		four: function(enemy){
			const rotateRadius = grid * 2, rotateMulti = 0.99;
			if(enemy.angle <= 3.2 && enemy.rotateSpeed != enemy.rotateSpeed * rotateMulti) enemy.rotateSpeed = enemy.rotateSpeed * rotateMulti;
			if(!enemy.initial) enemy.initial = enemy.x;

			if(enemy.goesRight){
				enemy.x = ((Math.cos(enemy.angle) * (rotateRadius * enemy.radiusMulti)) * -1) - (grid * 2);
			} else {
				enemy.x = gameWidth + Math.cos(enemy.angle) * (rotateRadius * enemy.radiusMulti);
			}

			enemy.y = enemy.initialY - (enemy.height / 2) + Math.sin(enemy.angle) * rotateRadius;
			enemy.angle -= enemy.rotateSpeed;
			if(enemy.angle <= 3.2 && gameClock % 16 == 0) spawnShots.medium.two(enemy);
			return enemy;
		}
	}
};

const enemyWaves = {
	small: {
		one: function(){
			const step = grid * .5;
			return {
				animation: enemyAnimations.small.one,
				img: enemySmallOneImg,
				width: grid,
				height: grid,
				score: 300,
				initial: (gameWidth / 2) - (grid /2),
				enemies: [
					{count: 0, y: -grid - (step * 10)},
					{count: 0.2, y: -grid - (step * 8)},
					{count: 0.4, y: -grid - (step * 6)},
					{count: 0.6, y: -grid - (step * 4)},
					{count: 0.8, y: -grid - (step * 2)},
					{count: 1, y: -grid}
				]
			}
		},
		two: function(){
			return {
				animation: enemyAnimations.small.two,
				width: grid,
				height: grid,
				score: 500,
				enemies: [
					{x: grid, y: -grid, hits: 2},
					{x: grid * 5, y: -grid * 3, hits: 2},
					{x: gameWidth - (grid * 2), y: -grid, hits: 2},
					{x: gameWidth - (grid * 6), y: -grid * 3, hits: 2},
				]
			}
		},
		three: function(){
			return {
				animation: enemyAnimations.small.three,
				width: grid,
				// img: enemySmallFourImg,
				height: grid,
				score: 300,
				enemies: [
					{x: grid * Math.floor(Math.random() * 15), y: -grid * Math.floor(Math.random() * 10)},
					{x: grid * Math.floor(Math.random() * 15), y: -grid * Math.floor(Math.random() * 10)},
					{x: grid * Math.floor(Math.random() * 15), y: -grid * Math.floor(Math.random() * 10)},
					{x: grid * Math.floor(Math.random() * 15), y: -grid * Math.floor(Math.random() * 10)},
					{x: grid * Math.floor(Math.random() * 15), y: -grid * Math.floor(Math.random() * 10)},
					{x: grid * Math.floor(Math.random() * 15), y: -grid * Math.floor(Math.random() * 10)},
				]
			}
		},
		four: function(){
			const step = grid * 1.5;
			return {
				animation: enemyAnimations.small.four,
				img: enemySmallTwoImg,
				width: grid,
				height: grid,
				score: 300,
				enemies: [
					{x: grid * 2, y: -grid - (step * 4), direction: 'downRight'},
					{x: grid * 2, y: -grid - (step * 3), direction: 'downRight'},
					{x: grid * 2, y: -grid - (step * 2), direction: 'downRight'},
					{x: grid * 2, y: -grid - step, direction: 'downRight'},
					{x: grid * 2, y: -grid, direction: 'downRight'},
					{x: gameWidth - (grid * 3), y: -grid - (step * 4), direction: 'downLeft'},
					{x: gameWidth - (grid * 3), y: -grid - (step * 3), direction: 'downLeft'},
					{x: gameWidth - (grid * 3), y: -grid - (step * 2), direction: 'downLeft'},
					{x: gameWidth - (grid * 3), y: -grid - step, direction: 'downLeft'},
					{x: gameWidth - (grid * 3), y: -grid, direction: 'downLeft'},
				]
			}
		},
		five: function(){
			const step = grid + (grid / 4), startX = gameWidth - (grid * 4);
			return {
				animation: enemyAnimations.small.five,
				img: enemySmallTwoImg,
				width: grid,
				height: grid,
				score: 300,
				enemies: [
					{x: startX, y: -grid},
					{x: startX, y: -grid - step},
					{x: startX, y: -grid - (step * 2)},
					{x: startX, y: -grid - (step * 3)},
					{x: startX, y: -grid - (step * 4)},
					{x: startX, y: -grid - (step * 5)},
					{x: startX, y: -grid - (step * 6)},
					{x: startX, y: -grid - (step * 7)},
					{x: startX, y: -grid - (step * 8)},
				]
			}
		},
		six: function(){
			return {
				animation: enemyAnimations.small.six,
				width: grid,
				height: grid,
				score: 300,
				enemies: [
					{x: grid, y: -grid, limit: (gameHeight / 3) * 2},
					{x: gameWidth - (grid * 2), y: -grid, limit: (gameHeight / 3) * 2},
					{x: grid * 2, y: -grid * 5, limit: (gameHeight / 3)},
					{x: gameWidth - (grid * 3), y: -grid * 5, limit: (gameHeight / 3)},
					{x: (gameWidth / 2) - (grid / 2), y: -grid * 8, limit: (gameHeight / 3)}
				]
			}
		},
		seven: function(){
			return {
				animation: enemyAnimations.small.seven,
				width: grid,
				height: grid,
				img: enemySmallOneImg,
				score: 300,
				enemies: [
					{x: grid * 4, y: -grid * 8, direction: 'right'},
					{x: gameWidth - (grid * 5), y: -grid * 8, direction: 'left'},
					{x: grid, y: -grid * 4, direction: 'right'},
					{x: gameWidth - (grid * 2), y: -grid * 4, direction: 'left'},
					{x: grid * 4, y: -grid, direction: 'right'},
					{x: gameWidth - (grid * 5), y: -grid, direction: 'left'},
				]
			}
		},
		eight: function(){
			const step = grid * 1.25;
			return {
				animation: enemyAnimations.small.eight,
				width: grid,
				height: grid,
				img: enemySmallTwoImg,
				fromBottom: true,
				score: 300,
				enemies: [
					{x: grid * 2, y: gameHeight + (step * 4), direction: 'downRight'},
					{x: grid * 2, y: gameHeight + (step * 3), direction: 'downRight'},
					{x: grid * 2, y: gameHeight + (step * 2), direction: 'downRight'},
					{x: grid * 2, y: gameHeight + step, direction: 'downRight'},
					{x: grid * 2, y: gameHeight, direction: 'downRight'},
					{x: gameWidth - (grid * 3), y: gameHeight + (step * 4), direction: 'downLeft'},
					{x: gameWidth - (grid * 3), y: gameHeight + (step * 3), direction: 'downLeft'},
					{x: gameWidth - (grid * 3), y: gameHeight + (step * 2), direction: 'downLeft'},
					{x: gameWidth - (grid * 3), y: gameHeight + step, direction: 'downLeft'},
					{x: gameWidth - (grid * 3), y: gameHeight, direction: 'downLeft'},
				]
			}
		},
		nine: function(){
			const step = grid + (grid / 4), startX = grid * 2;
			return {
				animation: enemyAnimations.small.nine,
				img: enemySmallTwoImg,
				width: grid,
				height: grid,
				score: 300,
				enemies: [
					{x: startX, y: -grid},
					{x: startX, y: -grid - step},
					{x: startX, y: -grid - (step * 2)},
					{x: startX, y: -grid - (step * 3)},
					{x: startX, y: -grid - (step * 4)},
					{x: startX, y: -grid - (step * 5)},
					{x: startX, y: -grid - (step * 6)},
					{x: startX, y: -grid - (step * 7)},
					{x: startX, y: -grid - (step * 8)},
				]
			}
		}
	},
	medium: {
		one: function(){
			return {
				animation: enemyAnimations.medium.one,
				img: enemyMediumOneImg,
				score: 2000,
				height: grid * 2,
				width: grid * 2,
				onlyDestroysPlayer: true,
				fromBottom: true,
				enemies: [
					{x: grid * 4, y: grid * -2, hits: 25},
				]
			}
		},
		two: function(){
			return {
				animation: enemyAnimations.medium.two,
				img: enemyMediumOneImg,
				score: 2000,
				height: grid * 2,
				width: grid * 2,
				onlyDestroysPlayer: true,
				enemies: [
					{x: gameWidth + grid, y: 0, hits: 10, initialY: (gameHeight / 3) - grid, angle: 4.7, radiusMulti: 7.5, rotateSpeed: 0.022},
					{x: gameWidth + grid, y: 0, hits: 10, initialY: (gameHeight / 3) + grid, angle: 5, radiusMulti: 6.5, rotateSpeed: 0.026}
				]
			}
		},
		three: function(isRight){
			var xPos = isRight ? gameWidth - (grid * 4) : grid * 2;
			return {
				animation: enemyAnimations.medium.three,
				img: enemyMediumOneImg,
				score: 2000,
				height: grid * 2,
				width: grid * 2,
				onlyDestroysPlayer: true,
				fromBottom: true,
				enemies: [
					{x: xPos, hits: 10, y: grid * -2}
				]
			}
		},
		four: function(){
			return {
				animation: enemyAnimations.medium.four,
				img: enemyMediumOneImg,
				score: 2000,
				height: grid * 2,
				width: grid * 2,
				onlyDestroysPlayer: true,
				enemies: [
					{x: grid * -1, y: 0, hits: 10, initialY: (gameHeight / 3), angle: 4.7, radiusMulti: 7.5, rotateSpeed: 0.022},
					{x: gameWidth + grid, y: 0, hits: 10, initialY: (gameHeight / 3), angle: 4.7, radiusMulti: 7.5, rotateSpeed: 0.022, goesRight: true}
				]
			}
		},
	}
};

const waves = [
	enemyWaves.small.one(),
	enemyWaves.small.one(),
	enemyWaves.small.two(),
	enemyWaves.small.two(),
	enemyWaves.small.three(),
	enemyWaves.small.three(),
	enemyWaves.small.four(),
	enemyWaves.small.five(),
	enemyWaves.small.six(),
	enemyWaves.small.six(),
	enemyWaves.medium.one(),
	enemyWaves.medium.two(),
	enemyWaves.small.seven(),
	enemyWaves.small.seven(),
	enemyWaves.small.three(),
	enemyWaves.small.three(),
	enemyWaves.small.eight(),
	enemyWaves.medium.three(),
	enemyWaves.medium.three(true),
	enemyWaves.small.seven(),
	enemyWaves.small.seven(),
	enemyWaves.medium.four(),
	enemyWaves.small.nine()
];

let waveClock = 0;
const waveLimit = 40;

enemiesLoop = function(){
	//  && gameClock >= 120
	if(waves.length && gameClock >= 120 && waveClock == 0){
		currentWave = waves[0];
		const draw = function(enemy, i){
			enemy.width = currentWave.width;
			enemy.height = currentWave.height;
			if(currentWave.img) enemy.img = currentWave.img;
			enemy.animation = currentWave.animation;
			if(currentWave.initial) enemy.initial = currentWave.initial;
			enemy = enemy.animation(enemy);
			if(enemy.img){
				if(enemy.hitClock){
					context.save();
					context.drawImage(enemy.img, enemy.x, enemy.y);
					context.globalCompositeOperation = 'color-dodge';
					context.fillStyle = 'rgba(255,255,255,.5)';
					context.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
					context.restore();
					enemy.hitClock--;
				} else {
					context.drawImage(enemy.img, enemy.x, enemy.y);
				}
			}
			if(currentWave.fromBottom){
				if(enemy.y <= -(grid * 2) || enemy.x + enemy.width <= -(grid * 4) || enemy.x >= gameWidth + (grid * 4)) currentWave.enemies.splice(i, 1);
			} else {
				if(enemy.y <= -(grid * 10) || enemy.x + enemy.width <= -(grid * 4) || enemy.x >= gameWidth + (grid * 4) || enemy.y > gameHeight) currentWave.enemies.splice(i, 1);
			}
			if(!currentWave.enemies.length){
				waveClock = waveLimit;
				waves.shift();
			}
			const enemyCollisionEl = {x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height},
			killEnemy = function(bulletObj){
				explodeEntity(bulletObj);
				score += currentWave.score;
				currentWave.chain++;
				currentWave.enemies.splice(i, 1);
			};
			checkBulletCollision(enemyCollisionEl, function(bulletObj){
				if(enemy.hits){
					enemy.hits -= 1;
					enemy.hitClock = 2;
					if(enemy.hits == 0) killEnemy(bulletObj);
				} else killEnemy(bulletObj);
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
		} else {
			waveClock = waveLimit;
			waves.shift();
		}
	} else if(waveClock > 0) waveClock--;
};