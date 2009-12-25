var _global = this;

(function () {

// class variables
    var idCounter = 0;
	
// constructor
    function Player (_x, _y, _imgSrc)
    {
        this.id = idCounter; 
        this.x  = _x;
        this.y  = _y;
		this.imgSrc = _imgSrc;
		
		this._width = 30;
		this._height = 16;
		this._speed = 5;
		this._lives = 2;
		this._score = 0;
    }
    
    _global.Player = Player;
    
// public

    Player.prototype.update = function (timeDelta)
    {
		this._time += timeDelta;
		
		if (rightDown == true){
			if (this.x + (this._width + 6) <= fallCanvas.width){
				this.x += this._speed;
			}
		}
		
		if (leftDown == true){
			if (this.x - 6 >= 0){
				this.x -= this._speed;
			}
		}
    };
    
})();