var explosions = [];

var explodeEntity = function(entityObj){
	entityObj.time = gameClock;
	explosions.push(entityObj);
};


var explosionAnimateTime = 1, explosionSize = grid * 2;

const explosionImg = new Image();
explosionImg.src = 'img/explosions.png';

var explosionsLoop = function(){

	var draw = function(){
		explosions.forEach(function(explosion, i){
			if(gameClock >= explosion.time + (explosionAnimateTime * 5)){
				explosions.splice(i, 1);
			} else {
				let sX = 0;
				if(gameClock >= explosion.time + explosionAnimateTime && gameClock < explosion.time + (explosionAnimateTime * 2)) sX = explosionSize;
				else if(gameClock >= explosion.time + (explosionAnimateTime * 2) && gameClock < explosion.time + (explosionAnimateTime * 3)) sX = explosionSize * 2;
				else if(gameClock >= explosion.time + (explosionAnimateTime * 3) && gameClock < explosion.time + (explosionAnimateTime * 4)) sX = explosionSize * 3;
				else if(gameClock >= explosion.time + (explosionAnimateTime * 4) && gameClock < explosion.time + (explosionAnimateTime * 5)) sX = explosionSize * 4;
				if(explosionSize > explosion.width){
					if(explosion.width == grid) explosion.x = explosion.x - (grid / 8);
					else explosion.x = explosion.x - (grid / 4);
				}
				if(explosionSize > explosion.width) explosion.y = explosion.y - (grid / 8);
				context.drawImage(explosionImg, sX, 0, explosionSize, explosionSize, explosion.x, explosion.y, explosionSize, explosionSize);
			}
		});
	};

	if(explosions.length) draw()

};