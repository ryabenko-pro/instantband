function Timeline() {
  this.timeline = [];
  
  this.container = null;
  this.startedAt = Timer.getTimestampMs();
  
  this.lastTimestamp = 0;
  this.lastAction = {ts: 0, action: 0};
  this.firstAction = this.lastAction;
  this.currentAction = this.firstAction;
  
  this.state = 'stop';
  
  this.instrument = null;
}

Timeline.prototype.init = function() {
  
}

Timeline.prototype.setInstrument = function(instrument) {
  this.instrument = instrument;
}

Timeline.prototype.replay = function() {
  this.state = 'play';
  this.currentAction = this.firstAction.next;
  this.serve();
}

Timeline.prototype.stop = function() {
  this.state = 'stop';
}

Timeline.prototype.playCurrent = function() {
  var action = this.currentAction;
  
  if (action.action == 'keydown')
    this.instrument.startPlay(action.note);
  if (action.action == 'keyup')
    this.instrument.stopPlay(action.note);
  
  this.currentAction = action.next;
}

Timeline.prototype.serve = function() {
  // Just finish
  if (!this.currentAction)
    return;
  
  this.playCurrent();
  if (!this.currentAction)
    return;
  
  var timeout = this.currentAction.diff;
  
  if (this.state == 'play') {
    setTimeout(function(tl){
      return function() {
        tl.serve();
      }
    }(this), timeout);
  }
}

Timeline.prototype.render = function(element) {
  var div = createEl('DIV');
  var replay = createEl('input', {
    type: 'button',
    value: 'replay',
    onclick: function(tl) {
      return function() {
        tl.replay();
      }
    }(this)
  });
  
  var stopPlay = createEl('input', {
    type: 'button',
    value: 'stop',
    onclick: function(tl) {
      return function() {
        tl.stop();
      }
    }(this)
  });
  
  div.appendChild(replay);
  div.appendChild(stopPlay);
  element.appendChild(div);
  
  this.container = div;
}

Timeline.prototype.addAction = function(action, note) {
  var ts = Timer.getTimestampMs();
  this.diffTs = ts - this.startedAt;
  
  if (!this.timeline[this.diffTs])
    this.timeline[this.diffTs] = [];
  
  var action = {
    ts: this.diffTs,
    action: action,
    note: note,
    diff: this.diffTs - this.lastAction.ts
  };
  
  this.timeline[this.diffTs].push(action);
  
  this.lastAction.next = action;
  this.lastAction = action;
  this.lastTimestamp = ts;
}

Timeline.prototype.keyDown = function(name) {
  this.addAction('keydown', name);
}

Timeline.prototype.keyUp = function() {
  this.addAction('keyup', name);
}
