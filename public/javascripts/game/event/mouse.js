/* Mouse Event */
Mouse = function() {

  // PRESS_ID 생각해 볼것
    this.attacking = false;
    this.angle = false;
};
window.mouse = null;

function InitializeMouse() {
  window.mouse = new Mouse();

  document.onmousedown = function(event) {
    mouse.attacking = true;
    SOCKET.emit('attacking', mouse);
  }
  document.onmouseup = function(event) {
    mouse.attacking = false;
    SOCKET.emit('attacking', mouse);
  }
  document.onmousemove = function(event) {
    var mouseX = event.clientX - cnvs.get(0).getBoundingClientRect().left;
  	var mouseY = event.clientY - cnvs.get(0).getBoundingClientRect().top;

  	mouseX -= (window.innerWidth)/2;
  	mouseY -= (window.innerHeight)/2;

    var angle = Math.atan2(mouseY,mouseX) / Math.PI * 180;

    mouse.angle = angle;
    SOCKET.emit('attacking', mouse);
  }
  document.oncontextmenu = function(event){
  	event.preventDefault();
  }
}
/* /Mouse Event */
