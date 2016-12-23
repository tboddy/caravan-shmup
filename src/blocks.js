var updateBlocks = function(){
	levelMap.forEach(function(row, i){
		if(gridPositions[i].y + grid >= 0 && gridPositions[i].y <= gameHeight){
			row.forEach(function(levelGrid, j){
				var gridChar = gridPositions[i].grids[j].char;
				if(gridChar.indexOf('(') > -1) gridChar = gridChar.substring(0, gridChar.indexOf('('));
				var gridObj = {x: gridPositions[i].grids[j].x, y: gridPositions[i].y, char: gridChar};
				gridChar = gridChar.trim();
				if(gridChar == 'g' || gridChar == 'G' || gridChar == 'r' || gridChar == 'R') checkBlockCollision(gridObj);
				else if(gridChar == 'k' || gridChar == 'K' || gridChar == 'l' || gridChar == 'L') checkBigBlockCollision(gridObj);
				else if(gridChar == '-' || gridChar == '_' || gridChar == '=' || gridChar == '+') checkSecretCollision(gridObj);
			});
		}
	});
};

var checkBlockCollision = function(block){
	checkBulletCollision({x: block.x, y: block.y, width: grid, height: grid}, function(){
		destroyBlock(block);
	});
};

var destroyBlock = function(block){
	levelMap.forEach(function(row, i){
		row.forEach(function(char, j){
			var gridChar = char;
			if(gridChar.indexOf('(') > -1) gridChar = gridChar.substring(0, gridChar.indexOf('('));
			var tempRow = gridPositions[i], gridItem = gridPositions[i].grids[j];
			if(gridItem.x == block.x && tempRow.y == block.y && block.char == gridChar){
				if(block.char == 'G' || block.char == 'R') spawnPointer(block);
				block.width = grid;
				block.height = grid;
				explodeEntity(block);
				levelMap[i][j] = 't';
				gridPositions[i].grids[j].char = 't';
				score += 10;
			}
		});
	});
};

var checkBigBlockCollision = function(bigBlock){
	checkBulletCollision({x: bigBlock.x, y: bigBlock.y, width: grid, height: grid}, function(){
		var gridsToDestroy = {};
		switch(bigBlock.char.trim()){
			case 'k':
				gridsToDestroy.topLeft = {x: bigBlock.x, y: bigBlock.y - grid};
				gridsToDestroy.topRight = {x: bigBlock.x + grid, y: bigBlock.y - grid};
				gridsToDestroy.bottomLeft = bigBlock;
				gridsToDestroy.bottomRight = {x: bigBlock.x + grid, y: bigBlock.y};
				break;
			case 'K':
				gridsToDestroy.topLeft = bigBlock;
				gridsToDestroy.topRight = {x: bigBlock.x + grid, y: bigBlock.y};
				gridsToDestroy.bottomLeft = {x: bigBlock.x, y: bigBlock.y + grid};
				gridsToDestroy.bottomRight = {x: bigBlock.x + grid, y: bigBlock.y + grid};
				break;
			case 'l':
				gridsToDestroy.topLeft = {x: bigBlock.x - grid, y: bigBlock.y - grid};
				gridsToDestroy.topRight = {x: bigBlock.x, y: bigBlock.y - grid};
				gridsToDestroy.bottomLeft = {x: bigBlock.x - grid, y: bigBlock.y};
				gridsToDestroy.bottomRight = bigBlock;
				break;
			case 'L':
				gridsToDestroy.topLeft = {x: bigBlock.x - grid, y: bigBlock.y};
				gridsToDestroy.topRight = bigBlock;
				gridsToDestroy.bottomLeft = {x: bigBlock.x - grid, y: bigBlock.y - grid};
				gridsToDestroy.bottomRight = {x: bigBlock.x, y: bigBlock.y - grid};
				break;
		};
		destroyBigBlock(gridsToDestroy);
	});
};

var destroyBigBlock = function(gridsToDestroy){
	levelMap.forEach(function(row, i){
		row.forEach(function(char, j){
			var gridChar = char;
			if(gridChar.indexOf('(') > -1) gridChar = gridChar.substring(0, gridChar.indexOf('('));
			var tempRow = gridPositions[i], grid = gridPositions[i].grids[j];
			gridChar = gridChar.trim();
			if(gridChar.indexOf('k') > -1 || gridChar.indexOf('K') > -1 || gridChar.indexOf('l') > -1 || gridChar.indexOf('L') > -1){
				var otherRowIndex = (gridChar.indexOf('K') > -1 || gridChar.indexOf('L') > -1) ? i + 1 : i - 1;
				for(var cord in gridsToDestroy){
					if(grid.x == gridsToDestroy[cord].x && tempRow.y == gridsToDestroy[cord].y){
						var newChar = '', newOtherChar = '';

						var tempGrid = levelMap[i][j], tempOtherGrid = levelMap[otherRowIndex][j];

						if(tempGrid.indexOf('(') > -1) tempGrid = tempGrid.substring(0, tempGrid.indexOf('('));
						if(tempOtherGrid.indexOf('(') > -1) tempOtherGrid = tempOtherGrid.substring(0, tempOtherGrid.indexOf('('));
						tempGrid = tempGrid.trim();
						tempOtherGrid = tempOtherGrid.trim();
						switch(tempGrid){
							case 'k': newChar = 'u'; break;
							case 'K': newChar = 'U'; break;
							case 'l': newChar = 'i'; break;
							case 'L': newChar = 'I'; break;
						};
						switch(tempOtherGrid){
							case 'k': newOtherChar = 'u'; break;
							case 'K': newOtherChar = 'U'; break;
							case 'l': newOtherChar = 'i'; break;
							case 'L': newOtherChar = 'I'; break;
						};
						levelMap[i][j] = newChar;
						gridPositions[i].grids[j].char = newChar;
						levelMap[otherRowIndex][j] = newOtherChar;
						gridPositions[otherRowIndex].grids[j].char = newOtherChar;
					}
				};
			}
		});
	});
	explodeEntity({x: gridsToDestroy.topLeft.x, y: gridsToDestroy.topLeft.y, width: grid * 2, height: grid * 2});
	score += 200;
};

var checkSecretCollision = function(secretBlock){
	checkBulletCollision({x: secretBlock.x, y: secretBlock.y, width: grid, height: grid}, function(){
		var gridsToDestroy = {};
		switch(secretBlock.char.trim()){
			case '-':
				gridsToDestroy.topLeft = {x: secretBlock.x, y: secretBlock.y - grid};
				gridsToDestroy.topRight = {x: secretBlock.x + grid, y: secretBlock.y - grid};
				gridsToDestroy.bottomLeft = secretBlock;
				gridsToDestroy.bottomRight = {x: secretBlock.x + grid, y: secretBlock.y};
				break;
			case '_':
				gridsToDestroy.topLeft = secretBlock;
				gridsToDestroy.topRight = {x: secretBlock.x + grid, y: secretBlock.y};
				gridsToDestroy.bottomLeft = {x: secretBlock.x, y: secretBlock.y + grid};
				gridsToDestroy.bottomRight = {x: secretBlock.x + grid, y: secretBlock.y + grid};
				break;
			case '=':
				gridsToDestroy.topLeft = {x: secretBlock.x - grid, y: secretBlock.y - grid};
				gridsToDestroy.topRight = {x: secretBlock.x, y: secretBlock.y - grid};
				gridsToDestroy.bottomLeft = {x: secretBlock.x - grid, y: secretBlock.y};
				gridsToDestroy.bottomRight = secretBlock;
				break;
			case '+':
				gridsToDestroy.topLeft = {x: secretBlock.x - grid, y: secretBlock.y};
				gridsToDestroy.topRight = secretBlock;
				gridsToDestroy.bottomLeft = {x: secretBlock.x - grid, y: secretBlock.y - grid};
				gridsToDestroy.bottomRight = {x: secretBlock.x, y: secretBlock.y - grid};
				break;
		};
		destroySecretBlock(gridsToDestroy);
	});
};

let bonusCount = 1;

var destroySecretBlock = function(gridsToDestroy){
	levelMap.forEach(function(row, i){
		row.forEach(function(char, j){
			var gridChar = char;
			if(gridChar.indexOf('(') > -1) gridChar = gridChar.substring(0, gridChar.indexOf('('));
			var tempRow = gridPositions[i], grid = gridPositions[i].grids[j];
			gridChar = gridChar.trim();
			if(gridChar.indexOf('-') > -1 || gridChar.indexOf('_') > -1 || gridChar.indexOf('=') > -1 || gridChar.indexOf('+') > -1){
				var otherRowIndex = (gridChar.indexOf('_') > -1 || gridChar.indexOf('+') > -1) ? i + 1 : i - 1;
				for(var cord in gridsToDestroy){
					if(grid.x == gridsToDestroy[cord].x && tempRow.y == gridsToDestroy[cord].y){
						var newChar = '', newOtherChar = '';

						var tempGrid = levelMap[i][j], tempOtherGrid = levelMap[otherRowIndex][j];

						if(tempGrid.indexOf('(') > -1) tempGrid = tempGrid.substring(0, tempGrid.indexOf('('));
						if(tempOtherGrid.indexOf('(') > -1) tempOtherGrid = tempOtherGrid.substring(0, tempOtherGrid.indexOf('('));
						tempGrid = tempGrid.trim();
						tempOtherGrid = tempOtherGrid.trim();
						switch(tempGrid){
							case '-': newChar = 'Q'; break;
							case '_': newChar = 'q'; break;
							case '=': newChar = 'Y'; break;
							case '+': newChar = 'y'; break;
						};
						switch(tempOtherGrid){
							case '-': newOtherChar = 'Q'; break;
							case '_': newOtherChar = 'q'; break;
							case '=': newOtherChar = 'Y'; break;
							case '+': newOtherChar = 'y'; break;
						};
						levelMap[i][j] = newChar;
						gridPositions[i].grids[j].char = newChar;
						levelMap[otherRowIndex][j] = newOtherChar;
						gridPositions[otherRowIndex].grids[j].char = newOtherChar;
					}
				};
			}
		});
	});
	explodeEntity({x: gridsToDestroy.topLeft.x, y: gridsToDestroy.topLeft.y, width: grid * 2, height: grid * 2});
	score += bonusCount * 1000;
	fullscreenMessageTime = 0;
	currentFullscreenMessage = 'bonus: ' + (bonusCount * 1000);
	bonusCount++;
};