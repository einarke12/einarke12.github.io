
window.Controls = (function() {
    'use strict';

    /**
     * Key codes we're interested in.
     */

     //==============================================================

    var KEYS = {
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        77: 'M',
        78: 'N',
        85: 'U',
        73: 'I',
        74: 'J',
        75: 'K'
    };

    //==============================================================
    
    /**
     * A singleton class which abstracts all player input,
     * should hide complexity of dealing with keyboard, mouse
     * and touch devices.
     * @constructor
     */

    var Controls = function() {
        this._didJump = false;
        this._didMuteBackground = false;
        this._didMuteEffects = false;
        this._didIncMusic = false;
        this._didDecMusic = false;
        this._didIncEffects = false;
        this._didDecEffects = false;
        this.keys = {};
        $(window)
            .on('keydown', this._onKeyDown.bind(this))
            .on('keyup', this._onKeyUp.bind(this));
    };

    //==============================================================

    Controls.prototype._onKeyDown = function(e) {
        // Only jump if space wasn't pressed.
        if (e.keyCode === 32 && !this.keys.space) {
            this._didJump = true;  
        }

        if (e.keyCode === 77 && !this.keys.m) {
            this._didMuteBackground = true;
        }

        if (e.keyCode === 78 && !this.keys.n) {
            this._didMuteEffects = true;
        }

        if (e.keyCode === 85 && !this.keys.u) {
            this._didIncMusic = true;
        }

        if (e.keyCode === 73 && !this.keys.i) {
            this._didDecMusic = true;
        }

        if (e.keyCode === 74 && !this.keys.j) {
            this._didIncEffects = true;
        }

        if (e.keyCode === 75 && !this.keys.k) {
            this._didDecEffects = true;
        }

        // Remember that this button is down.
        if (e.keyCode in KEYS) {
            var keyName = KEYS[e.keyCode];
            this.keys[keyName] = true;
            return false;
        }
    };

    //==============================================================

    Controls.prototype._onKeyUp = function(e) {
        if (e.keyCode in KEYS) {
            var keyName = KEYS[e.keyCode];
            this.keys[keyName] = false;
            return false;
        }
    };

    //==============================================================

    Controls.prototype.didJump = function() {
        var answer = this._didJump;
        this._didJump = false;
        return answer;
    };

    //==============================================================

    Controls.prototype.didMuteBackground = function() {
        var answer = this._didMuteBackground;
        this._didMuteBackground = false;
        return answer;
    };

     Controls.prototype.didMuteEffects = function() {
        var answer = this._didMuteEffects;
        this._didMuteEffects = false;
        return answer;
    };

    //==============================================================

    Controls.prototype.didIncEffects = function(){
        var answer = this._didIncEffects;
        this._didIncEffects = false;
        return answer;
    };

    Controls.prototype.didDecEffects = function(){
        var answer = this._didDecEffects;
        this._didDecEffects = false;
        return answer;
    };

    Controls.prototype.didIncMusic = function(){
        var answer = this._didIncMusic;
        this._didIncMusic = false;
        return answer;
    };

    Controls.prototype.didDecMusic = function(){
        var answer = this._didDecMusic;
        this._didDecMusic = false;
        return answer;
    };

    //==============================================================

    // Export singleton.
    return new Controls();
})();
