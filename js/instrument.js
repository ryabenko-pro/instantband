// TODO: убрать эти параметры, инструмент не должен знать о DOM, 
// он должен получать действия от пользователя через диспетчер
// диспетчеру же должен передавать свои контролы (?? ORLY??)
function Instrument(dispatcher) {
    this.kit = [];
    this.hotkeys = [];
    
    this.container = dispatcher.container;
    this.notesContainer = dispatcher.notesContainer;
    this.buttonsContainer = dispatcher.buttonsContainer;
    
    // Хак? Да, похоже что-то здесь не так
    dispatcher.setInstrument(this);
}

Instrument.prototype.add = function(name, note, hotkey) {
    this.hotkeys[hotkey] = name;
    
    this.kit[name] = note;
    note.render(this.notesContainer);
    
    // TODO: move this code to dispatcher
    var button = createEl('input', {
      type: 'button',
      value: name,
      onmousedown: function(dk, name) {
        return function() {
            dk.startPlay(name);
        }
      }(this, name),
      onmouseup: function(dk, name) {
          return function() {
              dk.stopPlay(name);
          }
      }(this, name)
    });
    
    this.buttonsContainer.appendChild(button);
}

Instrument.prototype.getNoteNameByHotkey = function(hk) {
  return this.hotkeys[hk];
}

Instrument.prototype.startPlay = function(name) {
    if (this.kit[name])
        this.kit[name].startPlay();
}

Instrument.prototype.stopPlay = function(name) {
    if (this.kit[name])
        this.kit[name].stopPlay();
}
    
