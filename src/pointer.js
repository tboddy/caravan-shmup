var pointers = [];

const pointerImg = new Image();
pointerImg.src = 'img/pointer.png';

var spawnPointer = function(block){
	var pointerDirection = (Math.random() >= 0.5) ? 'left' : 'right';
	pointers.push({x: block.x + (grid / 4), y: block.y + (grid / 4), direction: pointerDirection, initial: block.x});
};

var pointerLoop = function(){

	var draw = function(){

		var animatePointers = function(){
			pointers.forEach(function(pointerObj, i){
				pointerObj.width = grid / 2;
				powerupObj = sineCurve(pointerObj, dropXSpeed, dropXMax);
				context.drawImage(pointerImg, pointerObj.x, pointerObj.y);
				pointers[i].y += levelSpeed;
				if(pointerObj.y >= gameHeight) pointers.splice(i, 1);
				checkPointerCollision(pointerObj, i);
			});
		};

		var checkPointerCollision = function(pointerObj, i){
			var pointerEl = {x: pointerObj.x, y: pointerObj.y, width: grid, height: grid}, playerEl = {x: playerX, y: playerY, width: grid, height: grid};
			checkCollision(pointerEl, playerEl, function(pointerEl, playerEl){
				pointers.splice(i, 1);
				score += 150;
			});
		};

		animatePointers();

	};

	if(pointers.length) draw();

};
