const updateBlocks = function(){
	levelMap.forEach(function(row, i){
		if(gridPositions[i].y + grid >= 0 && gridPositions[i].y <= gameHeight){
			row.forEach(function(levelGrid, j){
				let gridChar = gridPositions[i].grids[j].char;
				if(gridChar.indexOf('(') > -1) gridChar = gridChar.substring(0, gridChar.indexOf('('));
				const gridObj = {x: gridPositions[i].grids[j].x, y: gridPositions[i].y, char: gridChar};
				gridChar = gridChar.trim();
				if(gridChar == 'g' || gridChar == 'G' || gridChar == 'r' || gridChar == 'R') checkBlockCollision(gridObj);
				else if(gridChar == 'k' || gridChar == 'K' || gridChar == 'l' || gridChar == 'L') checkBigBlockCollision(gridObj);
			});
		}
	});
},

checkBlockCollision = function(block){
	checkBulletCollision({x: block.x, y: block.y, width: grid, height: grid}, function(){
		destroyBlock(block);
	});
},

destroyBlock = function(block){
	levelMap.forEach(function(row, i){
		row.forEach(function(char, j){
			let gridChar = char;
			if(gridChar.indexOf('(') > -1) gridChar = gridChar.substring(0, gridChar.indexOf('('));
			if(gridPositions[i].grids[j].x == block.x && gridPositions[i].y == block.y && block.char == gridChar){
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
},

checkBigBlockCollision = function(bigBlock){
	checkBulletCollision({x: bigBlock.x, y: bigBlock.y, width: grid, height: grid}, function(){
		let gridsToDestroy = {};
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
},

destroyBigBlock = function(gridsToDestroy){
	levelMap.forEach(function(row, i){
		row.forEach(function(char, j){
			let gridChar = char;
			if(gridChar.indexOf('(') > -1) gridChar = gridChar.substring(0, gridChar.indexOf('('));
			gridChar = gridChar.trim();
			if(gridChar.indexOf('k') > -1 || gridChar.indexOf('K') > -1 || gridChar.indexOf('l') > -1 || gridChar.indexOf('L') > -1){
				const otherRowIndex = (gridChar.indexOf('K') > -1 || gridChar.indexOf('L') > -1) ? i + 1 : i - 1;
				for(let cord in gridsToDestroy){
					if(gridPositions[i].grids[j].x == gridsToDestroy[cord].x && gridPositions[i].y == gridsToDestroy[cord].y){
						let newChar = '', newOtherChar = '', tempGrid = levelMap[i][j], tempOtherGrid = levelMap[otherRowIndex][j];
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