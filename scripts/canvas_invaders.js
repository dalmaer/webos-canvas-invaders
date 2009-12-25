$(document).ready(function(){main();});

var FPS = 30;
var isLoaded = false;
var fallCanvas;
var tics;
var i=0;

var renderer;
var emitter;
var intervalId;

var gameOver = false;
var wave = 1;

// Set up enemy global vars
var enemyCount = 0;
var enemies = {};

var players = {};

var projectileCount = 0;
var projectiles = {};

// Set up the images
var redAlien = new Image();
redAlien.src = "images/invader1.png";

var redAlienA = new Image();
redAlienA.src = "images/invader12.png";

var orangeAlien = new Image();
orangeAlien.src = "images/invader2.png";

var orangeAlienA = new Image();
orangeAlienA.src = "images/invader22.png";

var ship = new Image();
ship.src = "images/ship.png";

var projImage = new Image();
projImage.src = "images/projectile.png";

var eProjImage = new Image();
eProjImage.src = "images/eprojectile.png";

var eProjImageA = new Image();
eProjImageA.src = "images/eprojectile2.png";

function main ()
{
    isLoaded = true;
    fallCanvas  = document.getElementById("invaders-canvas");
    bgCanvas  = document.getElementById("background-canvas");
	resizeCanvas();
    renderer    = new Renderer(fallCanvas);
    tics        = Math.ceil(1000 / FPS);
    initGame();
    intervalId = window.setInterval(updateGame, tics);
}

function resizeCanvas ()
{
	if (isLoaded) {
        // fallCanvas.width    = 570;
        // fallCanvas.height   = 350;
        // bgCanvas.width    = 570;
        // bgCanvas.height    = 350;

		fallCanvas.width    = 320;
		fallCanvas.height   = 460;
		bgCanvas.width    = 320;
		bgCanvas.height    = 460;
		
		$('#game_bezel').css('left', (document.width / 2) - ($('#game_bezel').width() / 2) + 'px');
		
		if (renderer != null) {
			renderer.init(fallCanvas);
		}
	}
}

function addEnemy(enemy){
	enemies[enemy.id] = enemy;
	renderer.addEnemy(enemy);
	++enemyCount;
}

function removeEnemy(enemy)
{
    delete enemies[enemy.id];
    renderer.removeEnemy(enemy);
    --enemyCount;
	
	if(enemyCount == 0){
		nextWave();
	}
}

function addPlayer(player){
	players[player.id] = player;
	renderer.addPlayer(player);
}

function addProjectile(projectile){
	projectiles[projectile.id] = projectile;
	renderer.addProjectile(projectile);
	++projectileCount;
}

function removeProjectile (projectile)
{
    delete projectiles[projectile.id];
    renderer.removeProjectile(projectile);
    --projectileCount;
}

var numenemies = 6; // 11

// Set up the initial game
function initGame() {
	var player = new Player(10,bgCanvas.height - 30, ship);
	addPlayer(player);
	
	for(i = 0; i<= numenemies; i++){
		for(j = 0; j <=6; j++){
			if (j == 0){
				var enemy = new Enemy(10 + (i*34), 40 + (j*25), orangeAlien, orangeAlienA);
			}else{
				var enemy = new Enemy(10 + (i*34), 40 + (j*25), redAlien, redAlienA);
			}
			addEnemy(enemy);
		}
	}
}

// Reset the enemies for the next wave
function nextWave() {
	wave++;
	for(i = 0; i<= numenemies; i++){
		for(j = 0; j <=6; j++){
			if (j == 0){
				var enemy = new Enemy(10 + (i*34), 40 + (j*25), orangeAlien, orangeAlienA);
			}else{
				var enemy = new Enemy(10 + (i*34), 40 + (j*25), redAlien, redAlienA);
			}
			addEnemy(enemy);
		}
	}
}

// Set up the key events
rightDown = false;
leftDown = false;
space = false;

var Key = {};
Key.J = 74;
Key.L = 76;

// Key event handelers
function onKeyDown(evt) {
  if (evt.keyCode == Key.L) rightDown = true;
  else if (evt.keyCode == Key.J) leftDown = true;
  if (evt.keyCode == 32){
	space = true;
	var projectile = new Projectile(players[0].x + (players[0]._width/2), players[0].y - 10, projImage, projImage, 5, 1);
	addProjectile(projectile);
  };
}

function onKeyUp(evt) {
  if (evt.keyCode == Key.L) rightDown = false;
  else if (evt.keyCode == Key.J) leftDown = false;
  if (evt.keyCode == 32) space = false;
}

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);

function updateGame(){
	
	renderer.redraw();
	
	if (gameOver != true){	
		for (var id in players){
			var player = players[id];
			
			if (player._lives < 0){
				$('#gameover').fadeIn(2000);
				gameOver = true;
			}
			
			player.update(100);
			$('#player_score').html(player._score);
		}
		
		for (var id in projectiles) {
			var projectile = projectiles[id];
			projectile.update(100);
		}
		
		// Change the direction of the inaders movement
		if (updateLogic == true){
			updateLogic = false;
			direction = -direction;
			enemyMoveSpeed = -enemyMoveSpeed;
			enemyYChange = 10;
		}
		
		// Loop through the enemies update their speed baased on enemies left, check if they have fired.
		for (var id in enemies) {
			var enemy = enemies[id];
			enemy.delay = (enemyCount * 20) - (wave * 10);
			
			if (enemy.delay <=50 ){
				enemy.delay = 50;
			}
			
			enemy.update(100);
			
			if (enemy._fire == true){
				enemy._fire = false;
				var projectile = new Projectile(enemy.x + (enemy._width/2), enemy.y + 10, eProjImage, eProjImageA, -5, 2);
				addProjectile(projectile);
			}
		}
		
		// reset the y var for the enemies to move down.
		enemyYChange = 0;
		
		// Check collisions between player, enemies, and projectiles
		checkCollisions();
	}
}

// Need to clean up at some point. Loops through the projectiles, checks who they came from then performs collision tests to see if its a hit
function checkCollisions(){
	for (var id in projectiles) {
		var projectile = projectiles[id];
		
		if(projectile._type == 1){
			for (var eid in enemies) {
				var enemy = enemies[eid];
				
				if (projectile.x >= enemy.x && projectile.x <= (enemy.x + enemy._width)){
					if (projectile.y <= (enemy.y + enemy._height) && projectile.y >= (enemy.y)){
						removeEnemy(enemy);
						removeProjectile(projectile);
						players[0]._score += 100;
					}
				}
			}
		}else{
			for (var pid in players) {
				var player = players[pid];
				if (projectile.x >= player.x && projectile.x <= (player.x + player._width)){
					if (projectile.y <= (player.y + player._height) && projectile.y >= (player.y)){
						removeProjectile(projectile);
						player._lives --;
					}
				}
			}
		}
		
		if (projectile.y <=0 || projectile.y > fallCanvas.height){
			removeProjectile(projectile);
		}
	}
	
}

