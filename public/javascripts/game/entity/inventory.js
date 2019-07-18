/* Client.Inventory */
var inventory = document.getElementById("inventory");

var showInventory = function(SELF_ID) {
  var items = Player.list[SELF_ID].inventory.items;
  for(var i in items) {
    inventory.innerHTML = "";
    addItem(items[i]);
  }
}
/* /Client.Inventory */
