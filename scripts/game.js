
window.Game = (function() {
	'use strict';

	/**
	 * Main game class.
	 * @param {Element} el jQuery element containing the game.
	 * @constructor
	 */
	 //==============================================================

	var Game = function(el) {
		this.el = el;
		this.audio_player = new window.AudioPlayer(this);
		this.score = 0;
		this.highscore = 0;		
		this.player = new window.Player(this.el.find('.Player'), this, this.audio_player);
		this.world = new window.World(this.audio_player, this.el.find('.leftPipe'), this.el.find('.rightPipe'), 
									  this.el.find('.cloud1'), this.el.find('.cloud2'), this.el.find('.cloud3'), this.el.find('.floor'),this)
		this.isPlaying = false;
		// Cache a bound onFrame since we need it each frame.
		this.onFrame = this.onFrame.bind(this);
	};

	//==============================================================
	/**
	 * Runs every frame. Calculates a delta and allows each game
	 * entity to update itself.
	 */
	Game.prototype.onFrame = function() {
		this.updateScore(this.score);
		// Check if the game loop should stop.
		if (!this.isPlaying) {
			return;
		}

		// Calculate how long since last frame in seconds.
		var now = +new Date() / 1000, delta = now - this.lastFrame;
		this.lastFrame = now;

		// Update game entities.
		this.player.onFrame(delta);
		this.world.onFrame(delta);
		this.audio_player.onFrame();

		if(this.world.checkCollision(this.player))
		{
			this.gameover();
		}

		// Request next frame.
		window.requestAnimationFrame(this.onFrame);
	};

	//==============================================================

	Game.prototype.updateScore = function(val){
		$(".Score").text(val); 
		$(".scoredisplay").text(val);
	};

	Game.prototype.updateHighscore = function(new_score){
		
		if(this.highscore < new_score){
			this.highscore = new_score;
			$(".highscore").text(new_score);
		}
		if(this.highscore > 0){
			$(".highscore-text").text("HIGHSCORE");
		}
	};


	Game.prototype.start = function() {
		this.reset();

		// Restart the onFrame loop
		this.lastFrame = +new Date() / 1000;
		window.requestAnimationFrame(this.onFrame);
		this.isPlaying = true;


	};

	//==============================================================

	Game.prototype.reset = function() {
		//$(".Rooftop").css("-webkit-animation-play-state", "running");
		this.score = 0;
		this.updateScore(0);
		this.player.reset();
		this.world.reset();
	};
	//==============================================================

	Game.prototype.gameover = function() {
		this.audio_player.gameOver();
		this.updateHighscore(this.score);
		this.updateScore(this.score);
		this.player.die();
		this.player.toggleSprite();
		//$(".Rooftop").css("-webkit-animation-play-state", "paused");
		this.isPlaying = false;

		// Should be refactored into a Scoreboard class.
		var that = this;
		var scoreboardEl = this.el.find('.Scoreboard');
		scoreboardEl
			.addClass('is-visible')
			.find('.Scoreboard-restart')
				.one('click', function() {
					scoreboardEl.removeClass('is-visible');
					that.start();
				});
	};

	//==============================================================

	/**
	 * Some shared constants.
	 */
	Game.prototype.WORLD_WIDTH = 50;
	Game.prototype.WORLD_HEIGHT = 57;

	//==============================================================

	return Game;
})();


