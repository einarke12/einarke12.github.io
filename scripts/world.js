window.World = (function(){

	//==============================================================
	var PIPE_WIDTH = 5;
	var PIPE_HEIGHT = 50;
	var PIPE_SPEED = 20;
	var GAPSIZE = 25;
	//==============================================================
	var MOVE_WEIGHT = 17;
	var PLAYER_OFFSET = 1;
	//==============================================================
	var CLOUD_WEIGHT = 30;
	var CLOUD_WIDTH = 15;
	//==============================================================
	var collision_on = true;

	//==============================================================

	var World = function(audio_player, left_pipe, right_pipe, cloud1, cloud2, cloud3, floor, game) {
		this.floor = floor;
		this.left_pipe = left_pipe;
		this.right_pipe = right_pipe;
		this.cloud1 = cloud1;
		this.cloud2 = cloud2;
		this.cloud3 = cloud3;
		this.game = game;
		this.audio_player = audio_player;

		this.scores = false;
		this.scoreleft = false;
		this.scoreright = false;

	    this.INITIAL_X = this.game.WORLD_WIDTH;
		this.INITIAL_Y = 0;

		//this.rightPipe = $(".rightPipe");
		this.pipes = {left_pipe: {x: 0, y:0, topsize: 0, gapsize: GAPSIZE, bottomsize:0}, 
					  right_pipe: {x: 0, y:0, topsize: 0, gapsize: GAPSIZE, bottomsize:0} }

		this.clouds = {cloud1: {x: 0, y: 0, rotation: 0, gravity: 0}, 
					   cloud2: {x: 0, y: 0, rotation: 0, gravity: 0},
					   cloud3: {x: 0, y: 0, rotation: 0, gravity: 0}};

		this.floors = {floor: {x: 0, y:0}}
	}

	//==============================================================

	World.prototype.onFrame = function(delta) {

		this.updatePipes(delta);
		this.movePipes();
		this.updateClouds(delta);
		this.moveClouds();
		this.updateFloors(delta);
		this.moveFloors();

	};

	//==============================================================

	World.prototype.movePipes = function(){
		this.left_pipe.css('transform', 'translateZ(0)  translate(' + this.pipes.left_pipe.x + 'em, ' + 0 + 'em)');
		this.right_pipe.css('transform', 'translateZ(0)  translate(' + this.pipes.right_pipe.x + 'em, ' + 0 + 'em)');
	}

	//==============================================================

	World.prototype.moveClouds = function(){
		this.cloud1.css('transform', 'translateZ(0)  translate(' + this.clouds.cloud1.x + 'em, ' + this.clouds.cloud1.y + 'em)'
												 + ' rotate(' + this.clouds.cloud1.rotation + 'deg)' );

		this.cloud2.css('transform', 'translateZ(0)  translate(' + this.clouds.cloud2.x + 'em, ' + this.clouds.cloud2.y + 'em) ' 
			                                     + ' rotate(' + this.clouds.cloud2.rotation + 'deg)' );

		this.cloud3.css('transform', 'translateZ(0)  translate(' + this.clouds.cloud3.x + 'em, ' + this.clouds.cloud3.y  + 'em) ' 
			                                     + ' rotate(' + this.clouds.cloud3.rotation + 'deg)' );


		this.clouds.cloud1.rotation -= 1;
		this.clouds.cloud2.rotation += 2;
		this.clouds.cloud3.rotation += 3.5;
	}

	//==============================================================

	World.prototype.moveFloors = function(){
		this.floor.css('transform', 'translateZ(0)  translate(' + this.floors.floor.x + 'em, ' + 0 + 'em)');
	}
	//==============================================================

	World.prototype.checkCollision = function(player) {

		if(collision_on){
			if(this.checkCollisionWithLeftPipe(player) || this.checkCollisionWithRightPipe(player)){ 
				return true; 
			}
		}
		
		return false;
	};

	//==============================================================


	World.prototype.checkCollisionWithLeftPipe = function(player) {

		var pipeoffset = this.pipes.left_pipe.topsize + GAPSIZE;
		if(this.pipes.left_pipe.x - PIPE_WIDTH < player.pos.x) 
		{ 
			if(this.pipes.left_pipe.x + PIPE_WIDTH > player.pos.x)
			{
				if(this.pipes.left_pipe.topsize * (0.01 * PIPE_HEIGHT)  > player.pos.y + PLAYER_OFFSET) { 
					return true; 
				}
				else if((pipeoffset * (0.01 * PIPE_HEIGHT)) - PIPE_WIDTH < player.pos.y - PLAYER_OFFSET) { 
					return true; 
				}
				else
				{ 
					if(!this.scoreleft)
					{
						if(this.pipes.left_pipe.x + PIPE_WIDTH/1.2 < player.pos.x )
						{
							this.scoreleft = true;
							this.game.score++;
							this.audio_player.score();
							
						}
					}
				}
			}
		}
		return false;
	};

	//==============================================================

	World.prototype.checkCollisionWithRightPipe = function(player) {
		var pipeoffset = this.pipes.right_pipe.topsize + GAPSIZE;
		if(this.pipes.right_pipe.x < player.pos.x) 
		{ 
			if(this.pipes.right_pipe.x + PIPE_WIDTH > player.pos.x)
			{
				if(this.pipes.right_pipe.topsize * (0.01 * PIPE_HEIGHT)  > player.pos.y + PLAYER_OFFSET) { return true; }
				else if((pipeoffset * (0.01 * PIPE_HEIGHT)) - PIPE_WIDTH < player.pos.y - PLAYER_OFFSET) { return true; }
				else{ 
					if(!this.scoreright){
						if(this.pipes.right_pipe.x + PIPE_WIDTH/1.2 < player.pos.x ){
							this.scoreright = true;
							this.game.score++;	
							this.audio_player.score();
						}
					}
				}
			}
		}
		return false;
	}

	//==============================================================

	World.prototype.reset = function() {
		this.setPipeSizes();
		this.pipes.left_pipe.x = this.INITIAL_X;
		this.pipes.left_pipe.y = this.INITIAL_Y;

		this.pipes.right_pipe.x = this.INITIAL_X + this.game.WORLD_WIDTH/2.3;
		this.pipes.right_pipe.y = this.INITIAL_Y;

		this.clouds.cloud1.x = Math.floor((Math.random()*this.game.WORLD_WIDTH)+0);
		this.clouds.cloud1.y = Math.floor((Math.random()*40)+0);
		this.clouds.cloud1.gravity = (Math.floor((Math.random()*3)+0) -1) * ((Math.random()*1)+0);

		this.clouds.cloud2.x = Math.floor((Math.random()*this.game.WORLD_WIDTH)+0);
		this.clouds.cloud2.y = Math.floor((Math.random()*40)+0);
		this.clouds.cloud2.gravity = (Math.floor((Math.random()*3)+0) -1) * ((Math.random()*1)+0);

		this.clouds.cloud3.x = Math.floor((Math.random()*this.game.WORLD_WIDTH)+0);
		this.clouds.cloud3.y = Math.floor((Math.random()*40)+0);
		this.clouds.cloud3.gravity = (Math.floor((Math.random()*3)+0) -1) * ((Math.random()*1)+0);

		this.floors.floor.x = 0;

	};

	//==============================================================

	World.prototype.updatePipes = function(delta) {

		if(this.pipes.left_pipe.x < PIPE_WIDTH * -1) { 
			this.pipes.left_pipe.x = this.INITIAL_X; 
			this.setLeftPipeSize();
			this.scoreleft = false;
		}
		else {
			this.pipes.left_pipe.x = this.pipes.left_pipe.x - delta * MOVE_WEIGHT;
		}

		if(this.pipes.right_pipe.x < PIPE_WIDTH * -1) { 
			this.pipes.right_pipe.x = this.INITIAL_X; 
			this.setRightPipeSize();
			this.scoreright = false;
		}
		else {
			this.pipes.right_pipe.x = this.pipes.right_pipe.x - delta * MOVE_WEIGHT;
		}
		
		
	};

	//==============================================================

	World.prototype.updateFloors = function(delta) {

		if(this.floors.floor.x < -12.35){
			this.floors.floor.x = 0;
		}
		else{
			this.floors.floor.x -= delta * MOVE_WEIGHT;
		}
	};

	//==============================================================

	World.prototype.updateClouds = function(delta) {
		if(this.clouds.cloud1.x < CLOUD_WIDTH * -2) { 
			this.clouds.cloud1.x = this.INITIAL_X;
			this.clouds.cloud1.y = Math.floor((Math.random()*40)+0);
			this.clouds.cloud1.gravity = (Math.floor((Math.random()*3)+0) -1) * ((Math.random()*1)+0);
		}
		else {
			this.clouds.cloud1.x = this.clouds.cloud1.x - delta * CLOUD_WEIGHT/3;
			this.clouds.cloud1.y += (0.2 * this.clouds.cloud1.gravity);
		}

		if(this.clouds.cloud2.x < CLOUD_WIDTH * -2) { 
			this.clouds.cloud2.x = this.INITIAL_X;
			this.clouds.cloud2.y = Math.floor((Math.random()*40)+0);
			this.clouds.cloud2.gravity = (Math.floor((Math.random()*3)+0) -1) * ((Math.random()*1)+0);
		}
		else {
			this.clouds.cloud2.x = this.clouds.cloud2.x - delta * CLOUD_WEIGHT/2;
			this.clouds.cloud2.y += (0.2 * this.clouds.cloud2.gravity);
		}

		if(this.clouds.cloud3.x > this.game.WORLD_WIDTH) { 
			this.clouds.cloud3.x = -10;
			this.clouds.cloud3.y = Math.floor((Math.random()*40)+0);
			this.clouds.cloud3.gravity = (Math.floor((Math.random()*3)+0) -1) * ((Math.random()*1)+0);
		}
		else {
			this.clouds.cloud3.x = this.clouds.cloud3.x + delta * CLOUD_WEIGHT/2;
			this.clouds.cloud3.y += (0.2 * this.clouds.cloud3.gravity);
		}
	}

	//==============================================================


	World.prototype.setPipeSizes = function(){
		this.setLeftPipeSize();
		this.setRightPipeSize();
	};

	//==============================================================

	World.prototype.setLeftPipeSize = function(){
		var remainder = 100;
		this.pipes.left_pipe.topsize = Math.floor((Math.random()*50)+20);
		remainder -= (this.pipes.left_pipe.topsize + GAPSIZE);
		this.pipes.left_pipe.bottomsize = remainder;

		this.left_pipe.find( ".PipeTop" ).css( "height", this.pipes.left_pipe.topsize + "%" );
		this.left_pipe.find( ".Gap" ).css( "height", GAPSIZE + "%" );
		this.left_pipe.find( ".PipeBottom" ).css( "height", remainder + "%");
	}

	//==============================================================

	World.prototype.setRightPipeSize = function(){
		var remainder = 100;
		this.pipes.right_pipe.topsize = Math.floor((Math.random()*50)+20);
		remainder -= (this.pipes.right_pipe.topsize + GAPSIZE);
		this.pipes.right_pipe.bottomsize = remainder;

		this.right_pipe.find( ".PipeTop" ).css( "height", this.pipes.right_pipe.topsize + "%" );
		this.right_pipe.find( ".Gap" ).css( "height", GAPSIZE + "%" );
		this.right_pipe.find( ".PipeBottom" ).css( "height", remainder + "%");
	}

	
	//==============================================================



	return World;
})();