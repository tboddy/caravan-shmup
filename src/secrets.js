let secrets = [], bonusCount = 1;

const secretImg = new Image(), secretDestroyedImage = new Image();
secretImg.src = 'img/secret.png';
secretDestroyedImage.src = 'img/destroyedsecretblock.png';

const secretLoop = function(){
	const draw = function(){
		secrets.forEach(function(secretObj, i){
			secretObj.y += levelSpeed;
			if(secretObj.y + secretObj.height >= 0){
				secretObj.hits <= 0 ? context.drawImage(secretDestroyedImage, secretObj.x, secretObj.y) : context.drawImage(secretImg, secretObj.x, secretObj.y);
				const secretCollisionEl = {x: secretObj.x, y: secretObj.y, width: secretObj.width, height: secretObj.height};
				if(secretObj.hits >= 0){
					checkBulletCollision(secretCollisionEl, function(){
						explodeEntity(secretCollisionEl);
						secretObj.hits -= 1;
						if(secretObj.hits == 0){
							score += bonusCount * 1000;
							fullscreenMessageTime = 0;
							currentFullscreenMessage = 'bonus: ' + (bonusCount * 1000);
							bonusCount++;
						}
					});
				}
				if(secretObj.y >= gameHeight + grid) secrets.splice(i, 1);
			}
		});
	};
	if(secrets.length) draw();
};