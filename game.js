const fps = 60, canvas = document.getElementById('canvas'), canvasEl = $('canvas'), grid = 16, gameHeight = 240, gameWidth = 256, browserWindow = require('electron').remote, storage = require('electron-json-storage'),
charImg = new Image(), analogThresh = 0.15;
const context = canvas.getContext('2d'), mainWindow = browserWindow.getCurrentWindow();
let gamepad = false, savedData = {}, startedGame = false, isFullscreen = false, loop, canGetHit = true;
charImg.src = 'img/font.png';

const resizeGame = function(){
	var canvasWidth = getAspect().width, canvasHeight = getAspect().height;
	canvasEl.css('width', canvasWidth + 'px').css('height', canvasHeight + 'px').css('margin-left', -(canvasWidth / 2) + 'px').css('margin-top', -(canvasHeight / 2) + 'px');
},

clearGame = function(){
	resizeGame();
	context.clearRect(0, 0, getAspect().width, getAspect().height);
},

getAspect = function(){
	var newWidth = $(window).width(), newHeight = $(window).height(), remHeight = $(window).width() * 0.9375, remWidth = $(window).height() * 1.066666666667;
	if(newWidth >= remWidth) newWidth = remWidth;
	else if(newHeight > remHeight) newHeight = remHeight;
	return {width: newWidth, height: newHeight};
},

drawString = function(input, x, y, isRed){
	input.split('').forEach(function(char, i){
		drawChar(char, x + (i * (grid / 2)), y, isRed);
	});
},

drawChar = function(input, x, y, isRed){
	var charLeft = 0, charTop = 0, size = grid / 2;

	switch(input){
		// case '0': charLeft = numStart; break;
		case '1': charLeft = size; break;
		case '2': charLeft = size * 2; break;
		case '3': charLeft = size * 3; break;
		case '4': charLeft = size * 4; break;
		case '5': charLeft = size * 5; break;
		case '6': charLeft = size * 6; break;
		case '7': charLeft = size * 7; break;
		case '8': charLeft = size * 8; break;
		case '9': charLeft = size * 9; break;

		case 'a': charLeft = size * 10; break;
		case 'b': charLeft = size * 11; break;
		case 'c': charLeft = size * 12; break;
		case 'd': charLeft = size * 13; break;
		case 'e': charLeft = size * 14; break;
		case 'f': charLeft = size * 15; break;
		case 'g': charLeft = size * 16; break;
		case 'h': charLeft = size * 17; break;
		case 'i': charLeft = size * 18; break;
		case 'j': charLeft = size * 19; break;
		case 'k': charLeft = size * 20; break;
		case 'l': charLeft = size * 21; break;
		case 'm': charLeft = size * 22; break;
		case 'n': charLeft = size * 23; break;
		case 'o': charLeft = size * 24; break;
		case 'p': charLeft = size * 25; break;
		case 'q': charLeft = size * 26; break;
		case 'r': charLeft = size * 27; break;
		case 's': charLeft = size * 28; break;
		case 't': charLeft = size * 29; break;
		case 'u': charLeft = size * 30; break;
		case 'v': charLeft = size * 31; break;
		case 'w': charLeft = size * 32; break;
		case 'x': charLeft = size * 33; break;
		case 'y': charLeft = size * 34; break;
		case 'z': charLeft = size * 35; break;
		case ':': charLeft = size * 36; break;
		case '.': charLeft = size * 37; break;
		case ' ': charLeft = size * 38; break;
	};
	if(isRed) charTop = size;
	context.drawImage(charImg, charLeft, charTop, size, size, x, y, size, size);
},

checkCollision = function(elA, elB, callback){
	if(elA.x + elA.width >= elB.x && elA.x <= elB.x + elB.width && elA.y <= elB.y + elB.height && elA.y + elA.height >= elB.y){
		callback(elA, elB);
	}
};
var levelMap = [
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', 'V', 'B', 'B', 'B', 'B', 'm', 'V', 'B', 'B', 'B', 'B', 'm', ' ', ' '],
	[' ', ' ', 'X', 'B', 'O', 'P', 'B', 'W', 'e', 'B', 'O', 'P', 'B', 'n', ' ', ' '],
	['w', 'w', 'W', 'B', 'o', 'p', 'B', 'n', 'X', 'B', 'o', 'p', 'B', 'e', 'w', 'w'],
	[' ', ' ', 'X', 'B', 'B', 'B', 'B', 'W', 'e', 'B', 'B', 'B', 'B', 'n', ' ', ' '],
	[' ', ' ', 'v', 'b', 'b', 'b', 'b', 'N', 'v', 'b', 'b', 'b', 'b', 'N', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'V', 'g', 'g', 'm', 'V', 'g', 'g', 'm', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'X', 'r', 'R', 'n', 'X', 'R', 'r', 'n', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'X', 'g', 'g', 'n', 'X', 'g', 'g', 'n', ' ', ' ', ' ', ' '],
	['V', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'm'],
	['e', 'R', 'B', 'r', 'B', 'r', 'B', 'r', 'r', 'B', 'r', 'B', 'r', 'B', 'R', 'W'],
	['X', 'B', 'B', 'B', 'B', 'B', 'B', 'r', 'r', 'B', 'B', 'B', 'B', 'B', 'B', 'n'],
	['v', 'b', 'b', 'b', 'b', 'b', 'A', 'B', 'B', 'a', 'b', 'b', 'b', 'b', 'b', 'N'],
	[' ', ' ', ' ', ' ', ' ', ' ', 'X', 'g', 'g', 'n', ' ', ' ', ' ', ' ', ' ', ' '],
	['g', 'g', 'g', 'm', 'V', 'g', 'g', 'g', 'g', 'g ','g', 'm', 'V', 'g', 'g', 'g'],
	['r', 'R', 'r', 'W', 'e', 'g', 'g', 'g', 'g', 'g', 'g', 'W', 'e', 'r', 'R', 'g'],
	['g', 'r', 'g', 'n', 'X', 'g', 'g', 'g', 'g', 'g', 'g', 'n', 'X', 'g', 'r', 'g'],
	['b', 'b', 'b', 'N', 'X', 'r', 'r', 'g', 'g', 'r', 'r', 'n', 'v', 'b', 'b', 'b'],
	[' ', ' ', ' ', ' ', 'Z', 'M', 'M', 'g', 'g', 'M', 'M', 'z', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'X', 'r', 'r', 'g', 'g', 'r', 'r', 'n', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'Z', 'M', 'M', 'G', 'G', 'M', 'M', 'z', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'X', 'r', 'r', 'g', 'g', 'r', 'r', 'n', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'Z', 'M', 'M', 'g', 'g', 'M', 'M', 'z', ' ', ' ', ' ', ' '],
	[' ', ' ', 'V', 'K', 'L', 'r', 'r', 'g', 'g', 'r', 'r', 'K', 'L', 'm', ' ', ' '],
	['M', 'M', 'M', 'k', 'l', 'B', 'B', 'B', 'B', 'B', 'B', 'k' ,'l', 'M', 'M', 'M'],
	['g', 'g', 'g', 'B(-)','B','B','B', 'B', 'B', 'B', 'B', 'B(-)','B','g','g', 'g'],
	['r', 'g', 'r', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'r', 'g', 'r'],
	['r', 'g', 'r', 'B', 'B', 'B', 'B', 'r', 'r', 'B', 'B', 'B', 'B', 'r', 'g', 'r'],
	['r', 'g', 'r', 'B', 'B', 'B', 'B', 'K', 'L', 'B', 'B', 'B', 'B', 'r', 'g', 'r'],
	['r', 'g', 'r', 'B', 'B', 'B', 'B', 'k', 'l', 'B', 'B', 'B', 'B', 'r', 'g', 'r'],
	['r', 'g', 'r', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'r', 'g', 'r'],
	['r', 'g', 'r', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'r', 'g', 'r'],
	['r', 'g', 'r', 'B', 'B', 'B', 'B', 'r', 'r', 'B', 'B', 'B', 'B', 'r', 'g', 'r'],
	['g', 'g', 'g', 'B', 'B', 'B', 'B', 'R', 'R', 'B', 'B', 'B', 'B', 'g', 'g', 'g'],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'r', 'r', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
	['r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g'],
	['g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r'],
	['r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g'],
	['g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r'],
	['r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g'],
	['g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r'],
	['r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g'],
	['g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r'],
	['r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g'],
	['g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r'],
	['r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g'],
	['b', 'A', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'a', 'b', 'b'],
	[' ', 'X', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'n', ' ', ' '],
	[' ', 'Z', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'z', ' ', ' '],
	[' ', 'X', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'n', ' ', ' '],
	[' ', 'v', 'b', 'b', 'A', 'r', 'g', 'r', 'g', 'r', 'a', 'b', 'b', 'N', ' ', ' '],
	[' ', ' ', ' ', ' ', 'X', 'g', 'r', 'g', 'r', 'g', 'z', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'Z', 'r', 'g', 'r', 'g', 'r', 'n', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'X', 'g', 'r', 'g', 'r', 'g', 'z', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'v', 'b', 'b', 'b', 'b', 'b', 'N', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['g', 'r', 'g', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'm', ' ', ' '],
	['r', 'G', 'r', 'B', 'B', 'B', 'B', 'B', 'B', 'g', 'r', 'g', 'B', 'n', ' ', ' '],
	['g', 'r', 'g', 'B', 'B', 'g', 'g', 'B', 'B', 'r', 'G', 'r', 'B', 'n', ' ', ' '],
	['B', 'B(-)', 'B', 'B', 'r', 'r', 'r', 'r', 'B', 'g', 'r', 'g', 'B','z',' ',' '],
	['B', 'B', 'B', 'B', 'B', 'g', 'g', 'B', 'B', 'B', 'B', 'B', 'B', 'n', ' ', ' '],
	['B', 'B', 'B', 'K', 'L', 'K', 'L', 'K', 'L', 'B', 'B', 'B', 'B', 'W', 'w', 'w'],
	['B', 'B', 'B', 'k', 'l', 'k', 'l', 'k', 'l', 'B', 'B', 'B', 'B', 'n', ' ', ' '],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'n', ' ', ' '],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'a', 'b', 'b', 'N', ' ', ' '],
	['b', 'b', 'b', 'b', 'b', 'A', 'r', 'g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', 'Z', 'g', 'r', 'g', 'r', 'z', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', 'X', 'r', 'g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', 'V', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'm', ' ', ' ', ' '],
	[' ', ' ', ' ', 'X', 'B', 'M', 'r', 'g', 'r', 'g', 'M', 'B', 'n', ' ', ' ', ' '],
	[' ', ' ', ' ', 'Z', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'z', ' ', ' ', ' '],
	[' ', ' ', ' ', 'Z', 'B', 'M', 'r', 'g', 'r', 'g', 'M', 'B', 'z', ' ', ' ', ' '],
	[' ', ' ', ' ', 'v', 'b', 'b', 'A', 'B', 'B', 'a', 'b', 'b', 'N', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', 'X', 'g', 'r', 'n', ' ', ' ', ' ', ' ', ' ', ' '],
	['g', 'r', 'g', 'm', ' ', ' ', 'Z', 'K', 'L', 'z', ' ', ' ', 'V', 'g', 'r', 'g'],
	['g', 'r', 'g', 'W', 'w', 'w', 'e', 'k', 'l', 'W', 'w', 'w', 'e', 'g', 'r', 'g'],
	['g', 'r', 'g', 'n', ' ', ' ', 'v', 'b', 'b', 'N', ' ', ' ', 'X', 'g', 'r', 'g'],
	['g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'g', 'r', 'g'],
	['g', 'r', 'g', 'z', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'Z', 'g', 'r', 'g'],
	['g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'g', 'r', 'g'],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
	['B', 'r', 'G', 'r', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'r', 'g', 'r', 'B'],
	['B', 'g', 'g', 'g', 'g', 'g', 'g', 'B', 'B', 'g', 'g', 'g', 'g', 'g', 'g', 'B'],
	['B', 'r', 'g', 'r', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'r', 'G', 'r', 'B'],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
	['B', 'M', 'B', 'M', 'B', 'M', 'B', 'M', 'B', 'M', 'a', 'b', 'b', 'b', 'b', 'b'],
	['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'n', ' ', ' ', ' ', ' ', ' '],
	['r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'n', ' ', ' ', ' ', ' ', ' '],
	['g', 'K', 'L', 'g', 'g', 'g', 'g', 'K', 'L', 'g', 'n', ' ', ' ', ' ', ' ', ' '],
	['r', 'k', 'l', 'r', 'r', 'r', 'r', 'k', 'l', 'r', 'z', ' ', ' ', ' ', ' ', ' '],
	['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'n', ' ', ' ', ' ', ' ', ' '],
	['r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'n', ' ', ' ', ' ', ' ', ' '],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'M', 'g', 'M', 'B', 'B', 'B', 'B', 'B', 'B'],
	['B', 'g', 'r', 'g', 'r', 'B', 'B', 'g', 'r', 'g', 'B', 'B', 'B', 'B', 'B', 'B'],
	['B', 'g', 'r', 'g', 'r', 'B', 'B', 'M', 'r', 'M', 'B', 'B', 'B', 'B', 'B', 'B'],
	['b', 'b', 'A', 'g', 'r', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'M', 'g', 'M', 'B'],
	[' ', ' ', 'X', 'g', 'r', 'B', 'B', 'B', 'B', 'B ','B', 'B', 'g', 'R', 'g', 'B'],
	[' ', ' ', 'X', 'B', 'B', 'B', 'B', 'M', 'g', 'M', 'B', 'B', 'M', 'g', 'M', 'B'],
	[' ', ' ', 'Z', 'B', 'B', 'B', 'B', 'g', 'R', 'g', 'B', 'B', 'B', 'B', 'B', 'B'],
	[' ', ' ', 'Z', 'K', 'L', 'B', 'B', 'M', 'g', 'M', 'B', 'B', 'B', 'B', 'B', 'B'],
	['w', 'w', 'e', 'k', 'l', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'M', 'g', 'M', 'B'],
	[' ', ' ', 'v', 'b', 'A', 'K', 'L', 'B', 'B', 'B', 'B', 'B', 'g', 'R', 'g', 'B'],
	[' ', ' ', ' ', ' ', 'X', 'k', 'l', 'B', 'B', 'B', 'B', 'B', 'M', 'g', 'M', 'B'],
	[' ', ' ', ' ', ' ', 'v', 'b', 'b', 'b', 'b', 'A', 'B(-)', 'B', 'B','B','B','B'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'Z', 'B', 'B', 'B', 'B', 'B', 'B'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'v', 'b', 'b', 'b', 'b', 'b', 'b'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'V', 'r'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'R'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'Z', 'r'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'v', 'b'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['g', 'r', 'g', 'R ','g', 'r', 'g', 'm', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['B', 'B', 'B', 'B ','B', 'B', 'B', 'z', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['B', 'B', 'B', 'B ','B', 'B', 'B', 'n', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['B', 'B', 'B', 'B ','B', 'B', 'B', 'n', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['g', 'g', 'M', 'r ','r', 'B', 'B', 'n', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['g', 'g', 'B', 'r', 'r', 'B', 'B', 'n', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['g', 'g', 'B', 'r', 'r', 'B', 'B', 'n', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['g', 'g', 'M', 'r', 'r', 'B', 'B', 'z', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['r', 'r', 'r', 'r', 'r', 'r', 'r', 'z', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'z', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'n', ' ', ' ', 'V', 'r', 'r', 'r', 'm', ' '],
	['B', 'r', 'g', 'r', 'B', 'B', 'B', 'n', ' ', ' ', 'X', 'r', 'r', 'r', 'n', ' '],
	['B', 'r', 'g', 'B', 'r', 'K', 'L', 'W', 'w', 'w', 'e', 'B', 'M', 'B', 'z', ' '],
	['B', 'r', 'g', 'B', 'B', 'k', 'l', 'n', ' ', ' ', 'X', 'B', 'g', 'g', 'n', ' '],
	['B', 'r', 'g', 'B', 'B', 'M', 'r', 'z', ' ', ' ', 'Z', 'B', 'g', 'g', 'n', ' '],
	['b', 'b', 'b', 'A', 'r', 'g', 'r', 'n', ' ', ' ', 'X', 'B','B ', 'B', 'n', ' '],
	[' ', ' ', ' ', 'X', 'r', 'g', 'r', 'W', 'w', 'w', 'e', 'r', 'R', 'r', 'z', ' '],
	[' ', ' ', ' ', 'Z', 'B', 'B(-)', 'B', 'n', ' ', ' ', 'X', 'B', 'r','B','n',' '],
	[' ', ' ', ' ', 'Z', 'B', 'B', 'B', 'n', ' ', ' ', 'X', 'K', 'L', 'r', 'n', ' '],
	[' ', ' ', ' ', 'v', 'b', 'b', 'b', 'N', ' ', ' ', 'X', 'k', 'l', 'r', 'W', 'w'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'B', 'M', 'B', 'W', 'w'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'v', 'b', 'b', 'b', 'N', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ' ,' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'V', 'B', 'B', 'M', 'B' ,'g', 'B'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'M', 'B', 'M', 'B', 'M', 'B'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'K', 'L', 'M', 'g', 'r', 'B'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'k', 'l', 'M', 'B', 'M', 'B'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'M', 'B', 'M', 'K', 'L', 'B'],
	['r', 'r', 'g', 'r', 'r', 'm', ' ', ' ', ' ', 'X', 'g', 'R', 'M', 'k', 'l', 'B'],
	['g', 'g', 'g', 'g', 'g', 'n', ' ', ' ', ' ', 'X', 'M', 'B', 'M', 'B', 'M', 'B'],
	['r', 'G', 'g', 'r', 'r', 'n', ' ', ' ', ' ', 'X', 'M', 'B', 'M', 'B', 'M', 'B'],
	['g', 'r', 'g', 'g', 'g', 'n', ' ', ' ', ' ', 'X', 'M', 'B', 'M', 'B', 'M', 'B'],
	['g', 'r', 'g', 'r', 'a', 'N', 'V', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r'],
	['g', 'r', 'g', 'r', 'n', ' ', 'X', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'G', 'g'],
	['g', 'r', 'g', 'r', 'W', 'w', 'e', 'M', 'g', 'r', 'g', 'M', 'g', 'r', 'g', 'M'],
	['g', 'r', 'G', 'r', 'W', 'w', 'e', 'B', 'B', 'B', 'B', 'B', 'M', 'r', 'M', 'B'],
	['g', 'r', 'g', 'R', 'n', ' ', 'v', 'b', 'b', 'b', 'A', 'B', 'g', 'M', 'g', 'B'],
	['b', 'b', 'b', 'b', 'N', ' ', ' ', ' ', ' ', ' ', 'X', 'B(-)', 'M','r','M','B'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'B', 'B', 'B', 'B', 'B'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'Z', 'g', 'g', 'M', 'r', 'r'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'g', 'g', 'B', 'r', 'r'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'g', 'g', 'M', 'r', 'r'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'g', 'G', 'B', 'r', 'r'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'g', 'g', 'M', 'r', 'r'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'g', 'g', 'B', 'R', 'r'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'Z', 'g', 'g', 'M', 'r', 'r'],
	['r', 'g', 'r', 'm', ' ', ' ', ' ', ' ', ' ', ' ', 'Z', 'g', 'g', 'B', 'r', 'r'],
	['M', 'B', 'M', 'z', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'g', 'g', 'M', 'r', 'r'],
	['r', 'g', 'r', 'n', ' ', ' ', ' ', ' ', ' ', ' ', 'v', 'b', 'A', 'B', 'r', 'r'],
	['g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'Z', 'M', 'B', 'M'],
	['r', 'G', 'r', 'n', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'v', 'b', 'b', 'b'],
	['g', 'M', 'g', 'n', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['r', 'g', 'r', 'z', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['g', 'M', 'g', 'n', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['r', 'g', 'r', 'n', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['b', 'b', 'b', 'N', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'm', ' ', ' ', ' '],
	['r', 'r', 'r ', 'B', 'g', 'g', 'g', 'B', 'r', 'r', 'r', 'B','n', ' ', ' ', ' '],
	['r', 'G', 'r', 'B', 'g', 'g', 'g', 'B', 'r', 'G', 'r', 'B', 'z', ' ', ' ', ' '],
	['r', 'r', 'r', 'B', 'g', 'g', 'g', 'B', 'r', 'r', 'r', 'B', 'W', 'w', 'w', 'w'],
	['B', 'B', 'B', 'B', 'B(-)', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'W','w','w','w'],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'n', ' ', ' ', ' '],
	['r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'W', 'w', 'w', 'w'],
	['M', 'g', 'M', 'g', 'M', 'g', 'M', 'B', 'M', 'B', 'M', 'B', 'n', ' ', ' ', ' '],
	['r', 'g', 'r', 'g', 'r', 'g', 'a', 'b', 'b', 'b', 'b', 'b', 'N', ' ', ' ', ' '],
	['r', 'g', 'M', 'G', 'r', 'G', 'n', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['r', 'g', 'r', 'g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['M', 'g', 'r', 'g', 'M', 'g', 'n', ' ', ' ', ' ', ' ', ' ', ' ', 'V', 'K', 'L'],
	['r', 'g', 'r', 'g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'k', 'l'],
	['R', 'g', 'M', 'g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', ' ', ' ', 'Z', 'K', 'L'],
	['r', 'g', 'r', 'g', 'r', 'g', 'W', 'w', 'w', 'w', 'w', 'w', 'w', 'e', 'k', 'l'],
	['M', 'g', 'M', 'g', 'M', 'g', 'n', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'K', 'L'],
	['r', 'g', 'r', 'g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'k', 'l'],
	['M', 'g', 'M', 'g', 'M', 'g', 'n', ' ', ' ', ' ', ' ', ' ', ' ', 'v', 'b', 'b'],
	['r', 'g', 'r', 'g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['M', 'g', 'M', 'g', 'M', 'g', 'n', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['b', 'b', 'b', 'A', 'r', 'g', 'z', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', 'Z', 'r', 'g', 'z', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', 'X', 'r', 'g', 'n', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', 'v', 'b', 'b', 'N', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
];
const start = function(){
	let menu = [
		{label: 'start game', action: 'startGame', active: true, index: 0},
		{label: 'options', action: 'showOptions', active: false, index: 1},
	], optionsMenu = [
		{label: 'toggle fullscreen', action: 'toggleFullscreen', active: true, index: 0},
		{label: 'back', action: 'cancelOptions', active: false, index: 1},
	], currentMenuItem = {}, optionsShowing = false, canPick = true, pickTime = 0;

	const startLogoImg = new Image(), creditString = '2016 decontrol';
	startLogoImg.src = 'img/logo.png';

	const init = function(){
		$(window).resize(resizeGame);
		controls();
		loop = startLoop();
		canvasEl.show();
		window.requestAnimationFrame(loop);
	},

	startLoop = function(){
		return function(){
			const draw = function(){
				context.drawImage(startLogoImg, (gameWidth / 2) - 64, grid * 2.5);
				if(optionsShowing){
					optionsMenu.forEach(function(item, i){
						const isActive = item.active ? true : false;
						drawString(item.label, textCenter(item.label), grid * (9.5 + (i * .5)), isActive);
					});
				} else {
					menu.forEach(function(item, i){
						const isActive = item.active ? true : false;
						drawString(item.label, textCenter(item.label), grid * (9.5 + (i * .5)), isActive);
					});
					drawString(creditString, textCenter(creditString), grid * 11.5);
				}
			};
			if(!gamepad) setupGamepad()
			clearGame();
			draw();
			updateStartGamepad();
			window.requestAnimationFrame(loop);
		};
	},

	updateStartGamepad = function(){
		if(!gamepad) setupGamepad()
		if(navigator.getGamepads()[0] && canPick){

			if(gamepad.axes[9]){
				const hatSwitch = gamepad.axes[9].toFixed(1);
				if(hatSwitch == '-1.0') moveUpMenu();
				else if(hatSwitch == '0.1') moveDownMenu();
			} else {
				if(gamepad.axes[1] < analogThresh * -1) moveUpMenu();
				else if(gamepad.axes[1] > analogThresh) moveDownMenu();
			}
			if(gamepad.buttons[9].pressed || gamepad.buttons[0].pressed || gamepad.buttons[1].pressed || gamepad.buttons[3].pressed || gamepad.buttons[2].pressed) selectMenuItem();
		} else if(!canPick){
			doPickTime();
		}
	},

	doPickTime = function(){
		pickTime++;
		if(pickTime >= fps * 0.5){
			pickTime = 0;
			canPick = true;
		}
	},

	textCenter = function(string){
		return (gameWidth / 2) - (string.length * (grid / 4));
	},

	controls = function(){
		setupKeyboard();
		navigator.getGamepads()[0] ? setupGamepad() : window.addEventListener('gamepadconnected', setupGamepad);
	},

	moveUpMenu = function(){
		canPick = false;
		getCurrentMenuItem();
		const menuArr = optionsShowing ? optionsMenu : menu;
		if(menuArr[currentMenuItem.index - 1]){
			menuArr[currentMenuItem.index].active = false;
			menuArr[currentMenuItem.index - 1].active = true;
		}
	},

	moveDownMenu = function(){
		canPick = false;
		getCurrentMenuItem();
		const menuArr = optionsShowing ? optionsMenu : menu;
		if(menuArr[currentMenuItem.index + 1]){
			menuArr[currentMenuItem.index].active = false;
			menuArr[currentMenuItem.index + 1].active = true;
		}
	},

	selectMenuItem = function(){
		canPick = false;
		getCurrentMenuItem();
		eval(currentMenuItem.action + '()');
	},

	getCurrentMenuItem = function(){
		const menuArr = optionsShowing ? optionsMenu : menu;
		menuArr.forEach(function(item, i){
			if(item.active) currentMenuItem = item;
		});
	},

	startGame = function(){
		if(!startedGame){
			stopKeyboard();
			startedGame = true;
			clearGame();
			initGame();
		}
	},

	setupGamepad = function(){
		gamepad = navigator.getGamepads()[0];
	},

	setupKeyboard = function(){
		document.addEventListener('keydown', keysDown);
	}, 

	stopKeyboard = function(){
		document.removeEventListener('keydown', keysDown);
	},

	keysDown = function(e){
		switch(e.which){
			case 38: moveUpMenu(); break;
			case 40: moveDownMenu(); break;
			case 13: selectMenuItem(); break;
		};
	},

	showOptions = function(){
		optionsShowing = true;
	},

	toggleFullscreen = function(){
		const openFullscreen = function(){
			mainWindow.setFullScreen(true);
			isFullscreen = true;
		}, closeFullscreen = function(){
			mainWindow.setFullScreen(false);
			isFullscreen = false;
		};
		isFullscreen ? closeFullscreen() : openFullscreen();
	},

	cancelOptions = function(){
		optionsShowing = false;
	};

	storage.get('savedData', function(err, data){
		savedData = data;
		init();
	});
	
};


// var drawStart = function(){
// 	var verString = 'pre alpha 0.04',
// 		startString = 'press start or enter',
// 		creditString = '2016 decontrol';
// 	context.drawImage(startLogoImg, (gameWidth / 2) - 64, grid * 2.5);
// 	drawString(verString, textCenter(verString), grid * 9.5);
// 	drawString(creditString, textCenter(creditString), grid * 10);
// 	drawString(startString, textCenter(startString), grid * 11.5);
// 	// context.drawImage(studiosLogoImg, (gameWidth / 2) - 32, grid * 12);
// };





// var startedGame = false, startLoopInterval;

// var initStart = function(){
// 	// initGame()
// 	startLoopInterval = setInterval(startLoop, 1000 / fps);
// 	startControls();
// };

// var setupGamepad = function(){
// 	gamepad = navigator.getGamepads()[0];
// };

// var startControls = function(){

// 	var setupKeyboard = function(){
// 		$(document).keydown(function(e){
// 			switch(e.which){
// 				case 13: checkStartGame(); break;
// 				case 220: toggleFullscreen(); break;
// 			};
// 		});
// 	};

// 	navigator.getGamepads()[0] ? setupGamepad() : window.addEventListener('gamepadconnected', setupGamepad);
// 	setupKeyboard();
// };

// var startLoop = function(){
// 	clearGame();
// 	updateStartGamepad();
// 	drawStart();
// };

// var updateStartGamepad = function(){
// 	if(!gamepad) setupGamepad()
// 	if(navigator.getGamepads()[0]) if(gamepad.buttons[9].pressed) checkStartGame();
// };

// const startLogoImg = new Image(), studiosLogoImg = new Image();
// startLogoImg.src = 'img/logo.png';
// studiosLogoImg.src = 'img/studioslogo.png';


// var textCenter = function(string){
// 	return (gameWidth / 2) - (string.length * (grid / 4));
// };

// var checkStartGame = function(){
// 	if(!startedGame){
// 		startedGame = true;
// 		clearInterval(startLoopInterval);
// 		initGame();
// 	}
// };
let gameLoopInterval, isGameOver = false, gameClock = 0;

const initGame = function(){
	setupLevel();
	setupPlayer();
	setupHighScore();
	setupBackgroundMusic();
	loop = gameLoop();
},

gameLoop = function(){
	return function(){
		clearGame();
		levelLoop();
		secretLoop();
		pointerLoop();
		powerupLoop();
		enemyShootingLoop();
		enemiesLoop();
		shootingLoop();
		playerLoop();
		explosionsLoop();
		hudLoop();
		gameClock++;
		window.requestAnimationFrame(loop);
	};
}, setupBackgroundMusic = function(){
	const musicEl = '<audio autoplay style="display:none;position:absolute;top:-100px;left:-100px;">\
		<source src="sound/bg.ogg" type="audio/ogg"></source>\
		</audio>';
	$('body').append(musicEl);
};





// var canvas = document.getElementById('canvas'), canvasEl = $('canvas'), fps = 29.97, gameClock = 0, grid = 16, gameHeight = 240, gameWidth = 256, isFullscreen = false, gameLoopInterval, gamepad = false,
// 	browserWindow = require('electron').remote, dropXSpeed = grid  / 2, dropXMax = grid * 8, storage = require('electron-json-storage'), savedData = {};
// var context = canvas.getContext('2d'), mainWindow = browserWindow.getCurrentWindow();

// var init = function(){
// 	storage.get('savedData', function(err, data){
// 		savedData = data;
// 		initStart();
// 	});
// };

// var initGame = function(){
// 	$(window).resize(resizeGame);
// 	setupLevel();
// 	setupPlayer();
// 	setupHighScore();
// 	setupBackgroundMusic();
// 	gameLoopInterval = setInterval(gameLoop, 1000 / fps);
// 	gameLoop();
// };

// var gameLoop = function(){
// 	clearGame();
// 	levelLoop();
// 	secretLoop();
// 	enemiesLoop();
// 	explosionsLoop();
// 	enemyShootingLoop();
// 	pointerLoop();
// 	powerupLoop();
// 	shootingLoop();
// 	playerLoop();
// 	hudLoop();
// 	gameClock++;
// };

// const setupBackgroundMusic = function(){
// 	const musicEl = '<audio autoplay style="display:none;position:absolute;top:-100px;left:-100px;">\
// 		<source src="sound/bg.ogg" type="audio/ogg"></source>\
// 		</audio>';
// 	$('body').append(musicEl);
// };

// var resizeGame = function(){
// 	var canvasWidth = getAspect().width, canvasHeight = getAspect().height;
// 	canvasEl.css('width', canvasWidth + 'px').css('height', canvasHeight + 'px').css('margin-left', -(canvasWidth / 2) + 'px').css('margin-top', -(canvasHeight / 2) + 'px');
// };

// var clearGame = function(){
// 	resizeGame();
// 	context.clearRect(0, 0, getAspect().width, getAspect().height);
// };

// var getAspect = function(){
// 	var newWidth = $(window).width(), newHeight = $(window).height(), remHeight = $(window).width() * 0.9375, remWidth = $(window).height() * 1.066666666667;
// 	if(newWidth >= remWidth) newWidth = remWidth;
// 	else if(newHeight > remHeight) newHeight = remHeight;
// 	return {width: newWidth, height: newHeight};
// };

// var checkCollision = function(elA, elB, callback){
// 	if(elA.x + elA.width >= elB.x && elA.x <= elB.x + elB.width && elA.y <= elB.y + elB.height && elA.y + elA.height >= elB.y){
// 		callback(elA, elB);
// 	}
// };

// var checkBulletCollision = function(el, callback){
// 	for(var group in shots){
// 		if(shots[group].length){
// 			shots[group].forEach(function(shot, i){
// 				var shotObj = {x: shot.x, y: shot.y, width: grid / 2, height: grid / 2};
// 				if(group == 'twoBottom' || group == 'three' || group == 'threeBottom') shotObj.width = grid / 4;
// 				checkCollision(el, shotObj, function(el, shotObj){
// 					shots[group].splice(i, 1);
// 					callback(el);
// 				});
// 			});
// 		}
// 	};
// };

// var sineCurve = function(inputObj, baseSpeed, baseMax){
// 	if(inputObj.x <= 0 || inputObj.x <= inputObj.initial - baseMax) inputObj.direction = 'right';
// 	else if(inputObj.x + grid >= gameWidth || inputObj.x >= inputObj.initial + baseMax) inputObj.direction = 'left';
// 	if(baseMax == grid * 99){

// 		if((inputObj.x <= gameWidth / 4 && inputObj.x > gameWidth / 8) || 
// 			(inputObj.x + inputObj.width >= gameWidth - (gameWidth / 4) && inputObj.x + inputObj.width < gameWidth - (gameWidth / 8))){
// 			baseSpeed = (baseSpeed / 4) * 3;
// 		} else if(inputObj.x <= (gameWidth / 8) ||
// 			inputObj.x + inputObj.width >= gameWidth - (gameWidth / 8)){
// 			baseSpeed = baseSpeed / 2;
// 		} else {
// 			baseSpeed = baseSpeed;
// 		}

// 	} else {
// 		if((inputObj.x <= inputObj.initial - (baseMax * 0.25) && inputObj.x > inputObj.initial - (baseMax * 0.75)) ||
// 			(inputObj.x >= inputObj.initial + (baseMax * 0.25) && inputObj.x < inputObj.initial + (baseMax * 0.75))){
// 			baseSpeed = (baseSpeed / 4) * 3;
// 		} else if(inputObj.x <= inputObj.initial - (baseMax * 0.75) ||
// 			inputObj.x >= inputObj.initial + (baseMax * 0.75)){
// 			baseSpeed = baseSpeed / 2;
// 		} else {
// 			baseSpeed = baseSpeed;
// 		}
// 	}

// 	if(inputObj.direction == 'left') inputObj.x -= baseSpeed;
// 	else inputObj.x += baseSpeed;
// 	return inputObj;
// };

// var toggleFullscreen = function(){
// 	var openFullscreen = function(){
// 		mainWindow.setFullScreen(true);
// 		isFullscreen = true;
// 	}, closeFullscreen = function(){
// 		mainWindow.setFullScreen(false);
// 		isFullscreen = false;
// 	};
// 	isFullscreen ? closeFullscreen() : openFullscreen();
// };

let gridPositions = [], currentPlatformAnimation = 0, groundSpeed = 0.1, cloudSpeed = 0.2;
const levelSpeed = 0.8, introTime = 90, outroTime = 10000;

const setupLevel = function(){
	const levelStartPos = levelMap.length * grid;
	levelMap.forEach(function(levelRow, i){
		const rowY = (i * grid) - (levelStartPos - gameHeight);
		let gridPosition = {y: rowY, groundY: rowY, cloudY: rowY, grids: []};
		levelRow.forEach(function(levelGrid, j){
			gridPosition.grids.push({x: j * grid, char: levelRow[j]});
			if(levelGrid.indexOf('(') > -1){
				var xPos = j * grid, yPos = (i * grid) - (levelStartPos - gameHeight);
				secrets.push({x: xPos, y: yPos, width: grid * 2, height: grid * 2, hits: 12});
				// entity = levelGrid.substring(levelGrid.indexOf('(') + 1, levelGrid.indexOf('(') + 2);
				// switch(entity){
				// 	case '-': 
				// };
			}
		});
		gridPositions.push(gridPosition);
	});
	setupGridImages();
};

const greenBlockImg = new Image(), redBlockImg = new Image(), greenPointImg = new Image(), redPointImg = new Image(), destroyedImg = new Image(),
	platformOneImg = new Image(), platformTwoImg = new Image(), platformBottomImg = new Image(), platformBottomLeftImg = new Image(), platformBottomRightImg = new Image(), platformLeftImg = new Image(), platformTopLeftImg = new Image(),
	platformRightImg = new Image(), platformTopRightImg = new Image(), platformRightNubImg = new Image(), platformLeftNubImg = new Image(), platformIntersectTopLeftImg = new Image(), platformIntersectTopRightImg = new Image(),
	pipeImg = new Image(), pipeLeftImg = new Image(), pipeRightImg = new Image(), bigBlockImg = new Image(), destroyedBigBlockImg = new Image(), bigThingImg = new Image(), destroyedSecretBlockImg = new Image();

const setupGridImages = function(){
	greenBlockImg.src = 'img/greenblock.png';
	redBlockImg.src = 'img/redblock.png';
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

	destroyedSecretBlockImg.src = 'img/destroyedsecretblock.png';
},

levelLoop = function(){

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
								case 'q': img = destroyedSecretBlockImg; break;
								case 'Q': img = destroyedSecretBlockImg; break;
								case 'y': img = destroyedSecretBlockImg; break;
								case 'Y': img = destroyedSecretBlockImg; break;
							}
							if(levelGrid == 'K' || levelGrid == 'O' || levelGrid == 'U' || levelGrid == 'q') context.drawImage(img, 0, 0, grid, grid, (j * grid), rowY, grid, grid);
							else if(levelGrid == 'k' || levelGrid == 'o' || levelGrid == 'u' || levelGrid == 'Q') context.drawImage(img, 0, grid, grid, grid, (j * grid), rowY, grid, grid);
							else if(levelGrid == 'L' || levelGrid == 'P' || levelGrid == 'I' || levelGrid == 'y') context.drawImage(img, grid, 0, grid, grid, (j * grid), rowY, grid, grid);
							else if(levelGrid == 'l' || levelGrid == 'p' || levelGrid == 'i' || levelGrid == 'Y') context.drawImage(img, grid, grid, grid, grid, (j * grid), rowY, grid, grid);
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
				explodeEntity(block, gameClock);
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
let pointers = [];

const pointerImg = new Image();
pointerImg.src = 'img/pointer.png';

const spawnPointer = function(block){
	pointers.push({x: block.x + (grid / 4), y: block.y + (grid / 4), initial: block.x, count: 0});
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

const enemySmallOneImg = new Image(), enemySmallTwoImg = new Image(), enemySmallFourImg = new Image(), enemySmallFiveImg = new Image(), enemyMediumOneImg = new Image();
enemySmallOneImg.src = 'img/enemysmallone.png';
enemySmallTwoImg.src = 'img/enemysmalltwo.png';
enemyMediumOneImg.src = 'img/enemymediumone.png';
enemySmallFourImg.src = 'img/enemysmallthree.png';
enemySmallFiveImg.src = 'img/enemysmallfive.png';

const bossOneAImg = new Image(), bossOneBImg = new Image();
bossOneAImg.src = 'img/bossonea.png';
bossOneBImg.src = 'img/bossoneb.png';

let bossOneAActive = false, bossOneBActive = false;

const bossOneInterval = fps * 2.5;

const enemySmallOneAnimation = function(enemy){
	enemy.y += 0.8;
	const increase = 90 / 180 * Math.PI / (grid * 1.5);
	enemy.x = enemy.initial - Math.sin(enemy.count) * (grid * 5);
	enemy.count += increase;
	return enemy;
},

enemySmallTwoAnimation = function(enemy){
	enemy.y += 0.8;
	const increase = 90 / 180 * Math.PI / (grid * 1.25);
	enemy.x = enemy.initial - Math.sin(enemy.count) * (grid * 3.5);
	enemy.count += increase;
	return enemy;
},

enemySmallThreeAnimation = function(enemy){
	if(!enemy.x) enemy.x = enemy.initial;
	if(enemy.x <= playerX - 2 && enemy.y <= playerY + playerHeight && enemy.y <= grid * 2){
		enemy.y += 2;
		enemy.x += 2.5;
	} else if(enemy.x >= playerX + 2 && enemy.y <= playerY + playerHeight && enemy.y <= grid * 2){
		enemy.y += 2;
		enemy.x -= 2.5;
	} else if(enemy.y <= gameHeight - (grid * 10)) enemy.y += 2;
	else if(enemy.y > gameHeight - (grid * 10) && enemy.y <= gameHeight - (grid * 9)) enemy.y += 2.5;
	else if(enemy.y > gameHeight - (grid * 9) && enemy.y <= gameHeight - (grid * 8)) enemy.y += 3;
	else if(enemy.y > gameHeight - (grid * 8) && enemy.y <= gameHeight - (grid * 7)) enemy.y += 3.5;
	else if(enemy.y > gameHeight - (grid * 7) && enemy.y <= gameHeight - (grid * 6)) enemy.y += 4;
	else if(enemy.y > gameHeight - (grid * 6) && enemy.y <= gameHeight - (grid * 5)) enemy.y += 4.5;
	else if(enemy.y > gameHeight - (grid * 5) && enemy.y <= gameHeight - (grid * 4)) enemy.y += 5;
	else if(enemy.y > gameHeight - (grid * 4) && enemy.y <= gameHeight - (grid * 3)) enemy.y += 5.5;
	else if(enemy.y > gameHeight - (grid * 3) && enemy.y <= gameHeight - (grid * 2)) enemy.y += 6;
	else if(enemy.y > gameHeight - (grid * 2) && enemy.y <= gameHeight - grid) enemy.y += 6.5;
	else enemy.y += 7;
	return enemy;
},

enemySmallFourAnimation = function(enemy){
	if(!enemy.x) enemy.x = enemy.initial;
	enemy.y += 1.8;
	return enemy;
},

enemyMediumOneAnimation = function(enemy){
	if((enemy.y + enemy.height) >= (gameHeight / 4) * 3) enemy.direction = 'up';
	if(enemy.direction == 'up'){
		enemy.y -= 1;
		if(gameClock % 12 == 0 && enemy.y + enemy.height >= 0) spawnMediumOneShot(enemy);
	}
	else enemy.y += 1.5;
	return enemy;
},

bossOneAnimation = function(enemy){
	if(!enemy.started){
		enemy.y = gameHeight;
		enemy.started = true;
	} else {
		if(enemy.x + enemy.width <= playerX + playerWidth) enemy.x += 0.5;
		else if(enemy.x >= playerX) enemy.x -= 0.5;
		if(enemy.y + enemy.height <= playerY + playerHeight) enemy.y += 0.5;
		else if(enemy.y >= playerY) enemy.y -= 0.5;
	}
	return enemy;
},

bossOneAAnimation = function(enemy, key){
	if(!bossOneAActive) bossOneAActive = true;
	enemy = bossOneAnimation(enemy);
	if(bossOneBActive){
		let nextBoss = {}, foundThis = false;
		for(waveTime in waves){
			if(foundThis){
				nextBoss = waves[waveTime];
				foundThis = false;
			}
			if(waveTime == key) foundThis = true;
		}
		if(nextBoss.enemies){
			nextBoss = nextBoss.enemies[0];
			if(enemy.x + enemy.width >= nextBoss.x) enemy.x = nextBoss.x - enemy.width;
		}
	}
	if(gameClock % bossOneInterval == 0) spawnBossOneAShot(enemy);
	return enemy;
},

bossOneBAnimation = function(enemy){
	if(!bossOneBActive) bossOneBActive = true;
	enemy = bossOneAnimation(enemy);
	if(gameClock % bossOneInterval == (bossOneInterval / 2)) spawnBossOneBShot(enemy);
	return enemy;
};

const waveSmallOne = function(initialPos){
	return {
		animation: enemySmallOneAnimation,
		img: enemySmallOneImg,
		width: grid,
		height: grid,
		initial: initialPos,
		score: 300,
		enemies: [
			{count: 0, y: grid * -6},
			{count: 0.2, y: grid * -5},
			{count: 0.4, y: grid * -4},
			{count: 0.6, y: grid * -3},
			{count: 0.8, y: grid * -2},
			{count: 1, y: grid * -1}
		]
	};
},

waveSmallTwo = function(initialPos){
	return {
		animation: enemySmallTwoAnimation,
		img: enemySmallTwoImg,
		width: grid,
		height: grid,
		initial: initialPos,
		score: 300,
		enemies: [
			{count: 0, y: grid * -6},
			{count: 0.2, y: grid * -5},
			{count: 0.4, y: grid * -4},
			{count: 0.6, y: grid * -3},
			{count: 0.8, y: grid * -2},
			{count: 1, y: grid * -1}
		]
	};
},

waveSmallThree = function(initialPos){
	return {
		animation: enemySmallThreeAnimation,
		img: enemySmallTwoImg,
		width: grid,
		height: grid,
		initial: initialPos,
		score: 500,
		enemies: [
			{y: grid * -6.25},
			{y: grid * -4.5},
			{y: grid * -2.75},
			{y: grid * -1}
		]
	};
},

waveSmallFour = function(initialPos){
	return {
		animation: enemySmallFourAnimation,
		img: enemySmallFourImg,
		width: grid,
		height: grid,
		initial: initialPos,
		score: 200,
		enemies: [
			{y: grid * -7},
			{y: grid * -5},
			{y: grid * -3},
			{y: grid * -1},
		]
	}
},

waveMediumOne = function(){
	return {
		animation: enemyMediumOneAnimation,
		img: enemyMediumOneImg,
		score: 1000,
		height: grid * 2,
		width: grid * 2,
		enemies: [
			{x: grid * 3, y: grid * -1, hits: 15},
			{x: gameWidth - (grid * 5), y: grid * -10, hits: 15}
		]
	};
},

waveBossOneA = function(){
	return {
		animation: bossOneAAnimation,
		img: bossOneAImg,
		height: grid * 3.5,
		width: grid * 3.5,
		score: 2000,
		onlyDestroysPlayer: true,
		enemies: [
			{x: grid * 2, y: -(grid * 3.5), hits: 25}
		]
	};
},

waveBossOneB = function(){
	return {
		animation: bossOneBAnimation,
		img: bossOneBImg,
		height: grid * 3.5,
		width: grid * 3.5,
		score: 2000,
		onlyDestroysPlayer: true,
		enemies: [
			{x: gameWidth - (grid * 3), y: -(grid * 3.5), hits: 30}
		]
	};
};

const waves = {
	0: waveSmallOne(grid * 6),
	200: waveSmallOne(grid * 9),
	500: waveMediumOne(),
	800: waveSmallTwo(grid * 5),
	1000: waveSmallTwo(grid * 10),
	1250: waveSmallThree(grid),
	1400: waveSmallThree(grid),
	1550: waveSmallThree(gameWidth),
	1700: waveSmallThree(gameWidth),
	1900: waveSmallFour(grid * 3),
	2000: waveSmallFour(gameWidth - (grid * 4)),
	2100: waveSmallFour(grid * 3),
	2200: waveSmallFour(gameWidth - (grid * 4)),
	2500: waveBossOneA(),
	2600: waveBossOneB(),
	3000: waveSmallThree(grid),
	3150: waveSmallThree(grid),
	3300: waveSmallThree(gameWidth),
	3450: waveSmallThree(gameWidth),
},

enemiesLoop = function(){
	for(waveTime in waves){
		if(gameClock >= parseInt(waveTime) + 150) waveLoop(waveTime);
	};
},

waveLoop = function(waveTime){
	const draw = function(enemy, i){
		enemy.animation = waves[waveTime].animation;
		enemy.img = waves[waveTime].img;
		enemy.width = waves[waveTime].width;
		enemy.height = waves[waveTime].height;
		if(waves[waveTime].initial) enemy.initial = waves[waveTime].initial;
		const isBoss = enemy.animation == bossOneAAnimation || enemy.animation == bossOneBAnimation,
		drawEnemy = function(){
			enemy = enemy.animation(enemy, waveTime);
			context.drawImage(enemy.img, enemy.x, enemy.y);
			if(enemy.y > gameHeight && i == 0) delete waves[waveTime];
			else if(enemy.y <= -(grid * 10) && (i + 1) == waves[waveTime].enemies.length) delete waves[waveTime];
			const enemyCollisionEl = {x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height},
			killEnemy = function(){
				if(enemy.animation == bossOneAAnimation) bossOneAActive = false;
				else if(enemy.animation == bossOneBAnimation) bossOneBActive = false;
				score += waves[waveTime].score;
				waves[waveTime].enemies.splice(i, 1);
			};
			checkBulletCollision(enemyCollisionEl, function(bulletObj){
				explodeEntity(bulletObj);
				if(enemy.hits) {
					enemy.hits -= 1;
					if(enemy.hits == 0) killEnemy();
				} else killEnemy();
			});
			if(canGetHit){
				checkCollision({x: playerX, y: playerY, width: playerWidth, height: playerHeight}, enemyCollisionEl, function(){
					waves[waveTime].onlyDestroysPlayer ? getHit(waves[waveTime].enemies, i, true) : getHit(waves[waveTime].enemies, i);
				});
			}
		};
		if(isBoss){
			drawEnemy();
		} else {
			if(!bossOneAActive && !bossOneBActive) drawEnemy();
		}



	};
	waves[waveTime].enemies.forEach(function(enemy, i){
		if(waves[waveTime]) draw(enemy, i);
	});
};
const powerupWaves = [0, 500, 1500, 2500, 3000, 3750, 4500],
powerupImg = new Image();
powerupImg.src = 'img/powerup.png';

let powerups = [], powerupBonusCount = 1;

const powerupLoop = function(){
	const draw = function(){
		const animatePowerups = function(){
			powerups.forEach(function(powerupObj, i){
				powerupObj.width = grid;
				const increase = 90 / 180 * Math.PI / (grid * 1.5),
					offsetNum = powerupObj.initial >= gameWidth / 2 ? 0.25 : -0.25;
				powerups[i].x = (powerupObj.x - Math.sin(powerupObj.count) * (grid * offsetNum));
				powerups[i].count += increase;
				context.drawImage(powerupImg, powerupObj.x, powerupObj.y);
				powerups[i].y += levelSpeed;
				if(powerupObj.y >= gameHeight) powerups.splice(i, 1);
				checkPowerupCollision(powerupObj, i);
			});
		},
		checkPowerupCollision = function(powerupObj, i){
			const powerupEl = {x: powerupObj.x, y: powerupObj.y, width: grid, height: grid}, playerEl = {x: playerX, y: playerY, width: grid, height: grid};
			checkCollision(powerupEl, playerEl, function(powerupEl, playerEl){
				powerups.splice(i, 1);
				currentPowerup < 4 ? currentPowerup++ : powerupBonus();
			});
		};
		animatePowerups();
	};
	if(powerupWaves.length){
		powerupWaves.forEach(function(waveTime){
			if(gameClock == parseInt(waveTime)) {
				spawnPowerup();
			}
		});
	}
	if(powerups.length) draw();
},

spawnPowerup = function(){
	powerups.push({x: grid * 11, y: -grid, initial: gameWidth / 2, count: 0});
}, powerupBonus = function(){
	score += powerupBonusCount * 1000;
	fullscreenMessageTime = 0;
	currentFullscreenMessage = 'bonus: ' + (powerupBonusCount * 1000);
	powerupBonusCount++;
};
const playerSpeed = 4, playerWidth = grid, playerHeight = grid * 1.5;
let movingUp = false, movingDown = false, movingLeft = false, movingRight = false, shot = false, player, playerIsHidden = false, playerX = (gameWidth / 2) - (playerWidth / 2), playerY = gameHeight - (playerHeight + grid);

const setupPlayer = function(){
	const setupKeyboard = function(){
		document.addEventListener('keydown', playerKeysDown);
		document.addEventListener('keyup', playerKeysUp);
	}, buildPlayer = function(){
		player = new Image();
	};
	setupKeyboard();
	buildPlayer();
},

playerKeysDown = function(e){
	switch(e.which){
		case 38: movingUp = true; break;
		case 40: movingDown = true; break;
		case 37: movingLeft = true; break;
		case 39: movingRight = true; break;
		case 90: shot = true; break;
	};
},

playerKeysUp = function(e){
	switch(e.which){
		case 38: movingUp = false; break;
		case 40: movingDown = false; break;
		case 37: movingLeft = false; break;
		case 39: movingRight = false; break;
		case 90: shot = false; break;
	};
};

playerLoop = function(){
	const update = function(){
		const updateGamepad = function(){
			if(navigator.getGamepads()[0]){
				gamepad = navigator.getGamepads()[0];
				if(gamepad.axes[9]){
					const hatSwitch = gamepad.axes[9].toFixed(1);
					movingUp = hatSwitch == '-1.0' || hatSwitch == '1.0' || hatSwitch == '-0.7' ? true : false;
					movingDown = hatSwitch == '0.1' || hatSwitch == '-0.1' || hatSwitch == '0.4' ? true : false;
					movingLeft = hatSwitch == '0.7' || hatSwitch == '1.0' || hatSwitch == '0.4' ? true : false;
					movingRight = hatSwitch == '-0.4' || hatSwitch == '-0.1' || hatSwitch == '-0.7' ? true : false; 
				} else {
					movingUp = gamepad.axes[1] < analogThresh * -1 ? true : false;
					movingDown = gamepad.axes[1] > analogThresh ? true : false;
					movingLeft = gamepad.axes[0] < analogThresh * -1 ? true : false;
					movingRight = gamepad.axes[0] > analogThresh ? true : false;
				}
				shot = gamepad.buttons[0].pressed || gamepad.buttons[1].pressed || gamepad.buttons[3].pressed || gamepad.buttons[2].pressed ? true : false;
				if(gamepad.buttons[8].pressed) mainWindow.reload();
			}
		},
		updateKeyboard = function(){
			if(movingRight) playerX += playerSpeed;
			else if(movingLeft) playerX -= playerSpeed;
			if(movingUp) playerY -= playerSpeed;
			else if(movingDown) playerY += playerSpeed;
			if(playerX <= 0) playerX = 0;
			else if(playerX + playerWidth >= gameWidth) playerX = gameWidth - playerWidth;
			if(playerY <= 0) playerY = 0;
			else if(playerY + playerHeight >= gameHeight) playerY = gameHeight - playerHeight;
		};
		updateGamepad();
		updateKeyboard();
	},
	draw = function(){
		if(!isGameOver){
			if(!canGetHit){
				if(gameClock % 10 == 0) player.src = 'img/playerblank.png';
				else if(gameClock % 10 == 5) player.src = 'img/player.png';
			} else if(player.src != 'img/player.png') {
				player.src = 'img/player.png';
			}
			let offset = 0;
			if(movingLeft) offset = grid;
			else if(movingRight) offset = grid * 2;
			context.drawImage(player, offset, 0, grid, grid * 1.5, playerX, playerY, grid, grid * 1.5);
		}
	};
	update();
	draw();
};






// var movingUp = false, movingDown = false, movingLeft = false, movingRight = false, shot = false, isPaused = false, player, inputStopped = false,  playerSpeed = grid / 2, playerWidth = grid, playerHeight = grid * 1.5, playerIsHidden = false;
// var playerX = (gameWidth / 2) - (playerWidth / 2), playerY = gameHeight - (playerHeight + grid);

// const playerImg = new Image();

// const playerKeysDown = function(e){
// 	switch(e.which){
// 		case 38: movingUp = true; break;
// 		case 40: movingDown = true; break;
// 		case 37: movingLeft = true; break;
// 		case 39: movingRight = true; break;
// 		case 90: shot = true; break;
// 		case 191: mainWindow.reload(); break;
// 	};
// }, playerKeysUp = function(e){
// 	switch(e.which){
// 		case 38: movingUp = false; break;
// 		case 40: movingDown = false; break;
// 		case 37: movingLeft = false; break;
// 		case 39: movingRight = false; break;
// 		case 90: shot = false; break;
// 	};
// }, playerReloadOnly = function(e){
// 	switch(e.which){
// 		case 191: mainWindow.reload(); break;
// 	};
// };

// const setupPlayer = function(){
// 	const setupKeyboard = function(){
// 		document.addEventListener('keydown', playerKeysDown);
// 		document.addEventListener('keyup', playerKeysUp);
// 	}, buildPlayer = function(){
// 		player = new Image();
// 	};
// 	setupKeyboard();
// 	buildPlayer();
// };

// var stopInput = function(){
// 	document.removeEventListener('keydown', playerKeysDown);
// 	document.removeEventListener('keyup', playerKeysUp);
// 	document.addEventListener('playerReloadOnly', playerKeysUp);
// 	inputStopped = true;
// };

// const analogThresh = 0.15;

// var playerLoop = function(){

// 	var update = function(){

// 		var updateGamepad = function(){
// 			if(inputStopped && navigator.getGamepads()[0]){
// 				gamepad = navigator.getGamepads()[0];
// 				movingUp = false, movingDown = false, movingDown = false, movingLeft = false, movingRight = false, shot = false;
// 				if(gamepad.buttons[2].pressed) mainWindow.reload();
// 			} else if(navigator.getGamepads()[0]){
// 				gamepad = navigator.getGamepads()[0];
// 				if(gamepad.axes[9]){
// 					var hatSwitch = gamepad.axes[9].toFixed(1);
// 					movingUp = hatSwitch == '-1.0' || hatSwitch == '1.0' || hatSwitch == '-0.7' ? true : false;
// 					movingDown = hatSwitch == '0.1' || hatSwitch == '-0.1' || hatSwitch == '0.4' ? true : false;
// 					movingLeft = hatSwitch == '0.7' || hatSwitch == '1.0' || hatSwitch == '0.4' ? true : false;
// 					movingRight = hatSwitch == '-0.4' || hatSwitch == '-0.1' || hatSwitch == '-0.7' ? true : false; 
// 				} else {
// 					movingUp = gamepad.axes[1] < analogThresh * -1 ? true : false;
// 					movingDown = gamepad.axes[1] > analogThresh ? true : false;
// 					movingLeft = gamepad.axes[0] < analogThresh * -1 ? true : false;
// 					movingRight = gamepad.axes[0] > analogThresh ? true : false;
// 				}
// 				shot = gamepad.buttons[0].pressed || gamepad.buttons[1].pressed || gamepad.buttons[3].pressed || gamepad.buttons[2].pressed ? true : false;
// 				if(gamepad.buttons[8].pressed) mainWindow.reload();
// 			}
// 		};

// 		var move = function(){
// 			if(movingRight) playerX += playerSpeed;
// 			else if(movingLeft) playerX -= playerSpeed;
// 			if(movingUp) playerY -= playerSpeed;
// 			else if(movingDown) playerY += playerSpeed;
// 			if(playerX <= 0) playerX = 0;
// 			else if(playerX + playerWidth >= gameWidth) playerX = gameWidth - playerWidth;
// 			if(playerY <= 0) playerY = 0;
// 			else if(playerY + playerHeight >= gameHeight) playerY = gameHeight - playerHeight;
// 		};

// 		updateGamepad();
// 		move();

// 	};

// 	var draw = function(){
// 		if(!isGameOver){
// 			if(!canGetHit){
// 				if(gameClock % 10 == 0) player.src = 'img/playerblank.png';
// 				else if(gameClock % 10 == 5) player.src = 'img/player.png';
// 			} else if(player.src != 'img/player.png') {
// 				player.src = 'img/player.png';
// 			}
// 			var offset = 0;
// 			if(movingLeft) offset = grid;
// 			else if(movingRight) offset = grid * 2;
// 			context.drawImage(player, offset, 0, grid, grid * 1.5, playerX, playerY, grid, grid * 1.5);
// 		}
// 	};

// 	update();
// 	draw();

// };
let enemyShots = {
	medium: {one: []}
},
bossShots = {
	oneA: [], oneB: []
};

const missileOneImg = new Image(), blueBulletImg = new Image();
missileOneImg.src = 'img/missileone.png';
blueBulletImg.src = 'img/bluebullet.png';

const missileTwoNImg = new Image(), missileTwoSImg = new Image(), missileTwoWImg = new Image(), missileTwoEImg = new Image(), missileTwoNWImg = new Image(), missileTwoNEImg = new Image(), missileTwoSWImg = new Image(),
	missileTwoSEImg = new Image();
missileTwoNImg.src = 'img/missiletwon.png';
missileTwoSImg.src = 'img/missiletwo.png';
missileTwoWImg.src = 'img/missiletwow.png';
missileTwoEImg.src = 'img/missiletwoe.png';
missileTwoNWImg.src = 'img/missiletwonw.png';
missileTwoNEImg.src = 'img/missiletwone.png';
missileTwoSWImg.src = 'img/missiletwosw.png';
missileTwoSEImg.src = 'img/missiletwose.png';

const spawnMediumOneShot = function(enemy){
	enemyShots.medium.one.push({x: enemy.x + (grid / 3), y: enemy.y + grid, width: grid / 2, height: grid});
	enemyShots.medium.one.push({x: (enemy.x + (grid * 2)) - ((grid / 3) + (grid / 2)), y: enemy.y + grid, width: grid / 2, height: grid});
},

spawnBossOneAShot = function(enemy){
	bossShots.oneA.push({x: enemy.x, y: enemy.y, width: 12, height: grid, direction: 'nw'});
	bossShots.oneA.push({x: enemy.x + enemy.width - grid, y: enemy.y, width: grid, height: grid, direction: 'ne'});
	bossShots.oneA.push({x: enemy.x, y: enemy.y + enemy.height - grid, width: grid, height: grid, direction: 'sw'});
	bossShots.oneA.push({x: enemy.x + enemy.width - grid, y: enemy.y + enemy.height - grid, width: grid, height: grid, direction: 'se'});
},

spawnBossOneBShot = function(enemy){
	bossShots.oneB.push({x: enemy.x + (enemy.height / 2), y: enemy.y - 6, width: 6, height: 6, direction: 'n'});
	bossShots.oneB.push({x: enemy.x + (enemy.height / 2), y: enemy.y + enemy.height, width: 6, height: 6, direction: 's'});
	bossShots.oneB.push({x: enemy.x - 6, y: enemy.y + (enemy.height / 2), width: 6, height: 6, direction: 'w'});
	bossShots.oneB.push({x: enemy.x + enemy.width, y: enemy.y + (enemy.height / 2), width: 6, height: 6, direction: 'e'});
	bossShots.oneB.push({x: enemy.x - 6, y: enemy.y - 6, width: 6, height: 6, direction: 'nw'});
	bossShots.oneB.push({x: enemy.x + enemy.width, y: enemy.y - 6, width: 6, height: 6, direction: 'ne'});
	bossShots.oneB.push({x: enemy.x - 6, y: enemy.y + enemy.height, width: 6, height: 6, direction: 'sw'});
	bossShots.oneB.push({x: enemy.x + enemy.width, y: enemy.y + enemy.height, width: 6, height: 6, direction: 'se'});
},

enemyShootingLoop = function(){
	var draw = function(){
		if(enemyShots.medium.one.length) animateMediumOneShot();
		if(bossShots.oneA.length) animateBossOneAShot();
		if(bossShots.oneB.length) animateBossOneBShot();
	};
	draw();
}, 

animateMediumOneShot = function(){
	enemyShots.medium.one.forEach(function(shotObj, i){
		context.drawImage(missileOneImg, shotObj.x, shotObj.y);
		enemyShots.medium.one[i].y += 3;
		if(enemyShots.medium.one[i].y >= gameHeight) enemyShots.medium.one.splice(i, 1);
		if(canGetHit) checkEnemyShotCollision(shotObj, i, enemyShots.medium.one);
		checkEnemyPopcorn(shotObj, i, enemyShots.medium.one);
	});
},

animateBossOneAShot = function(){
	const shotSpeed = 1.5 * 0.75;
	bossShots.oneA.forEach(function(shotObj, i){
		switch(shotObj.direction){
			case 'nw':
				bossShots.oneA[i].y -= shotSpeed;
				bossShots.oneA[i].x -= shotSpeed;
				context.drawImage(missileTwoNWImg, shotObj.x, shotObj.y);
				break;
			case 'ne':
				bossShots.oneA[i].y -= shotSpeed;
				bossShots.oneA[i].x += shotSpeed;
				context.drawImage(missileTwoNEImg, shotObj.x, shotObj.y);
				break;
			case 'sw':
				bossShots.oneA[i].y += shotSpeed;
				bossShots.oneA[i].x -= shotSpeed;
				context.drawImage(missileTwoSWImg, shotObj.x, shotObj.y);
				break;
			case 'se':
				bossShots.oneA[i].y += shotSpeed;
				bossShots.oneA[i].x += shotSpeed;
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
},

animateBossOneBShot = function(){
	const shotSpeed = 1.5;
	const shotSpeedDiag = shotSpeed * 0.75;
	bossShots.oneB.forEach(function(shotObj, i){
		switch(shotObj.direction){
			case 'n':
				bossShots.oneB[i].y -= shotSpeed;
				context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
				break;
			case 's':
				bossShots.oneB[i].y += shotSpeed;
				context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
				break;
			case 'w':
				bossShots.oneB[i].x -= shotSpeed;
				context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
				break;
			case 'e':
				bossShots.oneB[i].x += shotSpeed;
				context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
				break;
			case 'nw':
				bossShots.oneB[i].y -= shotSpeedDiag;
				bossShots.oneB[i].x -= shotSpeedDiag;
				context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
				break;
			case 'ne':
				bossShots.oneB[i].y -= shotSpeedDiag;
				bossShots.oneB[i].x += shotSpeedDiag;
				context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
				break;
			case 'sw':
				bossShots.oneB[i].y += shotSpeedDiag;
				bossShots.oneB[i].x -= shotSpeedDiag;
				context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
				break;
			case 'se':
				bossShots.oneB[i].y += shotSpeedDiag;
				bossShots.oneB[i].x += shotSpeedDiag;
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
};

var checkEnemyShotCollision = function(shotObj, i, arr){
	checkCollision(shotObj, {x: playerX, y: playerY, width: grid, height: grid}, function(){
		arr.splice(i, 1);
		getHit(arr, i);
	});
};

var checkEnemyPopcorn = function(shotObj, i, arr){
	checkBulletCollision(shotObj, function(){
		explodeEntity(shotObj);
		arr.splice(i, 1);
		score += 20;
	});
};
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
let explosions = [];

const explodeEntity = function(entityObj, passClock){
	entityObj.time = passClock ? passClock : gameClock;
	explosions.push(entityObj);
};


const explosionAnimateTime = 1, explosionSize = grid * 2;

const explosionImg = new Image();
explosionImg.src = 'img/explosions.png';

const explosionsLoop = function(){
	const draw = function(){
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
	if(explosions.length) draw();
};
let score = 0, highScore = 0, fullscreenMessageTime = 0, currentFullscreenMessage = 'score attack: 2 min', initialTime = new Date(), canTime = true, livesLeft = 4, isFinished = false, isDead = false,
	hitClock = 0, scoreSaved = false;
let endTime = new Date(initialTime.getTime() + (2 * 60000));

const setupHighScore = function(){
	if(savedData.highScore) highScore = savedData.highScore;
	else storage.set('savedData', {highScore: 0});
},

hudLoop = function(){

	const drawScore = function(){
		let tempScore = String(score);
		const addZero = function(input){
			return input.length < 7 ? addZero('0' + input) : input;
		};
		tempScore = addZero(tempScore);
		drawString('score ' + tempScore, grid / 4, grid / 4);
	},

	drawHighScore = function(){
		if(score > highScore) highScore = score;
		let tempScore = String(highScore);
		const addZero = function(input){
			return input.length < 7 ? addZero('0' + input) : input;
		};
		tempScore = addZero(tempScore);
		drawString('high ' + tempScore, (gameWidth - (grid / 4)) - ((grid / 2) * 12), grid / 4);
	},

	drawTime = function(){
		if(canTime){
			let timeString = '';
			const secondsLeft = 120 - (gameClock / fps),
			buildTimeString = function(){
				var tempMinutes = secondsLeft > 60 ? '1' : '0';
				var tempSeconds = String(secondsLeft);
				if(tempSeconds.indexOf('.') > -1) tempSeconds = tempSeconds.substring(0, tempSeconds.indexOf('.'));
				if(tempSeconds > 59) tempSeconds = tempSeconds - 60;
				tempSeconds = String(tempSeconds);
				if(tempSeconds.length < 2) tempSeconds = '0' + tempSeconds;
				var tempMilliseconds = String(secondsLeft);
				tempMilliseconds = tempMilliseconds.substring(tempMilliseconds.indexOf('.') + 1);
				tempMilliseconds = tempMilliseconds.substring(0, 2);
				if(tempMilliseconds.length < 2) tempMilliseconds = '0' + tempMilliseconds;
				return tempMinutes + ':' + tempSeconds + ':' + tempMilliseconds;
			};
			if(secondsLeft == 120) timeString = '2:00:00';
			else if(secondsLeft < 120 && secondsLeft > 0) timeString = buildTimeString();
			else {
				document.removeEventListener('keydown', playerKeysDown);
				document.removeEventListener('keyup', playerKeysUp);
				document.addEventListener('playerReloadOnly', playerKeysUp);
				canTime = false;
				isFinished = true;
			}
			drawString('time ' + timeString, grid / 4, (grid / 4) * 3);
		} else {
			drawString('time ' + '0:00:00', grid / 4, (grid / 4) * 3);
			isGameOver = true;
			shot = false;
			canGetHit = false;
			playerX = (gameWidth / 2) - (grid / 2);
			playerY = gameHeight * 2;
			if(isFinished) drawFullscreenMessageGameOver('time over');
			else if(isDead) drawFullscreenMessageGameOver('game over');
			if(!scoreSaved) saveHighScore();
		}
	},

	drawLives = function(){
		const stringNum = livesLeft > 0 ? livesLeft - 1 : livesLeft;
		drawString('left:' + String(stringNum), gameWidth - (grid * 3) - (grid / 4), gameHeight - (grid / 2) - (grid / 4));
		if(livesLeft == 0){
			document.removeEventListener('keydown', playerKeysDown);
			document.removeEventListener('keyup', playerKeysUp);
			document.addEventListener('playerReloadOnly', playerKeysUp);
			canTime = false;
			isDead = true;
		}
		if(hitClock > 0) hitClock--;
		else if(!canGetHit) canGetHit = true;
	},

	drawFullscreenMessage = function(){
		drawString(currentFullscreenMessage, (gameWidth / 2) - (currentFullscreenMessage.length * (grid / 4)), (gameHeight / 2) - (grid / 4), true);
		fullscreenMessageTime++;
	},

	drawFullscreenMessageGameOver = function(message){
		if(gameClock == 12000) mainWindow.reload();
		const baseYPos = (gameHeight / 2) - (grid / 4);
		const firstString = message, secondString = 'your score ' + score,
			thirdString = (score == highScore) ? 'new high score ' + score : '';
		if(thirdString == ''){
			drawString(firstString, (gameWidth / 2) - (firstString.length * (grid / 4)), baseYPos - (grid / 2), true);
			drawString(secondString, (gameWidth / 2) - (secondString.length * (grid / 4)), baseYPos + (grid / 2), true);
		} else {
			drawString(firstString, (gameWidth / 2) - (firstString.length * (grid / 4)), baseYPos - grid, true);
			drawString(secondString, (gameWidth / 2) - (secondString.length * (grid / 4)), baseYPos, true);
			drawString(thirdString, (gameWidth / 2) - (thirdString.length * (grid / 4)), baseYPos + grid, true);
		}
	};

	drawScore();
	drawHighScore();
	drawTime();
	drawLives();
	if(fullscreenMessageTime < fps * 2.5) drawFullscreenMessage();
}, 

timeString = function(timeInput){
	const buildTimeString = function(){
		let timeChars = '';
		timeInput.split('').forEach(function(timeNum){
			if(timeNum == ':'){
				timeChars += '<fontchar class="colon"></fontchar>'
			}	else {
				timeChars += '<fontchar class="num_' + timeNum + '"></fontchar>'
			}	
		});
		return timeChars;
	};
	var output = '<fontchar class="t"></fontchar>\
		<fontchar class="i"></fontchar>\
		<fontchar class="m"></fontchar>\
		<fontchar class="e"></fontchar>\
		<fontchar class="space"></fontchar>' +
		buildTimeString();
	return output;
},

getHit = function(enemyArr, i, destroysOnlyPlayer){
	if(livesLeft > 0) livesLeft -= 1;
	explodeEntity({x: playerX, y: playerY, width: playerWidth, height: playerHeight});
	playerX = (gameWidth / 2) - (playerWidth / 2), playerY = gameHeight - ((grid * 2.75) + grid);
	currentPowerup = 1;
	canGetHit = false;
	hitClock = fps * 2;
	if(!destroysOnlyPlayer) enemyArr.splice(i, 1);
},

saveHighScore = function(){
	scoreSaved = true;
	savedData.highScore = highScore;
	storage.set('savedData', {highScore: highScore});
};