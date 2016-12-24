const bossShots = {oneA: [], oneB: []};

const missileTwoNImg = new Image(), missileTwoSImg = new Image(), missileTwoWImg = new Image(), missileTwoEImg = new Image(),
	missileTwoNWImg = new Image(), missileTwoNEImg = new Image(), missileTwoSWImg = new Image(), missileTwoSEImg = new Image();
missileTwoNImg.src = 'img/missiletwon.png';
missileTwoSImg.src = 'img/missiletwo.png';
missileTwoWImg.src = 'img/missiletwow.png';
missileTwoEImg.src = 'img/missiletwoe.png';
missileTwoNWImg.src = 'img/missiletwonw.png';
missileTwoNEImg.src = 'img/missiletwone.png';
missileTwoSWImg.src = 'img/missiletwosw.png';
missileTwoSEImg.src = 'img/missiletwose.png';

const bossBulletSpawn = {
	oneA: function(enemy){
		// bossShots.oneA.push({x: enemy.x + (enemy.height / 2), y: enemy.y - grid, width: 12, height: grid, direction: 'n'});
		// bossShots.oneA.push({x: enemy.x + (enemy.height / 2), y: enemy.y + enemy.height, width: 12, height: grid, direction: 's'});
		// bossShots.oneA.push({x: enemy.x - grid, y: enemy.y + (enemy.height / 2), width: grid, height: 12, direction: 'w'});
		// bossShots.oneA.push({x: enemy.x + enemy.width, y: enemy.y + (enemy.height / 2), width: grid, height: 12, direction: 'e'});
		bossShots.oneA.push({x: enemy.x, y: enemy.y, width: 12, height: grid, direction: 'nw'});
		bossShots.oneA.push({x: enemy.x + enemy.width - grid, y: enemy.y, width: grid, height: grid, direction: 'ne'});
		bossShots.oneA.push({x: enemy.x, y: enemy.y + enemy.height - grid, width: grid, height: grid, direction: 'sw'});
		bossShots.oneA.push({x: enemy.x + enemy.width - grid, y: enemy.y + enemy.height - grid, width: grid, height: grid, direction: 'se'});
	}, oneB: function(enemy){
		bossShots.oneB.push({x: enemy.x + (enemy.height / 2), y: enemy.y - 6, width: 6, height: 6, direction: 'n'});
		bossShots.oneB.push({x: enemy.x + (enemy.height / 2), y: enemy.y + enemy.height, width: 6, height: 6, direction: 's'});
		bossShots.oneB.push({x: enemy.x - 6, y: enemy.y + (enemy.height / 2), width: 6, height: 6, direction: 'w'});
		bossShots.oneB.push({x: enemy.x + enemy.width, y: enemy.y + (enemy.height / 2), width: 6, height: 6, direction: 'e'});
		bossShots.oneB.push({x: enemy.x - 6, y: enemy.y - 6, width: 6, height: 6, direction: 'nw'});
		bossShots.oneB.push({x: enemy.x + enemy.width, y: enemy.y - 6, width: 6, height: 6, direction: 'ne'});
		bossShots.oneB.push({x: enemy.x - 6, y: enemy.y + enemy.height, width: 6, height: 6, direction: 'sw'});
		bossShots.oneB.push({x: enemy.x + enemy.width, y: enemy.y + enemy.height, width: 6, height: 6, direction: 'se'});
	}
};

const bossBulletOneSpeeds = {
	n: levelSpeed * 1.67,
	nwney: levelSpeed * 1.1,
	nwnex: levelSpeed * 1,
	s: levelSpeed * 1.5,
	swsey: levelSpeed * 1,
	swsex: levelSpeed * 1,
	we: levelSpeed * 1.5

};

const bossBulletAnimations = {
	oneA: function(){
		bossShots.oneA.forEach(function(shotObj, i){
			switch(shotObj.direction){
				case 'n':
					bossShots.oneA[i].y -= bossBulletOneSpeeds.n;
					context.drawImage(missileTwoNImg, shotObj.x, shotObj.y);
					break;
				case 's':
					bossShots.oneA[i].y += bossBulletOneSpeeds.s;
					context.drawImage(missileTwoSImg, shotObj.x, shotObj.y);
					break;
				case 'w':
					bossShots.oneA[i].x -= bossBulletOneSpeeds.we;
					context.drawImage(missileTwoWImg, shotObj.x, shotObj.y);
					break;
				case 'e':
					bossShots.oneA[i].x += bossBulletOneSpeeds.we;
					context.drawImage(missileTwoEImg, shotObj.x, shotObj.y);
					break;
				case 'nw':
					bossShots.oneA[i].y -= bossBulletOneSpeeds.nwney;
					bossShots.oneA[i].x -= bossBulletOneSpeeds.nwnex;
					context.drawImage(missileTwoNWImg, shotObj.x, shotObj.y);
					break;
				case 'ne':
					bossShots.oneA[i].y -= bossBulletOneSpeeds.nwney;
					bossShots.oneA[i].x += bossBulletOneSpeeds.nwnex;
					context.drawImage(missileTwoNEImg, shotObj.x, shotObj.y);
					break;
				case 'sw':
					bossShots.oneA[i].y += bossBulletOneSpeeds.swsey;
					bossShots.oneA[i].x -= bossBulletOneSpeeds.swsex;
					context.drawImage(missileTwoSWImg, shotObj.x, shotObj.y);
					break;
				case 'se':
					bossShots.oneA[i].y += bossBulletOneSpeeds.swsey;
					bossShots.oneA[i].x += bossBulletOneSpeeds.swsex;
					context.drawImage(missileTwoSEImg, shotObj.x, shotObj.y);
					break;
			};
			if(bossShots.oneA[i].y >= gameHeight) bossShots.oneA.splice(i, 1);
			else if(bossShots.oneA[i].y + shotObj.height <= 0) bossShots.oneA.splice(i, 1);
			if(bossShots.oneA[i]){
				if(bossShots.oneA[i].x >= gameWidth) bossShots.oneA.splice(i, 1);
				else if(bossShots.oneA[i].x + shotObj.width <= 0) bossShots.oneA.splice(i, 1);
			}
			if(bossShots.oneA[i]) checkEnemyShotCollision(shotObj, i, bossShots.oneA);
			if(bossShots.oneA[i]) checkEnemyPopcorn(shotObj, i, bossShots.oneA);
		});
	}, oneB: function(){
		bossShots.oneB.forEach(function(shotObj, i){
			switch(shotObj.direction){
				case 'n':
					bossShots.oneB[i].y -= bossBulletOneSpeeds.n;
					context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
					break;
				case 's':
					bossShots.oneB[i].y += bossBulletOneSpeeds.s;
					context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
					break;
				case 'w':
					bossShots.oneB[i].x -= bossBulletOneSpeeds.we;
					context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
					break;
				case 'e':
					bossShots.oneB[i].x += bossBulletOneSpeeds.we;
					context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
					break;
				case 'nw':
					bossShots.oneB[i].y -= bossBulletOneSpeeds.nwney;
					bossShots.oneB[i].x -= bossBulletOneSpeeds.nwnex;
					context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
					break;
				case 'ne':
					bossShots.oneB[i].y -= bossBulletOneSpeeds.nwney;
					bossShots.oneB[i].x += bossBulletOneSpeeds.nwnex;
					context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
					break;
				case 'sw':
					bossShots.oneB[i].y += bossBulletOneSpeeds.swsey;
					bossShots.oneB[i].x -= bossBulletOneSpeeds.swsex;
					context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
					break;
				case 'se':
					bossShots.oneB[i].y += bossBulletOneSpeeds.swsey;
					bossShots.oneB[i].x += bossBulletOneSpeeds.swsex;
					context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
					break;
			};
			if(bossShots.oneB[i].y >= gameHeight) bossShots.oneB.splice(i, 1);
			else if(bossShots.oneB[i].y + shotObj.height <= 0) bossShots.oneB.splice(i, 1);
			if(bossShots.oneB[i]){
				if(bossShots.oneB[i].x >= gameWidth) bossShots.oneB.splice(i, 1);
				else if(bossShots.oneB[i].x + shotObj.width <= 0) bossShots.oneB.splice(i, 1);
			}
			if(bossShots.oneB[i]) checkEnemyShotCollision(shotObj, i, bossShots.oneB);
		});
	}
};