window.Player = (function() {
	'use strict';

	var Controls = window.Controls;

	// All these constants are in em's, multiply by 10 pixels
	// for 1024x576px canvas.

	//==============================================================
	var WIDTH = 5;
	var HEIGHT = 5;
	var INITIAL_POSITION_X = 10;
	var INITIAL_POSITION_Y = 0;
	var FALL_DELAY = 1;
	//==============================================================
	// general
	var gravity = 1;
	var acceleration = 1;
	//==============================================================
	// jumping properties
	var jumping = false;	
	var jump_length = 7;
	var jump_goal = 0;
	var jump_weight = 1;
	//==============================================================
	// falling properties		
	var falling = true;
	var fall_speed = 35;
	var velocity = 0;
	var fall_delay = FALL_DELAY;
	//==============================================================
	// constructor
	var Player = function(el, game, audio_player) {
		this.el = el;
		this.game = game;
		this.pos = { x: 0, y: 0 };
		this.audio_player = audio_player;
		this.size = {width: WIDTH, height: HEIGHT};

		this.is_dead = false;

	};

	//==============================================================
	/**
	 * Resets the state of the player for a new game.
	 */
	Player.prototype.reset = function() 
	{
		this.is_dead = false;
		this.pos.x = INITIAL_POSITION_X;
		this.pos.y = INITIAL_POSITION_Y;
	};
	//==============================================================

	Player.prototype.onFrame = function(delta) 
	{

		if (Controls.didJump()){
	
			jump_goal = this.pos.y - jump_length;
			jumping = true;
			falling = false;
			this.audio_player.jumpSound();
			velocity = 0;
			fall_delay = FALL_DELAY;
		}

		if(jumping) { 
			this.rise(); 
		}
		else if(falling && (fall_delay <= 0)) { 
			this.fall(delta); 
		}
		else { 
			fall_delay--;
		}

		this.toggleSprite();



		this.checkCollisionWithBounds();
		
		this.movePlayer();
	};
	//==============================================================

	Player.prototype.fall = function(delta) {


		this.pos.y += delta * fall_speed * gravity;
		if(velocity > -90){
			velocity += 2;
		}
	};

	//==============================================================

	Player.prototype.rise = function() {
		if(this.pos.y <= jump_goal){ 
			jumping = false;
			falling = true;
		}
		else{
			if(this.pos.y > 0){ 
				this.pos.y -= jump_weight; 
				
				if(velocity < 90){
					velocity -=5;
				}

			} 
			else { 
				jumping = false; 
				falling = true;
			}
			
		}
	};

	//==============================================================

	Player.prototype.die = function(){
		this.is_dead = true;
	};

	//==============================================================

	Player.prototype.movePlayer = function(){
		this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)'
												+ ' rotate(' + velocity + 'deg)' );
	};


	//==============================================================

	Player.prototype.checkCollisionWithBounds = function() {
		if (this.pos.y + HEIGHT > (this.game.WORLD_HEIGHT - 7) ) {
			return this.game.gameover();
		}
	};

	//==============================================================

	Player.prototype.toggleSprite = function(){

		if(this.is_dead){
			this.el.toggleClass("dead", this.is_dead);
			this.el.toggleClass("falling", false);
			this.el.toggleClass("jumping", false);
		}
		else{
			this.el.toggleClass("dead", this.is_dead);
			this.el.toggleClass("falling", falling);
			this.el.toggleClass("jumping", jumping);
		}
	};

	//==============================================================

	return Player;

})();
