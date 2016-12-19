var updateBlocks = function(){
	levelMap.forEach(function(row, i){
		if(gridPositions[i].y + grid >= 0 && gridPositions[i].y <= gameHeight){
			row.forEach(function(levelGrid, j){ // in the grid
				var gridChar = gridPositions[i].grids[j].char;
				if(gridChar.indexOf('(') > -1) gridChar = gridChar.substring(0, gridChar.indexOf('('));
				var gridObj = {x: gridPositions[i].grids[j].x, y: gridPositions[i].y, char: gridChar};
				gridChar = gridChar.trim();
				if(gridChar == 'g' || gridChar == 'G' || gridChar == 'r' || gridChar == 'R') checkBlockCollision(gridObj);
				else if(gridChar == 'k' || gridChar == 'K' || gridChar == 'l' || gridChar == 'L') checkBigBlockCollision(gridObj);
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
		switch(bigBlock.char){
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
			if(gridChar == 'k' || gridChar == 'K' || gridChar == 'l' || gridChar == 'L'){
				var otherRowIndex = (gridChar == 'K' || gridChar == 'L') ? i + 1 : i - 1;
				for(var cord in gridsToDestroy){
					if(grid.x == gridsToDestroy[cord].x && tempRow.y == gridsToDestroy[cord].y){
						var newChar = '', newOtherChar = '';
						switch(levelMap[i][j]){
							case 'k': newChar = 'u'; break;
							case 'K': newChar = 'U'; break;
							case 'l': newChar = 'i'; break;
							case 'L': newChar = 'I'; break;
						};
						switch(levelMap[otherRowIndex][j]){
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