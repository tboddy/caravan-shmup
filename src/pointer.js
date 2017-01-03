let pointers = [];

const pointerImg = new Image();
pointerImg.src = 'img/pointer.png';

const spawnPointer = function(block){
	const pointerDirection = (Math.random() >= 0.5) ? 'left' : 'right';
	pointers.push({x: block.x + (grid / 4), y: block.y + (grid / 4), direction: pointerDirection, initial: block.x, count: 0});
},

pointerLoop = function(){
	const draw = function(){
		const animatePointers = function(){
			pointers.forEach(function(pointerObj, i){
				pointerObj.width = grid / 2;

				const increase = 90 / 180 * Math.PI / (grid * 1.5),
					offsetNum = pointerObj.initial >= gameWidth / 2 ? 0.25 : -0.25;
				pointers[i].x = (pointerObj.x - Math.sin(pointerObj.count) * (grid * offsetNum));
				pointers[i].count += increase;

				context.drawImage(pointerImg, pointerObj.x, pointerObj.y);
				pointers[i].y += levelSpeed;
				if(pointerObj.y >= gameHeight) pointers.splice(i, 1);
				checkPointerCollision(pointerObj, i);
			});
		},
		checkPointerCollision = function(pointerObj, i){
			const pointerEl = {x: pointerObj.x, y: pointerObj.y, width: grid, height: grid}, playerEl = {x: playerX, y: playerY, width: grid, height: grid};
			checkCollision(pointerEl, playerEl, function(pointerEl, playerEl){
				pointers.splice(i, 1);
				score += 150;
			});
		};
		animatePointers();
	};
	if(pointers.length) draw();
};
