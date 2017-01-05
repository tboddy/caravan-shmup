let shots = {one: [], two: [], twoBottom: [], three: [], threeBottom: [], threeLeft: [], threeRight: [], four: [], fourTopLeft: [], fourTopRight: [], fourBottomLeft: [], fourBottomRight: []}, canShoot = true, currentPowerup = 1;
const shotSpeed = 10, shotClock = 6, shotWidth = grid / 2, shotHeight = grid / 2,
	bulletOneImg = new Image(), bulletTwoImg = new Image(), bulletThreeImg = new Image(), bulletThreeLeftImg = new Image(), bulletThreeRightImg = new Image();
bulletOneImg.src = 'img/playerbullet.png';
bulletTwoImg.src = 'img/playerbullettwo.png';
bulletThreeImg.src = 'img/playerbulletthree.png';
bulletThreeLeftImg.src = 'img/playerbulletthreeleft.png';
bulletThreeRightImg.src = 'img/playerbulletthreeright.png';

const shootingLoop = function(){
	const update = function(){
		if(shot && (gameClock % shotClock == 0)){
			const shotX = playerX + (playerWidth / 2) - (shotWidth / 2);
			const shotObj = {x: shotX, y: playerY - ((grid / 3) * 2)};
			switch(currentPowerup){
				case 1: shots.one.push(shotObj); break;
				case 2:
					shots.two.push(shotObj);
					shots.twoBottom.push({x: shotX + (grid / 8), y: playerY + (grid * 1.5)});
					break;
				case 3:
					shots.three.push({x: shotX + (grid / 8), y: playerY - ((grid / 3) * 2)});
					shots.threeBottom.push({x: shotX + (grid / 8), y: playerY + (grid * 1.5)});
					shots.threeLeft.push({x: shotX - grid, y: playerY - (grid / 4)});
					shots.threeRight.push({x: shotX + grid, y: playerY - (grid / 4)});
					break;
				case 4:
					shots.four.push(shotObj);
					shots.fourTopLeft.push({x: shotX - grid, y: playerY - (grid / 4)});
					shots.fourTopRight.push({x: shotX + grid, y: playerY - (grid / 4)});
					shots.fourBottomLeft.push({x: shotX - grid, y: playerY + (grid * 1.25)});
					shots.fourBottomRight.push({x: shotX + grid, y: playerY + (grid * 1.25)});
					break;
			};
		}
	};
	const draw = function(){
		let typeCount = 0;
		for(let i in shots){
			if(shots[i].length){
				shots[i].forEach(function(shotItem, j){
					shootBullet(shotItem, j, typeCount);
				});
			}
			typeCount++;
		};
	};
	update();
	draw();
},

checkBulletBounds = function(shotItem){
	return (shotItem.y + shotHeight >= 0 && shotItem.y <= gameHeight && shotItem.x + shotWidth >= 0 && shotItem.x <= gameWidth) ? true : false;
},

shootBullet = function(shotItem, i, type){
	switch(type){
		case 0: shootBulletOne(shotItem, i); break;
		case 1: shootBulletTwo(shotItem, i); break;
		case 2: shootBulletTwoBottom(shotItem, i); break;
		case 3: shootBulletThree(shotItem, i); break;
		case 4: shootBulletThreeBottom(shotItem, i); break;
		case 5: shootBulletThreeLeft(shotItem, i); break;
		case 6: shootBulletThreeRight(shotItem, i); break;
		case 7: shootBulletFour(shotItem, i); break;
		case 8: shootBulletFourTopLeft(shotItem, i); break;
		case 9: shootBulletFourTopRight(shotItem, i); break;
		case 10: shootBulletFourBottomLeft(shotItem, i); break;
		case 11: shootBulletFourBottomRight(shotItem, i); break;
	};
},

shootBulletOne = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletOneImg, shotItem.x, shotItem.y);
		shots.one[i].y = shotItem.y -= shotSpeed;
	} else {
		shots.one.splice(i, 1)
	}
},

shootBulletTwo = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletOneImg, shotItem.x, shotItem.y);
		shots.two[i].y = shotItem.y -= shotSpeed;
	} else {
		shots.two.splice(i, 1)
	}
},

shootBulletTwoBottom = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletTwoImg, shotItem.x, shotItem.y);
		shots.twoBottom[i].y = shotItem.y += shotSpeed;
	} else {
		shots.twoBottom.splice(i, 1)
	}
},

shootBulletThree = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletThreeImg, shotItem.x, shotItem.y);
		shots.three[i].y = shotItem.y -= shotSpeed;
	} else {
		shots.three.splice(i, 1)
	}
},

shootBulletThreeBottom = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletTwoImg, shotItem.x, shotItem.y);
		shots.threeBottom[i].y = shotItem.y += shotSpeed;
	} else {
		shots.threeBottom.splice(i, 1)
	}
},

shootBulletThreeLeft = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletThreeLeftImg, shotItem.x, shotItem.y);
		shots.threeLeft[i].y = shotItem.y -= shotSpeed;
		shots.threeLeft[i].x = shotItem.x -= shotSpeed;
	} else {
		shots.threeLeft.splice(i, 1)
	}
},

shootBulletThreeRight = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletThreeRightImg, shotItem.x, shotItem.y);
		shots.threeRight[i].y = shotItem.y -= shotSpeed;
		shots.threeRight[i].x = shotItem.x += shotSpeed;
	} else {
		shots.threeRight.splice(i, 1)
	}
},

shootBulletFour = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletOneImg, shotItem.x, shotItem.y);
		shots.four[i].y = shotItem.y -= shotSpeed;
	} else {
		shots.four.splice(i, 1)
	}
},

shootBulletFourTopLeft = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletThreeLeftImg, shotItem.x, shotItem.y);
		shots.fourTopLeft[i].y = shotItem.y -= shotSpeed;
		shots.fourTopLeft[i].x = shotItem.x -= shotSpeed;
	} else {
		shots.fourTopLeft.splice(i, 1)
	}
},

shootBulletFourTopRight = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletThreeRightImg, shotItem.x, shotItem.y);
		shots.fourTopRight[i].y = shotItem.y -= shotSpeed;
		shots.fourTopRight[i].x = shotItem.x += shotSpeed;
	} else {
		shots.fourTopRight.splice(i, 1)
	}
},

shootBulletFourBottomLeft = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletThreeRightImg, shotItem.x, shotItem.y);
		shots.fourBottomLeft[i].y = shotItem.y += shotSpeed;
		shots.fourBottomLeft[i].x = shotItem.x -= shotSpeed;
	} else {
		shots.fourBottomLeft.splice(i, 1)
	}
},

shootBulletFourBottomRight = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletThreeLeftImg, shotItem.x, shotItem.y);
		shots.fourBottomRight[i].y = shotItem.y += shotSpeed;
		shots.fourBottomRight[i].x = shotItem.x += shotSpeed;
	} else {
		shots.fourBottomRight.splice(i, 1)
	}
},

checkBulletCollision = function(el, callback){
	for(var group in shots){
		if(shots[group].length){
			shots[group].forEach(function(shot, i){
				var shotObj = {x: shot.x, y: shot.y, width: grid / 2, height: grid / 2};
				if(group == 'twoBottom' || group == 'three' || group == 'threeBottom') shotObj.width = grid / 4;
				checkCollision(el, shotObj, function(el, shotObj){
					shots[group].splice(i, 1);
					callback(shotObj);
				});
			});
		}
	};
};