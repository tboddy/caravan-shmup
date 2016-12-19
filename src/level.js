var levelRowPositions = [], gridPositions = []; levelStartPos = 0, levelSpeed = 1.5, groundSpeed = 1 / 128, cloudSpeed = 1 / 24, introTime = 90, outroTime = 2700, currentPlatformAnimation = 0;

var setupLevel = function(){
	var rowGridCount = levelMap[0].length,
		levelStartPos = levelMap.length * grid;
	levelMap.forEach(function(levelRow, i){
		var rowY = (i * grid) - (levelStartPos - gameHeight);
		var gridPosition = {y: rowY, groundY: rowY, cloudY: rowY, grids: []};
		levelRow.forEach(function(levelGrid, j){
			gridPosition.grids.push({x: j * grid, char: levelRow[j]});
			if(levelGrid.indexOf('(') > -1){
				entity = levelGrid.substring(levelGrid.indexOf('(') + 1, levelGrid.indexOf('(') + 2);
				var xPos = j * grid, yPos = (i * grid) - (levelStartPos - gameHeight);
				switch(entity){
					case 'p':
						var powerupDirection = (Math.random() >= 0.5) ? 'left' : 'right';
						powerups.push({x: xPos, y: yPos, initial: xPos, direction: powerupDirection, width: grid});
						break;
					case '1': enemies.small.one.push({x: xPos, y: yPos, initial: xPos, width: grid, height: grid}); break;
					case '2': enemies.small.two.push({x: xPos, y: yPos, initial: xPos, width: grid, height: grid}); break;
					case '3': enemies.medium.one.push({x: xPos, y: yPos, width: grid * 2, height: grid * 2, hits: 2}); break;
					case '4': enemies.small.three.push({x: xPos, y: yPos, width: grid, height: grid}); break;
				};
			}
		});
		gridPositions.push(gridPosition);
	});
	setupGridImages();
};

const greenBlockImg = new Image(), redBlockImg = new Image(), greenPointImg = new Image(), redPointImg = new Image(), destroyedImg = new Image(),
	platformOneImg = new Image(), platformTwoImg = new Image(), platformBottomImg = new Image(), platformBottomLeftImg = new Image(), platformBottomRightImg = new Image(), platformLeftImg = new Image(), platformTopLeftImg = new Image(),
	platformRightImg = new Image(), platformTopRightImg = new Image(), platformRightNubImg = new Image(), platformLeftNubImg = new Image(), platformIntersectTopLeftImg = new Image(), platformIntersectTopRightImg = new Image(),
	pipeImg = new Image(), pipeLeftImg = new Image(), pipeRightImg = new Image(), bigBlockImg = new Image(), destroyedBigBlockImg = new Image(), bigThingImg = new Image();

const setupGridImages = function(){
	greenBlockImg.src = 'img/greenblock.png';
	redBlockImg.src = 'img/redBlock.png';
	greenPointImg.src = 'img/greenpoint.png';
	redPointImg.src = 'img/greenpoint.png';
	destroyedImg.src = 'img/destroyed.png';

	platformOneImg.src = 'img/platform1.png';
	platformTwoImg.src = 'img/platform2.png';
	platformBottomImg.src = 'img/platformbottom.png';
	platformBottomLeftImg.src = 'img/platformbottomleft.png';
	platformBottomRightImg.src = 'img/platformbottomright.png';
	platformLeftImg.src = 'img/platformleft.png';
	platformTopLeftImg.src = 'img/platformtopleft.png';
	platformRightImg.src = 'img/platformright.png';
	platformTopRightImg.src = 'img/platformtopright.png';
	platformLeftNubImg.src = 'img/platformleftnub.png';
	platformRightNubImg.src = 'img/platformrightnub.png';
	platformIntersectTopLeftImg.src = 'img/platformintersecttopleft.png';
	platformIntersectTopRightImg.src = 'img/platformintersecttopright.png';

	pipeImg.src = 'img/pipe.png';
	pipeLeftImg.src = 'img/pipeleft.png';
	pipeRightImg.src = 'img/piperight.png';

	bigBlockImg.src = 'img/bigblock.png';
	destroyedBigBlockImg.src = 'img/destroyedbigblock.png';

	bigThingImg.src = 'img/bigthing.png';
};

var levelLoop = function(){

	var update = function(){
		if(gameClock % 16 == 0){
			currentPlatformAnimation++;
			if(currentPlatformAnimation == 4) currentPlatformAnimation = 0;
		}
		for(var i in gridPositions){
			gridPositions[i].y += levelSpeed;
			gridPositions[i].groundY += groundSpeed;
			gridPositions[i].cloudY += cloudSpeed;
		}
		updateBlocks();
	};

	var draw = function(){

		var drawForeground = function(row, i){
			var rowY = gridPositions[i].y
			if(rowY + grid >= 0 && rowY <= gameHeight){
				row.forEach(function(levelGrid, j){
					if(levelGrid != ' '){
						var img;
						if(levelGrid.indexOf('(') > -1) levelGrid = levelGrid.substring(0, levelGrid.indexOf('('));
						levelGrid = levelGrid.trim();
						if(levelGrid != ''){
							switch(levelGrid){
								case 'g': img = greenBlockImg; break;
								case 'r': img = redBlockImg; break;
								case 'G': img = greenPointImg; break;
								case 'R': img = redPointImg; break;
								case 't': img = destroyedImg; break;
								case 'B': img = platformOneImg; break;
								case 'M': img = platformTwoImg; break;
								case 'b': img = platformBottomImg; break;
								case 'v': img = platformBottomLeftImg; break;
								case 'N': img = platformBottomRightImg; break;
								case 'X': img = platformLeftImg; break;
								case 'V': img = platformTopLeftImg; break;
								case 'n': img = platformRightImg; break;
								case 'm': img = platformTopRightImg; break;
								case 'Z': img = platformLeftNubImg; break;
								case 'z': img = platformRightNubImg; break;
								case 'a': img = platformIntersectTopLeftImg; break;
								case 'A': img = platformIntersectTopRightImg; break;
								case 'w': img = pipeImg; break;
								case 'W': img = pipeLeftImg; break;
								case 'e': img = pipeRightImg; break;
								case 'k': img = bigBlockImg; break;
								case 'K': img = bigBlockImg; break;
								case 'l': img = bigBlockImg; break;
								case 'L': img = bigBlockImg; break;
								case 'u': img = destroyedBigBlockImg; break;
								case 'U': img = destroyedBigBlockImg; break;
								case 'i': img = destroyedBigBlockImg; break;
								case 'I': img = destroyedBigBlockImg; break;
								case 'o': img = bigThingImg; break;
								case 'O': img = bigThingImg; break;
								case 'p': img = bigThingImg; break;
								case 'P': img = bigThingImg; break;
							}
							if(levelGrid == 'K' || levelGrid == 'O' || levelGrid == 'U') context.drawImage(img, 0, 0, grid, grid, (j * grid), rowY, grid, grid);
							else if(levelGrid == 'k' || levelGrid == 'o' || levelGrid == 'u') context.drawImage(img, 0, grid, grid, grid, (j * grid), rowY, grid, grid);
							else if(levelGrid == 'L' || levelGrid == 'P' || levelGrid == 'I') context.drawImage(img, grid, 0, grid, grid, (j * grid), rowY, grid, grid);
							else if(levelGrid == 'l' || levelGrid == 'p' || levelGrid == 'i') context.drawImage(img, grid, grid, grid, grid, (j * grid), rowY, grid, grid);
							else if(levelGrid == 'b' || levelGrid == 'N' || levelGrid == 'v' || levelGrid == 'a' || levelGrid == 'A'){
								var sX = 0;
								switch(currentPlatformAnimation){
									case 0: sX = 0; break;
									case 1: sX = grid; break;
									case 2: sX = grid * 2; break;
									case 3: sX = grid; break;
								};
								context.drawImage(img, sX, 0, grid, grid, (j * grid), rowY, grid, grid);
							}
							else context.drawImage(img, (j * grid), rowY);
						}
					} else {
						context.fillStyle = 'transparent';
						context.fillRect((j * grid), rowY, grid, grid);
					}
				});
			}
		};

		var drawLayer = function(type){
			levelMap.forEach(function(row, i){
				switch(type){
					case 'ground':
						var groundY = gridPositions[i].groundY * grid;
						if(groundY + (grid * grid) >= 0 && groundY <= gameHeight){
					 		var groundEl = new Image();
					 		groundEl.src = 'img/stars1.png';
					 		context.drawImage(groundEl, 0, groundY);
						}
						break;
					case 'clouds':
						var cloudY = gridPositions[i].cloudY * grid;
						if(cloudY + (grid * grid) >= 0 && cloudY <= gameHeight){
					 		var cloudEl = new Image();
					 		cloudEl.src = 'img/stars2.png';
					 		context.drawImage(cloudEl, 0, cloudY);
						}
						break;
					case 'foreground':
						drawForeground(row, i);
						break;
				};
			});
		};

		var drawIntro = function(){
			var newGround = 1 / 64;
			if(gameClock < introTime - 50) newGround = 1;
			else if(gameClock >= introTime - 50 && gameClock < introTime - 40) newGround = 1 / 2;
			else if(gameClock >= introTime - 40 && gameClock < introTime - 30) newGround = 1 / 4;
			else if(gameClock >= introTime - 30 && gameClock < introTime - 20) newGround = 1 / 8;
			else if(gameClock > introTime - 20 && gameClock < introTime - 10) newGround = 1 / 16;
			else if(gameClock > introTime - 10 && gameClock < introTime || gameClock >= outroTime && gameClock < outroTime + 10) newGround = 1 / 32;
			else if(gameClock >= outroTime + 10 && gameClock < outroTime + 20) newGround = 1 / 16;
			else if(gameClock >= outroTime + 20 && gameClock < outroTime + 30) newGround = 1 / 8;
			else if(gameClock >= outroTime + 30 && gameClock < outroTime + 40) newGround = 1 / 4;
			else if(gameClock >= outroTime + 40 && gameClock < outroTime + 50) newGround = 1 / 2;
			else if(gameClock >= outroTime + 50) newGround = 1;
			groundSpeed = newGround;
			cloudSpeed = newGround * 2;
		};

		drawLayer('ground');
		drawLayer('clouds');
		drawLayer('foreground');
		drawIntro();

	};

	update();
	draw();

};

// var gridItem = function(character){
// 	var image = '', entity = '', entityString = '';
// 	if(character.indexOf('(') > -1) character = character.substring(0, character.indexOf('('));
// 	character = character.trim();

// 	switch(character){

// 		case 'B': image = 'platform1'; break;
// 		case 'M': image = 'platform2'; break;

// 		case 'b': image = 'platformbottom'; break;
// 		case 'N': image = 'platformbottomright'; break;
// 		case 'v': image = 'platformbottomleft'; break;
// 		case 'a': image = 'platformintersecttopleft'; break;
// 		case 'A': image = 'platformintersecttopright'; break;

// 		case 'X': image = 'platformleft'; break;
// 		case 'V': image = 'platformtopleft'; break;
// 		case 'n': image = 'platformright'; break;
// 		case 'm': image = 'platformtopright'; break;

// 		case 'z': image = 'platformrightnub'; break;
// 		case 'Z': image = 'platformleftnub'; break;
// 		case 'w': image = 'pipe'; break;
// 		case 'W': image = 'pipeleft'; break;
// 		case 'e': image = 'piperight'; break;

// 		case 'g': image = 'greenblock'; break;
// 		case 'G': image = 'greenpoint'; break;
// 		case 'r': image = 'redblock'; break;
// 		case 'R': image = 'redpoint'; break;
// 		case 't': image = 'destroyed'; break;
		
// 		case 'k': image = 'bigblock'; break;
// 		case 'K': image = 'bigblock'; break;
// 		case 'l': image = 'bigblock'; break;
// 		case 'L': image = 'bigblock'; break;
// 		case 'u': image = 'destroyedbigblock'; break;
// 		case 'U': image = 'destroyedbigblock'; break;
// 		case 'i': image = 'destroyedbigblock'; break;
// 		case 'I': image = 'destroyedbigblock'; break;

// 		case 'o': image = 'bigthing'; break;
// 		case 'O': image = 'bigthing'; break;
// 		case 'p': image = 'bigthing'; break;
// 		case 'P': image = 'bigthing'; break;

// 	};
// 	return image;
// };