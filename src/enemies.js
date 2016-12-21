const enemies = {
	small: {one: [], two: [], three: [], four: []},
	medium: {one: []}
};

const enemySmallOneImg = new Image(), enemySmallTwoImg = new Image(), enemySmallFourImg = new Image();
	enemyMediumOneImg = new Image();
enemySmallOneImg.src = 'img/enemysmallone.png';
enemySmallTwoImg.src = 'img/enemysmalltwo.png';
enemyMediumOneImg.src = 'img/enemymediumone.png';
enemySmallFourImg.src = 'img/enemysmallthree.png';

var enemiesLoop = function(){

	var draw = function(){

		var drawEnemy = function(opts){
			opts.arr.forEach(function(enemyObj, i){
				if(enemyObj.y + opts.height < 0 && (enemyObj.direction && (enemyObj.direction != 'up') || !enemyObj.direction)) enemyObj.y += levelSpeed;
				if(enemyObj.y + opts.height >= 0){
				enemyObj = opts.animation(enemyObj, opts.width, opts.height, i, opts.arr);
					context.drawImage(opts.img, enemyObj.x, enemyObj.y);
					var enemyCollisionEl = {x: enemyObj.x, y: enemyObj.y, width: opts.width, height: opts.height};
					checkBulletCollision(enemyCollisionEl, function(){
						explodeEntity(enemyCollisionEl);
						if(opts.hits && !opts.arr['hits']){
							opts.arr['hits'] = opts.hits;
						} else if(opts.arr['hits']) {
							opts.arr.hits -= 1;
							if(opts.arr.hits == 0){
								opts.arr.splice(i, 1);
								score += opts.score;
							}
						} else {
							opts.arr.splice(i, 1);
							score += opts.score;
						}
					});
					if(canGetHit){
						checkCollision({x: playerX, y: playerY, width: playerWidth, height: playerHeight}, enemyCollisionEl, function(){
							opts.onlyDestroysPlayer ? getHit(opts.arr, i, true) : getHit(opts.arr, i);
						});
					}
					if(enemyObj.y + opts.height < 0 && enemyObj.direction){
						if(enemyObj.direction == 'up') opts.arr.splice(i, 1);
					}
					if((enemyObj.y + opts.height >= gameHeight + (opts.height * 2))) opts.arr.splice(i, 1);
				}
			});
		};

		if(enemies.small.one.length) drawEnemySmallOne(drawEnemy);
		if(enemies.small.two.length) drawEnemySmallTwo(drawEnemy);
		if(enemies.small.three.length) drawEnemySmallThree(drawEnemy);
		if(enemies.small.four.length) drawEnemySmallFour(drawEnemy);
		if(enemies.medium.one.length) drawEnemyMediumOne(drawEnemy);

		if(bosses.oneA.length) drawBossOneA(drawEnemy);
		if(bosses.oneB.length) drawBossOneB(drawEnemy);

	};

	draw();

};

// draw farm
var drawEnemySmallOne = function(callback){
	var opts = {
		arr: enemies.small.one,
		img: enemySmallOneImg,
		width: grid,
		height: grid,
		animation: enemyAnimations.smallOne,
		score: 300
	};
	callback(opts);
}, drawEnemySmallTwo = function(callback){
	var opts = {
		arr: enemies.small.two,
		img: enemySmallTwoImg,
		width: grid,
		height: grid,
		animation: enemyAnimations.smallTwo,
		score: 300
	};
	callback(opts);
}, drawEnemySmallThree = function(callback){
	var opts = {
		arr: enemies.small.three,
		img: enemySmallTwoImg,
		width: grid,
		height: grid,
		animation: enemyAnimations.smallThree,
		score: 500
	};
	callback(opts);
}, drawEnemySmallFour = function(callback){
	var opts = {
		arr: enemies.small.four,
		img: enemySmallFourImg,
		width: grid,
		height: grid,
		animation: enemyAnimations.smallFour,
		score: 200
	};
	callback(opts);
}, drawEnemyMediumOne = function(callback){
	var opts = {
		arr: enemies.medium.one,
		img: enemyMediumOneImg,
		width: grid * 2,
		height: grid * 2,
		animation: enemyAnimations.mediumOne,
		score: 1000,
		hits: 5
	};
	callback(opts);
};


// animations

var enemyAnimations = {
	smallOne: function(enemyObj){
		if(enemyObj.y + grid >= 0) enemyObj.y += (levelSpeed / 4) * 3;
		enemyObj = sineCurve(enemyObj, grid / 3, grid * 4);
		return enemyObj;
	},
	smallTwo: function(enemyObj, enemyWidth, enemyHeight){
		if(enemyObj.y + grid >= 0) enemyObj.y += levelSpeed;
		enemyObj = sineCurve(enemyObj, grid / 3, grid * 2.5);
		return enemyObj;
	},
	smallThree: function(enemyObj, enemyWidth, enemyHeight, i, enemyArr){
		if(enemyObj.y + enemyHeight >= 0){
			let ySpeed = levelSpeed;
			if(enemyObj.y + grid > grid){
				if(enemyObj.y + enemyObj.height < playerY){
					if(enemyObj.x + enemyWidth < playerX) enemyObj.x += grid / 3;
					else if(enemyObj.x + enemyObj.width > playerX + playerWidth) enemyObj.x -= grid / 3;
					if(enemyObj.x + enemyWidth >= playerX - grid && enemyObj.x + enemyObj.width < playerX + playerWidth + grid) ySpeed = levelSpeed * 3;
				} else ySpeed = levelSpeed * 3;
			}
			enemyObj.y += ySpeed;
		}
		return enemyObj;
	}, smallFour: function(enemyObj, enemyWidth, enemyHeight, i, enemyArr){
		if(enemyObj.y + enemyHeight >= 0){
			enemyObj.y += levelSpeed * 2.75;
		}
		return enemyObj;
	}, mediumOne: function(enemyObj){
		if((enemyObj.y + enemyObj.height) >= gameHeight / 2) enemyObj.direction = 'up';
		if(enemyObj.direction == 'up'){
			enemyObj.y -= levelSpeed / 2;
			if(gameClock % 6 == 0){
				spawnMediumOneShot(enemyObj);
			}
		}
		else enemyObj.y += levelSpeed * 2;
		return enemyObj;
	}
};