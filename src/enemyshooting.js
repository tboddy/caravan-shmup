let enemyShots = {
	small: {seven: []},
	medium: {one: [], two: []},
	boss: {one: [], two: []}
};

const missileOneImg = new Image(), missileTwoImg = new Image(), blueBulletImg = new Image();
missileOneImg.src = 'img/missileone.png';
missileTwoImg.src = 'img/missiletwo.png';
blueBulletImg.src = 'img/bluebullet.png';

let bossAngle = 0, bossRight = false;
const bossDiff = 1.25, bossRem = 0.005;

const spawnShots = {
	small: {
		seven(enemy){
			enemyShots.small.seven.push({x: enemy.x + (enemy.width / 2) - 3, y: enemy.y + ((enemy.height / 4) * 3), width: 6, height: 6});
		}
	}, medium: {
		one(enemy){
			enemyShots.medium.one.push({x: enemy.x + (enemy.width / 2) - 3, y: enemy.y + ((enemy.height / 4) * 3), width: 6, height: 6});
		}, two(enemy){
			enemyShots.medium.two.push({x: enemy.x + (enemy.width / 2) - 3, y: enemy.y + ((enemy.height / 4) * 3), width: 12, height: grid});
		}
	}, boss: {
		one(enemy){
			enemyShots.boss.one.push({x: enemy.x + (enemy.width / 2) - 4, y: enemy.y + ((enemy.height / 4) * 3), width: 12, height: grid});
		}, two(enemy){
			enemyShots.boss.one.push({x: enemy.x, y: enemy.y + enemy.y + ((enemy.height / 4) * 3), width: 12, height: grid});
		}
	}
},

shotAnimations = {
	small: {
		seven: function(){
			const vel = 2;
			enemyShots.small.seven.forEach(function(shotObj, i){
				if(!shotObj.dAngle) shotObj.dAngle = Math.atan2(playerY - shotObj.y, (playerX + (playerWidth / 2) - 3) - shotObj.x);
				shotObj.x += vel * Math.cos(shotObj.dAngle);
				shotObj.y += (vel) * Math.sin(shotObj.dAngle);
				context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
				if(canGetHit) checkEnemyShotCollision(shotObj, i, enemyShots.small.seven);
				if(shotObj.y >= gameHeight) enemyShots.small.seven.splice(i, 1);
			});
		}
	}, medium: {
		one(){
			const vel = 2;
			enemyShots.medium.one.forEach((shotObj, i) => {
				if(!shotObj.dAngle) shotObj.dAngle = Math.atan2(playerY - shotObj.y, (playerX + (playerWidth / 2) - 3) - shotObj.x);
				shotObj.x += vel * Math.cos(shotObj.dAngle);
				shotObj.y += (vel) * Math.sin(shotObj.dAngle);
				context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
				if(canGetHit) checkEnemyShotCollision(shotObj, i, enemyShots.medium.one);
				if(shotObj.y >= gameHeight) enemyShots.medium.one.splice(i, 1);
			});
		}, two(){
			enemyShots.medium.two.forEach((shotObj, i) => {
				shotObj.y += 1.5;
				context.drawImage(missileOneImg, shotObj.x, shotObj.y);
				if(canGetHit) checkEnemyShotCollision(shotObj, i, enemyShots.medium.one);
				checkEnemyPopcorn(shotObj, i, enemyShots.medium.two);
				if(shotObj.y >= gameHeight) enemyShots.medium.two.splice(i, 1);
			});
		}
	}, boss: {
		one(){
			enemyShots.boss.one.forEach((shotObj, i) => {
				if(bossRight){
					if(bossAngle >= bossDiff) bossRight = false;
					bossAngle = bossAngle + bossRem;
				} else {
					if(bossAngle <= -bossDiff) bossRight = true; 
					bossAngle = bossAngle - bossRem;
				}
				if(!shotObj.init) shotObj.init = bossAngle;
				shotObj.x += shotObj.init;
				shotObj.y += 1.75;
				context.drawImage(missileOneImg, shotObj.x, shotObj.y);
				if(canGetHit) checkEnemyShotCollision(shotObj, i, enemyShots.boss.one);
				checkEnemyPopcorn(shotObj, i, enemyShots.boss.one);
				if(shotObj.y >= gameHeight) enemyShots.boss.one.splice(i, 1);
			});
		}, two(){

		}
	}
},

enemyShootingLoop = function(){
	var draw = function(){
		if(enemyShots.small.seven.length) shotAnimations.small.seven();
		if(enemyShots.medium.one.length) shotAnimations.medium.one();
		if(enemyShots.medium.two.length) shotAnimations.medium.two();
		if(enemyShots.boss.one.length) shotAnimations.boss.one();
		if(enemyShots.boss.two.length) shotAnimations.boss.two();
	};
	draw();
},

checkEnemyShotCollision = function(shotObj, i, arr){
	checkCollision(shotObj, {x: playerX, y: playerY, width: grid, height: grid}, function(){
		arr.splice(i, 1);
		getHit(arr, i);
	});
},

checkEnemyPopcorn = function(shotObj, i, arr){
	checkBulletCollision(shotObj, function(){
		explodeEntity(shotObj);
		arr.splice(i, 1);
		score += 20;
	});
};