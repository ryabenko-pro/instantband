function Note(src, duration) {
    this.src = src;
    this.ID = src;
    this.duration = duration;
    
    this.container = null;
    this.state = 0;
}

Note.prototype.render = function(element) {
    var audio = document.createElement('audio');
    audio.controls = true;
    audio.src = this.src;
    
    this.audio = audio;
    
    
    var div = document.createElement('div');
    div.appendChild(audio);
    
    if (element)
        element.appendChild(div);
    
    return div;
}


Note.prototype.serve = function(ms) {}

Note.prototype.servePlay = function(ms) {
  if (0 == this.state)
    return false;

  this.playTime += ms;
  if (this.playTime > this.duration) {
    this.serve = this.serveStoping;
  }

  if (this.audio.currentTime > 2)
    this.audio.currentTime = 0;
  
  this.audio.volume = Math.max(0, this.audio.volume - 0.05);
  
  return true;
}

Note.prototype.serveStoping = function(ms) {
  if (0 == this.state) {
    this.stopPlay();
    return false;
  }
  
  this.audio.volume = Math.min(0.5, this.audio.volume);
  this.state = 0;
  return 50;
}

Note.prototype.startPlay = function() {
  this.state = 1;
  this.playTime = 0;
  this.audio.currentTime = 0;
  this.audio.volume = 1;
  this.serve = this.servePlay;
  Timer.getInstance().addService(this, 50);
  this.audio.play();
}

Note.prototype.stopPlay = function() {
  // TODO: корректно завершать ноту через serveStoping
  this.state = 0;
  this.audio.pause();
}

function Drum(src) {
  this.src = src;
}

extend(Drum, Note);

Drum.prototype.servePlay = function(ms) {
  return false;
}

Drum.prototype.stopPlay = function(ms) {
  
}


