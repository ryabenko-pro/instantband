function Dispatcher(timeline) {
  this.kit = [];
  this.hotkeys = [];
  this.downkeys = [];
    
  this.container = null;
  this.notesContainer = null;
  this.buttonsContainer = null;
    
  this.input = null;
    
  this.timeline = timeline;
  this.instrument = null;
}

Dispatcher.prototype.setInstrument = function(instrument) {
  this.instrument = instrument;
  this.timeline.setInstrument(instrument);
}

Dispatcher.prototype.render = function(element) {
  div = document.createElement('div');
    
  if (element)
    element.appendChild(div);
    
  this.container = div;
    
  this.notesContainer = createEl('div');
  this.buttonsContainer = createEl('div');
  this.input = createEl('input', {
    onkeydown: function(dispatcher){
      return function() {    
        dispatcher.keydown(event.keyCode);
      }
    }(this),
    onkeyup: function (dispatcher) {
      return function() {
        dispatcher.keyup(event.keyCode);
      }
    }(this)
  });
    
  div.appendChild(this.input);
  div.appendChild(this.buttonsContainer);
  div.appendChild(this.notesContainer);

  return div;
}

Dispatcher.prototype.keydown = function(name) {
  if (!this.downkeys[name]) {
    this.downkeys[name] = true;
    var noteName = this.instrument.getNoteNameByHotkey(name);
    this.instrument.startPlay(noteName);
    this.timeline.keyDown(noteName);
  }
}

Dispatcher.prototype.keyup = function(name) {
  this.downkeys[name] = false;
  var noteName = this.instrument.getNoteNameByHotkey(name);
  this.instrument.stopPlay(noteName);
  this.timeline.keyUp(noteName);
}
