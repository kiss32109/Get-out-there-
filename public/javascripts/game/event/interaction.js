/* Interaction Event */

Interaction = function() {

  // PRESS_ID 생각해 볼것
    this.activating = false;
};

// ASCII codes
const KEY_E = 69;

function InitializeInteraction() {

  window.interaction = new Interaction();

  $(document).keydown(function(e) {
      var p = Player.list[SELF_ID]
      if (e.keyCode === 16) isShift = true;
      if (e.keyCode === KEY_E) {
        interaction.activating = true;
        SOCKET.emit('interacting', interaction);
      }
  });

  $(document).keyup(function(e) {
      if (e.keyCode === 16) isShift = false;
      if (e.keyCode === KEY_E) {
        interaction.activating = false;
        SOCKET.emit('interacting', interaction);
      }
  });
};
