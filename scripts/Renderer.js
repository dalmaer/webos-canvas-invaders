var _global = this;
//Renderer Class most borrowed from  http://iterationsix.com/ particle example

(function () {
	
	function Renderer(canvas){
		this._enemies  = {};
		this._player = {};
		this._projectiles = {};
		this.init(canvas);
	}

	_global.Renderer = Renderer;

	Renderer.prototype.init = function (canvas)
	{
		this._canvas    = canvas;
		this._context   = this._canvas.getContext("2d");
		this._width     = this._canvas.width;
		this._height    = this._canvas.height;
	};

	Renderer.prototype.redraw = function ()
	{
		draw.call(this);
	};
    
	Renderer.prototype.addEnemy = function (enemy)
    {
        this._enemies[enemy.id] = enemy;
    };
	
	Renderer.prototype.removeEnemy = function (enemy)
    {
        delete this._enemies[enemy.id];
    };
	
	Renderer.prototype.addPlayer = function (player)
    {
        this._player[player.id] = player;
    };
	
	Renderer.prototype.addProjectile = function (projectile)
    {
        this._projectiles[projectile.id] = projectile;
    };
	
	Renderer.prototype.removeProjectile = function (projectile)
    {
        delete this._projectiles[projectile.id];
    };
	
// private

    function draw ()
    {
        // foreground
        this._context.clearRect(0, 0,this._width, this._height);
		this._context.fillStyle = 'black';
		for (var id in this._enemies) {
			var enemy = this._enemies[id];		
			this._context.save();
			if (enemy.frame == 1){
				this._context.drawImage(enemy.imgSrc, enemy.x, enemy.y);
			}else{
				this._context.drawImage(enemy.imgSrcA, enemy.x, enemy.y);
			}
			
			this._context.restore();
		}
		
		for (var id in this._player) {
			var player = this._player[id];		
			this._context.save();
			this._context.drawImage(player.imgSrc, player.x, player.y);
			
			for (i=0; i<= player._lives; i++){
				this._context.drawImage(player.imgSrc, (this._width / 2) + 180 + (i * 38), 10);
			}
			
			this._context.restore();
		}
		
		for (var id in this._projectiles) {
			var projectile = this._projectiles[id];		
			this._context.save();
			
			if (projectile.frame == 1){
				this._context.drawImage(projectile.imgSrc, projectile.x, projectile.y);
			}else{
				this._context.drawImage(projectile.imgSrcA, projectile.x, projectile.y);
			}
			
			this._context.restore();
		}
		
    }

})();