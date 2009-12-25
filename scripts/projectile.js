var _global = this;

(function () {

// class variables
    var idCounter = 0;
	
// constructor
    function Projectile (_x, _y, _imgSrc, _imgSrcA, _speed, _type)
    {
        this.id = idCounter++; 
        this.x  = _x;
        this.y  = _y;
		this.imgSrc = _imgSrc;
		this.imgSrcA = _imgSrcA;
		
		this._width = 30;
		this._speed = _speed;
		this.delay = 500;
		this.frame = 1;
		this._time = 0;
		
		// Type determins if it belongs to the player or enemy.. could also be determined by speed
		this._type = _type;
    }
    
    _global.Projectile = Projectile;
    
// public

    Projectile.prototype.update = function (timeDelta)
    {
		this._time += timeDelta;
		this.y -= this._speed;
		if (this._time >= this.delay){
			this._time = 0;
			this.frame = -this.frame;
		}
    };
    
})();