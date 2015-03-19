

window.AudioPlayer = (function() {
	'use strict';

	var controls = window.Controls;

	var MAX_VOLUME = 1;
	var MIN_VOLUME = 0;
	//==============================================================
	var sound_effect_volume = 0.5;
	var music_volume = 0.2;
	//==============================================================
	var music_loop = false;
	var is_sound_playing = false;
	//==============================================================
	var music_off = false;
	var effects_off = false;
	//==============================================================
	var score_sound_counter = 0;
	var jump_sound_counter = 0;
	//==============================================================
	// CONSTRUCTOR
	//==============================================================
	var AudioPlayer = function(game) {
		this.sounds = {jump: [], background: null,  gameover: [], score: []}
		this.volume = {music: 0.2, effects: 0.5};

		this.game = game;
		this.loadBackgroundMusic();
		this.loadJumpSounds();
		this.loadScoreSounds();
		this.loadGameOverSounds();

		$('.background').prop("volume", this.volume.music);
		$('.soundeffect').prop("volume", this.volume.effects);

		this.addEventListeners();


	};

	//==============================================================
	// ON FRAME
	//==============================================================

	AudioPlayer.prototype.onFrame = function(delta) {

		this.loopBackgroundMusic();

		if(controls.didMuteBackground()){
			music_off = !music_off;
			this.toggleBackgroundMute();
		}

		if(controls.didMuteEffects()){
			effects_off = !effects_off;
			this.toggleEffectMute();
		}

		if(controls.didIncMusic()){
			this.incMusic();
			this.updateVolume();		
		}

		if(controls.didDecMusic()){
			this.decMusic();
			this.updateVolume();
		}

		if(controls.didIncEffects()){
			this.incEffects();
			this.updateVolume();
		}

		if(controls.didDecEffects()){
			this.decEffects();
			this.updateVolume();
		}
	
	};

	//==============================================================
	// PLAY FUNCTIONS
	//==============================================================

	AudioPlayer.prototype.play = function(element){
		element.load();
		element.play();
	};

	AudioPlayer.prototype.jumpSound = function(){

		if(!jump_sound_counter){

			//this.play(this.sounds.jump);
			
			var indices = this.sounds.jump.length - 2;
			var rand_sound = Math.floor((Math.random()*indices)+0);
			this.play(this.sounds.jump[rand_sound]);
			jump_sound_counter--;
		}
		
	};	

	AudioPlayer.prototype.gameOver = function(){

		var indices = this.sounds.gameover.length - 1;
		var rand_sound = Math.floor((Math.random()*indices)+0);
		this.play(this.sounds.gameover[rand_sound]);
	};

	
	AudioPlayer.prototype.score = function(){
		if(!score_sound_counter){
			is_sound_playing = true;
			var indices = this.sounds.score.length - 1;
			var rand_sound = Math.floor((Math.random()*indices)+0);
			this.play(this.sounds.score[rand_sound]);
			score_sound_counter--;
		}
		
	};

	AudioPlayer.prototype.restartGame = function(){
		this.play(this.restart);
	};

	//==============================================================
	// LOOPING FUNCTIONS
	//==============================================================

	AudioPlayer.prototype.turnMusicOn = function(){
		music_loop = true;
		this.play(this.sounds.background);;
	};

	AudioPlayer.prototype.loopBackgroundMusic = function(){
		if(!music_loop){
			this.turnMusicOn();
		}
	}


	//==============================================================
	// TOGGLE FUNCTIONS
	//==============================================================


	AudioPlayer.prototype.toggleBackgroundMute = function(){
		if(music_off){
			$('.background').prop("volume", 0);
		}
		else{
			$('.background').prop("volume", this.volume.music);
		}
	};

	AudioPlayer.prototype.toggleEffectMute = function(){
		console.log("MUTING EFFECTS");
		if(effects_off){
			$('.soundeffect').prop("volume", 0);
		}
		else{
			$('.soundeffect').prop("volume", this.volume.effects);
		}
	};

	//==============================================================
	// VOLUME FUNCTIONS
	//==============================================================

	AudioPlayer.prototype.updateVolume = function(){
		$('.soundeffect').prop("volume", this.volume.effects);
		$('.background').prop("volume", this.volume.music);
	};

	AudioPlayer.prototype.incMusic = function(){
		if(this.volume.music < MAX_VOLUME){
			this.volume.music += 0.1;
			if(this.volume.music > 1){
				this.volume.music = MAX_VOLUME;
			}
		}
		else{
			this.volume.music = MAX_VOLUME;
		}
	};

	AudioPlayer.prototype.decMusic = function(){
		if(this.volume.music > MIN_VOLUME){
			this.volume.music -= 0.1;
			if(this.volume.music < 0){
				this.volume.music = 0;
			}
		}
		else{
			this.volume.music = MIN_VOLUME;
		}
	};

	AudioPlayer.prototype.incEffects = function(){
		if(this.volume.effects < MAX_VOLUME){
			this.volume.effects += 0.1;
			if(this.volume.effects > 1){
				this.volume.effects = MAX_VOLUME;
			}
		}
		else{
			this.volume.effects = MAX_VOLUME;
		}
	};

	AudioPlayer.prototype.decEffects = function(){
		if(this.volume.effects > MIN_VOLUME){
			this.volume.effects -= 0.1;
			if(this.volume.effects < 0){
				this.volume.effects = 0;
			}
		}
		else{
			this.volume.effects = MIN_VOLUME;
		}
	};

	//==============================================================
	// INITIAL LOADING FUNCTIONS
	//==============================================================

	AudioPlayer.prototype.loadBackgroundMusic = function(){
		this.sounds.background = $(".background").get(0);
	};

	AudioPlayer.prototype.loadJumpSounds = function(){
		//this.sounds.jump = $(".jump").get(0);
		var scorelength = $('.scoresound').length;
		for(var i = 0; i < scorelength; i++){
			this.sounds.jump.push($(".jump").get(i));
		}
	};

	AudioPlayer.prototype.loadRestartSounds = function(){

	};

	AudioPlayer.prototype.loadScoreSounds = function(){

		var scorelength = $('.scoresound').length;
		for(var i = 0; i < scorelength; i++){
			this.sounds.score.push($(".scoresound").get(i));
		}
	};

	AudioPlayer.prototype.loadGameOverSounds = function(){
		var scorelength = $('.gameover').length;
		for(var i = 0; i < scorelength; i++){
			this.sounds.gameover.push($(".gameover").get(i));
		}
	};

	//==============================================================

	AudioPlayer.prototype.addEventListeners = function(){


		$(".background").get(0).addEventListener('ended', function(){
			console.log("MUSIC OFF");
			music_loop = false;
			$(".background").get(0).currentTime = 0;
		});

		var scorelength = $('.scoresound').length;
		for(var i = 0; i < scorelength; i++){
			$(".scoresound").get(i).addEventListener('ended', function(){
				score_sound_counter++;
			});
		}

		var jumplength = $('.jump').length;
		for(var i = 0; i < jumplength; i++){
			$(".jump").get(i).addEventListener('ended', function(){
				jump_sound_counter++;
			});
		}

		
	}



	//==============================================================

	return AudioPlayer;
})();


