
module.exports = {

  getGUID: function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + '-' + s4();
  },
  randomRange: function(n1, n2) {
    return Math.floor( (Math.random() * (n2 - n1 + 1)) + n1 );
  },
  clone: function(obj) {
    if (obj === null || typeof(obj) !== 'object')
    return obj;

    var copy = obj.constructor();

    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = this.clone(obj[attr]);
      }
    }
    return copy;
  },

};
